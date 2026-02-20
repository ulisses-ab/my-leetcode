import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { Link } from "react-router-dom";

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  title?: string;
}

export function Navbar({ title = "LeetClone", className, ...props }: NavbarProps) {
  const navbarCenter = useNavbarStore((state) => state.navbarCenter);

  return (
    <nav
      {...props}
      className={cn(
        "w-full px-4 py-2 h-13 flex items-center justify-between bg-transparent",
        className
      )}
    >
      <div className="flex flex-1 items-center space-x-2">
        <span className="font-bold text-lg">{title}</span>
        <Link to="/problems">
          <Button variant="ghost" size="sm">Problems</Button>
        </Link>
      </div>

      <div className="flex flex-1 justify-center">
        {navbarCenter}
      </div>


      <div className="flex-1 flex justify-end">
        <UserMenu />
      </div>
    </nav>
  );
}
