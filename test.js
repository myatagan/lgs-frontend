document.addEventListener("DOMContentLoaded", () => {

  const questionsDiv = document.getElementById("questions");
  const finishBtn = document.getElementById("finishBtn");
  const backBtn = document.getElementById("backBtn");

  // -----------------------------
  // Soruları localStorage'dan al
  // -----------------------------
  const questions = JSON.parse(
    localStorage.getItem("currentQuestions") || "[]"
  );

  // Güvenlik: soru yoksa
  if (!Array.isArray(questions) || questions.length === 0) {
    questionsDiv.innerHTML = `
      <p style="color:red;">
        Soru bulunamadı. Lütfen testi yeniden başlatın.
      </p>
    `;
    finishBtn.style.display = "none";
    if (backBtn) backBtn.style.display = "inline-block";
    return;
  }

  // -----------------------------
  // Soruları + şıkları göster
  // -----------------------------
  questionsDiv.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ddd";
    card.style.padding = "12px";
    card.style.borderRadius = "10px";
    card.style.margin = "12px 0";

    const choicesHTML = (q.choices || []).map(choice => {
      const letter = String(choice).trim().charAt(0); // A/B/C/D
      return `
        <label style="display:block; margin:6px 0;">
          <input type="radio" name="q${index}" value="${letter}">
          ${choice}
        </label>
      `;
    }).join("");

    card.innerHTML = `
      <p><b>${index + 1})</b> ${q.question}</p>
      ${choicesHTML}
    `;

    questionsDiv.appendChild(card);
  });

  // -----------------------------
  // SINAVI BİTİR
  // -----------------------------
  finishBtn.addEventListener("click", () => {
    let correct = 0;
    const wrong = [];

    questions.forEach((q, i) => {
      const selected = document.querySelector(
        `input[name="q${i}"]:checked`
      );
      const userAnswer = selected ? selected.value : null;

      if (userAnswer === q.answer) {
        correct++;
      } else {
        wrong.push({
          question: q.question,
          choices: q.choices,
          answer: q.answer,          // ✅ doğru cevap
          explanation: q.explanation,
          user: userAnswer           // kullanıcının cevabı
        });
      }
    });

    // Sonuçları kaydet
    localStorage.setItem("result_correct", String(correct));
    localStorage.setItem("result_total", String(questions.length));
    localStorage.setItem("result_wrong", JSON.stringify(wrong));

    // Sonuç sayfasına git
    window.location.href = "results.html";
  });

  // -----------------------------
  // Geri dön
  // -----------------------------
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      localStorage.removeItem("currentQuestions");
      window.location.href = "index.html";
    });
  }
});
