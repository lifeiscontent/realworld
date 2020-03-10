# frozen_string_literal: true

RSpec.configure do |rspec|
  # This config option will be enabled by default on RSpec 4,
  # but for reasons of backwards compatibility, you have to
  # set it on RSpec 3.
  #
  # It causes the host group and examples to inherit metadata
  # from the shared context.
  rspec.shared_context_metadata_behavior = :apply_to_host_groups
end

RSpec.shared_context 'GraphQL', shared_context: :metadata do
  let(:current_user) { nil }
  let(:operation_name) { nil }
  let(:variables) { nil }
  let(:context) { { current_user: current_user } }
  let(:query) { nil }
  let(:result) { {} }

  subject { ApiSchema.execute(query, variables: variables, context: context, operation_name: operation_name).to_h }
end

RSpec.configure do |config|
  config.include_context 'GraphQL', type: :graphql
end
