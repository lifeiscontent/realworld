# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'createQuestion', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation CreateQuestionMutation($input: CreateQuestionInput!) {
      createQuestion(input: $input) {
        question {
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
  let(:question_attributes) { attributes_for(:question) }
  let(:variables) do
    {
      input: {
        body: question_attributes[:body],
        tagIds: tags.map(&:id)
      }
    }
  end

  context 'current_user is not defined' do
    let(:result) do
      {
        data: {
          createQuestion: nil
        },
        errors: [
          {
            extensions: { code: 'UNAUTHORIZED', details: {}, fullMessages: [] },
            locations: [
              { column: 7, line: 2 }
            ],
            message: 'You are not authorized to perform this action', path: ['createQuestion']
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
          createQuestion: {
            question: {
              body: question_attributes[:body],
              tags: tags.map { |tag| { id: tag.id.to_s, name: tag.name } }
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
