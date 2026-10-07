# frozen_string_literal: true

# The unique index on article_id and user_id prevents duplicates. Callers use
# create_or_find_by!, so a second favorite returns the first one.
class Favorite < ApplicationRecord
  belongs_to :article, counter_cache: true, validate: true
  belongs_to :user, validate: true
end
