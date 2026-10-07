import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface FormPageProps {
  /** The page class of the Conduit templates, for example "auth-page". */
  page: 'auth-page' | 'settings-page' | 'editor-page';
  /** A narrow column for account forms, a wide column for the editor. */
  width: 'narrow' | 'wide';
  children: ReactNode;
}

/** A page with one centered column, for a form. */
export function FormPage({ page, width, children }: FormPageProps) {
  return (
    <div className={page}>
      <div className="container page">
        <div className="row">
          <div
            className={clsx('col-xs-12', {
              'col-md-6 offset-md-3': width === 'narrow',
              'col-md-10 offset-md-1': width === 'wide',
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
