"use client";

import { useRouter } from "next/navigation";
import { useConfig } from "@/contexts/config-context";
import { normalizePath } from "@/lib/utils/file";
import { getSchemaByName, initializeState } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmptyCreate = ({
  children,
  type,
  name,
  onCreate
}: {
  children: React.ReactNode;
  type: "content" | "media" | "settings";
  name?: string;
  onCreate?: (path: string) => void;
}) => {
  const { config } = useConfig();
  if (!config) throw new Error(`未找到配置（Configuration not found）`);

  const router = useRouter();

  let path = "";
  let content: string | Record<string, any> = "";
  let toCreate = "";
  let redirectTo = `/${config.owner}/${config.repo}/${encodeURIComponent(config.branch)}`;

  if (type === "settings") {
    path = ".pages.yml";
    toCreate = "配置文件";
    redirectTo = `${redirectTo}/settings`;
  } else if (type === "content" || type === "media") {
    if (!name) throw new Error(`参数 "name" 是必需的`);
    const schema = getSchemaByName(config.object, name, type);
    if (!schema) throw new Error(`未找到名为 ${name} 的 schema`);

    if (type === "media") {
      path = `${schema.input}/.gitkeep`;
      toCreate = "媒体文件夹";
      redirectTo = `${redirectTo}/media/${schema.name}`;
    } else {
      if (schema.type === "file") {
        path = schema.path;
        toCreate = "文件";
        if (schema.fields && schema.fields.length) {
          content = initializeState(schema.fields, {});
        }
      } else {
        path = `${schema.path}/.gitkeep`;
        toCreate = "内容集合文件夹";
      }
      redirectTo = `${redirectTo}/${schema.type}/${schema.name}`;
    }
  } else {
    throw new Error(`无效的类型 "${type}"`);
  }
  
  const handleCreate = async () => {
    try {
      const createPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/${config.owner}/${config.repo}/${encodeURIComponent(config.branch)}/files/${encodeURIComponent(normalizePath(path))}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type,
              name,
              content,
            }),
          });
          if (!response.ok) {
            throw new Error(`创建 ${toCreate} 失败: ${response.status} ${response.statusText}`);
          }

          const data: any = await response.json();
          
          if (data.status !== "success") throw new Error(data.message);
          
          resolve(data)
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(createPromise, {
        loading: `正在创建 ${toCreate}...`,
        success: (response: any) => {
          router.push(`${redirectTo}?empty-created`);
          router.refresh();
          return `${toCreate} 创建成功！`;
        },
        error: (error: any) => error.message,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button type="button" size="sm" onClick={handleCreate}>
      {children}
    </Button>
  );
};

export { EmptyCreate };