import { defaultDecorateStory } from '@storybook/client-api';

export function decorateStory(example, story) {
  return defaultDecorateStory(example, story.decorators ?? [])(example.story);
}

export function buildAuthorizationResult({
  value = false,
  message,
  reasons,
} = {}) {
  return {
    message,
    reasons,
    value,
  };
}
