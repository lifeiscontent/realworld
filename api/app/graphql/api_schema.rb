# frozen_string_literal: true

class ApiSchema < GraphQL::Schema
  mutation Types::MutationType
  query Types::QueryType

  rescue_from ActiveRecord::RecordInvalid do |error|
    raise GraphQL::ExecutionError.new(
      error.message,
      extensions: {
        code: 'GRAPHQL_VALIDATION_FAILED',
        errors: error.record.errors.full_messages
      }
    )
  end

  rescue_from ActiveModel::ValidationError do |error|
    raise GraphQL::ExecutionError.new(
      error.message,
      extensions: {
        code: 'GRAPHQL_VALIDATION_FAILED',
        errors: error.model.errors.full_messages
      }
    )
  end

  rescue_from ActionPolicy::Unauthorized do |error|
    raise GraphQL::ExecutionError.new(
      # use result.message (backed by i18n) as an error message
      error.result.message,
      # use GraphQL error extensions to provide more context
      extensions: {
        code: 'UNAUTHORIZED',
        fullMessages: error.result.reasons.full_messages,
        details: error.result.reasons.details
      }
    )
  end
end
