# frozen_string_literal: true

class GraphqlController < ApplicationController
  include ActionPolicy::Controller
  authorize :user, through: :current_user
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  # protect_from_forgery with: :null_session
  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    result = ApiSchema.execute(query, variables:, context:, operation_name:)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development e
  end

  private

  def context
    {
      current_user:
    }
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      ensure_hash(ambiguous_param.present? ? JSON.parse(ambiguous_param) : {})
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def handle_error_in_development(error)
    logger.error error.message
    logger.error error.backtrace.join("\n")

    render json: {
      error: {
        message: error.message,
        backtrace: error.backtrace
      },
      data: {}
    }, status: 500
  end

  def current_user
    _bearer, token = request.headers[:authorization].split
    User.from_jwt(token)
  rescue StandardError
    nil
  end
end
