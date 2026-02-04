import React from "react";
import { Progress } from "@/components/ui/progress";

const UsageCreditProgress = ({ remainingToken }) => {
  return (
    <div className="p-3 border rounded-2xl mb-5 flex flex-col gap-2">
      <h2 className="font-bold text-xl">Free Plan</h2>
      <p className="text-primary/20">{5 - remainingToken}/5 Messages Used.</p>
      <Progress value={100 - ((5 - remainingToken) / 5) * 100} />
    </div>
  );
};

export default UsageCreditProgress;
