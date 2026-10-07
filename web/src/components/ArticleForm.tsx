import { useState } from 'react';
import { Form } from 'react-router';
import { ErrorMessages } from './ErrorMessages';
import { SubmitButton } from './SubmitButton';

interface ArticleFormValues {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

interface ArticleFormProps {
  defaultValues?: ArticleFormValues;
  errors?: ReadonlyArray<string>;
}

const emptyArticle: ArticleFormValues = {
  title: '',
  description: '',
  body: '',
  tagList: [],
};

export function ArticleForm({
  defaultValues = emptyArticle,
  errors = [],
}: ArticleFormProps) {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ErrorMessages messages={errors} />
            <Form method="post">
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="title"
                    placeholder="Article Title"
                    aria-label="Article Title"
                    defaultValue={defaultValues.title}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="What's this article about?"
                    aria-label="What's this article about?"
                    defaultValue={defaultValues.description}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    name="body"
                    placeholder="Write your article (in markdown)"
                    aria-label="Write your article (in markdown)"
                    defaultValue={defaultValues.body}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <TagsInput defaultValue={defaultValues.tagList} />
                </fieldset>
                <SubmitButton className="btn btn-lg pull-xs-right btn-primary">
                  Publish Article
                </SubmitButton>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Adds a tag when the user presses Enter, and removes it with its icon. Each
 * tag is a hidden tagList input, so the form posts the list.
 */
function TagsInput({ defaultValue }: { defaultValue: string[] }) {
  const [tags, setTags] = useState(defaultValue);
  const [draft, setDraft] = useState('');

  return (
    <>
      <input
        type="text"
        className="form-control"
        placeholder="Enter tags"
        aria-label="Enter tags"
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onKeyDown={event => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          const tag = draft.trim();
          if (tag && !tags.includes(tag)) setTags([...tags, tag]);
          setDraft('');
        }}
      />
      <div className="tag-list">
        {tags.map(tag => (
          <span key={tag} className="tag-default tag-pill">
            <input type="hidden" name="tagList" value={tag} />
            <button
              type="button"
              className="icon-button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => setTags(tags.filter(item => item !== tag))}
            >
              <i className="ion-close-round" />
            </button>{' '}
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
