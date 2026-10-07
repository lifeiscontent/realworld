import type { ComponentProps } from 'react';
import { useFormAction, useNavigation } from 'react-router';

import { Button } from './Button';

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, 'type'> & {
  /** The action of the form, if it is not the current route. */
  action?: string;
};

const pathOf = (url: string) => url.split('?')[0];

/** A submit button that is disabled while its own form submits. */
export function SubmitButton({
  action,
  disabled,
  ...props
}: SubmitButtonProps) {
  const navigation = useNavigation();
  const formAction = useFormAction(action);
  const submitting =
    navigation.state === 'submitting' &&
    pathOf(navigation.formAction) === pathOf(formAction);

  return <Button type="submit" disabled={disabled || submitting} {...props} />;
}
