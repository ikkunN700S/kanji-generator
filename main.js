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
});