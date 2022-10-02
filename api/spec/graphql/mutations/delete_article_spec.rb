# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'deleteArticle', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation DeleteArticleMutation($slug: ID!) {
      deleteArticle(slug: $slug) {
        article {
          title
          description
          body
        }
      }
    }
    GRAPHQL
  end
  let(:author) { create(:author) }
  let(:tags) { create_list(:tag, 3) }
  let(:article) { create(:article, author:) }
  let(:variables) do
    {
      slug: article.slug
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          deleteArticle: nil
        },
        errors: [
          {
            extensions: {
              code: 'UNAUTHORIZED',
              details: {},
              fullMessages: []
            },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action',
            path: ['deleteArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is a user' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        data: {
          deleteArticle: nil
        },
        errors: [
          {
            extensions: {
              code: 'UNAUTHORIZED',
              details: {},
              fullMessages: []
            },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action',
            path: ['deleteArticle']
          }
        ]
      }
    end

    it { is_expected.to eql result }
  end

  context 'current_user is author' do
    let(:current_user) { author }
    let(:result) do
      {
        data: {
          deleteArticle: {
            article: {
              body: article.body,
              description: article.description,
              title: article.title
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
