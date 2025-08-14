// components/interview/ControlPanel.tsx
import { Mic, MicOff, Phone, Settings } from "lucide-react";
import AlertConfirmation from "../[interviewId]/start/_components/AlertConfirmation";

interface ControlPanelProps {
  isCallActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onStopInterview: () => void;
  isProcessingFeedback?: boolean;
  hasCallEnded?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isCallActive,
  isMuted,
  onToggleMute,
  onStopInterview,
  isProcessingFeedback = false,
  hasCallEnded = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <div className="flex items-center justify-center gap-4">
        {/* Mute/Unmute */}
        <button
          onClick={onToggleMute}
          className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-200 ${
            isMuted
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
          disabled={!isCallActive || isProcessingFeedback || hasCallEnded}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>

        {/* End Call */}
        <AlertConfirmation stopInterview={onStopInterview}>
          <button
            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="End Interview"
            disabled={!isCallActive || isProcessingFeedback || hasCallEnded}
          >
            <Phone className="h-6 w-6" />
          </button>
        </AlertConfirmation>

        {/* Settings */}
        <button
          className="h-14 w-14 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-all duration-200"
          title="Settings"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {isProcessingFeedback
            ? "Processing feedback..."
            : hasCallEnded
            ? "Interview completed"
            : isCallActive
            ? "Interview in Progress..."
            : "Interview Ready to Start"}
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;