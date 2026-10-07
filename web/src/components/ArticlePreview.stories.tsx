import preview from '../../.storybook/preview';
import { article } from '../stories/fixtures';
import { ArticlePreview } from './ArticlePreview';

const meta = preview.meta({
  title: 'Components/ArticlePreview',
  component: ArticlePreview,
  tags: ['autodocs'],
  args: { article },
});

export const Default = meta.story();

export const Favorited = meta.story({
  args: { article: { ...article, favorited: true, favoritesCount: 4 } },
});
