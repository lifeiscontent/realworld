# frozen_string_literal: true

# GraphQL errors for the HTTP status codes of the RealWorld API. The code is in
# extensions.code, so a client can handle each case.
module Errors
  def self.unauthenticated!
    raise GraphQL::ExecutionError.new('You must sign in to do this.', extensions: { code: 'UNAUTHENTICATED' })
  end

  def self.not_found!(message)
    raise GraphQL::ExecutionError.new(message, extensions: { code: 'NOT_FOUND' })
  end

  # Validation errors in the shape of the RealWorld API: { field: [messages] }.
  def self.unprocessable!(record)
    errors = record.errors.to_hash.transform_keys { |key| key.to_s.camelize(:lower) }
    raise GraphQL::ExecutionError.new(
      record.errors.full_messages.to_sentence,
      extensions: { code: 'UNPROCESSABLE_ENTITY', errors: }
    )
  end
end
