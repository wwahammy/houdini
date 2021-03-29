# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
module Model::Attributes
	extend ActiveSupport::Concern
	class_methods do
		def coerce_uri(attribute, scheme:'http')
			class_eval <<-RUBY, __FILE__, __LINE__ + 1
				def #{attribute}=(value)
					begin
						uri = URI.parse value
						scheme = "#{scheme&.to_s || "" }"
						value = ((scheme.ends_with?('://') ? scheme : scheme + "://") + value) unless uri.scheme
						attribute = :#{attribute.to_s}
						#byebug
						return write_attribute(:#{attribute.to_s}, value)  
					rescue URI::InvalidURIError
						# do nothing, it'll be handled by the validator
					end
					write_attribute(attribute, value)
				end		
			RUBY
		end
	end
end