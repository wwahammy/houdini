# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
require 'rails_helper'

RSpec.describe Model::Attributes do 

	let(:uri_with_no_scheme) { 'www.penelope-is-furry.org'}
	let(:uri_with_http) { 'http://www.penelope-is-furry.org'}
	let(:uri_with_https) { 'https://www.penelope-is-furry.org'}
	
	class NoCoercedUri < ApplicationRecord
		
		include Model::Attributes
	end

	class CoercedUri < ApplicationRecord
		include Model::Attributes

		coerce_uri :website
		coerce_uri :website_with_scheme_only, scheme: 'https'
		coerce_uri :website_with_scheme_plus_colon_and_slashes, scheme: 'https://'
	end

	switch_to_SQLite do
    create_table :no_coerced_uris do |t|
      t.string :website
    end
		
		create_table :coerced_uris do |t|
      t.string :website
			t.string :website_with_scheme_only
			t.string :website_with_scheme_plus_colon_and_slashes
    end
  end

	describe '.coerce_uri' do
		it 'has no effect if coerce_uri is not called' do
			expect(NoCoercedUri.new(website: uri_with_no_scheme).website).to eq uri_with_no_scheme
		end

		it 'adds http by default when no schema added' do
			expect(CoercedUri.new(website: uri_with_no_scheme).website).to eq uri_with_http
		end

		it 'doesnt adjust schemes if one is provided' do 
			expect(CoercedUri.new(website: uri_with_https).website).to eq uri_with_https
		end

		it 'accepts custom coercion scheme' do 
			expect(CoercedUri.new(website_with_scheme_only: uri_with_no_scheme).website_with_scheme_only).to eq uri_with_https
		end

		it 'accepts custom coercion scheme if you include colons and slashes' do 
			expect(CoercedUri.new(website_with_scheme_plus_colon_and_slashes: 
				uri_with_no_scheme).website_with_scheme_plus_colon_and_slashes).to eq uri_with_https
		end
	end
end