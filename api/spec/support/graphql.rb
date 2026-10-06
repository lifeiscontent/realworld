# frozen_string_literal: true

module GraphQLHelpers
  # Runs a GraphQL document as the user and returns the result with symbol keys.
  def execute(document, variables: {}, user: nil)
    ApiSchema.execute(document, variables:, context: { current_user: user }).to_h.deep_symbolize_keys
  end

  # The extensions.code of each error in a result.
  def error_codes(result)
    (result[:errors] || []).map { |error| error.dig(:extensions, :code) }
  end
end

RSpec.configure do |config|
  config.include GraphQLHelpers, type: :graphql
end
