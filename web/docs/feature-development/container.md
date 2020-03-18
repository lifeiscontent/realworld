## Creating a `container`

a `container` is for the interactions it has with Data/GraphQL.

1.  Test the behavior of the expected outcome from the containers. e.g. does `create` get called? in Apollo you can test this using `MockedProvider` from [@apollo/react-testing][@apollo/react-testing].

[@apollo/react-testing]: https://www.apollographql.com/docs/react/api/react-testing

Let's write a test for the ArticleComments component.

[web/src/containers/article-comments/index.spec.js][web/src/containers/article-comments/index.spec.js]

```js
// import the story to use as a fixture
import story, { canCreateComment } from './index.stories';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import a custom helper for easier use of stories as fixtures
import { decorateStory } from '../../utils/storybook';

describe('ArticleComments', () => {
  it('canCreateComment', async () => {
    // render the component to the screen
    render(decorateStory(canCreateComment, story));

    // grab our form controls
    const commentInput = await screen.findByPlaceholderText(
      'Write a comment...'
    );

    const submitButton = await screen.findByText('Post Comment');

    // set our text
    fireEvent.change(commentInput, { target: { value: 'Hello world' } });

    // fire the event and wait for our callbacks to run using await and async callback
    await waitFor(async () => {
      fireEvent.click(submitButton);
    });

    // here, we'er using a selector to tell @testing-library to not look for the input field with the text 'Hello world'
    const comment = await screen.findByText('Hello world', {
      selector: '.card-text > p'
    });

    // then we just check to see that the comment exist
    // we actually already did this in the query, this is more or less to make the assertion.
    expect(comment).toHaveTextContent('Hello world');
  });
});
```

> Notes:
>
> We loaded our story up with fixture data to render the UI and we prepopulated the apollo client to expect that we'd be firing a mutation with the text "Hello world". This is why the test is so lean. Check the [source][web/src/containers/article-comments/index.stories.js] to learn more.

[web/src/containers/article-comments/index.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/containers/article-comments/index.js
[web/src/containers/article-comments/index.stories.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/containers/article-comments/index.stories.js
[web/src/containers/article-comments/index.spec.js]: https://github.com/lifeiscontent/realworld/blob/master/web/src/containers/article-comments/index.spec.js
