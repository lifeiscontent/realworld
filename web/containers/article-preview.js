import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";
import { format } from "../utils/date";
import { ArticlePreviewTag } from "./article-preview-tag";

export function ArticlePreview(props) {
  const article = useQuery(ArticlePreviewQuery, {
    variables: { slug: props.slug }
  });

  return article.loading ? (
    <div className="article-preview">Loading...</div>
  ) : (
    <div className="article-preview">
      <div className="article-meta">
        <Link
          href="/[username]"
          as={`/${article.data.article.author.username}`}
          shallow
        >
          <a>
            <img
              src={
                article.data.article.author.imageUrl ??
                "/images/smiley-cyrus.jpg"
              }
            />
          </a>
        </Link>
        <div className="info">
          <Link
            href="/[username]"
            as={`/${article.data.article.author.username}`}
            shallow
          >
            <a className="author">{article.data.article.author.username}</a>
          </Link>
          <time dateTime={article.data.article.createdAt} className="date">
            {format(new Date(article.data.article.createdAt), "MMMM Qo")}
          </time>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart" /> {article.data.article.favoritesCount}
        </button>
      </div>
      <Link
        href="/article/[slug]"
        as={`/article/${article.data.article.slug}`}
        shallow
      >
        <a className="preview-link">
          <h1>{article.data.article.title}</h1>
          <p>{article.data.article.description}</p>
          <span>Read more...</span>
          {article.data.article.tagsConnection.edges.length ? (
            <ul className="tag-list">
              {article.data.article.tagsConnection.edges.map(edge => (
                <ArticlePreviewTag key={edge.node.id} id={edge.node.id} />
              ))}
            </ul>
          ) : null}
        </a>
      </Link>
    </div>
  );
}

ArticlePreview.fragments = {
  article: gql`
    fragment ArticlePreviewArticleFragment on Article {
      id
      createdAt
      description
      favoritesCount
      slug
      title
      tagsConnection {
        edges {
          node {
            ...ArticlePreviewTagTagFragment
          }
        }
      }
      author {
        id
        imageUrl
        username
      }
    }
    ${ArticlePreviewTag.fragments.tag}
  `
};

const ArticlePreviewQuery = gql`
  query ArticlePreviewQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      ...ArticlePreviewArticleFragment
    }
  }
  ${ArticlePreview.fragments.article}
`;
