module Houdini
	module Nonprofit
		class CreateCommand < Rails::Command::Base
		
			desc "Create a new nonprofit on your Houdini instance"
			option :super_user, aliases: '-su', desc: "Make the nonprofit admin a super user (they can access any nonprofit's dashboards)"
			option :dont_confirm_admin, default: false, type: :boolean, desc: "Require the nonprofit admin to be confirmed via email"
			def perform
				
				result = {
					nonprofit: {
						name: ask("What is the nonprofit's name?"),
						state_code: ask("What is the nonprofit's state?"),
						city: ask("What is the nonprofit's city?"),
					}, 
					user: {
						name: ask("What is your nonprofit's admin's name?"),
						email: ask("What is your nonprofit's admin's email address (it'll be used for logging in)?"),
						password: ask("What is the nonprofit's admin's password?", echo: false)
					}
				}
				say
				require_application_and_environment!
				nonprofit = ::Nonprofit.new(result[:nonprofit].merge({register_np_only: true}))
				user = nonprofit.admins.build(result[:user])
				unless nonprofit.save
					nonprofit.errors.full_messages.each do |i|
						say i
					end
					byebug
				else
					say("Nonprofit #{nonprofit.id} successfully created.")
				end

			end
		end
	end
end