import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { format } from '../../utils/date';

export function ArticleInfo(props) {
  return (
    <div className="info">
      <Link href="/[username]" as={`/${props.author.username}`}>
        <a className="author">{props.author.username}</a>
      </Link>
      <time dateTime={props.createdAt} className="date">
        {format(new Date(props.createdAt), 'MMMM Qo')}
      </time>
    </div>
  );
}

ArticleInfo.propTypes = {
  author: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  createdAt: PropTypes.string.isRequired
};
