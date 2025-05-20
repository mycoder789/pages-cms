import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { MainRootLayout } from "../main-root-layout";
import { getInitialsFromName } from "@/lib/utils/avatar";
import { Installations } from "@/components/installations";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function Page() {
	const { user } = await getAuth();
	if (!user) throw new Error("User not found");

  const displayName = user.githubId ? user.githubName || user.githubUsername : user.email;

  return (
    <MainRootLayout>
      <div className="max-w-screen-sm mx-auto p-4 md:p-6 space-y-6">
        <Link className={cn(buttonVariants({ variant: "outline", size: "xs" }), "inline-flex")} href="/" prefetch={true}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          返回首页
        </Link>
        <header className="flex items-center mb-6">
          <h1 className="font-semibold tracking-tight text-lg md:text-2xl">设置</h1>
        </header>
        <div className="flex flex-col relative flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">个人资料</CardTitle>
              <CardDescription>管理展示给其他用户的信息。</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="w-full">
                <div className="grid w-full items-center gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      姓名
                    </Label>
                    <div className="col-span-3">
                      <Input name="name" disabled defaultValue={displayName}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                      头像
                    </Label>
                    <div className="col-span-3">
                      <Avatar className="h-24 w-24 rounded-md">
                        <AvatarImage
                          src={
                            user?.githubId
                              ? `https://avatars.githubusercontent.com/u/${user.githubId}`
                              : `https://unavatar.io/${user?.email}?fallback=false`
                          }
                          alt={
                            user?.githubId
                              ? user.githubUsername
                              : user.email
                          }
                        />
                        <AvatarFallback className="rounded-md">{getInitialsFromName(displayName)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="ml-auto" disabled>保存资料</Button>
            </CardFooter>
          </Card>
          
          {user.githubId &&
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">GitHub 安装</CardTitle>
                <CardDescription>管理你安装了 GitHub 应用的账户。</CardDescription>
              </CardHeader>
              <CardContent>
                <Installations/>
              </CardContent>
            </Card>
          }
        </div>
      </div>
    </MainRootLayout>
  );
}