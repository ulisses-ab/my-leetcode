import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/features/auth/SignInButton";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const user = useAuthStore(store => store.user);
  const logout = useAuthStore(store => store.logout);

  if(!user) {
    return (
      <div className="flex space-x-2 items-center">
        <Button variant="outline" size="sm">Premium</Button>
        <SignInButton />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/a.png" alt="@shadcn" />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}