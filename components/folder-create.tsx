"use client";

import { useState } from "react";
import { useConfig } from "@/contexts/config-context";
import { joinPathSegments, normalizePath } from "@/lib/utils/file";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FolderCreate = ({
  children,
  path,
  type,
  name,
  onCreate,
}: {
  children: React.ReactElement<{ onClick: () => void }>;
  path: string;
  type: "content" | "media";
  name?: string;
  onCreate?: (path: string) => void;
}) => {
  const { config } = useConfig();
  if (!config) throw new Error(`Configuration not found.`);

  const [folderPath, setFolderPath] = useState(path);
  
  const handleCreate = async () => {
    try {
      const fullNewPath = joinPathSegments([
        normalizePath(path),
        normalizePath(folderPath)
      ]);

      const createPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/${config.owner}/${config.repo}/${encodeURIComponent(config.branch)}/files/${encodeURIComponent(fullNewPath + "/.gitkeep")}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type,
              name,
              content: "",
            }),
          });
          if (!response.ok) throw new Error(`创建文件夹失败: ${response.status} ${response.statusText}`);

          const data: any = await response.json();
          
          if (data.status !== "success") throw new Error(data.message);
          
          resolve(data)
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(createPromise, {
        loading: `正在创建文件夹 "${fullNewPath}"...`,
        success: (response: any) => {
          if (onCreate) onCreate(response.data);
          return `文件夹 "${fullNewPath}" 创建成功。`;
        },
        error: (error: any) => error.message,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建文件夹</DialogTitle>
          <DialogDescription>
            请输入要创建的