"use client";

import { useState } from "react";
import { handleAppInstall } from "@/lib/actions/app";
import { useUser } from "@/contexts/user-context";
import { RepoSelect } from "@/components/repo/repo-select";
import { RepoTemplates } from "@/components/repo/repo-templates";
import { RepoLatest } from "@/components/repo/repo-latest";
import { Message } from "@/components/message";
import { SubmitButton } from "@/components/submit-button";
import { MainRootLayout } from "./main-root-layout";
import { Github } from "lucide-react";

export default function Page() {
	const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const { user } = useUser();
	
	if (!user) throw new Error("User not found");
	if (!user.accounts) throw new Error("Accounts not found");

	return (
    <MainRootLayout>
			<div className="max-w-screen-sm mx-auto p-4 md:p-6 space-y-6">
				{user.accounts.length > 0
					? <>
							<h2 className="font-semibold text-lg md:text-2xl tracking-tight">最近访问</h2>
							<RepoLatest/>
							<h2 className="font-semibold text-lg md:text-2xl tracking-tight">打开一个项目</h2>
							<RepoSelect onAccountSelect={(account) => setDefaultAccount(account)}/>
							{user?.githubId &&
								<>
									<h2 className="font-semibold text-lg md:text-2xl tracking-tight">从模板创建项目</h2>
									<RepoTemplates defaultAccount={defaultAccount}/>
								</>
							}
						</>
					:	user.githubId
							? <Message
									title="安装 GitHub 应用"
									description="你必须为想要使用 Pages CMS 的账户安装 GitHub 应用。"
									className="absolute inset-0"
								>
									<form action={handleAppInstall}>
										<SubmitButton type="submit">
											<Github className="h-4 w-4 mr-2" />
											安装
										</SubmitButton>
									</form>
								</Message>
						  : <Message
									title="暂无内容"
									description="你必须被邀请加入某个代码仓库，才能进行协作。请联系邀请人或组织管理员。"
									className="absolute inset-0"
								/>
				}
			</div>
		</MainRootLayout>
	);
}