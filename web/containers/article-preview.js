import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";

const ArticlePreviewQuery = gql`
  query ArticlePreviewQuery($id: ID!) {
    article(id: $id) {
      id
      createdAt
      description
      favoritesCount
      slug
      title
      author {
        id
        username
      }
    }
  }
`;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const ordinalSuffixOf = i => {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) return `${i}st`;
  if (j == 2 && k != 12) return `${i}nd`;
  if (j == 3 && k != 13) return `${i}rd`;
  return `${i}th`;
};

function formatDateString(dateString) {
  const date = new Date(dateString);
  return `${months[date.getMonth()]} ${ordinalSuffixOf(date.getDate())}`;
}

export function ArticlePreview(props) {
  const article = useQuery(ArticlePreviewQuery, {
    variables: { id: props.id }
  });

  return article.loading ? (
    <div className="article-preview">Loading...</div>
  ) : (
    <div className="article-preview">
      <div className="article-meta">
        <Link href={`/${article.data.article.author.username}`}>
          <a>
            <img src="http://i.imgur.com/N4VcUeJ.jpg" />
          </a>
        </Link>
        <div className="info">
          <Link href={`/${article.data.article.author.username}`}>
            <a className="author">{article.data.article.author.username}</a>
          </Link>
          <time dateTime={article.data.article.createdAt} className="date">
            {formatDateString(article.data.article.createdAt)}
          </time>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart" /> {article.data.article.favoritesCount}
        </button>
      </div>
      <Link href={`/article/${article.data.article.slug}`}>
        <a className="preview-link">
          <h1>{article.data.article.title}</h1>
          <p>{article.data.article.description}</p>
          <span>Read more...</span>
        </a>
      </Link>
    </div>
  );
}
