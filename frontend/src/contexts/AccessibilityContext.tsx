import React, { createContext, useContext, useEffect, useRef } from "react";
import {
  announceToScreenReader,
  focusElement,
  generateAccessibilityId,
  prefersReducedMotion,
  prefersHighContrast,
  createSkipLink,
} from "@/utils/accessibility";

interface AccessibilityContextType {
  announceToScreenReader: (
    message: string,
    priority?: "polite" | "assertive"
  ) => void;
  focusElement: (elementId: string, delay?: number) => void;
  generateId: (prefix?: string) => string;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  setDocumentTitle: (title: string) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const skipLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // Add skip link to the beginning of the document
    const skipLink = createSkipLink();
    skipLinkRef.current = skipLink;
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark if it doesn't exist
    if (!document.getElementById("main-content")) {
      const mainContent =
        document.querySelector("main") || document.querySelector("#root");
      if (mainContent && !mainContent.id) {
        mainContent.id = "main-content";
      }
    }

    // Set up keyboard navigation for the application
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      // Alt + 1: Focus main content
      if (event.altKey && event.key === "1") {
        event.preventDefault();
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.focus();
          announceToScreenReader("Focused main content area");
        }
      }

      // Alt + 2: Focus navigation
      if (event.altKey && event.key === "2") {
        event.preventDefault();
        const navigation =
          document.querySelector("nav") ||
          document.querySelector('[role="navigation"]');
        if (navigation instanceof HTMLElement) {
          navigation.focus();
          announceToScreenReader("Focused navigation area");
        }
      }

      // Escape: Close modals or overlays
      if (event.key === "Escape") {
        const activeDialog = document.querySelector(
          '[role="dialog"][open], .dialog-open'
        );
        if (activeDialog) {
          const closeButton = activeDialog.querySelector(
            '[data-close], .close-button, button[aria-label*="close" i]'
          ) as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeydown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeydown);
      if (skipLinkRef.current && document.body.contains(skipLinkRef.current)) {
        document.body.removeChild(skipLinkRef.current);
      }
    };
  }, []);

  const setDocumentTitle = (title: string) => {
    document.title = `${title} - Mind Care`;
    announceToScreenReader(`Page changed to: ${title}`, "polite");
  };

  const contextValue: AccessibilityContextType = {
    announceToScreenReader,
    focusElement,
    generateId: generateAccessibilityId,
    prefersReducedMotion: prefersReducedMotion(),
    prefersHighContrast: prefersHighContrast(),
    setDocumentTitle,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};

// Hook for managing focus traps in modals
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
};

// Hook for managing ARIA live regions
export const useAriaLive = () => {
  const politeRef = useRef<HTMLDivElement | null>(null);
  const assertiveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live regions if they don't exist
    if (!politeRef.current) {
      politeRef.current = document.createElement("div");
      politeRef.current.setAttribute("aria-live", "polite");
      politeRef.current.setAttribute("aria-atomic", "true");
      politeRef.current.className = "sr-only";
      politeRef.current.id = "polite-announcer";
      document.body.appendChild(politeRef.current);
    }

    if (!assertiveRef.current) {
      assertiveRef.current = document.createElement("div");
      assertiveRef.current.setAttribute("aria-live", "assertive");
      assertiveRef.current.setAttribute("aria-atomic", "true");
      assertiveRef.current.className = "sr-only";
      assertiveRef.current.id = "assertive-announcer";
      document.body.appendChild(assertiveRef.current);
    }

    return () => {
      if (politeRef.current && document.body.contains(politeRef.current)) {
        document.body.removeChild(politeRef.current);
      }
      if (
        assertiveRef.current &&
        document.body.contains(assertiveRef.current)
      ) {
        document.body.removeChild(assertiveRef.current);
      }
    };
  }, []);

  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    const target =
      priority === "polite" ? politeRef.current : assertiveRef.current;
    if (target) {
      target.textContent = "";
      setTimeout(() => {
        if (target) {
          target.textContent = message;
        }
      }, 100);
    }
  };

  return { announce };
};

// Hook for enhanced form accessibility
export const useFormAccessibility = () => {
  const generateFieldId = (name: string) => `field-${name}-${Date.now()}`;

  const generateDescriptionId = (fieldId: string) => `${fieldId}-description`;

  const generateErrorId = (fieldId: string) => `${fieldId}-error`;

  const getAriaDescribedBy = (
    fieldId: string,
    hasError: boolean,
    hasDescription: boolean
  ) => {
    const ids: string[] = [];
    if (hasDescription) ids.push(generateDescriptionId(fieldId));
    if (hasError) ids.push(generateErrorId(fieldId));
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  return {
    generateFieldId,
    generateDescriptionId,
    generateErrorId,
    getAriaDescribedBy,
  };
};

export default AccessibilityProvider;
