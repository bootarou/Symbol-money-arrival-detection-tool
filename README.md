# Symbol Deposit Detector SDK

## Overview / 概要
This SDK enables real-time monitoring of Symbol blockchain deposits (incoming transfers) via WebSocket, both on client-side (browser) and server-side (Node.js). You can filter deposits by message string, MosaicId, and amount.

本SDKはSymbolブロックチェーンの着金（入金）をWebSocketでリアルタイム監視できます。クライアントサイド（ブラウザ）・サーバーサイド（Node.js）両対応。メッセージ文字列・MosaicId・数量でフィルタ可能です。

---

## Features / 特徴
- SymbolノードのWebSocket APIを直接利用し、SDKや外部依存なしで動作
- クライアントサイド（ブラウザ）でもサーバーサイド（Node.js）でも利用可能
- メッセージ内容・MosaicId・数量で着金検出を柔軟にフィルタリング
- サンプルUI（sample/index.html）付き
- エラーハンドリング用コールバック対応
- 複数ノードURLを配列で指定し、接続できない場合は自動で次のノードへ切り替え

---

## Node.jsでの利用方法

1. `node` フォルダに移動し、依存パッケージをインストールします。
   ```sh
   cd node
   npm install
   ```
2. `sample.js` を編集し、ノードURLやアドレス、フィルター条件を設定します。
3. サンプルを実行します。
   ```sh
   npm start
   ```

---

## Node.js用サンプルコード（`node/sample.js`）
```js
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
```

---

## クライアントサイド（ブラウザ）での利用例
`sample/index.html` をブラウザで開き、必要な情報を入力して「監視開始」ボタンを押してください。

- `sample/deposit-monitor.js` をimportし、コールバックで検出後の処理やエラー処理を記述できます。
- フィルター条件（メッセージ、MosaicId、数量）はUIで指定可能です。
- ノードURLはカンマ区切りで複数指定できます。

---

## API

### DepositMonitor (Node.js/ESM)
- **constructor(nodeWsUrls: string[] | string, address: string)**
- **monitorDeposits(onDeposit: (tx: any) => void, filter?: { messageText?: string; mosaicId?: string; amount?: string }, onError?: (err: any) => void)**
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