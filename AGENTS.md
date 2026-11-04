# AGENTS.md

このリポジトリでテーマとアドオンを変更するときの決まりです。

## 置き場所

- `packages/slidev-theme-swiss`: 配色、文字、レイアウトなどの見た目
- `packages/slidev-addon-swiss`: デッキから使うコンポーネント
- テーマのレイアウトはアドオンのコンポーネントを使います。デッキの `addons:` にもアドオンを書いてください

## スタイル

- CSS はプレゼンター画面にも当たるので、`.slidev-layout` の下に書きます
- 色と寸法は `styles/tokens.css` の変数を使います
- 紙、墨、アクセント 1 色だけで組みます。角丸、影、グラデーションは使いません (人の写真の円を除く)
- 要素は 12 列のグリッドに沿わせます

## レイアウト

- ルート要素に `slidev-layout` とレイアウト名のクラスを付けます
- `title` は Slidev が予約しているので、props ではなく `$frontmatter` から読みます
- 画像のパスを受ける値は `utils/withBase.ts` を通します

## 確認

- 変更したら、ルートで `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm -r build` を実行します
- 単体テストは `node --test` で書き、Vue と Slidev に依存しない関数だけを対象にします
- 見た目は `pnpm --filter slidev-theme-swiss screenshot` で確かめます。コンポーネントのファイルを足したときは、dev サーバーを起動し直します
