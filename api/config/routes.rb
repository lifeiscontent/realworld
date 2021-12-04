# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  post '/graphql', to: 'graphql#execute'
  root to: 'welcome#index', via: :get
end
