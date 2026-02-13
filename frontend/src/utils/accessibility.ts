// Accessibility utility functions for screen reader support

/**
 * Announces text to screen readers without visual output
 * @param message - The message to announce
 * @param priority - The priority level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Sets focus to an element by ID with error handling
 * @param elementId - The ID of the element to focus
 * @param delay - Optional delay before focusing (useful for dynamic content)
 */
export const focusElement = (elementId: string, delay: number = 0): void => {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  }, delay);
};

/**
 * Gets readable text content from an element, handling various content types
 * @param element - The DOM element to extract text from
 * @returns Clean text content suitable for screen readers
 */
export const getAccessibleText = (element: HTMLElement): string => {
  // Check for aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }
  
  // Fall back to text content
  return element.textContent || '';
};

/**
 * Creates a unique ID for accessibility purposes
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export const generateAccessibilityId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Manages keyboard navigation for a group of elements
 */
export class KeyboardNavigationManager {
  private elements: HTMLElement[];
  private currentIndex: number = 0;

  constructor(elements: HTMLElement[]) {
    this.elements = elements.filter(el => !el.hasAttribute('disabled'));
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.moveNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.movePrevious();
        break;
      case 'Home':
        event.preventDefault();
        this.moveToFirst();
        break;
      case 'End':
        event.preventDefault();
        this.moveToLast();
        break;
    }
  }

  private moveNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.focusCurrent();
  }

  private movePrevious(): void {
    this.currentIndex = this.currentIndex === 0 ? this.elements.length - 1 : this.currentIndex - 1;
    this.focusCurrent();
  }

  private moveToFirst(): void {
    this.currentIndex = 0;
    this.focusCurrent();
  }

  private moveToLast(): void {
    this.currentIndex = this.elements.length - 1;
    this.focusCurrent();
  }

  private focusCurrent(): void {
    if (this.elements[this.currentIndex]) {
      this.elements[this.currentIndex].focus();
    }
  }

  setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.elements.length) {
      this.currentIndex = index;
    }
  }
}

/**
 * Validates and improves form accessibility
 * @param formElement - The form element to enhance
 */
export const enhanceFormAccessibility = (formElement: HTMLFormElement): void => {
  const inputs = formElement.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input) => {
    const htmlInput = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    // Ensure all form controls have labels
    const id = htmlInput.id || generateAccessibilityId('input');
    htmlInput.id = id;
    
    // Find associated label
    let label = formElement.querySelector(`label[for="${id}"]`) as HTMLLabelElement;
    
    if (!label) {
      // Look for aria-labelledby
      const labelledBy = htmlInput.getAttribute('aria-labelledby');
      if (labelledBy) {
        label = document.getElementById(labelledBy) as HTMLLabelElement;
      }
    }
    
    // Add aria-required for required fields
    if (htmlInput.hasAttribute('required') && !htmlInput.hasAttribute('aria-required')) {
      htmlInput.setAttribute('aria-required', 'true');
    }
    
    // Add aria-invalid for validation
    if (!htmlInput.hasAttribute('aria-invalid')) {
      htmlInput.setAttribute('aria-invalid', 'false');
    }
  });
};

/**
 * WCAG color contrast checker utility
 * @param backgroundColor - Background color in hex format
 * @param textColor - Text color in hex format
 * @returns Object with contrast ratio and WCAG compliance levels
 */
export const checkColorContrast = (backgroundColor: string, textColor: string) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const bg = hexToRgb(backgroundColor);
  const text = hexToRgb(textColor);

  if (!bg || !text) {
    return { ratio: 0, wcagAA: false, wcagAAA: false };
  }

  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);
  const textLuminance = getLuminance(text.r, text.g, text.b);

  const ratio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                (Math.min(bgLuminance, textLuminance) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    wcagAALarge: ratio >= 3, // For text 18pt+ or 14pt+ bold
  };
};

/**
 * Skip to content functionality
 */
export const createSkipLink = (): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-10000px';
  skipLink.style.width = '1px';
  skipLink.style.height = '1px';
  skipLink.style.overflow = 'hidden';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.position = 'static';
    skipLink.style.left = 'auto';
    skipLink.style.width = 'auto';
    skipLink.style.height = 'auto';
    skipLink.style.overflow = 'visible';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-10000px';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
  });
  
  return skipLink;
};

/**
 * Reduced motion preferences detection
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * High contrast preferences detection
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Screen reader detection (best effort)
 */
export const isScreenReaderActive = (): boolean => {
  // This is a best-effort detection and not 100% reliable
  return !!(
    navigator.userAgent.includes('NVDA') ||
    navigator.userAgent.includes('JAWS') ||
    navigator.userAgent.includes('VoiceOver') ||
    window.navigator.userAgent.includes('Dragon') ||
    (window as any).speechSynthesis
  );
};