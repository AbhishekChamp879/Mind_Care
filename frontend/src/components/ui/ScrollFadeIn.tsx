import { ReactNode } from 'react';

const ScrollFadeIn = ({ children, yOffset = 24, delay = 0 }: { children: ReactNode; yOffset?: number; delay?: number }) => {
  // minimal wrapper - real implementation can add IntersectionObserver and animations
  return <div className="scroll-fade-in" data-y-offset={yOffset} data-delay={delay}>{children}</div>;
};

export default ScrollFadeIn;
