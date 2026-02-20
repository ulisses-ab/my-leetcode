import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyToClipboardButtonProps {
  text?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  successDuration?: number;
  className?: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  text = 'npm install @shadcn/ui',
  variant = 'outline',
  size = 'default',
  showText = true,
  successDuration = 2000,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, successDuration);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            className={className}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {showText && <span className="ml-2">Copied!</span>}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {showText && <span className="ml-2">Copy</span>}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copied to clipboard!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};