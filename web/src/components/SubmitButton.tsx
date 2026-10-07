import type { ReactNode } from 'react';
import { useFormAction, useNavigation } from 'react-router';

interface SubmitButtonProps {
  className: string;
  children: ReactNode;
  /** The action of the form, if it is not the current route. */
  action?: string;
}

/** A submit button that is disabled while its own form submits. */
export function SubmitButton({
  className,
  children,
  action,
}: SubmitButtonProps) {
  const navigation = useNavigation();
  const formAction = useFormAction(action);
  const submitting =
    navigation.state === 'submitting' &&
    new URL(navigation.formAction, window.location.origin).pathname ===
      new URL(formAction, window.location.origin).pathname;

  return (
    <button type="submit" className={className} disabled={submitting}>
      {children}
    </button>
  );
}
