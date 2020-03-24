import { defaultDecorateStory } from '@storybook/client-api';

export function decorateStory(example, story) {
  return defaultDecorateStory(example, story.decorators ?? [])(example.story);
}
