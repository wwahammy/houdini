module Houdini
	module Nonprofit
		class CreateCommand < Rails::Command::Base
			desc "Create a new nonprofit on your Houdini instance"
			option :super_user, aliases: '-su', desc: "Make the nonprofit admin a super user (they can access any nonprofit's dashboards)"
			option :dont_confirm_admin, default: false, type: :boolean, desc: "Require the nonprofit admin to be confirmed via email"

			# create with or without user as admin
			# create super_user

			def perform
				result = {
					nonprofit: {
						name: ask("What is the nonprofit's name?"),
						state_code: ask("What is the nonprofit's state?"),
						city: ask("What is the nonprofit's city?")
					}, 
					user: {
						name: ask("What is your nonprofit's admin's name?"),
						email: ask("What is your nonprofit's admin's email address? (It'll be used for logging in)"),
						phone: ask("What is your nonprofit's admin's phone number?"),
						password: ask("What is the nonprofit's admin's password?", echo: false)
					}
				}
				say
				require_application_and_environment!

				nonprofit = ::Nonprofit.new(result[:nonprofit].merge({ register_np_only: true }))
				user = User.new(result[:user])
				role = Role.new(host: nonprofit, name: 'nonprofit_admin', user: user)

				Qx.transaction do
					if user.save && nonprofit.save && role.save
						say("Nonprofit #{nonprofit.id} successfully created.")
					else
						user.errors.full_messages.each { |i| say("Errors creating user: #{i}") }
						nonprofit.errors.full_messages.each { |i| say("Errors creating nonprofit: #{i}") }
						role.errors.full_messages.each { |i| say("Errors creating role: #{i}") }
					end
				end
			end
		end
	end
end