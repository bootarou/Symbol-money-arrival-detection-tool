# Symbol Deposit Detector SDK

## Overview / 概要
This SDK enables real-time monitoring of Symbol blockchain deposits (incoming transfers) via WebSocket, both on client-side (browser) and server-side (Node.js). You can filter deposits by message string, MosaicId, and amount.

本SDKはSymbolブロックチェーンの着金（入金）をWebSocketでリアルタイム監視できます。クライアントサイド（ブラウザ）・サーバーサイド（Node.js）両対応。メッセージ文字列・MosaicId・数量でフィルタ可能です。

---

## Usage / 使い方

### Node.js/TypeScriptでの利用例
```typescript
import { SymbolDepositDetectorSDK } from './src/index';

const nodeWsUrl = 'wss://your-symbol-node:3001/ws';
const address = 'あなたのSymbolアドレス（ハイフンなし）';

const sdk = new SymbolDepositDetectorSDK(nodeWsUrl, address);
sdk.monitorDeposits((tx) => {
    console.log('入金検出:', tx);
}, {
    messageText: '注文123',
    mosaicId: '6BED913FA20223F8',
    amount: '1000000'
});
```

### クライアントサイド（ブラウザ）での利用例
`sample/index.html` をブラウザで開き、必要な情報を入力して「監視開始」ボタンを押してください。

- `sample/deposit-monitor.js` をimportし、コールバックで検出後の処理を記述できます。
- フィルター条件（メッセージ、MosaicId、数量）はUIで指定可能です。

---

## API

### SymbolDepositDetectorSDK (Node.js/TypeScript)
- **constructor(nodeWsUrl: string, address: string)**
- **monitorDeposits(onDeposit: (tx: any) => void, filter?: { messageText?: string; mosaicId?: string; amount?: string })**
- **close()**

### DepositMonitor (クライアントサイド/ESM)
- **constructor(nodeWsUrl: string, address: string)**
- **monitorDeposits(onDeposit: (tx: any) => void, filter?: { messageText?: string; mosaicId?: string; amount?: string })**
- **close()**

---

## Types / 型定義
- `src/types/index.ts` を参照してください。

---

## Contributing / コントリビュート
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

貢献は大歓迎です！機能追加やバグ修正のためのプルリクエストやIssueの作成をお待ちしています。

---

## License / ライセンス
This project is licensed under the MIT License. See the LICENSE file for more details.

このプロジェクトはMITライセンスの下で公開されています。詳細はLICENSEファイルをご覧ください。