"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { handleRemoveCollaborator, handleAddCollaborator } from "@/lib/actions/collaborator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { Message } from "@/components/message";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Ban, Loader } from "lucide-react";

export function Collaborators({
  owner,
  repo,
  branch
}: {
  owner: string,
  repo: string,
  branch?: string
}) {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [addCollaboratorState, addCollaboratorAction] = useFormState(handleAddCollaborator, { message: "", data: [] });
  const [email, setEmail] = useState<string>("");
  const [removing, setRemoving] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined | null>(null);

  const isEmailInList = useMemo(() => collaborators.some(collaborator => collaborator.email === email), [email, collaborators]);

  const addNewCollaborator = useCallback((newCollaborator: any) => {
    setCollaborators(prevCollaborators => [...prevCollaborators, ...newCollaborator]);
  }, []);

  useEffect(() => {
    async function fetchCollaborators() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/collaborators/${owner}/${repo}`);
        if (!response.ok) throw new Error(`获取协作者失败: ${response.status} ${response.statusText}`);

        const data: any = await response.json();
        if (data.status !== "success") throw new Error(data.message);

        setCollaborators(data.data);

        if (data.data.errors && data.data.errors.length > 0) {
          data.data.errors.forEach((error: any) => toast.error(error));
        }
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollaborators();
  }, [owner, repo, branch]);

  const handleConfirmRemove = async (collaboratorId: number) => {
    setRemoving([...removing, collaboratorId]);
    
    try {
      const removed = await handleRemoveCollaborator(collaboratorId, owner, repo);
      
      if (removed.error) {
        toast.error(removed.error);
      } else {
        setCollaborators(collaborators.filter((collaborator) => collaborator.id !== collaboratorId));
        toast.success(removed.message);
      }
    } catch(error: any) {
      toast.error(error.message);
    } finally {
      setRemoving(removing.filter((id) => id !== collaboratorId));
    }
  }

  useEffect(() => {
    if (addCollaboratorState?.message) {
      if (addCollaboratorState.data && addCollaboratorState.data.length > 0) {
        addNewCollaborator(addCollaboratorState.data);
      }
      
      toast.success(addCollaboratorState.message, { duration: 10000});
      setEmail("");
    }
  }, [addCollaboratorState, addNewCollaborator]);

  const loadingSkeleton = useMemo(() => (
    <ul>
      <li className="flex gap-x-2 items-center border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md px-3 py-2 text-sm">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-24 text-left rounded" />
        <Button variant="outline" size="xs" className="ml-auto" disabled>
          移除
        </Button>
      </li>
    </ul>
  ), []);

  if (error) {
    return (
      <Message
        title="出错了"
        description="无法获取协作者列表。"
        className="absolute inset-0"
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {isLoading
        ? loadingSkeleton
        : collaborators.length > 0
          ? <ul>
              {collaborators.map((collaborator: any) => (
                <li key={collaborator.id} className="flex gap-x-2 items-center border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md px-3 py-2 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://unavatar.io/${collaborator.email}?fallback=false`} alt={`${collaborator.email} 的头像`} />
                    <AvatarFallback className="font-medium text-muted-foreground uppercase text-xs">
                      {collaborator.email.split('@')[0].substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium text-left truncate">
                    {collaborator.email}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="xs" className="ml-auto" disabled={removing.includes(collaborator.id)}>
                        移除
                        {removing.includes(collaborator.id) && (<Loader className="ml-2 h-4 w-4 animate-spin" />)}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认操作</AlertDialogTitle>
                        <AlertDialogDescription>
                          这将移除「{collaborator.email}」对「{owner}/{repo}」的访问权限。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleConfirmRemove(collaborator.id)}>确认移除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          : <div className="bg-accent text-muted-foreground text-sm px-3 py-2 rounded-md flex items-center justify-center h-[50px]">
              <Ban className="h-4 w-4 mr-2"/>
              暂无协作者
            </div>
      }
      <form action={addCollaboratorAction} className="flex gap-x-2">
        <div className="w-full">
          <input type="hidden" name="owner" value={owner} />
          <input type="hidden" name="repo" value={repo} />
          <Input
            type="email"
            name="email"
            placeholder="请输入协作者邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {addCollaboratorState?.error &&
            <div className="text-sm font-medium text-red-500 mt-2 ">{addCollaboratorState.error}</div>
          }
        </div>
        <SubmitButton type="submit" disabled={isEmailInList}>
          邀请协作者
        </SubmitButton>
      </form>
    </div>
  )
}