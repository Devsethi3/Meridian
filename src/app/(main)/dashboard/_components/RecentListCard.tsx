import { Button } from "@/components/ui/button";
import { Interview } from "@/lib/types";
import { CopyIcon, Send } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

interface RecentListCardProps {
  interview: Interview;
}

const RecentListCard: React.FC<RecentListCardProps> = ({ interview }) => {
  const copyLink = () => {
    const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview.interview_id;
    navigator.clipboard.writeText(url);
    toast("Copied");
  };

  return (
    <>
      <div className="p-4 bg-background rounded-lg border">
        <div className="h-[40px] w-[40px] bg-primary rounded-full" />
        <h2 className="text-sm">
          {moment(interview?.created_at).format("DD MM yyy")}
        </h2>
        <h2 className="mt-3 font-bold text-lg">{interview.jobPosition}</h2>
        <h2 className="mt-2">{interview.duration}</h2>
        <div className="flex items-center justify-between mt-4">
          <Button onClick={copyLink} variant={"outline"}>
            {" "}
            <CopyIcon /> Copy
          </Button>
          <Button>
            <Send />
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default RecentListCard;

// Create an amazing ui to show these interview with cards as the production grade application and it should be respsonsive with smooth animation with proper loading states (with skeletons), error states, make sure to only use the variable colors (init from shadcn ui) like primary, secondary, muted, etc
// RecentList and RecentListCard are both different component so give the code separately for both components