import { Button } from "@/components/ui/button";
import { useOAuth } from "@/api/hooks/oauth";
import { FaGoogle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface SignInDialogProps {
  children: React.ReactNode;
}

export function SignInDialog({ children }: SignInDialogProps) {
  const { google } = useOAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
            Choose your preferred login method
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <Button
            variant="outline"
            onClick={google}
            className="w-full h-11"
          >
            <FaGoogle className="w-4 h-4" />
            <span>Continue with Google</span>
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogDescription className="font-sans text-[11px] text-bb-muted-strong">
            By signing in you accept our{' '}
            <Link to="/terms" className="text-bb-accent underline underline-offset-2 decoration-dashed hover:text-bb-accent-soft">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-bb-accent underline underline-offset-2 decoration-dashed hover:text-bb-accent-soft">Privacy Policy</Link>
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
