// Supporter wants to make a single donation to Nonprofit with ID 1

//`POST /nonprofit/1/transaction`

const donation_request = {

	// donation is a `transaction assignment`. Others are `campaign_gift_purchase`
	// or `ticket_purchase`
	donations: [{
		// since this is in the nonprofit's currency they could do `amount: 10000` and
		// we'll autoexpand
		// if there's only one transaction assignment, this can be figured out.
		amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		designation: 'Special account',
	}],

	offline_transactions: [{
		// this amount must match all of the transaction assignments
		amount: 10000,
		method: 'check',
	}],
	// information about the supporter donating. This either creates a new supporter
	// or finds one with the same email
	supporter: {
		email: 'penelope@fightingpoverty.org',
		name: 'Penelope Schultz',
	},
};

const donation_result: any = {
	object: 'transaction',
	id: 'trx_313435ncan',
	amount: {
		value_in_cents: 10000,
		currency: 'usd',
	},
	donations: [{
		object: 'donation',
		id: 'don_2454',
		// from transaction
		supporter: 340,
		// from supporter
		nonprofit: 1235,
		amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		designation: 'Special account',
		// it's a transaction assignment.
		subtype: 'trx_assignment',
	}],
	offline_transactions: [{
		id: 'offltrx_415h5io',
		object: 'offline_transasction',
		// based upon adding up the first charge
		original_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		//this is based upon adding up all of the charges, refunds, disputes and adjustments
		net_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		method: 'check',
		status: 'success',
		payments: [
			{
				id: 'offchrg_4325n3fnfewE',
				object: 'offline_charge',
				// gross_amount - fees
				net_amount: {
					value_in_cents: 10000,
					currency: 'usd',
				},
				gross_amount: {
					value_in_cents: 10000,
					currency: 'usd',
				},
				fees: null,
				status: 'success',
				//from transaction
				supporter: 340,
				// from supporter
				nonprofit: 1235,
				// from subtransaction
				transaction: 'trx_313435ncan',
				subtransaction: 'offltrx_415h5io',
				subtype: 'payment',
				//timestamp of creation
				created: 133543588,
			},
		],
		//it's a subtransaction
		subtype: 'subtransaction',
		//from transaction
		supporter: 340,
		// from supporter
		nonprofit: 1235,
		transaction: 'trx_313435ncan',
	}],

	nonprofit: {
		id: 1235,
		object: 'nonprofit',
		name: "Nonprofit's name",
	},

	// we include all payments here from all of the subtransactions for ease of use
	payments: [{
		id: 'offchrg_4325n3fnfewE',
		object: 'offline_charge',
		// gross_amount - fees
		net_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		gross_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		fees: null,
		status: 'success',
		subtransaction_entity: 'offchrg_4325n3fnfewE',
		// from subtransaction_entity
		subtransaction: 'offltrx_415h5io',
		//from transaction
		supporter: 340,
		// from supporter
		nonprofit: 1235,
		// subtransaction
		transaction: 'trx_313435ncan',
		created: 133543588,
	}],
	// information about the supporter donating
	supporter: {
		id: 340,
		email: 'penelope@fightingpoverty.org',
		name: 'Penelope Schultz',
		nonprofit: 1235,
	},
};


// Supporter wants to make a ticket purchase from Nonprofit 1 and tickets are available

const ticket_purchase_request: any = {
	// donation is a `transaction assignment`. Others are `campaign_gift_purchase`
	// or `ticket_purchase`
	ticket_purchase: {
		// since this is in the nonprofit's currency they could do `amount: 10000` and
		// we'll autoexpand
		amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		event: 1,
		ticket_requests: [{
			ticket_level: 'tktlvl_r3453j90942',
			quantity: 5,
			note: "Seat with Penelope's Father",
		},
		{
			ticket_level: 'tktlvl_434',
			quantity: 1,
		}],
	},

	offline_transactions: [{
		// this amount must match all of the transaction assignments
		amount: 10000,
		method: 'check',
	}],
	// information about the supporter donating. This either creates a new supporter
	// or finds one with the same email
	supporter: {
		email: 'penelope@fightingpoverty.org',
		name: 'Penelope Schultz',
	},
};

