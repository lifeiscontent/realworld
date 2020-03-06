import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as Yup from 'yup';
import { MockedProvider } from '@apollo/react-testing';

import { ArticleForm } from './article-form';

describe('ArticleForm', () => {
  function setup({
    handleSubmit = () => undefined,
    initialValues = {
      input: { title: '', description: '', body: '', tagIds: [] }
    }
  } = {}) {
    return render(
      <MockedProvider>
        <ArticleForm initialValues={initialValues} onSubmit={handleSubmit} />
      </MockedProvider>
    );
  }

  it('renders', async () => {
    const { asFragment } = setup();
    await wait(() => {
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <form
            action="#"
            id="article-form"
          >
            <ul
              class="error-messages"
            />
            <fieldset>
              <fieldset
                class="form-group"
              >
                <label
                  for="article-form-title-input"
                >
                  Title
                </label>
                <input
                  class="form-control form-control-lg"
                  id="article-form-title-input"
                  name="input.title"
                  placeholder="How to build webapps that scale"
                  type="text"
                  value=""
                />
              </fieldset>
              <fieldset
                class="form-group"
              >
                <label
                  for="article-form-description-input"
                >
                  Description
                </label>
                <input
                  class="form-control"
                  id="article-form-description-input"
                  name="input.description"
                  placeholder="Web development technologies have evolved at an incredible clip over the past few years."
                  type="text"
                  value=""
                />
              </fieldset>
              <fieldset
                class="form-group"
              >
                <label
                  for="article-form-body-textarea"
                >
                  Body
                </label>
                <textarea
                  class="form-control"
                  id="article-form-body-textarea"
                  name="input.body"
                  placeholder="# Introducing RealWorld.

        It's a great solution for learning how other frameworks work."
                  rows="8"
                />
              </fieldset>
              <fieldset
                class="form-group"
              >
                <label
                  for="article-form-tags-ids-input"
                >
                  Tags
                </label>
                <p>
                  <input
                    class="form-control"
                    id="article-form-tags-ids-input"
                    list="tags"
                    name="input.tagIds"
                    placeholder="Press enter to add tag to list"
                    type="text"
                    value=""
                  />
                  <datalist
                    id="tags"
                  />
                </p>
                <div
                  class="tag-list"
                />
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="submit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </DocumentFragment>
      `);
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
