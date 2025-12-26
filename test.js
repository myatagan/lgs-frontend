const testArea = document.getElementById("test-area");
const finishBtn = document.getElementById("finishBtn");

// Soruları al
const questions = JSON.parse(localStorage.getItem("questionsData"));

if (!questions || questions.length === 0) {
  testArea.innerHTML = "<p>Soru bulunamadı. Lütfen testi yeniden başlat.</p>";
  finishBtn.style.display = "none";
} else {
  renderQuestions();
}

function renderQuestions() {
  questions.forEach((q, index) => {
    const div = document.createElement("div");

    const choicesHTML = q.choices.map(choice => {
      const letter = choice[0];
      return `
        <label>
          <input type="radio" name="q${index}" value="${letter}">
          ${choice}
        </label><br>
      `;
    }).join("");

    div.innerHTML = `
      <h3>${index + 1}) ${q.question}</h3>
      ${choicesHTML}
      <hr>
    `;

    testArea.appendChild(div);
  });
}

// SINAVI BİTİR
finishBtn.addEventListener("click", () => {
  let correct = 0;
  let wrongList = [];

  questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const userAnswer = selected ? selected.value : null;

    if (userAnswer === q.answer) {
      correct++;
    } else {
      wrongList.push({
        index: index + 1,
        question: q.question,
        user: userAnswer,
        correct: q.answer,
        explanation: q.explanation
      });
    }
  });

  localStorage.setItem("result_correct", correct);
  localStorage.setItem("result_total", questions.length);
  localStorage.setItem("result_wrong", JSON.stringify(wrongList));

  window.location.href = "result.html"; // ⚠️ DİKKAT
});
