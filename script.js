document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://lgssorubankasi.onrender.com";

  const isIndexPage = document.getElementById("generateBtn") !== null;
  const isTestPage  = document.getElementById("finishBtn") !== null;

  const subjects = {
    "Mat": [
      "1. Ünite: Çarpanlar ve Katlar",
      "1. Ünite: Üslü İfadeler",
      "2. Ünite: Kareköklü İfadeler",
      "2. Ünite: Veri Analizi",
      "3. Ünite: Basit Olayların Olma Olasılığı",
      "3. Ünite: Cebirsel İfadeler ve Özdeşlikler",
      "4. Ünite: Doğrusal Denklemler",
      "4. Ünite: Eşitsizlikler",
      "5. Ünite: Üçgenler",
      "5. Ünite: Eşlik ve Benzerlik",
      "6. Ünite: Dönüşümler Geometrisi",
      "6. Ünite: Geometrik Cisimler",
    ]
    // diğer dersler aynen kalabilir
  };

  // ================= INDEX =================
  if (isIndexPage) {

    const lessonSelect = document.getElementById("lesson");
    const topicSelect  = document.getElementById("topic");
    const generateBtn  = document.getElementById("generateBtn");

    localStorage.removeItem("currentQuestions");

    function fillTopics(lesson) {
      topicSelect.innerHTML = "";
      subjects[lesson].forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        topicSelect.appendChild(opt);
      });
    }

    fillTopics(lessonSelect.value);

    lessonSelect.addEventListener("change", () => {
      fillTopics(lessonSelect.value);
    });

    generateBtn.addEventListener("click", async () => {
      if (generateBtn.disabled) return;

      generateBtn.disabled = true;
      generateBtn.textContent = "Oluşturuluyor...";

      try {
        const lesson = lessonSelect.value;
        const topic = topicSelect.value;
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        const count = Number(document.getElementById("count").value);

        const res = await fetch(`${API_URL}/generate`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ lesson, topic, difficulty, count })
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Soru üretilemedi.");
        }

        if (!Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("Soru listesi boş geldi.");
        }

        localStorage.setItem(
          "currentQuestions",
          JSON.stringify(data.questions)
        );

        window.location.href = "test.html";

      } catch (err) {
        alert("Hata: " + err.message);
        generateBtn.disabled = false;
        generateBtn.textContent = "Test Oluştur";
      }
    });
  }

  // ================= TEST =================
  if (isTestPage) {

    const finishBtn = document.getElementById("finishBtn");
    const backBtn   = document.getElementById("backBtn");
    const questionsDiv = document.getElementById("questions");

    const questions = JSON.parse(
      localStorage.getItem("currentQuestions") || "[]"
    );

    if (!questions.length) {
      questionsDiv.innerHTML =
        "<p>Soru bulunamadı. Lütfen teste yeniden başlayın.</p>";
      if (finishBtn) finishBtn.style.display = "none";
      return;
    }

    questions.forEach((q, i) => {
      const div = document.createElement("div");

      const choices = q.choices.map(c => `
        <label>
          <input type="radio" name="q${i}" value="${c[0]}">
          ${c}
        </label>
      `).join("<br>");

      div.innerHTML = `
        <p><b>${i + 1})</b> ${q.question}</p>
        ${choices}
        <hr>
      `;

      questionsDiv.appendChild(div);
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        localStorage.removeItem("currentQuestions");
        window.location.href = "index.html";
      });
    }
  }

});
