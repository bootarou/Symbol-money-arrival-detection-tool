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

## クライアントサイド（ブラウザ）での利用方法

1. `sample/index.html` をブラウザで開きます。
2. 画面の各入力欄に以下を入力します。
   - **ノードWebSocket URL**: 監視したいSymbolノードのWebSocketエンドポイント（カンマ区切りで複数指定可）
   - **監視アドレス（ハイフンなし）**: 監視したいSymbolアドレス（例：Nから始まるアドレス、ハイフンなし）
   - **メッセージ文字列**: （任意）特定の文字列を含むメッセージのみ検出したい場合に入力
   - **MosaicId**: （任意）特定のモザイクIDのみ検出したい場合に入力
   - **数量**: （任意）特定数量のみ検出したい場合に入力
3. 「監視開始」ボタンを押すと、着金監視が始まります。
4. 入金が検出されると、下部のログ欄にトランザクション情報が表示されます。
5. 「停止」ボタンで監視を終了できます。

### コードから直接利用したい場合

`sample/deposit-monitor.js` をimportし、以下のように利用できます。

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
    // 入金検出時の処理
    console.log('入金検出:', tx);
  },
  {
    messageText: '注文123',
    mosaicId: '6BED913FA20223F8',
    amount: '1000000'
  },
  (err) => {
    // エラー時の処理
    console.error('エラー:', err);
  }
);
```

- ノードURLは配列で複数指定可能です。
- フィルター条件は必要なものだけ指定できます。
- エラー時は第3引数のコールバックでハンドリングできます。

---

## API

### DepositMonitor (Node.js/ESM/ブラウザ)
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