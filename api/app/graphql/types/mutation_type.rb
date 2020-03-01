# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_article, mutation: Mutations::CreateArticle
    field :create_comment, mutation: Mutations::CreateComment
    field :delete_article, mutation: Mutations::DeleteArticle
    field :delete_comment, mutation: Mutations::DeleteComment
    field :favorite_article, mutation: Mutations::FavoriteArticle
    field :follow_user, mutation: Mutations::FollowUser
    field :sign_in, mutation: Mutations::SignIn
    field :sign_up, mutation: Mutations::SignUp
    field :unfavorite_article, mutation: Mutations::UnfavoriteArticle
    field :unfollow_user, mutation: Mutations::UnfollowUser
    field :update_article, mutation: Mutations::UpdateArticle
    field :update_user, mutation: Mutations::UpdateUser
  end
end
