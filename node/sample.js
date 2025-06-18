// Node.js用サンプル
import { DepositMonitor } from './deposit-monitor.js';

const nodeWsUrls = [
  'wss://your-symbol-node1:3001/ws',
  'wss://your-symbol-node2:3001/ws'
];
const address = 'あなたのSymbolアドレス（ハイフンなし）';

const monitor = new DepositMonitor(nodeWsUrls, address);

monitor.monitorDeposits(
  (tx) => {
    console.log('入金検出:', JSON.stringify(tx, null, 2));
  },
  {
    messageText: '注文123',
    mosaicId: '6BED913FA20223F8',
    amount: '1000000'
  },
  (err) => {
    console.error('エラー:', err);
  }
);
