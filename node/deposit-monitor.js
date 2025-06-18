// Node.js用 Symbol Deposit Monitor
import WebSocket from 'ws';

export class DepositMonitor {
  constructor(nodeWsUrls, address) {
    this.nodeWsUrls = Array.isArray(nodeWsUrls) ? nodeWsUrls : [nodeWsUrls];
    this.address = address;
    this.ws = null;
    this.uid = null;
    this.currentNodeIndex = 0;
    this.onDeposit = null;
    this.filter = null;
    this.onError = null;
  }
  monitorDeposits(onDeposit, filter, onError) {
    this.onDeposit = onDeposit;
    this.filter = filter;
    this.onError = onError;
    this.currentNodeIndex = 0;
    this._connectToNode();
  }
  _connectToNode() {
    if (this.currentNodeIndex >= this.nodeWsUrls.length) {
      if (this.onError) this.onError(new Error('全てのノードへの接続に失敗しました'));
      return;
    }
    const url = this.nodeWsUrls[this.currentNodeIndex];
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      // onopen直後はuidがまだ取得できないので、購読はonmessageでuid取得後に行う
    };
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // コネクション時のuid取得
        if (data.uid && !this.uid) {
          this.uid = data.uid;
          this.ws.send(JSON.stringify({ uid: this.uid, subscribe: 'block' }));
          this.ws.send(
            JSON.stringify({
              uid: this.uid,
              subscribe: `confirmedAdded/${this.address.replace(/-/g, '')}`,
            }),
          );
          return;
        }
        if(!data.data || !data.data.transaction) return;

        if (
          data.data.transaction &&
          data.data.transaction.type === 16724 &&
          this.hexToBase32(data.data.transaction.recipientAddress) === this.address.replace(/-/g, '')
        ) {
          let match = true;
          if (this.filter) {
            if (
              this.filter.messageText !== undefined &&
              (!data.data.transaction.message ||
                !this.decodeHexMessage(data.data.transaction.message).includes(this.filter.messageText))
            ) {
              match = false;
            }
            if (
              this.filter.mosaicId !== undefined &&
              !data.data.transaction.mosaics.some((m) => m.id === this.filter.mosaicId)
            ) {
              match = false;
            }
            if (
              this.filter.amount !== undefined &&
              !data.data.transaction.mosaics.some((m) => m.amount === this.filter.amount)
            ) {
              match = false;
            }
          }
          if (match && this.onDeposit) {
            this.onDeposit(data);
          }
        }
      } catch (e) {
        if (this.onError) this.onError(e);
      }
    };
    this.ws.onerror = (err) => {
      this.currentNodeIndex++;
      this._connectToNode();
      if (this.onError) this.onError(new Error(`ノード接続エラー: ${url}`));
    };
    this.ws.onclose = () => {
      // WebSocket closed
    };
  }
  decodeHexMessage(hex) {
    if (!hex) return '';
    return decodeURIComponent(hex.replace(/../g, '%$&'));
  }
  hexToBase32(hex) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    let bits = 0;
    let value = 0;
    let output = '';
    for (let i = 0; i < bytes.length; ++i) {
      value = (value << 8) | bytes[i];
      bits += 8;
      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }
    return output;
  }
  close() {
    this.ws?.close();
  }
}
