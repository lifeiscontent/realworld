# frozen_string_literal: true

require 'graphql/rake_task'
GraphQL::RakeTask.new(load_schema: lambda do |_task|
  require File.expand_path('../../config/environment', __dir__)
  ApiSchema
end)
