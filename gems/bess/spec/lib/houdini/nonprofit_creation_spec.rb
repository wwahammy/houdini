# frozen_string_literal: true

#
# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
require 'rails_helper'

RSpec.describe Houdini::NonprofitCreation do
	subject { described_class.new(result, options).call }
	let(:user_email) { 'username@email.com' }
	let(:user_name) { 'User Name' }
	let(:nonprofit_name) { 'My Nonprofit' }
	let(:nonprofit_state_code) { 'DF' }
	let(:nonprofit_city) { 'DF' }
	let(:nonprofit_website) { 'https://www.mynonprofit.org' }
	let(:nonprofit_email) { 'mynonprofit@email.com' }
	let(:nonprofit_phone) { '5561999999999' }
	let(:result) do
		{
			nonprofit: {
				name: nonprofit_name,
				state_code: nonprofit_state_code,
				city: nonprofit_city,
				website: nonprofit_website,
				email: nonprofit_email,
				phone: nonprofit_phone
			},
			user: {
				name: user_name,
				email: user_email,
				password: 'P@ssw0rd!'
			}
		}
	end
	let(:options) { { confirm_admin: true } }

	describe 'command side effects' do
		it {is_expected.to include(success: true, messages: ["Nonprofit #{Nonprofit.last.id} successfully created."])}
	end

	describe 'created nonprofit' do 
		subject {super(); Nonprofit.find_by(name: nonprofit_name) }

		it {is_expected.to have_attributes(state_code: nonprofit_state_code, city: nonprofit_city, 
				website: nonprofit_website, email: nonprofit_email, phone: nonprofit_phone)}
	end

	# it 'nonprofit has described fields' do
	# 	subject
		
	# 	expect(nonprofit.state_code).to eq(nonprofit_state_code)
	# 	expect(nonprofit.city).to eq(nonprofit_city)
	# 	expect(nonprofit.website).to eq(nonprofit_website)
	# 	expect(nonprofit.email).to eq(nonprofit_email)
	# 	expect(nonprofit.phone).to eq(nonprofit_phone)
	# end


	describe 'created user' do
	
		subject{ super(); User.find_by(email: user_email) }
		it { is_expected.to_not be_super_admin }
		it {is_expected.to_not be_confirmed }

		it { is_expected.to have_attributes(name: user_name) }
		

		# describe 'skip admin confirmation' do
		# 	let(:options) { { confirm_admin: false } }
		# 	it { is_expected.to be_confirmed }
		# 	it { is_expected.to_not be_super_admin }
		# end
	end

	describe 'super_admin_option' do 
		subject{ super(); User.find_by(email: user_email) }
		let(:options) { { super_admin: true } }
		it { byebug; is_expected.to be_super_admin }
		it { byebug; is_expected.to_not be_confirmed }
	end

	# it 'returns successful hash' do
	# 	creation_result = nonprofit_creation_result
	# 	nonprofit_id = Nonprofit.find_by(name: nonprofit_name).id.to_s
	# 	expect(creation_result).to eq({ success: true, messages: ["Nonprofit #{nonprofit_id} successfully created."] })
	# end

	# describe 'super_admin option' do
	# 	let(:options) { { super_admin: true } }
	# 	subject {}
		
	# 	it 'creates a user with super_admin role' do
	# 		nonprofit_creation_result
			
	# 	end
	# end

	# describe 'skip admin confirmation' do
	# 	let(:options) { { confirm_admin: false } }
	# 	us
	# 	it {is_expected.to }
	# 	it 'creates a confirmed user' do
	# 		nonprofit_creation_result
	# 		expect(User.where(email: user_email).last).to be_confirmed
	# 	end
	# end

	# describe 'nonprofit can not be saved' do
	# 	let(:result) do
	# 		{
	# 			nonprofit: {
	# 				name: nonprofit_name,
	# 				state_code: nonprofit_state_code,
	# 				city: nonprofit_city,
	# 				website: nonprofit_website,
	# 				email: nonprofit_email,
	# 				phone: nonprofit_phone
	# 			},
	# 			user: {
	# 				name: user_name,
	# 				email: nil,
	# 				password: 'P@ssw0rd!'
	# 			}
	# 		}
	# 	end

	# 	it 'returns failed hash with error messages' do
	# 		creation_result = nonprofit_creation_result
	# 		expected_error_messages = ["Error creating user: Email can't be blank", 'Error creating user: Email is invalid']
	# 		expect(creation_result).to eq({ success: false, messages: expected_error_messages })
	# 	end
	# end
end
