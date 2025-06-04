
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FabProps {
  href: string;
  tooltipText?: string;
}

export function Fab({ href, tooltipText = "Book an Appointment" }: FabProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50 p-0"
            aria-label={tooltipText}
          >
            <Link href={href}>
              <CalendarPlus className="h-7 w-7" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
