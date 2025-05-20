import { User } from "@/components/user";
import { About } from "@/components/about";

// 页面主布局：包括顶部内容区域与底部信息栏
export function MainRootLayout({
  children,
}: {
  children: React.ReactNode; // 子组件内容
}) {
	return(
    <div className="flex flex-col h-screen">
			<main className="flex-1 w-full overflow-auto">
				{/* 主体区域，用于渲染页面内容 */}
				{children}
			</main>

			{/* 页面底部，包含用户信息和“关于”组件 */}
			<footer className="flex items-center gap-2 border-t px-2 py-2 lg:px-4 lg:py-3 mt-auto">
        <User className="mr-auto"/>
        <About/>
      </footer>
		</div>
	);
}