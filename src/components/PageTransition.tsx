import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition Component
 *
 * Optimized wrapper - no animations for instant performance
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  return <>{children}</>;
};

export default PageTransition;
