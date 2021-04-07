# frozen_string_literal: true

module Mutations
  class CreateQuestion < Mutations::BaseMutation
    class CreateQuestionInput < Types::BaseInputObject
      argument :body, String, required: true
      argument :tag_ids, [ID], required: true

      def prepare
        to_h
      end
    end

    argument :input, CreateQuestionInput, required: true

    field :question, Types::QuestionType, null: false

    def resolve(input:)
      authorize! Question, to: :create?

      question = Question.create!(**input, author: context[:current_user])

      { question: question }
    end
  end
end
