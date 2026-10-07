interface TagListProps {
  tags: ReadonlyArray<string>;
}

/** The tags of an article, as outline pills. */
export function TagList({ tags }: TagListProps) {
  if (!tags.length) return null;

  return (
    <ul className="tag-list">
      {tags.map(tag => (
        <li key={tag} className="tag-default tag-pill tag-outline">
          {tag}
        </li>
      ))}
    </ul>
  );
}
