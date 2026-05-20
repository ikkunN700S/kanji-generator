document.addEventListener("DOMContentLoaded", async () => {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const convertBtn = document.getElementById("convertBtn");

  // コンバーターのインスタンス化
  const converter = new KanjiConverter();

  // 辞書の読み込み
  const isLoaded = await converter.loadDictionary("dictionary.json");

  if (isLoaded) {
    convertBtn.textContent = "漢字に変換する";
    convertBtn.disabled = false;
  } else {
    convertBtn.textContent = "エラー：辞書が読み込めません";
  }

  // 変換ボタンクリック時の処理
  convertBtn.addEventListener("click", () => {
    const text = inputText.value;
    const result = converter.convert(text);
    outputText.value = result;
  });

  copyBtn.addEventListener("click", async () => {
    const textToCopy = outputText.value;
    
    // 空の場合は何もしない
    if (!textToCopy) return;

    try {
      // クリップボードにテキストを書き込む
      await navigator.clipboard.writeText(textToCopy);
      
      // ボタンのテキストを一時的に変更してフィードバック
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "コピーしました！";
      
      // 2秒後に元のテキストに戻す
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
      alert("コピーに失敗しました。");
    }
  });
});