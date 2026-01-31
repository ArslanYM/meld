"use client";
import React, { useState } from "react";
import AIModelList from "@/shared/AIModelList";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
const AiMultiModel = () => {
  const [aiModeList, setAiModeList] = useState(AIModelList);
  const onToggleChange = (model, value) => {
    setAiModeList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m)),
    );
  };
  return (
    <div className="flex flex-1 h-[75vh] border-b">
      {aiModeList.map((model, index) => (
        <div
          className={`flex flex-col border-r h-full overflow-auto 
          ${model.enable ? "flex-1 min-w-[400px]" : "flex-none w-[100px]"}
          `}
        >
          <div
            key={index}
            className="flex w-full h-[70px] items-center justify-between border-b p-4"
          >
            <div className="flex items-center gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                height={24}
                width={24}
              />
              {model.enable && (
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={model.subModel[0].name} />
                  </SelectTrigger>
                  <SelectContent>
                    {model.subModel.map((subModel, index) => (
                      <SelectItem key={index} value={subModel.name}>
                        {subModel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                />
              ) : (
                <MessageSquare
                  onClick={(v) => onToggleChange(model.model, true)}
                />
              )}
            </div>
          </div>
          {model.premium && model.enable && (
            <div className="h-full flex items-center justify-center">
              <Button variant="outline">
                <Lock /> Upgade to unlock
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AiMultiModel;
