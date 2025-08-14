// components/interview/InterviewInfo.tsx
import { ConnectionStatus } from "@/lib/types";
import { Users } from "lucide-react";

interface InterviewInfoProps {
  jobPosition: string;
  questionCount: number;
  callDuration: number;
  connectionStatus: ConnectionStatus;
}

const InterviewInfo: React.FC<InterviewInfoProps> = ({
  jobPosition,
  questionCount,
  callDuration,
  connectionStatus,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connecting":
        return "bg-yellow-500";
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <h4 className="font-semibold text-gray-800">Interview Details</h4>
            <p className="text-sm text-gray-600">
              Position: {jobPosition} | Questions: {questionCount} | Duration:{" "}
              {formatTime(callDuration)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Status</p>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
            ></div>
            <span className="text-sm font-medium">
              {getConnectionStatusText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewInfo;