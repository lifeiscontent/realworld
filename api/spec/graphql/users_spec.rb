# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :graphql do
  let(:user_fields) { 'email token username bio image' }

  describe 'login (POST /api/users/login)' do
    let(:document) { "mutation($user: LoginUser!) { login(user: $user) { #{user_fields} } }" }
    let!(:account) { create(:user, email: 'jake@example.com', password: 'jakejake') }

    it 'returns the user with a token' do
      result = execute(document, variables: { user: { email: 'jake@example.com', password: 'jakejake' } })
      user = result.dig(:data, :login)

      expect(user).to include(email: 'jake@example.com', username: account.username, bio: nil, image: nil)
      expect(User.from_jwt(user[:token])).to eq(account)
    end

    it 'returns 422 for a wrong password' do
      result = execute(document, variables: { user: { email: 'jake@example.com', password: 'wrong' } })

      expect(error_codes(result)).to eq(['UNPROCESSABLE_ENTITY'])
      expect(result[:errors].first.dig(:extensions, :errors)).to eq(base: ['email or password is invalid'])
    end

    it 'returns 422 for an unknown email' do
      result = execute(document, variables: { user: { email: 'nobody@example.com', password: 'jakejake' } })

      expect(error_codes(result)).to eq(['UNPROCESSABLE_ENTITY'])
    end
  end

  describe 'register (POST /api/users)' do
    let(:document) { "mutation($user: NewUser!) { register(user: $user) { #{user_fields} } }" }

    it 'creates the user with a profile and returns a token' do
      result = execute(document,
                       variables: { user: { username: 'jake', email: 'jake@example.com', password: 'jakejake' } })
      user = result.dig(:data, :register)

      expect(user).to include(username: 'jake', email: 'jake@example.com', bio: nil, image: nil)
      expect(User.find_by(username: 'jake').profile).to be_present
      expect(User.from_jwt(user[:token]).username).to eq('jake')
    end

    it 'returns 422 with the errors of each field' do
      create(:user, username: 'jake', email: 'jake@example.com')

      result = execute(document,
                       variables: { user: { username: 'jake', email: 'jake@example.com', password: 'jakejake' } })

      expect(error_codes(result)).to eq(['UNPROCESSABLE_ENTITY'])
      expect(result[:errors].first.dig(:extensions, :errors)).to include(
        email: ['has already been taken'], username: ['has already been taken']
      )
    end
  end

  describe 'user (GET /api/user)' do
    let(:document) { "{ user { #{user_fields} } }" }

    it 'returns null for a guest' do
      expect(execute(document)).to eq(data: { user: nil })
    end

    it 'returns the current user' do
      account = create(:user)
      account.create_profile!(bio: 'I like to skateboard', image_url: 'https://example.com/jake.jpg')

      user = execute(document, user: account).dig(:data, :user)

      expect(user).to include(username: account.username, bio: 'I like to skateboard', image: 'https://example.com/jake.jpg')
    end
  end

  describe 'updateUser (PUT /api/user)' do
    let(:document) { "mutation($user: UpdateUser!) { updateUser(user: $user) { #{user_fields} } }" }
    let(:account) { create(:user, password: 'jakejake').tap(&:create_profile!) }

    it 'requires a user' do
      expect(error_codes(execute(document, variables: { user: { bio: 'Hi' } }))).to eq(['UNAUTHENTICATED'])
    end

    it 'changes only the given fields' do
      changes = { bio: 'I like to skateboard', image: 'https://example.com/jake.jpg' }
      user = execute(document, variables: { user: changes }, user: account).dig(:data, :updateUser)

      expect(user).to include(username: account.username, email: account.email, bio: 'I like to skateboard',
                              image: 'https://example.com/jake.jpg')
      expect(account.reload.valid_password?('jakejake')).to be(true)
    end

    it 'removes the bio and image when they are empty' do
      account.profile.update!(bio: 'Old bio', image_url: 'https://example.com/old.jpg')

      user = execute(document, variables: { user: { bio: '', image: '' } }, user: account).dig(:data, :updateUser)

      expect(user).to include(bio: nil, image: nil)
    end

    it 'changes the username, email, and password' do
      execute(document, variables: { user: { username: 'jacob', email: 'jacob@example.com', password: 'newpassword' } },
                        user: account)

      expect(account.reload).to have_attributes(username: 'jacob', email: 'jacob@example.com')
      expect(account.valid_password?('newpassword')).to be(true)
    end

    it 'returns 422 for a taken username' do
      create(:user, username: 'taken')

      result = execute(document, variables: { user: { username: 'taken' } }, user: account)

      expect(result[:errors].first.dig(:extensions, :errors)).to eq(username: ['has already been taken'])
    end
  end
end