const ticket_purchase_result: any = {
	object: 'transaction',
	id: 'trx_313435ncan',
	amount: {
		value_in_cents: 10000,
		currency: 'usd',
	},
	ticket_purchases: [{
		// since this is in the nonprofit's currency they could do `amount: 10000` and
		// we'll autoexpand
		amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		event: 1,
		tickets: [{
			amount: {
				value_in_cents: 2000,
				currency: 'usd',
			},
			ticket_level: 'tktlvl_r3453j90942',
			checked_in: false,
			deleted: false,
			note: "Seat with Penelope's Father",
			id: 'tkt_werikhti35N',
		},
		{
			amount: {
				value_in_cents: 2000,
				currency: 'usd',
			},
			ticket_level: 'tktlvl_r3453j90942',
			checked_in: false,
			deleted: false,
			note: "Seat with Penelope's Father",
			id: 'tkt_werikVti35N',
		},
		//... and 3 more for tktlvl_r3453j90942
		{
			ticket_level: 'tktlvl_434',
			checked_in: false,
			deleted: false,
			id: 'tkt_535nrfuoh',
			amount: {
				value_in_cents: 0,
				currency: 'usd',
			},
		}],

		id: 'tktpur_34235nrf',
		object: 'ticket_purchase',
		subtype: 'trx_assignment',
	}],
	offline_transactions: [{
		id: 'offltrx_415h5io',
		object: 'offline_transasction',
		// based upon adding up the first charge
		original_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		//this is based upon adding up all of the charges, refunds, disputes and adjustments
		net_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		method: 'check',
		status: 'success',
		payments: [
			{
				id: 'offchrg_4325n3fnfewE',
				object: 'offline_charge',
				// gross_amount - fees
				net_amount: {
					value_in_cents: 10000,
					currency: 'usd',
				},
				gross_amount: {
					value_in_cents: 10000,
					currency: 'usd',
				},
				fees: null,
				status: 'success',
				//from transaction
				supporter: 340,
				// from supporter
				nonprofit: 1235,
				// from subtransaction
				transaction: 'trx_313435ncan',
				subtransaction: 'offltrx_415h5io',
				subtype: 'payment',
				//timestamp of creation
				created: 133543588,
			},
		],
		//it's a subtransaction
		subtype: 'subtransaction',
		//from transaction
		supporter: 340,
		// from supporter
		nonprofit: 1235,
		transaction: 'trx_313435ncan',
	}],

	nonprofit: {
		id: 1235,
		object: 'nonprofit',
		name: "Nonprofit's name",
	},

	// we include all payments here from all of the subtransactions for ease of use
	payments: [{
		id: 'offchrg_4325n3fnfewE',
		object: 'offline_charge',
		// gross_amount - fees
		net_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		gross_amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		fees: null,
		status: 'success',
		subtransaction_entity: 'offchrg_4325n3fnfewE',
		// from subtransaction_entity
		subtransaction: 'offltrx_415h5io',
		//from transaction
		supporter: 340,
		// from supporter
		nonprofit: 1235,
		// subtransaction
		transaction: 'trx_313435ncan',
		created: 133543588,
	}],
	// information about the supporter donating
	supporter: {
		id: 340,
		email: 'penelope@fightingpoverty.org',
		name: 'Penelope Schultz',
		nonprofit: 1235,
	},
};


// Supporter wants to make a ticket purchase from Nonprofit 1 and tickets are NOT available

// TODO


// Supporter wants to make a Stripe charge for a campaign_gift from Nonprofit 1

const stripe_campaign_gift_request: any = {
	campaign_gift_purchase: {
		// since this is in the nonprofit's currency they could do `amount: 10000` and
		// we'll autoexpand
		amount: {
			value_in_cents: 10000,
			currency: 'usd',
		},
		campaign: 1,
		campaign_gifts: [{
			campaign_gift_option: 'cgo_535n35n',
		}],
	},

	stripe_transactions: [
		{
			amount: 10000,
		},
	],
	// information about the supporter donating. This either creates a new supporter
	// or finds one with the same email
	supporter: {
		email: 'penelope@fightingpoverty.org',
		name: 'Penelope Schultz',
	},
};

const stripe_campaign_gift_result: any = {
	// donation is a `transaction assignment`. Others are `campaign_gift_purchase`
	// or `ticket_purchase`

};




// Supporter wants to start a recurring donation and charge immediately

//`POST /nonprofit/1/recurring_donation`

// Supporter wants a refund or to rearrange their payment to other assignments

// Simple case - Full refund
// POST /nonprofits/<nonprofit_id>/transactions/<transaction_id>/reassign`
const donation_refund_request = {};

// Case 1 - Partial refund
// `POST /nonprofits/<nonprofit_id>/transactions/<transaction_id>/reassign`
const donation_partial_refund_request = {
	origins: [{
		donation: [{
			amount: {
				value_in_cents_to_be_rearranged: 3000,
			},
			id: 'don_2454',
		}],
	}],
	targets: [{
		refund: {
			value_in_cents_to_be_refunded: 3000,
		},
	}],
};

// Case 2 - Reassigning the donation
// `POST /nonprofits/<nonprofit_id>/transactions/<transaction_id>/reassign`
const donation_partial_rearrangement = {
	origins: [{
		donation: {
			id: 'don_2454',
			amount: {
				value_in_cents_to_be_rearranged: 5000,
			},
		},
	}],
	targets: [{
		ticket_purchase: {
			// since this is in the nonprofit's currency they could do `amount: 10000` and
			// we'll autoexpand
			amount: {
				value_in_cents: 5000,
				currency: 'usd',
			},
			event: 1,
			ticket_requests: [{
				ticket_level: 'tktlvl_r3453j90942',
				quantity: 5,
				note: "Seat with Penelope's Father",
			},
			{
				ticket_level: 'tktlvl_434',
				quantity: 1,
			}],
		},
	}],
};

// Case 3 - Reassigning the donation and requesting a partial refund
// `POST /nonprofits/<nonprofit_id>/transactions/<transaction_id>/reassign`
const donation_partial_refund_request_with_rearrangement = {
	origins: [{
		donation: {
			id: 'don_2454',
			amount: {
				value_in_cents_to_be_rearranged: 7000,
			},
		},
	}],
	targets: [{
		ticket_purchase: {
			// since this is in the nonprofit's currency they could do `amount: 10000` and
			// we'll autoexpand
			amount: {
				value_in_cents: 5000,
				currency: 'usd',
			},
			event: 1,
			ticket_requests: [{
				ticket_level: 'tktlvl_r3453j90942',
				quantity: 5,
				note: "Seat with Penelope's Father",
			},
			{
				ticket_level: 'tktlvl_434',
				quantity: 1,
			}],
		},
	},
	{
		refund: {
			amount: {
				value_in_cents_to_be_refunded: 2000,
			},
		},
	}],
};
