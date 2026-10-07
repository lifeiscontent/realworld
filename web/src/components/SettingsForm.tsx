import { Form } from 'react-router';
import { paths } from '../lib/paths';
import { ErrorMessages } from './ErrorMessages';
import { SubmitButton } from './SubmitButton';

interface SettingsFormProps {
  user: {
    username: string;
    email: string;
    bio?: string | null;
    image?: string | null;
  };
  errors?: ReadonlyArray<string>;
}

export function SettingsForm({ user, errors = [] }: SettingsFormProps) {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ErrorMessages messages={errors} />
            <Form method="post">
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    name="image"
                    placeholder="URL of profile picture"
                    aria-label="URL of profile picture"
                    defaultValue={user.image ?? ''}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="username"
                    placeholder="Your Name"
                    aria-label="Your Name"
                    autoComplete="username"
                    defaultValue={user.username}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    name="bio"
                    placeholder="Short bio about you"
                    aria-label="Short bio about you"
                    defaultValue={user.bio ?? ''}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    defaultValue={user.email}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    aria-label="New Password"
                    autoComplete="new-password"
                  />
                </fieldset>
                <SubmitButton className="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </SubmitButton>
              </fieldset>
            </Form>
            <hr />
            <Form method="post" action={paths.logout()}>
              <button type="submit" className="btn btn-outline-danger">
                Or click here to logout.
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
