import { Interview } from "@/lib/types";

interface RecentListCardProps {
  interview: Interview;
}

const RecentListCard: React.FC<RecentListCardProps> = ({ interview }) => {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900">
      <h3 className="font-semibold text-lg">{interview.jobPosition}</h3>
      <p className="text-sm text-muted-foreground">
        {interview.jobDescription}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Duration: {interview.duration} | Type: {interview.type}
      </p>
    </div>
  );
};

export default RecentListCard;
