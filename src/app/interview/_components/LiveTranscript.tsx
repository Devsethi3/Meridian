// components/interview/LiveTranscript.tsx
import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface LiveTranscriptProps {
  transcript: string[];
  currentTranscript: string;
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  transcript,
  currentTranscript,
}) => {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, currentTranscript]);

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Live Transcript</h3>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[500px]">
        {transcript.length === 0 && !currentTranscript && (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Transcript will appear here when the interview starts</p>
          </div>
        )}

        <div className="space-y-3">
          {transcript.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[85%] ${
                message.startsWith("AI:")
                  ? "bg-blue-50 text-blue-900 mr-auto"
                  : "bg-gray-50 text-gray-900 ml-auto"
              }`}
            >
              <p className="text-sm">{message}</p>
            </div>
          ))}

          {currentTranscript && (
            <div className="p-3 rounded-lg max-w-[85%] ml-auto bg-gray-100 text-gray-700 border-l-4 border-blue-500">
              <p className="text-sm italic">You: {currentTranscript}</p>
            </div>
          )}
        </div>
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
};

export default LiveTranscript;
