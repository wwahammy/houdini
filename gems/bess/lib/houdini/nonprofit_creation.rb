class Houdini::NonprofitCreation
	def initialize(result, options = nil)
		result = sanitize_optional_fields(result)
		@nonprofit = ::Nonprofit.new(result[:nonprofit].merge({ register_np_only: true }))
		@user = User.new(result[:user])
		@options = options
	end

	def call
		@user.skip_confirmation! unless @options&.dig(:confirm_admin)
		roles = [Role.new(host: @nonprofit, name: 'nonprofit_admin', user: @user)]
		roles << Role.new(host: @nonprofit, name: 'super_admin', user: @user) if @options&.dig(:super_admin)

		result = {}
		ActiveRecord::Base.transaction do
			if @user.save && @nonprofit.save && roles.each(&:save)
				result = { success: true, messages: ["Nonprofit #{@nonprofit.id} successfully created."] }
			else
				result = { success: false, messages: [] }
				@user.errors.full_messages.each { |i| result[:messages] << "Error creating user: #{i}" }
				@nonprofit.errors.full_messages.each { |i| result[:messages]  << "Error creating nonprofit: #{i}" }
				roles.each { |role| role.errors.full_messages.each { |i| result[:messages] << "Error creating role: #{i}" } }
			end
		end
		result
	end

	private def sanitize_optional_fields(result)
		result.transform_values! { |keys| keys.transform_values! { |value| value&.empty? ? nil : value } }
	end
end
