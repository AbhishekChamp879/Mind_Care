import React from 'react';
import { cn } from '@/lib/utils';

// Simplified loader component
const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// Simplified Slot implementation
interface SlotProps {
  children: React.ReactElement;
  [key: string]: unknown;
}

const Slot = ({ children, ...props }: SlotProps) => {
  const child = React.Children.only(children);
  return React.cloneElement(child, { ...props });
};

interface ButtonBaseProps {
  isLoading?: boolean;
  showRipple?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'hero' | 'trust' | 'gentle' | 'safety' | 'calm' | 'support' | 'premium';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
  className?: string;
  isLoading?: boolean;
  showRipple?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
}

interface ButtonVariantOptions {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
  state?: {
    loading?: boolean;
    ripple?: boolean;
  };
}

const buttonVariants = (options: ButtonVariantOptions) => {
  const { variant = 'default', size = 'default', className = '', state = {} } = options;
  return cn(
    // Base styles
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-white/0 before:transition-colors hover:before:bg-white/10 active:before:bg-white/5 group',
    // Variant styles
    {
      'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-premium hover:shadow-floating hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0': variant === 'default',
      'bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground': variant === 'destructive',
      'border-2 border-primary/20 bg-white/5 backdrop-blur-sm text-foreground': variant === 'outline',
      // Add other variant styles here
    },
    // Size styles
    {
      'h-11 px-6 py-3 text-sm': size === 'default',
      'h-9 px-4 py-2 text-xs rounded-lg': size === 'sm',
      'h-14 px-10 py-4 text-lg rounded-2xl': size === 'lg',
      'h-16 px-12 py-5 text-xl font-bold rounded-2xl': size === 'xl',
      'h-11 w-11 rounded-xl': size === 'icon',
    },
    // State styles
    {
      'opacity-80 cursor-wait': state.loading,
      'after:absolute after:inset-0 after:rounded-xl after:bg-white/20 after:transform after:scale-0 after:opacity-0 after:transition-transform after:duration-500 active:after:scale-[2.5] active:after:opacity-100': state.ripple,
    },
    className
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    isLoading = false,
    showRipple = true,
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    children,
    onClick,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const [rippleActive, setRippleActive] = React.useState(false);

    React.useEffect(() => {
      if (rippleActive) {
        const timer = setTimeout(() => setRippleActive(false), 500);
        return () => clearTimeout(timer);
      }
    }, [rippleActive]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (showRipple) {
        setRippleActive(true);
      }
      onClick?.(e);
    };

    return React.createElement(
      Comp,
      {
        className: buttonVariants({
          variant,
          size,
          state: {
            loading: isLoading,
            ripple: showRipple && rippleActive,
          },
          className
        }),
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-expanded': ariaExpanded,
        onClick: handleClick,
        disabled: isLoading || disabled,
        ref,
        ...props
      },
      isLoading ? [
        React.createElement(Loader2, { key: 'loader', className: "mr-2 h-4 w-4 animate-spin" }),
        children
      ] : children
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };