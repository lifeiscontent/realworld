# frozen_string_literal: true

class GraphqlController < ApplicationController
  # The RealWorld API uses "Token <jwt>". Many GraphQL clients send "Bearer <jwt>".
  AUTHORIZATION_SCHEMES = %w[Token Bearer].freeze

  rescue_from JSON::ParserError, ActionController::BadRequest do |error|
    render json: { errors: [{ message: error.message }] }, status: :bad_request
  end

  def execute
    result = ApiSchema.execute(
      params[:query],
      variables: variables_hash(params[:variables]),
      context: { current_user: },
      operation_name: params[:operationName]
    )
    render json: result
  end

  private

  # The variables come as a JSON string (form data), a Hash (JSON body), or nothing.
  def variables_hash(variables)
    case variables
    when String then variables.present? ? variables_hash(JSON.parse(variables)) : {}
    when Hash then variables
    when ActionController::Parameters then variables.to_unsafe_h
    when nil then {}
    else raise ActionController::BadRequest, 'variables must be a JSON object'
    end
  end

  # Returns the user of the token in the Authorization header, or nil.
  def current_user
    return @current_user if defined?(@current_user)

    scheme, token = request.authorization.to_s.split(' ', 2)
    @current_user = (User.from_jwt(token) if AUTHORIZATION_SCHEMES.include?(scheme) && token.present?)
  end
end
