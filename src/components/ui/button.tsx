import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all shadow-md focus:outline-none",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

Button.displayName = "Button";

export { Button };
