import { useState } from 'react';
import { Form } from 'react-router';
import { z } from 'zod';

import { ErrorMessages } from '../../ui/ErrorMessages';
import { SubmitButton } from '../../ui/SubmitButton';
import { TextArea, TextField } from '../../ui/TextField';

/**
 * Reads the posted form. The API validates the values. A form without tags
 * sends no tagList.
 */
export const articleFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()).default([]),
});

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
  errors,
}: ArticleFormProps) {
  return (
    <>
      <ErrorMessages messages={errors} />
      <Form method="post">
        <fieldset>
          <TextField
            label="Article Title"
            name="title"
            size="lg"
            defaultValue={defaultValues.title}
          />
          <TextField
            label="What's this article about?"
            name="description"
            defaultValue={defaultValues.description}
          />
          <TextArea
            label="Write your article (in markdown)"
            name="body"
            defaultValue={defaultValues.body}
          />
          <fieldset className="form-group">
            <TagsInput defaultValue={defaultValues.tagList} />
          </fieldset>
          <SubmitButton variant="primary" size="lg" className="pull-xs-right">
            Publish Article
          </SubmitButton>
        </fieldset>
      </Form>
    </>
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
