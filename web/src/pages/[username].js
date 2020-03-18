import ProfilePage from '../containers/profile-page';
import { withApollo } from '../hocs/with-apollo';

export default withApollo({ ssr: true })(ProfilePage);
