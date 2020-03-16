# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  post '/graphql', to: 'graphql#execute'
  root to: 'welcome#index'
end
