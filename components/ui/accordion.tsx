"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDetailsElement> {
  value: string;
}

interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, children, ...props }, ref) => (
    <details
      ref={ref}
      className={cn("border border-border rounded-lg", className)}
      {...props}
    >
      {children}
    </details>
  )
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <summary
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center justify-between p-4 text-sm font-medium transition-all hover:bg-muted/50 list-none [&::-webkit-details-marker]:hidden",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 [details[open]_&]:rotate-180" />
    </summary>
  )
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "pb-4 px-4 text-sm text-muted-foreground animate-accordion-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } 