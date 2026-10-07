# frozen_string_literal: true

class ApiSchema < GraphQL::Schema
  mutation Types::MutationType
  query Types::QueryType

  use GraphQL::Dataloader

  # Limit the cost of one request. The standard introspection query has a depth
  # of 13 and a complexity of 181, so it stays below these limits.
  max_depth 15
  max_complexity 300
  validate_max_errors 100

  # The RealWorld API answers 422 with { errors: { field: [messages] } }.
  rescue_from ActiveRecord::RecordInvalid do |error|
    Errors.unprocessable!(error.record)
  end

  # The RealWorld API answers 403 when the user may not change the record.
  rescue_from ActionPolicy::Unauthorized do |error|
    raise GraphQL::ExecutionError.new(error.result.message, extensions: { code: 'FORBIDDEN' })
  end
end
