import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router';
import { hrefForPage, totalPages } from '../lib/pagination';

interface PaginationProps {
  currentPage: number;
  /** The number of items in all pages. */
  totalCount: number;
}

/** Links to each page of the current URL, with ?page=N. */
export function Pagination({ currentPage, totalCount }: PaginationProps) {
  const location = useLocation();
  const count = totalPages(totalCount);
  if (count <= 1) return null;

  return (
    <nav aria-label="Pagination">
      <ul className="pagination">
        {Array.from({ length: count }, (_, index) => index + 1).map(page => (
          <li
            key={page}
            className={clsx('page-item', { active: page === currentPage })}
          >
            <Link
              className="page-link"
              to={hrefForPage(location, page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
