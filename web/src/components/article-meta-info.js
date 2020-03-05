import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../utils/date';

export function ArticleMetaInfo(props) {
  return (
    <div className="info">
      <Link href="/[username]" as={`/${props.userUsername}`} shallow>
        <a className="author">{props.userUsername}</a>
      </Link>
      <time dateTime={props.articleCreatedAt} className="date">
        {format(new Date(props.articleCreatedAt), 'MMMM Qo')}
      </time>
    </div>
  );
}

ArticleMetaInfo.propTypes = {
  userUsername: PropTypes.string.isRequired,
  articleCreatedAt: PropTypes.string.isRequired
};
