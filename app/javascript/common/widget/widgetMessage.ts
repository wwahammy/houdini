interface WidgetMessage {
	type:string
	object: unknown
}

interface IMessageHandler {
	eventName:string
	recognize(message:WidgetMessage): boolean;
	handlers: ((message:WidgetMessage)  => void)[]
}


class MessageHandler implements Partial<IMessageHandler> {
	constructor(eventName:string)
	recognize
}



export class MessageHandlers {
	readonly messageHandlers:MessageHandler[]
	constructor() {
		this.messageHandlers = [];
	}

	addHandler(event)
	getRecognizer(message:WidgetMessage) : MessageHandler| undefined {
		return this.messageHandlers.find((handler) => handler.recognize(message))
	}
}

