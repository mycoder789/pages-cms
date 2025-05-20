import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { getAccounts } from "@/lib/utils/accounts";
import { Providers } from "@/components/providers";

// 页面布局组件，负责权限验证与全局 Provider 注入
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode; // 子页面内容
}>) {
  // 获取用户登录信息
  const { session, user } = await getAuth();

  // 未登录则跳转到登录页
  if (!session) return redirect("/sign-in");

  // 获取当前用户关联的账号列表
  const accounts = await getAccounts(user);
  const userWithAccounts = { ...user, accounts };

  // 将用户数据注入全局 Provider 中，供子组件使用
	return (
    <Providers user={userWithAccounts}>
      {children}
    </Providers>
  );
}