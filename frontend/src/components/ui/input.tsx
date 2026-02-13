/**
 * @fileoverview Input Component - Accessible form input for Mind Care application
 * 
 * A fully accessible input component that extends HTML input elements with
 * comprehensive ARIA support and consistent styling for mental health forms.
 * 
 * Features:
 * - WCAG 2.1 AA compliant accessibility
 * - Consistent styling across the application
 * - Built-in ARIA attributes for screen readers
 * - Support for form validation states
 * - Responsive text sizing
 * - Focus indicators optimized for anxiety-friendly UX
 * 
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter your name" />
 * 
 * // Accessible input with labels and error handling
 * <Input
 *   type="email"
 *   aria-label="Email address for account recovery"
 *   aria-describedby="email-help email-error"
 *   aria-invalid={hasError}
 *   aria-required={true}
 * />
 * 
 * // Form input with validation
 * <Input
 *   aria-describedby="password-requirements"
 *   aria-invalid={!isValid}
 *   type="password"
 * />
 * ```
 * 
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/textbox/} ARIA textbox pattern
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props interface for the Input component with accessibility enhancements.
 * 
 * Extends standard HTML input props with additional ARIA attributes
 * for comprehensive screen reader support and form accessibility.
 * 
 * @interface InputProps
 */
export interface InputProps extends React.ComponentProps<'input'> {
  /**
   * Accessible name for the input when a visible label isn't present.
   * Critical for screen reader users to understand the input's purpose.
   * 
   * @example "Search counselors", "Emergency contact phone"
   */
  'aria-label'?: string;
  
  /**
   * Space-separated list of element IDs that describe this input.
   * Links to help text, error messages, or additional instructions.
   * 
   * @example "password-help password-error"
   */
  'aria-describedby'?: string;
  
  /**
   * Indicates whether the input has a validation error.
   * Automatically communicated to screen readers for form feedback.
   * 
   * @default false
   */
  'aria-invalid'?: boolean;
  
  /**
   * Indicates whether this input must be filled out before form submission.
   * Helps screen readers communicate required fields to users.
   * 
   * @default false
   */
  'aria-required'?: boolean;
}

/**
 * Input Component - Accessible form input with mental health-focused styling.
 * 
 * Provides a consistent, accessible text input experience across the Mind Care
 * application. Includes calming visual design and comprehensive accessibility
 * features essential for mental health forms where clarity and trust are vital.
 * 
 * Styling Features:
 * - Soft, rounded borders to reduce visual stress
 * - Calming focus indicators that don't trigger anxiety
 * - Responsive text sizing for readability
 * - File input styling for document uploads
 * - Disabled state handling with appropriate visual feedback
 * 
 * @param props - Input props including HTML input attributes and ARIA enhancements
 * @param ref - Forwarded ref to the underlying input element
 * 
 * @example
 * ```tsx
 * // Crisis form input with immediate validation
 * <Input
 *   type="tel"
 *   aria-label="Emergency contact phone number"
 *   aria-describedby="phone-help"
 *   aria-required={true}
 *   placeholder="(555) 123-4567"
 * />
 * 
 * // Therapy session notes input
 * <Input
 *   aria-label="Session goals and topics to discuss"
 *   aria-describedby="session-help"
 *   placeholder="What would you like to focus on today?"
 * />
 * ```
 * 
 * @returns Fully accessible input component with mental health-focused styling
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, 'aria-required': ariaRequired, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
