const questionsDiv = document.getElementById("questions");
const resultsDiv = document.getElementById("results");
const finishBtn = document.getElementById("finishBtn");

// LocalStorage’dan soruları al
const currentQuestions = JSON.parse(localStorage.getItem("currentQuestions")) || [];

// Sorular yoksa uyarı göster
if (currentQuestions.length === 0) {
  questionsDiv.innerHTML = "<p style='color:red;'>Soru bulunamadı. Lütfen yeniden test oluşturun.</p>";
} else {
  finishBtn.style.display = "inline-block";
}




// Soruları QUIZ formatında yazdır
currentQuestions.forEach((q, index) => {
  const div = document.createElement("div");
  div.className = "quiz-item";

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
    <p><b>${index + 1})</b> ${q.question}</p>
    ${choicesHTML}
    <hr>
  `;

  questionsDiv.appendChild(div);
});

// SINAVI BİTİR
finishBtn.addEventListener("click", () => {
  let correct = 0;
  let wrongList = [];

  currentQuestions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const userAns = selected ? selected.value : null;

    if (userAns === q.answer) {
      correct++;
    } else {
      wrongList.push({
        index: index + 1,
        question: q.question,
        user: userAns,
        correct: q.answer,
        explanation: q.explanation
      });
    }
  });
  backBtn.style.display = "block";

  let html = `<p><b>Doğru Sayısı:</b> ${correct} / ${currentQuestions.length}</p>`;

  wrongList.forEach(w => {
    html += `
      <div class="wrong">
        <p><b>${w.index})</b> ${w.question}</p>
        <p>Senin cevabın: <b>${w.user ?? "-"}</b></p>
        <p>Doğru cevap: <b>${w.correct}</b></p>
        <p>Çözüm:</p>
        <p>${w.explanation}</p>
      </div><hr>
    `;
  });

  resultsDiv.innerHTML = html;
});
