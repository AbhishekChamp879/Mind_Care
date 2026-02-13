import { ReactNode } from 'react';

const PageTransition = ({ children }: { children: ReactNode }) => {
  return <div className="page-transition">{children}</div>;
};

export default PageTransition;
