# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
require 'rails_helper'

RSpec.describe ObjectEventHookConfig, type: :model do
  describe '.webhook' do
    before do
      @nonprofit = create(:nm_justice)
      @open_fn_config = create(:open_fn_config)
    end

    it 'returns an instance of OpenFn webhook' do
      webhook = double
      expect(Houdini::WebhookAdapter::OpenFnAdapter)
        .to receive(:new)
        .with(url: @open_fn_config[:inbox], auth_headers: @open_fn_config[:configuration])
        .and_return(webhook)
      result = @open_fn_config.webhook
      expect(result).to eq(webhook)
    end

    it 'calls all the way through to a RestClient::Request.execute' do 
      payload = {object: 'supporter.updated'}
      expect(RestClient::Request).to receive(:execute).with(method: :post,
        url: @open_fn_config[:inbox],
        payload: payload,
        headers: @open_fn_config[:configuration])
      @open_fn_config.webhook.post(payload)
    end
  end
end
