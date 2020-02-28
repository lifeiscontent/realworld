import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as Yup from 'yup';
import { MockedProvider } from '@apollo/react-testing';

import { ArticleForm } from './article-form';

const validationSchema = Yup.object({
  input: Yup.object({
    title: Yup.string()
      .label('Title')
      .required(),
    description: Yup.string()
      .label('Description')
      .required(),
    body: Yup.string()
      .label('Body')
      .required(),
    tagIds: Yup.array(Yup.string())
      .label('Tags')
      .test('', '${path} is a required field', value => Array.isArray(value))
  })
});

describe('ArticleForm', () => {
  function setup({
    handleSubmit = () => undefined,
    initialValues = {
      input: { title: '', description: '', body: '', tagIds: [] }
    }
  } = {}) {
    return render(
      <MockedProvider>
        <ArticleForm
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </MockedProvider>
    );
  }

  it('renders', async () => {
    const { asFragment } = setup();
    await wait(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('displays errors on submit', async () => {
    const { getByRole, getAllByText } = setup();

    await wait(() => {
      const submitButton = getByRole('button');
      fireEvent.click(submitButton);
      const errors = getAllByText(/is a required field$/);

      expect(errors).toHaveLength(3);
    });
  });

  it('calls onSubmit when valid on submit', async () => {
    let handleSubmit = jest.fn();

    const { getByRole, getByLabelText } = setup({
      handleSubmit
    });

    await wait(() => {
      fireEvent.change(getByLabelText(/title/i), {
        target: { value: 'How to build webapps that scale' }
      });
    });

    await wait(() => {
      fireEvent.change(getByLabelText(/description/i), {
        target: {
          value:
            'Web development technologies have evolved at an incredible clip over the past few years.'
        }
      });
    });

    await wait(() => {
      fireEvent.change(getByLabelText(/body/i), {
        target: {
          value:
            "## Introducing RealWorld.\nIt's a great solution for learning how other frameworks work."
        }
      });
    });

    await wait(() => {
      const submitButton = getByRole('button');

      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
