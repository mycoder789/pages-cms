"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleHelp, Chrome, Book, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export function About({
  onClick
}: {
  onClick?: () => void;
}) {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <CircleHelp className="h-4 w-4" />
              <span className="sr-only">关于 Pages CMS</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          关于 Pages CMS
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>关于 Pages CMS</DialogTitle>
          <DialogDescription>
            Pages CMS 是一个为静态网站（如 Jekyll、Next.js、VuePress、Hugo 等）设计的开源内容管理系统。它允许你通过用户友好的界面，直接在 GitHub 上编辑你的网站内容。
          </DialogDescription>
        </DialogHeader>
        <footer className="grid grid-flow-col justify-stretch text-sm gap-x-2">
          <a className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")} href="https://pagescms.org" target="_blank">
            <Chrome className="h-4 w-4 shrink-0 mr-2"/>
            官方网站
          </a>
          <a className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")} href="https://pagescms.org/docs" target="_blank">
            <Book className="h-4 w-4 shrink-0 mr-2"/>
            使用文档
          </a>
          <a className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")} href="https://github.com/pages-cms/pages-cms" target="_blank">
            <Github className="h-4 w-4 shrink-0 mr-2"/>
            GitHub 项目
          </a>
        </footer>
      </DialogContent>
    </Dialog>
  )
}