# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
require 'rails_helper'

describe InsertRefunds do
	let!(:nonprofit) { create(:nm_justice) }
	let!(:supporter) { create(:supporter, nonprofit: nonprofit) }

  let!(:gross_amount) { 500 }
  let!(:fees) { CalculateFees.for_single_amount(gross_amount) }
  let!(:net_amount) { gross_amount + fees }
  let!(:payment) do
    force_create(
      :payment,
      gross_amount: gross_amount,
      net_amount: net_amount,
      fee_total: fees,
      date: Time.zone.now,
      nonprofit: nonprofit,
      supporter: supporter,
      refund_total: 0
    )
  end

  let!(:stripe_charge) { create(:stripe_charge, payment: payment) }
  let!(:charge) { create(:charge, payment: payment, stripe_charge_id: 'ch_s0m3th1ng', nonprofit: nonprofit, supporter: supporter, amount: gross_amount) }

  before do
    nonprofit.save!
    supporter.save!
    stripe_charge.save!
    charge.save!
  end

  describe '.with_stripe' do
    context 'when invalid' do
      it 'raises an error with an invalid charge' do
        charge.update(stripe_charge_id: 'xxx')
        expect { InsertRefunds.with_stripe(charge, amount: 1) }.to raise_error(ParamValidation::ValidationError)
      end

      it 'sets a failure message an error with an invalid amount' do
        charge.update(amount: 0)
        expect { InsertRefunds.with_stripe(charge, amount: 0) }.to raise_error(ParamValidation::ValidationError)
      end

      it 'returns err if refund amount is greater than payment gross minus payment refund total' do
        expect { InsertRefunds.with_stripe(charge, 'amount' => 600) }.to raise_error(RuntimeError)
      end
    end

    context 'when valid' do
      let(:retrieved_stripe_charge) { double }
      let(:stripe_charge_refunds) { double }
      let(:created_stripe_charge_refund) { double }

      let(:fake_refund_id) { 're_f@k3' }

      before do
        allow(Stripe::Charge)
          .to receive(:retrieve)
          .with('ch_s0m3th1ng')
          .and_return(retrieved_stripe_charge)
        allow(retrieved_stripe_charge)
          .to receive(:refunds)
          .and_return(stripe_charge_refunds)
        allow(stripe_charge_refunds)
          .to receive(:create)
          .with({'amount' => 100, 'refund_application_fee' => true, 'reverse_transfer' => true })
          .and_return(created_stripe_charge_refund)
        allow(created_stripe_charge_refund)
          .to receive(:id)
          .and_return(fake_refund_id)
      end

      subject { InsertRefunds.with_stripe(charge, 'amount' => 100) }

      it 'sets the stripe refund id' do
        result = subject
        expect(result['refund']['stripe_refund_id']).to match(/^re_/)
      end

      it 'creates a negative payment for the refund with the gross amount' do
        result = subject
        expect(result['payment']['gross_amount']).to eq(-100)
      end

      it 'creates a negative payment for the refund with the net amount' do
        result = subject
        expect(result['payment']['net_amount']).to eq(-109)
      end

      it 'updates the payment_id on the refund' do
        result = subject
        expect(result['refund']['payment_id']).to eq(result['payment']['id'])
      end

      it 'increments the payment refund total by the gross amount' do
        subject
        expect(payment.reload['refund_total']).to eq(100)
      end

      it 'sets the payment supporter id' do
        result = subject
        expect(result['payment']['supporter_id']).to eq(supporter['id'])
      end
    end
  end
end
