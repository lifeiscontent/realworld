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
  let(:file_name) { self.class.top_level_description.underscore.parameterize(separator: '_') }
  let(:result_file_name) { [self.class.top_level_description, self.class.description].join('_').underscore.parameterize(separator: '_') }
  let(:query_string) { file_fixture("graphql/#{file_name}.graphql").read }
  let(:variables) { {} }
  let(:context) { {} }
  let(:result) do
    if File.exist?("spec/fixtures/files/graphql/#{result_file_name}.json")
      JSON.parse(file_fixture("graphql/#{result_file_name}.json").read)
    else
      File.open("spec/fixtures/files/graphql/#{result_file_name}.json", 'w') { |file| file.write(JSON.pretty_unparse(subject)) }

      subject
    end
  end

  subject { ApiSchema.execute(query_string, variables: variables, context: context).to_h }
end

RSpec.configure do |config|
  config.include_context 'GraphQL', type: :graphql
end
