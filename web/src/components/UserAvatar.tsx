const DEFAULT_AVATAR = '/images/default-avatar.svg';

interface UserAvatarProps {
  username: string;
  image: string | null | undefined;
  className?: string;
  /** The image is next to the username, so it needs no alt text. */
  decorative?: boolean;
}

/** The user's image, or the default avatar when the user has none. */
export function UserAvatar({
  username,
  image,
  className,
  decorative = false,
}: UserAvatarProps) {
  return (
    <img
      src={image || DEFAULT_AVATAR}
      alt={decorative ? '' : username}
      className={className}
    />
  );
}
