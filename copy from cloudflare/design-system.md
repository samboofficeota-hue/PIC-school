# 🎨 デザインシステム - 公益資本主義アカデミー

## カラーパレット - Fresh & Bright（明るく爽やかな配色）

### 📋 カラーコード一覧

#### **ベースカラー（背景・基礎）**
```css
--color-background: #FFF8F0          /* クリーム系の温かみのある背景 */
--color-background-secondary: #FDFBF7 /* より淡いクリーム */
--color-white: #FFFFFF
--color-border: #E8DED0              /* 柔らかいベージュ系ボーダー */
```

#### **メインカラー（フレッシュミントグリーン）**
```css
--color-primary: #6FDAA3             /* フレッシュミントグリーン - 明るく爽やか・成長 */
--color-primary-light: #9FE8C3       /* より淡いミントグリーン */
--color-primary-dark: #4FC089        /* より濃いミントグリーン */
--color-primary-pale: #D0F5E5        /* 極淡いミントグリーン */
```

#### **サブカラー（明るいスカイブルー）**
```css
--color-secondary: #5EC4E8           /* 明るいスカイブルー - 知性・信頼・爽やか */
--color-secondary-light: #8ED9F0     /* より淡いスカイブルー */
--color-secondary-dark: #3AAFD8      /* より濃いスカイブルー */
--color-secondary-pale: #D5F0F9      /* 極淡いスカイブルー */
```

#### **アクセントカラー1（コーラルオレンジ）**
```css
--color-accent: #F4A261              /* コーラルオレンジ - エネルギー・行動 */
--color-accent-light: #F9C08A        /* より淡いコーラル */
--color-accent-dark: #E68840         /* より濃いコーラル */
--color-accent-pale: #FCE5D3         /* 極淡いコーラル */
```

#### **アクセントカラー2（モーブパープル）**
```css
--color-accent-secondary: #C4A1D3    /* モーブパープル - 創造性・感性 */
--color-accent-secondary-light: #D9BBE3 /* より淡いモーブ */
--color-accent-secondary-dark: #A981B3 /* より濃いモーブ */
--color-accent-secondary-pale: #EDE5F3 /* 極淡いモーブ */
```

#### **テキストカラー**
```css
--color-text-primary: #3E4C59        /* ダークグレイッシュブルー */
--color-text-secondary: #5D6D7E      /* ミディアムグレイッシュブルー */
--color-text-light: #8B95A0          /* ライトグレイッシュブルー */
--color-text-lighter: #B0B7BE        /* より淡いグレー */
```

#### **セッションカラー（各Session識別用）**
```css
--color-session-intro: #FFB6C1       /* ライトピンク - Session 1 (イントロ) */
--color-session-news: #FFD4A3        /* ピーチ - Session 2 (ニュース) */
--color-session-work: #A8E6A3        /* ライムグリーン - Session 3 (ワーク) */
--color-session-dialogue: #A8D5F5    /* スカイブルー - Session 4 (対話) */
--color-session-summary: #D4B5F2     /* ラベンダー - Session 5 (サマリー) */
```

#### **ステータスカラー**
```css
--color-success: #95C9B4             /* 成功（プライマリグリーン） */
--color-warning: #F4A261             /* 警告（アクセントオレンジ） */
--color-error: #E07A5F               /* エラー（テラコッタ） */
--color-info: #88B4D9                /* 情報（セカンダリブルー） */
```

---

## 🎯 カラーの使い分けガイドライン

### **背景**
- `--color-background` (#FFF8F0) - メイン背景
- `--color-white` (#FFFFFF) - カード、モーダルの背景

### **ブランドカラー**
- `--color-primary` (#95C9B4) - メインボタン、リンク、ブランド要素
- `--color-secondary` (#88B4D9) - サブボタン、セカンダリアクション

### **アクセント**
- `--color-accent` (#F4A261) - CTA、重要なアクション、強調
- `--color-accent-secondary` (#C4A1D3) - 特別な要素、クリエイティブな表現

### **テキスト**
- `--color-text-primary` (#3E4C59) - 見出し、重要なテキスト
- `--color-text-secondary` (#5D6D7E) - 本文、説明文
- `--color-text-light` (#8B95A0) - 補足情報、メタ情報

---

## 🎨 カラー組み合わせ例

### **パターン1: ヒーロー背景**
```css
background: linear-gradient(135deg, #D0F5E5 0%, #D5F0F9 50%, #FCE5D3 100%);
```

### **パターン2: カード背景（グリーン系）**
```css
background: linear-gradient(135deg, #D0F5E5 0%, #9FE8C3 100%);
```

### **パターン3: カード背景（ブルー系）**
```css
background: linear-gradient(135deg, #D5F0F9 0%, #8ED9F0 100%);
```

### **パターン4: CTA背景**
```css
background: linear-gradient(135deg, #6FDAA3 0%, #5EC4E8 100%);
```

### **パターン5: アクセントボタン**
```css
background: linear-gradient(135deg, #F4A261 0%, #E68840 100%);
```

---

## 🖼️ カラーパレットプレビュー

### メインカラー
🟢 Primary: #6FDAA3 (フレッシュミントグリーン)
🔵 Secondary: #5EC4E8 (明るいスカイブルー)

### アクセントカラー
🟧 Accent 1: #F4A261 (コーラルオレンジ)
🟪 Accent 2: #C4A1D3 (モーブパープル)

### テキストカラー
⬛ Text Primary: #3E4C59
⬛ Text Secondary: #5D6D7E
⬛ Text Light: #8B95A0

### セッションカラー
🩷 Session 1: #FFB6C1 (ライトピンク)
🧡 Session 2: #FFD4A3 (ピーチ)
💚 Session 3: #A8E6A3 (ライムグリーン)
💙 Session 4: #A8D5F5 (スカイブルー)
💜 Session 5: #D4B5F2 (ラベンダー)

---

## 🎭 デザインコンセプト

### **Fresh & Bright（明るく爽やか）**
- 温かみのあるクリーム系背景で包み込むような安心感
- フレッシュミントグリーンで明るく爽やか、前向きな印象
- 明るいスカイブルーで知性と信頼感を表現
- コーラルオレンジのアクセントで行動を促す
- 全体的に明るく元気な配色で若者向けにアプローチ

### **対象者への訴求**
- **高校生**: 親しみやすく、でも子供っぽくない
- **大学生**: モダンで洗練された印象
- **20代社会人**: プロフェッショナルで信頼できる

### **ブランドメッセージ**
- 🌿 **フレッシュミントグリーン**: 成長、新鮮さ、希望、公益
- 💙 **明るいスカイブルー**: 知性、信頼、爽やかさ、未来志向
- 🔥 **コーラルオレンジ**: 行動、情熱、エネルギー、変革
- 🎨 **モーブパープル**: 創造性、感性、独自性

---

## 📏 その他のデザイン要素

### **角丸（Border Radius）**
- Small: 8px
- Medium: 16px
- Large: 24px
- Extra Large: 32px
- Full: 9999px (完全な円形)

### **シャドウ**
- Small: 0 2px 4px rgba(0, 0, 0, 0.08)
- Medium: 0 4px 12px rgba(0, 0, 0, 0.1)
- Large: 0 8px 24px rgba(0, 0, 0, 0.12)
- Extra Large: 0 12px 36px rgba(0, 0, 0, 0.15)

### **トランジション**
- Fast: 0.15s
- Base: 0.3s
- Slow: 0.5s

---

**最終更新**: 2025-10-22
