import React from "react";
import { Progress } from "@/components/ui/progress";

const UsageCreditProgress = () => {
  return (
    <div className="p-3 border rounded-2xl mb-5 flex flex-col gap-2">
      <h2 className="font-bold text-xl">Free Plan</h2>
      <p className="text-primary/20">0.5 messages used</p>
      <Progress value={33} />
    </div>
  );
};

export default UsageCreditProgress;
