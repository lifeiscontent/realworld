import { href } from 'react-router';

import { type Tab, Tabs } from '../../ui/Tabs';

interface FeedToggleProps {
  /** Shows the Your Feed tab. Only signed-in users have a feed. */
  showYourFeed: boolean;
  feed: 'following' | 'global' | 'tag';
  tag?: string;
}

/** The tabs of the home page: Your Feed, Global Feed, and the tag. */
export function FeedToggle({ showYourFeed, feed, tag }: FeedToggleProps) {
  const tabs: Tab[] = [
    ...(showYourFeed
      ? [
          {
            label: 'Your Feed',
            to: '/?feed=following',
            active: feed === 'following',
          },
        ]
      : []),
    { label: 'Global Feed', to: href('/'), active: feed === 'global' },
    ...(feed === 'tag' && tag
      ? [{ label: `#${tag}`, to: href('/tag/:tag', { tag }), active: true }]
      : []),
  ];
  return <Tabs className="feed-toggle" tabs={tabs} />;
}
