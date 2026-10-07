const DEFAULT_IMAGE = '/images/default-avatar.svg';

interface AvatarProps {
  /** The name of the person, for the alt text. */
  name: string;
  image: string | null | undefined;
  className?: string;
  /** The image is next to the name, so it needs no alt text. */
  decorative?: boolean;
}

/** The image of a person, or the default avatar when there is none. */
export function Avatar({
  name,
  image,
  className,
  decorative = false,
}: AvatarProps) {
  return (
    <img
      src={image || DEFAULT_IMAGE}
      alt={decorative ? '' : name}
      className={className}
    />
  );
}
