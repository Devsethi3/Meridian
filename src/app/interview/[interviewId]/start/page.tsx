"use client";

import { InterviewContext } from "@/context/InterviewContext";
import { useInterviewContext } from "@/hooks/useInterviewContext";

const StartInterviewPage = () => {
  const { interviewInfo, setInterviewInfo } = useInterviewContext();
  
  return (
    <>
      <div className="p-20 lg:px-48 xl:px-56">
        {JSON.stringify(interviewInfo)}
      </div>
    </>
  );
};

export default StartInterviewPage;
