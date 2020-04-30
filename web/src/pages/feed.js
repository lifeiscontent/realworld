import FeedPage from '../containers/feed-page';
import { withApollo } from '../hocs/with-apollo';

export default withApollo({ ssr: true })(FeedPage);
