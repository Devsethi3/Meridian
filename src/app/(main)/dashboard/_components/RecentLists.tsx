"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import { Files, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import RecentListCard from "./RecentListCard";
import { Interview } from "@/lib/types";

const RecentLists = () => {
  const [recentList, setRecentList] = useState<Interview[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getInterviewList();
    }
  }, [user]);

  const getInterviewList = async () => {
    const { data: Interviews, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user?.email);

    if (error) {
      console.error(error);
      return;
    }

    setRecentList(Interviews ?? []);
  };

  return (
    <section className="my-10">
      <h2 className="font-bold text-2xl mb-6 text-gray-900 dark:text-white">
        Previously Created Interviews
      </h2>

      {recentList.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center border border-dashed rounded-2xl p-10 bg-muted/50 dark:bg-gray-900/30">
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
            <Files className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            No Interviews Found
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            You haven&apos;t created any interviews yet. Once you do, they&apos;ll appear
            here.
          </p>
          <Button className="mt-6">
            <Plus className="mr-2 w-4 h-4" />
            Create New Interview
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentList.map((item) => (
            <RecentListCard key={item.id} interview={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentLists;
