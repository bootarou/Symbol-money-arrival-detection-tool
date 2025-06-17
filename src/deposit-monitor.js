// deposit-monitor.js
export class DepositMonitor {
  constructor(nodeWsUrl, address) {
    this.nodeWsUrl = nodeWsUrl;
    this.address = address;
    this.ws = null;
  }
  monitorDeposits(onDeposit, filter) {
    this.ws = new WebSocket(this.nodeWsUrl);
    this.ws.onopen = () => {
      const subscribeMsg = {
        uid: 1,
        subscribe: `confirmedAdded/${this.address.replace(/-/g, '')}`,
      };
      this.ws?.send(JSON.stringify(subscribeMsg));
    };
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (
        data.transaction &&
        data.transaction.type === 16724 &&
        data.transaction.recipientAddress === this.address.replace(/-/g, '')
      ) {
        let match = true;
        if (filter) {
          if (
            filter.messageText !== undefined &&
            (!data.transaction.message ||
              !this.decodeHexMessage(data.transaction.message.payload).includes(filter.messageText))
          ) {
            match = false;
          }
          if (
            filter.mosaicId !== undefined &&
            !data.transaction.mosaics.some((m) => m.id === filter.mosaicId)
          ) {
            match = false;
          }
          if (
            filter.amount !== undefined &&
            !data.transaction.mosaics.some((m) => m.amount === filter.amount)
          ) {
            match = false;
          }
        }
        if (match) {
          onDeposit(data);
        }
      }
    };
    this.ws.onerror = (err) => {
      // WebSocket error
    };
    this.ws.onclose = () => {
      // WebSocket closed
    };
  }
  decodeHexMessage(hex) {
    if (!hex) return '';
    return decodeURIComponent(hex.replace(/../g, '%$&'));
  }
  close() {
    this.ws?.close();
  }
}
