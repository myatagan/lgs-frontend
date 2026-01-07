document.addEventListener("DOMContentLoaded", () => {

  const correct = Number(localStorage.getItem("result_correct") || 0);
  const total = Number(localStorage.getItem("result_total") || 0);
  const wrong = JSON.parse(localStorage.getItem("result_wrong") || "[]");

  document.getElementById("score").innerHTML =
    `Doğru Sayısı: <b>${correct} / ${total}</b>`;

  const wrongDiv = document.getElementById("wrongList");

  if (wrong.length === 0) {
    wrongDiv.innerHTML = "<p>Tebrikler! Tüm soruları doğru yaptınız 🎉</p>";
    return;
  }

  wrong.forEach(w => {
    const div = document.createElement("div");
    div.className = "wrong-card";

    div.innerHTML = `
      <p><b>${w.index})</b> ${w.question}</p>
      <p>Senin cevabın: <b>${w.userAnswer ?? "-"}</b></p>
      <p>Doğru cevap: <b>${w.correctAnswer}</b></p>
      <p><b>Çözüm:</b> ${w.explanation}</p>
      <hr>
    `;

    wrongDiv.appendChild(div);
  });

});

function restart() {
  localStorage.removeItem("questions");
  localStorage.removeItem("result_correct");
  localStorage.removeItem("result_total");
  localStorage.removeItem("result_wrong");
  window.location.href = "index.html";
}
