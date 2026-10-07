import { Link } from 'react-router';
import { paths } from '../lib/paths';

interface PopularTagsProps {
  tags: ReadonlyArray<string>;
}

export function PopularTags({ tags }: PopularTagsProps) {
  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      {tags.length ? (
        <div className="tag-list">
          {tags.map(tag => (
            <Link
              key={tag}
              to={paths.tag(tag)}
              className="tag-pill tag-default"
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : (
        <div>No tags are here... yet.</div>
      )}
    </div>
  );
}
