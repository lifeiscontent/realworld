import { Form, href } from 'react-router';

import { Button } from '../../ui/Button';
import { ErrorMessages } from '../../ui/ErrorMessages';
import { SubmitButton } from '../../ui/SubmitButton';
import { TextArea, TextField } from '../../ui/TextField';

interface SettingsFormProps {
  user: {
    username: string;
    email: string;
    bio?: string | null;
    image?: string | null;
  };
  errors?: ReadonlyArray<string>;
}

/** The settings of the user, and the logout button. */
export function SettingsForm({ user, errors }: SettingsFormProps) {
  return (
    <>
      <h1 className="text-xs-center">Your Settings</h1>
      <ErrorMessages messages={errors} />
      <Form method="post">
        <fieldset>
          <TextField
            label="URL of profile picture"
            name="image"
            defaultValue={user.image ?? ''}
          />
          <TextField
            label="Your Name"
            name="username"
            size="lg"
            autoComplete="username"
            defaultValue={user.username}
          />
          <TextArea
            label="Short bio about you"
            name="bio"
            size="lg"
            defaultValue={user.bio ?? ''}
          />
          <TextField
            label="Email"
            name="email"
            size="lg"
            autoComplete="email"
            defaultValue={user.email}
          />
          <TextField
            label="New Password"
            name="password"
            type="password"
            size="lg"
            autoComplete="new-password"
          />
          <SubmitButton variant="primary" size="lg" className="pull-xs-right">
            Update Settings
          </SubmitButton>
        </fieldset>
      </Form>
      <hr />
      <Form method="post" action={href('/logout')}>
        <Button type="submit" variant="danger" outline>
          Or click here to logout.
        </Button>
      </Form>
    </>
  );
}
