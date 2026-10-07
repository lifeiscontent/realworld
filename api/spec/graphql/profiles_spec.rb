# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Profiles', type: :graphql do
  let(:jake) { create(:user, username: 'jake', bio: 'I work at statefarm') }
  let(:viewer) { create(:user) }

  describe 'profile (GET /api/profiles/:username)' do
    let(:document) { 'query($username: String!) { profile(username: $username) { username bio image following } }' }

    it 'returns the profile' do
      expect(execute(document, variables: { username: jake.username })).to eq(
        data: { profile: { username: 'jake', bio: 'I work at statefarm', image: nil, following: false } }
      )
    end

    it 'shows when the current user follows the user' do
      create(:relationship, follower: viewer, followed: jake)

      result = execute(document, variables: { username: 'jake' }, user: viewer)

      expect(result.dig(:data, :profile, :following)).to be(true)
    end

    it 'returns null for an unknown user' do
      expect(execute(document, variables: { username: 'nobody' })).to eq(data: { profile: nil })
    end
  end

  describe 'followUser (POST /api/profiles/:username/follow)' do
    let(:document) { 'mutation($username: String!) { followUser(username: $username) { username following } }' }

    it 'requires a user' do
      expect(error_codes(execute(document, variables: { username: jake.username }))).to eq(['UNAUTHENTICATED'])
    end

    it 'follows the user, and following again has no effect' do
      2.times do
        result = execute(document, variables: { username: jake.username }, user: viewer)
        expect(result.dig(:data, :followUser)).to eq(username: 'jake', following: true)
      end
      expect(jake.followers.count).to eq(1)
    end

    it 'returns 403 for the same user' do
      expect(error_codes(execute(document, variables: { username: viewer.username },
                                           user: viewer))).to eq(['FORBIDDEN'])
    end

    it 'returns 404 for an unknown user' do
      expect(error_codes(execute(document, variables: { username: 'nobody' }, user: viewer))).to eq(['NOT_FOUND'])
    end
  end

  describe 'unfollowUser (DELETE /api/profiles/:username/follow)' do
    let(:document) { 'mutation($username: String!) { unfollowUser(username: $username) { username following } }' }

    it 'unfollows the user' do
      create(:relationship, follower: viewer, followed: jake)

      result = execute(document, variables: { username: jake.username }, user: viewer)

      expect(result.dig(:data, :unfollowUser)).to eq(username: 'jake', following: false)
      expect(jake.followers.count).to eq(0)
    end
  end
end
