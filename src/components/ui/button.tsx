import * as React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "outline"
  | "ghost"
  | "secondary"
  | "destructive"
  | "link";
type Size = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean; // <Button asChild><Link .../></Button> 지원
}

const base =
  "inline-flex items-center justify-center rounded-xl text-sm font-medium " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-sky-300 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]";

const variants: Record<Variant, string> = {
  default: "bg-[#6EC6FF] text-white hover:bg-[#5db9f4]",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "bg-transparent hover:bg-gray-100",
  secondary: "bg-gray-900 text-white hover:opacity-90",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  link: "bg-transparent underline underline-offset-4 text-[#6EC6FF] hover:opacity-90",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-6",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    // 의존성 없이 asChild 지원 (Link 등으로 감쌀 때)
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(child.props?.className, classes),
        ref,
        ...props,
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
