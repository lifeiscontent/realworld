import { clsx } from 'clsx';
import { Link } from 'react-router';

export interface Tab {
  label: string;
  to: string;
  active: boolean;
}

interface TabsProps {
  tabs: ReadonlyArray<Tab>;
  /** "feed-toggle" on the home page, "articles-toggle" on a profile. */
  className: string;
}

/** Links that switch between lists, as outline pills. */
export function Tabs({ tabs, className }: TabsProps) {
  return (
    <div className={className}>
      <ul className="nav nav-pills outline-active">
        {tabs.map(tab => (
          <li key={tab.to} className="nav-item">
            <Link
              className={clsx('nav-link', { active: tab.active })}
              to={tab.to}
              aria-current={tab.active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
