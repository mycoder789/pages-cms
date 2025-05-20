"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * 通用提示组件（Message）
 * 用于显示页面的空状态、错误信息、引导操作等内容。
 * 所有展示文字通过 props 动态传入，建议使用中文内容。
 */

export function Message({
  title,         // 标题文本（如：“暂无内容”、“加载失败”等）
  description,   // 描述说明（支持 React 节点，可含链接）
  href,          // 可选，跳转链接
  cta,           // 可选，按钮文字（如“立即创建”）
  className,     // 可选，自定义样式类
  children,      // 可选，插入自定义内容（优先级高于 CTA）
}: {
  title: string;
  description: React.ReactNode;
  href?: string;
  cta?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("p-4 md:p-6 flex justify-center items-center", className)}>
      <div className="max-w-[340px] text-center">
        {/* 标题 */}
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight mb-2">
          {title}
        </h1>
        
        {/* 描述内容 */}
        <p className="text-sm text-muted-foreground mb-6">
          {description}
        </p>

        {/* 子内容优先，如果没有则使用按钮链接 */}
        {children
          ? children
          : href && cta
            ? (
              <Link
                className={buttonVariants({ variant: "default", size: "sm" })}
                href={href}
              >
                {cta}
              </Link>
            )
            : null
        }
      </div>
    </div>
  );
}