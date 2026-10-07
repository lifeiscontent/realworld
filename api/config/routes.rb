# frozen_string_literal: true

Rails.application.routes.draw do
  post '/graphql', to: 'graphql#execute'
  get 'up' => 'rails/health#show', as: :rails_health_check
end
