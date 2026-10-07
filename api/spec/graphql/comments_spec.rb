# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Comments', type: :graphql do
  let(:jake) { create(:user, username: 'jake') }
  let(:viewer) { create(:user) }
  let(:article) { create(:article, author: jake) }

  describe 'comments (GET /api/articles/:slug/comments)' do
    let(:document) { 'query($slug: String!) { comments(slug: $slug) { id body author { username } } }' }

    it 'returns the newest comments first' do
      old = create(:comment, article:, author: viewer, body: 'First', created_at: 1.day.ago)
      new = create(:comment, article:, author: jake, body: 'Second')

      expect(execute(document, variables: { slug: article.slug }).dig(:data, :comments)).to eq(
        [{ id: new.id.to_s, body: 'Second', author: { username: 'jake' } },
         { id: old.id.to_s, body: 'First', author: { username: viewer.username } }]
      )
    end

    it 'returns null for an unknown article' do
      expect(execute(document, variables: { slug: 'nothing' })).to eq(data: { comments: nil })
    end
  end

  describe 'addComment (POST /api/articles/:slug/comments)' do
    let(:document) do
      <<~GRAPHQL
        mutation($slug: String!, $comment: NewComment!) {
          addComment(slug: $slug, comment: $comment) { body author { username } }
        }
      GRAPHQL
    end

    it 'requires a user' do
      expect(error_codes(execute(document, variables: { slug: article.slug, comment: { body: 'Hi' } })))
        .to eq(['UNAUTHENTICATED'])
    end

    it 'adds the comment' do
      result = execute(document, variables: { slug: article.slug, comment: { body: 'His name was my name too.' } },
                                 user: viewer)

      expect(result.dig(:data,
                        :addComment)).to eq(body: 'His name was my name too.', author: { username: viewer.username })
    end

    it 'returns 422 for an empty body' do
      result = execute(document, variables: { slug: article.slug, comment: { body: '' } }, user: viewer)

      expect(result[:errors].first.dig(:extensions, :errors)).to eq(body: ["can't be blank"])
    end
  end

  describe 'deleteComment (DELETE /api/articles/:slug/comments/:id)' do
    let(:document) { 'mutation($slug: String!, $id: ID!) { deleteComment(slug: $slug, id: $id) }' }
    let(:comment) { create(:comment, article:, author: viewer) }

    it 'deletes the comment of its author' do
      expect(execute(document, variables: { slug: article.slug, id: comment.id }, user: viewer))
        .to eq(data: { deleteComment: true })
    end

    it 'returns 403 for another user' do
      expect(error_codes(execute(document, variables: { slug: article.slug, id: comment.id }, user: create(:user))))
        .to eq(['FORBIDDEN'])
    end

    it 'returns 404 for a comment of another article' do
      other = create(:article, author: jake)

      expect(error_codes(execute(document, variables: { slug: other.slug, id: comment.id }, user: viewer)))
        .to eq(['NOT_FOUND'])
    end
  end
end
