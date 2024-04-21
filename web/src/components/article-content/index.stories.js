import { expect, within } from '@storybook/test';
import { ArticleContent } from '.';

const meta = {
  component: ArticleContent,
  args: {
    description:
      'Web development technologies have evolved at an incredible clip over the past few years.',
    body: `# Introducing RealWorld.\n\nIt's a great solution for learning how other frameworks work.`,
  },
};

export default meta;

export const AsGuest = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText(
      new RegExp(
        'Web development technologies have evolved at an incredible clip over the past few years.',
        'i'
      )
    );
    const h1 = canvas.getByRole('heading', {
      level: 1,
      name: new RegExp('Introducing RealWorld.', 'i'),
    });
    const p = canvas.getByText(
      new RegExp(
        "It's a great solution for learning how other frameworks work.",
        'i'
      )
    );

    await expect(content).toBeInTheDocument();
    await expect(h1).toBeInTheDocument();
    await expect(p).toBeInTheDocument();
  },
};
