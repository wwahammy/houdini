# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
module Model::Eventable
	extend ActiveSupport::Concern

	class_methods do 
	end
	included do 
		def to_event(event_type, *expand)
			Jbuilder.new do |event|
					event.id "objevt_" + SecureRandom.alphanumeric(22)
					event.object 'object_event'
					event.type event_type
					event.data do 
							event.object to_builder(*expand)
					end
			end
		end
	
		def to_builder(*expand)
			raise NotImplementedError.new("to_builder must be implemented in your model")
		end
	end
	
end