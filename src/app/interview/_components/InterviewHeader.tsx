// components/interview/InterviewHeader.tsx
import { ConnectionStatus } from "@/lib/types";
import { Timer } from "lucide-react";

interface InterviewHeaderProps {
  connectionStatus: ConnectionStatus;
  callDuration: number;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  connectionStatus,
  callDuration,
}) => {
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}
          ></div>
          <h2 className="font-bold text-xl">AI Interview Session</h2>
          <span className="text-sm text-gray-500">
            ({getConnectionStatusText()})
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
          <Timer className="w-4 h-4" />
          <span className="font-mono text-lg">{formatTime(callDuration)}</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
