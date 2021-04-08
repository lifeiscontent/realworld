# frozen_string_literal: true

class Group::Membership < ApplicationRecord
  belongs_to :user, validate: true
  belongs_to :group, counter_cache: true, validate: true

  validates_uniqueness_of :user_id, scope: :group_id

  def self.table_name_prefix
    'group_'
  end
end
