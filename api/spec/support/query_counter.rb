# frozen_string_literal: true

module QueryCounter
  IGNORED = %w[SCHEMA TRANSACTION].freeze

  # Returns the number of SQL queries that the block sends.
  def count_queries(&)
    count = 0
    counter = lambda do |*, payload|
      count += 1 unless payload[:cached] || IGNORED.include?(payload[:name])
    end
    ActiveSupport::Notifications.subscribed(counter, 'sql.active_record', &)
    count
  end
end

RSpec.configure do |config|
  config.include QueryCounter
end
