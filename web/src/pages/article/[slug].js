import ArticlePage from '../../containers/article-page';
import { withApollo } from '../../hocs/with-apollo';

export default withApollo({ ssr: true })(ArticlePage);
