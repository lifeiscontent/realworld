# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'POST /graphql', type: :request do
  let(:user) { create(:user, username: 'jake') }
  let(:query) { '{ user { username } }' }

  def post_graphql(query:, variables: nil, token: nil, scheme: 'Token')
    headers = token ? { 'Authorization' => "#{scheme} #{token}" } : {}
    post '/graphql', params: { query:, variables: }.compact, headers:, as: :json
  end

  it 'returns the user of a valid token' do
    post_graphql(query:, token: user.generate_jwt)

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body).to eq('data' => { 'user' => { 'username' => 'jake' } })
  end

  it 'accepts the Bearer scheme' do
    post_graphql(query:, token: user.generate_jwt, scheme: 'Bearer')

    expect(response.parsed_body.dig('data', 'user', 'username')).to eq('jake')
  end

  it 'ignores an unknown scheme' do
    post_graphql(query:, token: user.generate_jwt, scheme: 'Basic')

    expect(response.parsed_body).to eq('data' => { 'user' => nil })
  end

  it 'treats an invalid token as a guest' do
    post_graphql(query:, token: 'not-a-token')

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body).to eq('data' => { 'user' => nil })
  end

  it 'treats an expired token as a guest' do
    token = user.generate_jwt

    travel(User::JWT_LIFETIME + 1.minute) { post_graphql(query:, token:) }

    expect(response.parsed_body).to eq('data' => { 'user' => nil })
  end

  it 'treats the token of a deleted user as a guest' do
    token = user.generate_jwt
    user.destroy!

    post_graphql(query:, token:)

    expect(response.parsed_body).to eq('data' => { 'user' => nil })
  end

  it 'accepts the variables as a JSON string' do
    post_graphql(query: 'query($username: String!) { profile(username: $username) { username } }',
                 variables: { username: user.username }.to_json)

    expect(response.parsed_body).to eq('data' => { 'profile' => { 'username' => 'jake' } })
  end

  it 'returns 400 for variables that are not JSON' do
    post_graphql(query:, variables: '{not json')

    expect(response).to have_http_status(:bad_request)
    expect(response.parsed_body['errors']).to be_present
  end

  it 'returns 400 for variables that are not an object' do
    post_graphql(query:, variables: '[1, 2]')

    expect(response).to have_http_status(:bad_request)
  end

  it 'answers the standard introspection query' do
    post_graphql(query: GraphQL::Introspection::INTROSPECTION_QUERY)

    expect(response.parsed_body['errors']).to be_nil
  end

  it 'rejects a query that is too deep' do
    deep = "{ __schema { types { #{'fields { type { ' * 7}name#{' } }' * 7} } } }"

    post_graphql(query: deep)

    expect(response.parsed_body['errors'].first['message']).to include('exceeds max depth')
  end

  it 'rejects a query that is too complex' do
    aliases = Array.new(100) { |index| "a#{index}: articles { articlesCount articles { slug } }" }.join(' ')

    post_graphql(query: "{ #{aliases} }")

    expect(response.parsed_body['errors'].first['message']).to include('exceeds max complexity')
  end
end
