import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { TagsInputTag } from './tags-input-tag';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export function TagsInput(props) {
  const [value, setValue] = useState('');
  const tags = useQuery(TagsInputQuery, {
    returnPartialData: true
  });
  const [field, , helpers] = useField(props);
  return (
    <>
      <p>
        <input
          type="text"
          className="form-control"
          placeholder="Press enter to add tag to list"
          list="tags"
          name={field.name}
          onBlur={field.onBlur}
          value={value}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              const tag = tags.data.tags.find(
                tag => tag.name === event.target.value
              );
              if (tag?.id) {
                if (field.value.includes(tag.id) === false) {
                  helpers.setValue(field.value.concat(tag.id));
                  setValue('');
                  event.target.blur();
                  event.target.focus();
                }
              } else {
                // TODO: create tag and refetch TagsInputQuery
              }
            }
          }}
          onChange={event => {
            event.preventDefault();
            setValue(event.target.value);
          }}
        />
        <datalist id="tags">
          {tags.data.tags?.map(tag => (
            <option value={tag.name} key={tag.id} />
          ))}
        </datalist>
      </p>
      <div className="tag-list">
        {field.value.map(id => (
          <TagsInputTag id={id} key={id} />
        ))}
      </div>
    </>
  );
}

TagsInput.propTypes = {
  name: PropTypes.string.isRequired
};

const TagsInputQuery = gql`
  query TagsInputQuery {
    tags {
      ...TagsInputTagTagFragment
    }
  }
  ${TagsInputTag.fragments.tag}
`;
