# frozen_string_literal: true

class Tagging < ApplicationRecord
  belongs_to :article
  belongs_to :tag, counter_cache: true
end
