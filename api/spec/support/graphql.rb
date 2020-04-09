# frozen_string_literal: true

RSpec.shared_context 'GraphQL' do
  let(:current_user) { nil }
  let(:operation_name) { nil }
  let(:variables) { nil }
  let(:context) { { current_user: current_user } }
  let(:query) { nil }
  let(:mutation) { nil }
  let(:result) { {} }

  subject do
    ApiSchema.execute(query || mutation,
                      variables: variables,
                      context: context,
                      operation_name: operation_name).to_h.deep_symbolize_keys
  end
end

RSpec.configure do |config|
  config.include_context 'GraphQL', type: :graphql
end
