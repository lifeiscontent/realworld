# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'CommentFormCreateCommentMutation', type: :graphql do
  context 'no data' do
    it { is_expected.to eql(result) }
  end
end
