# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :authenticate, mutation: Mutations::Authenticate
  end
end
