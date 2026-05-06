import { useAuthStore } from "@/features/auth/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/features/auth/SignInButton";
import { Link } from "react-router-dom";
import { playClick } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

export function UserMenu() {
  const user = useAuthStore(store => store.user);
  const logout = useAuthStore(store => store.logout);

  if (!user) {
    return (
      <div className="flex space-x-2 items-center">
        <SignInButton />
      </div>
    );
  }

  const initials = user.handle.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={() => { if (useSoundStore.getState().enabled) playClick(); }}
          className="group flex h-9 items-center gap-2 border-2 border-bb-border/55 bg-bb-surface/72 pl-1 pr-3 text-bb-ink hover:border-bb-accent hover:text-bb-accent transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center border-2 border-bb-accent bg-bb-accent/20 font-mono text-[11px] font-bold text-bb-accent">
            {initials}
          </span>
          <span className="font-sans text-xs uppercase tracking-wide max-w-[8rem] truncate">
            {user.handle}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2.5 py-2 border-b-2 border-bb-border/40 mb-1">
          <p className="font-display text-sm uppercase tracking-tight text-bb-ink truncate">{user.handle}</p>
          <p className="font-mono text-[10px] text-bb-muted-strong truncate">{user.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
