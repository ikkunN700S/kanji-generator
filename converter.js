class KanjiConverter {
  constructor() {
    this.dictionary = { words: {}, chars: {} };
    this.sortedWordKeys = [];
  }

  // 辞書JSONを非同期で読み込む
  async loadDictionary(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.dictionary = await response.json();
      
      // 長い単語から優先して置換するためにキーを文字数順にソートする
      this.sortedWordKeys = Object.keys(this.dictionary.words).sort((a, b) => b.length - a.length);
      return true;
    } catch (error) {
      console.error("辞書の読み込みに失敗しました:", error);
      return false;
    }
  }

  // カタカナをひらがなに変換するヘルパー関数
  kataToHira(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
      const chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  }

  // メインの変換処理
  convert(text) {
    if (!text) return "";

    let result = "";
    let i = 0;

    while (i < text.length) {
      // 処理中の位置からの部分文字列を取得
      const remainingText = text.slice(i);
      // カタカナが含まれている可能性を考慮し、比較用にひらがな化
      const normalizedRemaining = this.kataToHira(remainingText);

      let matched = false;

      // 1. まず「複数文字の単語（words）」で最長一致検索
      for (const key of this.sortedWordKeys) {
        if (normalizedRemaining.startsWith(key)) {
          result += this.dictionary.words[key];
          i += key.length;
          matched = true;
          break;
        }
      }

      // 単語でマッチした場合は次のループへ
      if (matched) continue;

      // 2. 単語にマッチしなかった場合、1文字取り出して処理
      const char = text[i];
      const normalizedChar = this.kataToHira(char);

      // ひらがな/カタカナとして「chars」辞書に存在すれば変換
      if (this.dictionary.chars[normalizedChar]) {
        result += this.dictionary.chars[normalizedChar];
      } else {
        // 漢字や記号など、辞書にないものはそのまま追加
        result += char;
      }
      
      i++;
    }

    return result;
  }
}