# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :login, mutation: Mutations::Login
    field :register, mutation: Mutations::Register
    field :update_user, mutation: Mutations::UpdateUser
    field :follow_user, mutation: Mutations::FollowUser
    field :unfollow_user, mutation: Mutations::UnfollowUser
    field :create_article, mutation: Mutations::CreateArticle
    field :update_article, mutation: Mutations::UpdateArticle
    field :delete_article, mutation: Mutations::DeleteArticle
    field :add_comment, mutation: Mutations::AddComment
    field :delete_comment, mutation: Mutations::DeleteComment
    field :favorite_article, mutation: Mutations::FavoriteArticle
    field :unfavorite_article, mutation: Mutations::UnfavoriteArticle
  end
end
