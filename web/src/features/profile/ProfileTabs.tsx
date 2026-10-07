import { href } from 'react-router';

import { Tabs } from '../../ui/Tabs';

interface ProfileTabsProps {
  username: string;
  tab: 'articles' | 'favorites';
}

/** The tabs of a profile: the articles of the user and their favorites. */
export function ProfileTabs({ username, tab }: ProfileTabsProps) {
  return (
    <Tabs
      className="articles-toggle"
      tabs={[
        {
          label: 'My Articles',
          to: href('/profile/:username/:tab?', { username }),
          active: tab === 'articles',
        },
        {
          label: 'Favorited Articles',
          to: href('/profile/:username/:tab?', { username, tab: 'favorites' }),
          active: tab === 'favorites',
        },
      ]}
    />
  );
}
