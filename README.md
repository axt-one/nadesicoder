# なでしこーだー
日本語プログラミング言語「[なでしこ](https://nadesi.com/top/)」で[AtCoder](https://atcoder.jp/)の問題を解くためのchrome拡張機能です。  
「なでしこーだー」はブラウザで動かすことのできる「[なでしこ３](https://nadesi.com/doc3/)」の言語エンジンを利用して、なでしこ３で書いたコードをJavaScriptに変換することでAtCoderに提出できるようにしています。  
標準入力の取得方法は[使い方](#使い方)を参照してください。

## インストール方法
1. このリポジトリをクローンするか、ソースコードをダウンロードして展開します。
2. chromeを起動します。
3. 拡張機能の設定を開きます。
   - 「環境設定 > 拡張機能」を開くか、chromeの検索バーに`chrome://extensions`と入力します。
4. 右上の「デベロッパーモード」をオンにします。
5. 左上の「パッケージ化されていない拡張機能を読み込む」をクリックし、1.でダウンロードしたフォルダを選択します。
これでchromeに「なでしこーだー」がインストールされます。

## 使い方
AtCoderのコンテストページを開くと自動的に「なでしこーだー」が起動します。
### なでしこ３で書いたコードを提出する
コンテストの「問題」ページもしくは「提出」ページを開き、「提出」ボタンの横に「なでしこ提出」ボタンが表示されていればOKです。  
エディタになでしこ３でソースコードを書き、「なでしこ提出」ボタンをクリックすると自動でJavaScriptに変換されて提出されます。AtCoderの言語欄は特に変更する必要はありません。


### なでしこ３で書いたコードをテストする
「なでしこーだー」はAtCoderのコードテストにも対応しています。コンテストの「コードテスト」ページを開くと「実行」ボタンの横に「なでしこ実行」が表示されます。  
エディタになでしこ３でソースコードを書き、「なでしこ実行」ボタンをクリックすると自動でJavaScriptに変換されて実行されます。AtCoderの言語欄は特に変更する必要はありません。


### 標準入力を取得する
AtCoderは標準入力を受け取り、解答を標準出力する形式の問題が出題されますが、「なでしこーだー」で使用しているweb版のなでしこ３（wnako3）は標準入力を受け取る機能がありません。そのため「なでしこーだー」では標準入力を受け取る独自の関数「標準入力」を設定しています。関数「標準入力」は、一度にすべての標準入力を受け取り、その文字列を返します。複数行の入力がある場合も改行記号を含む一つの文字列が返ります。

#### 例１

ソースコード
```なでしこ３
標準入力を整数変換して、それに10を掛けて表示
```
入力
```
3
```
出力
```
30
```

#### 例２

ソースコード
```なでしこ３
標準入力を改行で区切ってAに代入。
Aの配列合計を表示
```
入力
```
1
2
3
```
出力
```
6
```

### 標準出力
上の例にあるように標準出力は「表示」命令を使うことができます。
「コンソール表示」命令でも同じ結果になります。