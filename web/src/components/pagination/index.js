import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';

export function Pagination({ pageInfo }) {
  const {
    hasNextPage = false,
    hasPreviousPage = false,
    startCursor = null,
    endCursor = null
  } = pageInfo;
  const router = useRouter();
  return (
    <nav>
      <ul className="pagination">
        <li
          className={clsx('page-item', {
            disabled: hasPreviousPage === false
          })}
        >
          <Link
            href={{
              pathname: '/',
              query: router.query.tagName
                ? {
                    before: startCursor,
                    last: 10,
                    tagName: router.query.tagName
                  }
                : {
                    before: startCursor,
                    last: 10
                  }
            }}
          >
            <a className="page-link">Previous</a>
          </Link>
        </li>
        <li
          className={clsx('page-item', {
            disabled: hasNextPage === false
          })}
        >
          <Link
            href={{
              pathname: '/',
              query: router.query.tagName
                ? {
                    after: endCursor,
                    first: 10,
                    tagName: router.query.tagName
                  }
                : {
                    after: endCursor,
                    first: 10
                  }
            }}
          >
            <a className="page-link">Next</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

Pagination.defaultProps = {
  pageInfo: {}
};

Pagination.propTypes = {
  pageInfo: PropTypes.shape({
    endCursor: PropTypes.string,
    hasNextPage: PropTypes.bool,
    startCursor: PropTypes.string,
    hasPreviousPage: PropTypes.bool
  })
};
