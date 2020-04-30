import IndexPage from '../containers/index-page';
import { withApollo } from '../hocs/with-apollo';

export default withApollo({ ssr: true })(IndexPage);
