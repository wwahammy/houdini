# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class Houdini::WebhookAdapter
  extend ActiveSupport::Autoload
  include ActiveModel::AttributeAssignment

  autoload :OpenFnAdapter

  attr_accessor :url, :auth_headers
  def initialize(**attributes)
    assign_attributes(**attributes) if attributes
  end

  def post(payload)
    RestClient::Request.execute(
      method: :post,
      url: url,
      payload: payload,
      headers: auth_headers
    )
  end

  ADAPTER = 'Adapter'
  private_constant :ADAPTER

  # based on ActiveJob's configuration
  class << self
    
    def build(name, **options)
      lookup(name).new(**options)
    end

    # TODO I'm not sure this is the best way to do this. We're treating any class
    # which is in the Houdini::WebhookAdapter module with a postfix of `Adapter` as a
    # webhook adapter. This doesn't make downstream usage super flexible. But I suppose it's not the end of the
    # world either way.
    def lookup(name)
      const_get(name.to_s.camelize << ADAPTER)
    end
  end
end
