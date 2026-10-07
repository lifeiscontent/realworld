/** The number of articles on a page. */
const PAGE_SIZE = 10;

/** The page of a request, from ?page=N, with its limit and offset. */
export function pageOf(url: URL) {
  const value = Number(url.searchParams.get('page') ?? '1');
  const page = Number.isInteger(value) && value > 0 ? value : 1;
  return { page, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
}

export function totalPages(totalCount: number): number {
  return Math.ceil(totalCount / PAGE_SIZE);
}

/** The URL of a page of a location. Page 1 has no page parameter. */
export function hrefForPage(
  location: { pathname: string; search: string },
  page: number
): string {
  const searchParams = new URLSearchParams(location.search);
  if (page === 1) searchParams.delete('page');
  else searchParams.set('page', String(page));
  const query = searchParams.toString();
  return query ? `${location.pathname}?${query}` : location.pathname;
}
