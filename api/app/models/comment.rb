# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :author, class_name: 'Profile', foreign_key: 'profile_id'
  belongs_to :article
end
