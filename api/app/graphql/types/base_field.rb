# frozen_string_literal: true

module Types
  class BaseField < GraphQL::Schema::Field
    argument_class Types::BaseArgument

    # Adds the limit and offset arguments of a field that returns a list type.
    def limit_offset_arguments
      argument :limit, GraphQL::Types::Int,
               required: false,
               default_value: 20,
               validates: { numericality: { greater_than: 0, less_than_or_equal_to: 100 } },
               description: 'The number of items on the page.'
      argument :offset, GraphQL::Types::Int,
               required: false,
               default_value: 0,
               validates: { numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10_000 } },
               description: 'The number of items to skip.'
    end
  end
end
