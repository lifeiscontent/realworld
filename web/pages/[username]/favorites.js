import React from "react";
import Link from "next/link";

export default function ProfilePage(props) {
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src="http://i.imgur.com/Qr71crq.jpg" className="user-img" />
              <h4>Eric Simons</h4>
              <p>
                Cofounder @GoThinkster, lived in Aol's HQ for a few months,
                kinda looks like Peeta from the Hunger Games
              </p>
              <button className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-plus-round" />
                &nbsp; Follow Eric Simons
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link href="/eric-simons">
                    <a className="nav-link">My Articles</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/eric-simons/favorites">
                    <a className="nav-link active">Favorited Articles</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="article-preview">
              <div className="article-meta">
                <Link href="/eric-simons">
                  <a>
                    <img src="http://i.imgur.com/Qr71crq.jpg" />
                  </a>
                </Link>
                <div className="info">
                  <Link href="/eric-simons">
                    <a className="author">Eric Simons</a>
                  </Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart" /> 29
                </button>
              </div>
              <Link href="/article/how-to-build-webapps-that-scale">
                <a className="preview-link">
                  <h1>How to build webapps that scale</h1>
                  <p>This is the description for the post.</p>
                  <span>Read more...</span>
                </a>
              </Link>
            </div>
            <div className="article-preview">
              <div className="article-meta">
                <Link href="/albert-pai">
                  <a>
                    <img src="http://i.imgur.com/N4VcUeJ.jpg" />
                  </a>
                </Link>
                <div className="info">
                  <Link href="/albert-pai">
                    <a className="author">Albert Pai</a>
                  </Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart" /> 32
                </button>
              </div>
              <Link href="/article/the-song-you-wont-ever-stop-singing">
                <a className="preview-link">
                  <h1>
                    The song you won't ever stop singing. No matter how hard you
                    try.
                  </h1>
                  <p>This is the description for the post.</p>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    <li className="tag-default tag-pill tag-outline">Music</li>
                    <li className="tag-default tag-pill tag-outline">Song</li>
                  </ul>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
