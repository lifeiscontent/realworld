import React from 'react';
import PropTypes from 'prop-types';

function Shell({ children }) {
  return children;
}

Shell.propTypes = {
  children: PropTypes.node.isRequired
};

const getLayout = page => <Shell>{page}</Shell>;

export default getLayout;
