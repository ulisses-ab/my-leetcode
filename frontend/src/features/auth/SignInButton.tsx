import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignInDialog } from "@/features/auth/SignInDialog";

export function SignInButton() {
  return (
    <SignInDialog>
      <Button variant="default" size="sm">Sign In</Button>
    </SignInDialog>
  )
}