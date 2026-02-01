"use client";
import React, { useContext, useState } from "react";
import DefaultModel from "@/shared/AiModelsShared";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock, LockIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import AIModelList from "@/shared/AIModelList";
import { doc, updateDoc } from "firebase/firestore";
const AiMultiModel = () => {
  const [aiModeList, setAiModeList] = useState(AIModelList);
  const { aiSelectedModels, setAiSelectedModels } = useContext(
    AiSelectedModelContext,
  );
  const onToggleChange = (model, value) => {
    setAiModeList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m)),
    );
  };

  const onSelectedValue = async (parentModel, value) => {
    setAiSelectedModels((prev) => ({
      ...prev,
      [parentModel]: {
        modelId: value,
      },
    }));
    //update to firebase db
    const docRef = doc(db, "users", user?.primaryEmailAddress.emailAddress);
    await updateDoc(docRef, {
      selectedModelPref: aiSelectedModels,
    });
  };
  return (
    <div className="flex flex-1 h-[75vh] border-b">
      {aiModeList.map((model, index) => (
        <div
          key={index}
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
                <Select
                  defaultValue={aiSelectedModels[model.model].modelId}
                  onValueCange={(value) => {
                    onSelectedValue(model.model, value);
                  }}
                  disabled={model.premium}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={aiSelectedModels[model.model].modelId}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm  text-primary/30">
                        Free
                      </SelectLabel>
                      {model.subModel.map(
                        (subModel, index) =>
                          subModel.premium == false && (
                            <SelectItem key={index} value={subModel.id}>
                              {subModel.name}
                            </SelectItem>
                          ),
                      )}
                    </SelectGroup>
                    <SelectGroup className="px-3 ">
                      <SelectLabel className="text-sm  text-primary/30">
                        Premium
                      </SelectLabel>
                      {model.subModel.map(
                        (subModel, index) =>
                          subModel.premium == true && (
                            <SelectItem
                              key={index}
                              value={subModel.name}
                              disabled={subModel.premium}
                            >
                              {subModel.name} {<LockIcon className="h-4 w-4" />}
                            </SelectItem>
                          ),
                      )}
                    </SelectGroup>
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
