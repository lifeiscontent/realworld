# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'signUp', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation SignUpMutation($input: SignUpInput!) {
      signUp(input: $input) {
        user {
          email
          username
        }
      }
    }
    GRAPHQL
  end
  let(:user_attributes) { attributes_for(:user) }
  let(:variables) do
    {
      input: {
        email: user_attributes[:email],
        username: user_attributes[:username],
        password: 'password'
      }
    }
  end

  context 'current_user is nil' do
    let(:result) do
      {
        data: {
          signUp: {
            user: {
              email: user_attributes[:email],
              username: user_attributes[:username]
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
