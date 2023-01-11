import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import { gql } from '@apollo/client';

export function Pagination({
  hasNextPage = false,
  hasPreviousPage = false,
  startCursor = null,
  endCursor = null,
}) {
  const router = useRouter();
  return (
    <nav>
      <ul className="pagination">
        <li
          className={clsx('page-item', {
            disabled: !hasPreviousPage,
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
            className="page-link"
          >
            Previous
          </Link>
        </li>
        <li
          className={clsx('page-item', {
            disabled: !hasNextPage,
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
            className="page-link"
          >
            Next
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

Pagination.propTypes = {
  endCursor: PropTypes.string,
  hasNextPage: PropTypes.bool,
  startCursor: PropTypes.string,
  hasPreviousPage: PropTypes.bool,
};
