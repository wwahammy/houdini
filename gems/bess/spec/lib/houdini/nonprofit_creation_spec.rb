
RSpec.describe Houdini::NonprofitCreation do
	let(:user_email) { 'username@email.com' }
	let(:user_name) { 'User Name' }
	let(:nonprofit_name) { 'My Nonprofit' }
	let(:nonprofit_state_code) { 'DF' }
	let(:nonprofit_city) { 'DF' }
	let(:nonprofit_website) { 'https://www.mynonprofit.org' }
	let(:nonprofit_email) { 'mynonprofit@email.com' }
	let(:nonprofit_phone) { '5561999999999' }
	let(:result) {
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
	}
	let(:options) { { confirm_admin: true } }
	subject { described_class.new(result, options).call }

	it 'creates a nonprofit' do
		expect{ subject }.to change{ Nonprofit.where(name: nonprofit_name).count }.from(0).to(1)
	end

	it 'nonprofit has described fields' do
		subject
		nonprofit = Nonprofit.find_by(name: nonprofit_name)
		expect(nonprofit.state_code).to eq(nonprofit_state_code)
		expect(nonprofit.city).to eq(nonprofit_city)
		expect(nonprofit.website).to eq(nonprofit_website)
		expect(nonprofit.email).to eq(nonprofit_email)
		expect(nonprofit.phone).to eq(nonprofit_phone)
	end
	
	it 'creates a user' do
		expect{ subject }.to change{ User.where(email: user_email).count }.from(0).to(1)
	end

	it 'user has described fields' do
		subject
		user = User.find_by(email: user_email)
		expect(user.name).to eq(user_name)
		expect(user.super_admin?).to be_falsey
		expect(user.confirmed?).to be_falsey
	end

	it 'returns successful hash' do
		creation_result = subject
		nonprofit_id = Nonprofit.find_by(name: nonprofit_name).id.to_s
		expect(creation_result).to eq({ success: true, messages: ["Nonprofit #{nonprofit_id} successfully created."] })
	end

	describe 'super_admin option' do
		let(:options) { { super_admin: true } }

		it 'creates a user with super_admin role' do
			subject
			expect(User.find_by(email: user_email).super_admin?).to be_truthy
		end
	end

	describe 'skip admin confirmation' do
		let(:options) { { confirm_admin: false } }

		it 'creates a confirmed user' do
			subject
			expect(User.where(email: user_email).last.confirmed?).to be_truthy
		end
	end

	describe 'nonprofit can not be saved' do
	let(:result) {
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
					email: nil,
					password: 'P@ssw0rd!'
				}
			}
		}

		it 'returns failed hash with error messages' do
			creation_result = subject
			expected_error_messages = ["Error creating user: Email can't be blank", "Error creating user: Email is invalid"]
			expect(creation_result).to eq({ success: false, messages: expected_error_messages })
		end
	end
end
