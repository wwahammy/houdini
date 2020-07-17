


interface SetParams {
	command: 'setDonationParams'
	sender: 'commitchange'
	[args:string]: unknown
}

export type LegacyMessages = SetParams