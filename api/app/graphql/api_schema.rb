# frozen_string_literal: true

class ApiSchema < GraphQL::Schema
  mutation Types::MutationType
  query Types::QueryType

  # The RealWorld API answers 422 with { errors: { field: [messages] } }.
  rescue_from ActiveRecord::RecordInvalid do |error|
    Errors.unprocessable!(error.record)
  end

  rescue_from ActiveModel::ValidationError do |error|
    Errors.unprocessable!(error.model)
  end

  # The RealWorld API answers 403 when the user may not change the record.
  rescue_from ActionPolicy::Unauthorized do |error|
    raise GraphQL::ExecutionError.new(error.result.message, extensions: { code: 'FORBIDDEN' })
  end
end
