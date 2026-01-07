document.addEventListener("DOMContentLoaded", () => {

  const questionsDiv = document.getElementById("questions");
  const finishBtn = document.getElementById("finishBtn");

  const questions = JSON.parse(
    localStorage.getItem("questions") || "[]"
  );

  if (!Array.isArray(questions) || questions.length === 0) {
    questionsDiv.innerHTML =
      "<p style='color:red;'>Soru bulunamadı. Lütfen testi yeniden başlatın.</p>";
    finishBtn.style.display = "none";
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

  // SINAVI BİTİR
  finishBtn.addEventListener("click", () => {
    let correct = 0;
    let wrong = [];

    questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      const userAnswer = selected ? selected.value : null;

      if (userAnswer === q.answer) {
        correct++;
      } else {
        wrong.push({
          index: i + 1,
          question: q.question,
          userAnswer,
          correctAnswer: q.answer,
          explanation: q.explanation
        });
      }
    });

    // Sonuçları sakla
    localStorage.setItem("result_correct", correct);
    localStorage.setItem("result_total", questions.length);
    localStorage.setItem("result_wrong", JSON.stringify(wrong));

    // Sonuç sayfasına git
    window.location.href = "results.html";
  });

});
