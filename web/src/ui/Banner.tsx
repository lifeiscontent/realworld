import type { ReactNode } from 'react';

/** The wide band at the top of the home and article pages. */
export function Banner({ children }: { children: ReactNode }) {
  return (
    <div className="banner">
      <div className="container">{children}</div>
    </div>
  );
}
