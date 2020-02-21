import React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { format } from "../../utils/date";
import Markdown from "react-markdown";
import { Comment } from "../../containers";

const ArticlePageQuery = gql`
  query ArticlePageQuery($slug: String!) {
    article: articleBySlug(slug: $slug) {
      slug
      id
      title
      favoritesCount
      createdAt
      body
      author {
        id
        imageUrl
        username
        followersCount
      }
      commentsConnection {
        edges {
          node {
            ...CommentCommentFragment
          }
        }
      }
    }
  }
  ${Comment.fragments.comment}
`;

export default function ArticlePage(props) {
  const router = useRouter();
  const article = useQuery(ArticlePageQuery, {
    variables: {
      slug: router.query.slug
    },
    skip: typeof router.query.slug === "undefined"
  });

  if (article.loading || article.data === undefined)
    return <div className="article-page">Loading...</div>;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.data.article.title}</h1>
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
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round" />
              &nbsp; Follow {article.data.article.author.username}{" "}
              <span className="counter">(10)</span>
            </button>
            &nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart" />
              &nbsp; Favorite Post{" "}
              <span className="counter">
                ({article.data.article.favoritesCount})
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <Markdown source={article.data.article.body} />
          </div>
        </div>
        <hr />
        <div className="article-actions">
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
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round" />
              &nbsp; Follow {article.data.article.author.username}{" "}
              <span className="counter">
                ({article.data.article.author.followersCount})
              </span>
            </button>
            &nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart" />
              &nbsp; Favorite Post{" "}
              <span className="counter">
                ({article.data.article.favoritesCount})
              </span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                  defaultValue={""}
                />
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>
            {article.loading ? (
              <div>Loading...</div>
            ) : (
              article.data.article.commentsConnection.edges.map(edge => (
                <Comment key={edge.node.id} id={edge.node.id} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
