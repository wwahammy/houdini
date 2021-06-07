# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
require 'rails_helper'

RSpec.describe OfflineTransactionRefund, type: :model do
	let!(:nonprofit) { create(:nm_justice) }
	let!(:supporter) { force_create(:supporter, nonprofit: nonprofit) }

	let(:offline_transaction_refund) do
		build(
			:offline_transaction_refund,
			payment:
				force_create(
					:payment,
					gross_amount: 500,
					net_amount: 400,
					fee_total: 100,
					date: Time.zone.now,
					nonprofit: nonprofit,
					supporter: supporter
				)
		)
	end
	let(:offline_transaction_charge) do
		build(
			:offline_transaction_charge,
			payment:
				force_create(
					:payment,
					gross_amount: 400,
					net_amount: 300,
					fee_total: 100,
					date: Time.zone.now,
					nonprofit: nonprofit,
					supporter: supporter
				)
		)
	end

	let(:offline_transaction) { build(:offline_transaction) }
	let(:transaction) do
		trx = supporter.transactions.build(amount: 500)
		trx.build_subtransaction(
			subtransactable: OfflineTransaction.new(amount: 500),
			subtransaction_payments: [
				build(:subtransaction_payment, paymentable: offline_transaction_refund),
				build(:subtransaction_payment, paymentable: offline_transaction_charge)
			]
		)
		trx.save!
		trx
	end

	let(:attributes) { double }
	let(:event_publisher) { double }

	before do
		allow(Houdini)
			.to receive(:event_publisher)
			.and_return(event_publisher)
		allow(event_publisher)
			.to receive(:announce)
			.with(any_args)
		transaction
	end

	after do
		Timecop.return
	end

	describe 'offline transaction refund' do
		subject { offline_transaction_refund }

		it do
			is_expected
				.to have_attributes(
					nonprofit: an_instance_of(Nonprofit),
					id: match_houid('offtrxrfnd')
				)
		end

		it { is_expected.to be_persisted }
	end

	describe '.to_builder' do
		subject { JSON.parse(offline_transaction_refund.to_builder.target!) }

		it do
			is_expected
				.to match_json(
					{
						object: 'offline_transaction_refund',
						nonprofit: kind_of(Numeric),
						supporter: kind_of(Numeric),
						id: match_houid('offtrxrfnd'),
						type: 'payment',
						fee_total: { cents: 100, currency: 'usd' },
						net_amount: { cents: 400, currency: 'usd' },
						gross_amount: { cents: 500, currency: 'usd' },
						created: kind_of(Numeric),
						subtransaction: {
							id: match_houid('offlinetrx'),
							object: 'offline_transaction',
							type: 'subtransaction'
						},
						transaction: match_houid('trx')
					}
				)
		end
	end

	describe '.publish_created' do
		let(:payment_created_event) { double }
		let(:offline_transaction_refund_created_event) { double }

		before do
			allow(offline_transaction_refund)
				.to receive(:to_event)
				.with('offline_transaction_refund.created', :nonprofit, :trx, :supporter, :subtransaction)
				.and_return(offline_transaction_refund_created_event)

			allow(offline_transaction_refund_created_event)
				.to receive(:attributes!)
				.and_return(attributes)

			allow(offline_transaction_refund)
				.to receive(:to_event)
				.with('payment.created', :nonprofit, :trx, :supporter, :subtransaction)
				.and_return(payment_created_event)

			allow(payment_created_event)
				.to receive(:attributes!)
				.and_return(attributes)
		end

		it 'announces offline_transaction_refund.created event' do
			offline_transaction_refund.publish_created

			expect(event_publisher)
				.to have_received(:announce)
				.with(:offline_transaction_refund_created, attributes)
		end

		it 'announces payment.created event' do
			offline_transaction_refund.publish_created

			expect(event_publisher)
				.to have_received(:announce)
				.with(:payment_created, attributes)
		end
	end

	describe '.publish_updated' do
		let(:payment_updated_event) { double }
		let(:offline_transaction_refund_updated_event) { double }

		before do
			allow(offline_transaction_refund)
				.to receive(:to_event)
				.with('offline_transaction_refund.updated', :nonprofit, :trx, :supporter, :subtransaction)
				.and_return(offline_transaction_refund_updated_event)

			allow(offline_transaction_refund_updated_event)
				.to receive(:attributes!)
				.and_return(attributes)

			allow(offline_transaction_refund)
				.to receive(:to_event)
				.with('payment.updated', :nonprofit, :trx, :supporter, :subtransaction)
				.and_return(payment_updated_event)

			allow(payment_updated_event)
				.to receive(:attributes!)
				.and_return(attributes)
		end

		it 'announces offline_transaction_refund.updated event' do
			offline_transaction_refund.publish_updated

			expect(event_publisher)
				.to have_received(:announce)
				.with(:offline_transaction_refund_updated, attributes)
		end

		it 'announces payment.updated event' do
			offline_transaction_refund.publish_updated

			expect(event_publisher)
				.to have_received(:announce)
				.with(:payment_updated, attributes)
		end
	end

	describe '.publish_deleted' do
		let(:payment_deleted_event) { double }
		let(:offline_transaction_refund_deleted_event) { double }

		before do
			allow(offline_transaction_refund)
				.to receive(:to_event)
				.with('offline_transaction_refund.deleted', :nonprofit, :trx, :supporter, :subtransaction)
				.and_return(offline_transaction_refund_deleted_event)

			allow(offline_transaction_refund_deleted_event)
				.to receive(:attributes!)
				.and_return(attributes)

			allow(offline_transaction_refund)
				.to receive(:to_event)
				.with('payment.deleted', :nonprofit, :trx, :supporter, :subtransaction)
				.and_return(payment_deleted_event)

			allow(payment_deleted_event)
				.to receive(:attributes!)
				.and_return(attributes)
		end

		it 'announces offline_transaction_refund.deleted event' do
			offline_transaction_refund.publish_deleted

			expect(event_publisher)
				.to have_received(:announce)
				.with(:offline_transaction_refund_deleted, attributes)
		end

		it 'announces payment.deleted event' do
			offline_transaction_refund.publish_deleted

			expect(event_publisher)
				.to have_received(:announce)
				.with(:payment_deleted, attributes)
		end
	end
end
