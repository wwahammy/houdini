



export function rawSendMessage<TMessage=unknown>(window:Window, message:TMessage, targetOrigin:string, transfer?: Transferable[]):void {
	window.postMessage(message, targetOrigin, transfer);
}