package computerdatabase

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._

class BasicSimulation extends Simulation {

  var maxClients = 25
  var bodyStr = "{\"operationName\":\"IndexPageQuery\",\"variables\":{\"first\":10},\"query\":\"query IndexPageQuery($after: String, $before: String, $first: Int, $last: Int, $tagName: String) {\\n  viewer {\\n    ...LayoutViewerFragment\\n    ...ViewerFeedToggleViewerFragment\\n    __typename\\n  }\\n  articlesConnection(\\n    after: $after\\n    before: $before\\n    first: $first\\n    last: $last\\n    tagName: $tagName\\n  ) {\\n    pageInfo {\\n      ...PaginationPageInfoFragment\\n      __typename\\n    }\\n    edges {\\n      node {\\n        ...IndexPageArticleFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  ...SidebarQueryFragment\\n}\\n\\nfragment IndexPageArticleFragment on Article {\\n  author {\\n    ...ArticlePreviewAuthorFragment\\n    __typename\\n  }\\n  ...ArticlePreviewArticleFragment\\n  __typename\\n}\\n\\nfragment ArticlePreviewArticleFragment on Article {\\n  title\\n  description\\n  ...ArticleInfoArticleFragment\\n  ...ArticlePreviewFavoriteButtonArticleFragment\\n  ...ArticlePreviewTagsListArticleFragment\\n  __typename\\n}\\n\\nfragment ArticleInfoArticleFragment on Article {\\n  author {\\n    username\\n    __typename\\n  }\\n  createdAt\\n  __typename\\n}\\n\\nfragment ArticlePreviewFavoriteButtonArticleFragment on Article {\\n  canFavorite {\\n    value\\n    __typename\\n  }\\n  canUnfavorite {\\n    value\\n    __typename\\n  }\\n  favoritesCount\\n  slug\\n  viewerDidFavorite\\n  __typename\\n}\\n\\nfragment ArticlePreviewTagsListArticleFragment on Article {\\n  tags {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ArticlePreviewAuthorFragment on User {\\n  ...UserAvatarLinkUserFragment\\n  __typename\\n}\\n\\nfragment UserAvatarLinkUserFragment on User {\\n  username\\n  ...UserAvatarUserFragment\\n  __typename\\n}\\n\\nfragment UserAvatarUserFragment on User {\\n  username\\n  profile {\\n    imageUrl\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment LayoutViewerFragment on User {\\n  username\\n  __typename\\n}\\n\\nfragment PaginationPageInfoFragment on PageInfo {\\n  endCursor\\n  hasNextPage\\n  hasPreviousPage\\n  startCursor\\n  __typename\\n}\\n\\nfragment SidebarQueryFragment on Query {\\n  popularTags {\\n    ...SidebarTagListTagFragment\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment SidebarTagListTagFragment on Tag {\\n  id\\n  name\\n  __typename\\n}\\n\\nfragment ViewerFeedToggleViewerFragment on User {\\n  username\\n  __typename\\n}\"}"

  val httpProtocol = http
    .baseUrl("http://ruby:3500")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0")
    .header("content-type", "application/json")
    .maxConnectionsPerHost(maxClients)
    .shareConnections

  val scn = scenario("BasicSimulation")
    .exec(
      http("request_index")
        .post("/graphql")
        .body(StringBody(bodyStr))
        .check(bodyString.saveAs("responseBody"))
      )
      .exec { session =>
        // println(session("responseBody").as[String])
        session
      }

  setUp(
    scn.inject(
        constantConcurrentUsers(maxClients) during(300 seconds)
    )
  ).protocols(httpProtocol)
}

