# frozen_string_literal: true

# The unique index on followed_id and follower_id prevents duplicates. Callers
# use create_or_find_by!, so a second follow returns the first one.
class Relationship < ApplicationRecord
  belongs_to :followed, class_name: 'User', validate: true
  belongs_to :follower, class_name: 'User', validate: true
end
