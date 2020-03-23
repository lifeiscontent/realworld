import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import gql from 'graphql-tag';

export function Pagination({
  hasNextPage,
  hasPreviousPage,
  startCursor,
  endCursor,
}) {
  const router = useRouter();
  return (
    <nav>
      <ul className="pagination">
        <li
          className={clsx('page-item', {
            disabled: hasPreviousPage === false,
          })}
        >
          <Link
            href={{
              pathname: router.pathname,
              query: router.query.tagName
                ? {
                    before: startCursor,
                    last: 10,
                    tagName: router.query.tagName,
                  }
                : {
                    before: startCursor,
                    last: 10,
                  },
            }}
          >
            <a className="page-link">Previous</a>
          </Link>
        </li>
        <li
          className={clsx('page-item', {
            disabled: hasNextPage === false,
          })}
        >
          <Link
            href={{
              pathname: router.pathname,
              query: router.query.tagName
                ? {
                    after: endCursor,
                    first: 10,
                    tagName: router.query.tagName,
                  }
                : {
                    after: endCursor,
                    first: 10,
                  },
            }}
          >
            <a className="page-link">Next</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

Pagination.fragments = {
  pageInfo: gql`
    fragment PaginationPageInfoFragment on PageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  `,
};

Pagination.defaultProps = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
};

Pagination.propTypes = {
  endCursor: PropTypes.string,
  hasNextPage: PropTypes.bool,
  startCursor: PropTypes.string,
  hasPreviousPage: PropTypes.bool,
};
