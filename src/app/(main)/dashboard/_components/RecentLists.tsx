"use client";

import { Button } from "@/components/ui/button";
import { Files, Plus } from "lucide-react";
import { useState } from "react";

const RecentLists = () => {
  const [recentList, setRecentList] = useState([]);

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
            You haven’t created any interviews yet. Once you do, they’ll appear
            here so you can view and manage them easily.
          </p>

          <Button className="mt-6">
            <Plus className="mr-2 w-4 h-4" />
            Create New Interview
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentList.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900"
            >
                {/* <h4 className="font-semibold text-lg">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.date}</p> */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentLists;
