# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'signIn', type: :graphql do
  let(:mutation) do
    <<-GRAPHQL
    mutation SignInMutation($input: SignInInput!) {
      signIn(input: $input) {
        user {
          email
          username
        }
        token
      }
    }
    GRAPHQL
  end

  let(:user) { create(:user) }
  let(:variables) do
    {
      input: {
        email: user.email,
        password: 'password'
      }
    }
  end

  context 'current_user is nil' do
    let(:token) { SecureRandom.uuid }
    before(:each) { allow_any_instance_of(User).to receive(:generate_jwt).and_return(token) }

    let(:result) do
      {
        data: {
          signIn: {
            token:,
            user: {
              email: user.email,
              username: user.username
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end
