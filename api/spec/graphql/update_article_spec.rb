# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'UpdateArticle', type: :graphql do
  let(:query) do
    <<-GRAPHQL
    mutation UpdateArticleMutation($slug: ID!, $input: UpdateArticleInput!) {
      updateArticle(slug: $slug, input: $input) {
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
  let(:author) { create(:author) }
  let(:tags) { create_list(:tag, 3) }
  let(:article) { create(:article, author: author) }
  let(:variables) do
    {
      slug: article.slug,
      input: {
        title: article.title,
        description: article.description,
        body: article.body,
        tagIds: tags.map(&:id)
      }
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        'data' => {
          'updateArticle' => nil
        },
        'errors' => [
          {
            'extensions' => {
              'code' => 'UNAUTHORIZED',
              'details' => {},
              'fullMessages' => []
            },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action',
            'path' => ['updateArticle']
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
        'data' => {
          'updateArticle' => nil
        },
        'errors' => [
          {
            'extensions' => {
              'code' => 'UNAUTHORIZED',
              'details' => {},
              'fullMessages' => []
            },
            'locations' => [
              { 'column' => 7, 'line' => 2 }
            ],
            'message' => 'You are not authorized to perform this action',
            'path' => ['updateArticle']
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
        'data' => {
          'updateArticle' => {
            'article' => {
              'body' => 'There are five steps involved.',
              'description' => 'There are five steps involved.',
              'tags' => [
                { 'id' => '1', 'name' => 'tag1' },
                { 'id' => '2', 'name' => 'tag2' },
                { 'id' => '3', 'name' => 'tag3' }
              ],
              'title' => 'Title 1'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
