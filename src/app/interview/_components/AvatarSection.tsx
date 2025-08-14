// components/interview/AvatarSection.tsx
import Image from "next/image";

interface AvatarSectionProps {
  userName: string | undefined;
  isCallActive: boolean;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  userName,
  isCallActive,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* AI Recruiter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col items-center justify-center h-[300px] relative">
          <div
            className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
              isCallActive ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <div className="relative">
            <Image
              src="/ai-robot.png"
              width={120}
              height={120}
              alt="AI Recruiter"
              className={`transition-all duration-300 ${
                isCallActive ? "scale-110" : "scale-100 opacity-75"
              }`}
            />
            {isCallActive && (
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse"></div>
            )}
          </div>
          <p className="mt-4 font-semibold text-gray-800">AI Recruiter</p>
          <p className="text-sm text-gray-500">Ready to interview</p>
        </div>
      </div>

      {/* User */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col items-center justify-center h-[300px] relative">
          <div
            className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
              isCallActive ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${
                isCallActive ? "scale-110" : "scale-100 opacity-75"
              }`}
            >
              {userName?.charAt(0) || "U"}
            </div>
            {isCallActive && (
              <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse"></div>
            )}
          </div>
          <p className="mt-4 font-semibold text-gray-800">{userName}</p>
          <p className="text-sm text-gray-500">Candidate</p>
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;
