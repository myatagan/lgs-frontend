document.addEventListener("DOMContentLoaded", () => {

  const questionsDiv = document.getElementById("questions");
  const finishBtn = document.getElementById("finishBtn");

  
  if (!questionsDiv) {
    console.error("questions div bulunamadı");
    return;
  }

  const questions = JSON.parse(
    localStorage.getItem("questions") || "[]"
  );

  if (!Array.isArray(questions) || questions.length === 0) {
    questionsDiv.innerHTML =
      "<p style='color:red;'>Soru bulunamadı. Lütfen testi yeniden başlatın.</p>";
    if (finishBtn) finishBtn.style.display = "none";
    return;
  }

  // Soruları yazdır
  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question-card";

    const options = q.choices.map(c => `
      <label>
        <input type="radio" name="q${i}" value="${c[0]}">
        ${c}
      </label>
    `).join("");

    div.innerHTML = `
      <p><b>${i + 1})</b> ${q.question}</p>
      <div class="options">${options}</div>
    `;

    questionsDiv.appendChild(div);
  });

  finishBtn.addEventListener("click", () => {
    alert("Sınav tamamlandı (sonuç sayfası bağlanabilir).");
  });

});
