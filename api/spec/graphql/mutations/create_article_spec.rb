# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createArticle', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation CreateArticleMutation($input: CreateArticleInput!) {
      createArticle(input: $input) {
        article {
          title
          description
          body
          tags {
            id
            name
          }
        }
      }
    }
    GRAPHQL
  end
  let(:tags) { create_list(:tag, 3) }
  let(:article_attributes) { attributes_for(:article) }
  let(:variables) do
    {
      input: {
        title: article_attributes[:title],
        description: article_attributes[:description],
        body: article_attributes[:body],
        tagIds: tags.map(&:id)
      }
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          createArticle: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['createArticle']
          }
        ]
      }
    end
    it { is_expected.to eql result }
  end

  context 'current_user is defined' do
    let(:current_user) { create(:user) }

    let(:result) do
      {
        data: {
          createArticle: {
            article: {
              body: article_attributes[:body],
              description: article_attributes[:description],
              tags: tags.map { |tag| { id: tag.id.to_s, name: tag.name } },
              title: article_attributes[:title]
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
