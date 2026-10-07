import { href, Link } from 'react-router';

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
              to={href('/tag/:tag', { tag })}
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
