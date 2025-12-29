document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // SAYFA TESPİTİ
  // ===============================
  const generateBtn = document.getElementById("generateBtn");
  const finishBtn   = document.getElementById("finishBtn");

  const isIndexPage = !!generateBtn;
  const isTestPage  = !!finishBtn;

  // ===============================
  // DERS → KONU HARİTASI (GEREKLİ)
  // ===============================
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
      "6. Ünite: Geometrik Cisimler"
    ],
    "Fen": [
      "1. Ünite: Mevsimler ve İklim",
      "2. Ünite: DNA ve Genetik Kod",
      "3. Ünite: Basınç",
      "4. Ünite: Madde ve Endüstri",
      "5. Ünite: Basit Makineler",
      "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi",
      "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi"
    ]
  };

  // ===============================
  // INDEX SAYFASI
  // ===============================
  if (isIndexPage) {

    const lessonSelect = document.getElementById("lesson");
    const topicSelect  = document.getElementById("topic");

    function fillTopics(lesson) {
      topicSelect.innerHTML = "";
      (subjects[lesson] || []).forEach(topic => {
        const opt = document.createElement("option");
        opt.value = topic;
        opt.textContent = topic;
        topicSelect.appendChild(opt);
      });
    }

    fillTopics(lessonSelect.value);
    lessonSelect.addEventListener("change", () => {
      fillTopics(lessonSelect.value);
    });

    let isGenerating = false;

    generateBtn.addEventListener("click", async () => {
      if (isGenerating) return;

      const difficultyInput = document.querySelector(
        'input[name="difficulty"]:checked'
      );

      if (!difficultyInput) {
        alert("Lütfen zorluk seviyesi seçin.");
        return;
      }

      isGenerating = true;
      generateBtn.disabled = true;
      generateBtn.textContent = "Oluşturuluyor...";

      const payload = {
        lesson: lessonSelect.value,
        topic: topicSelect.value,
        difficulty: difficultyInput.value,
        count: document.getElementById("count").value
      };

      try {
        const res = await fetch(
          "https://lgssorubankasi.onrender.com/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );

        const data = await res.json();

        if (!data.ok || !Array.isArray(data.questions) || data.questions.length === 0) {
          alert("Soru üretilemedi. Lütfen tekrar deneyin.");
          isGenerating = false;
          generateBtn.disabled = false;
          generateBtn.textContent = "Test Oluştur";
          return;
        }

        // 🔥 TEK DOĞRU KAYIT
        localStorage.setItem(
          "currentQuestions",
          JSON.stringify(data.questions)
        );

        window.location.href = "test.html";

      } catch (e) {
        alert("Sunucuya ulaşılamadı.");
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.textContent = "Test Oluştur";
      }
    });
  }

  // ===============================
  // TEST SAYFASI
  // ===============================
  if (isTestPage) {

    const questionsDiv = document.getElementById("questions");
    const resultsDiv   = document.getElementById("results");
    const backBtn      = document.getElementById("backBtn");

    const questions = JSON.parse(
      localStorage.getItem("currentQuestions") || "[]"
    );

    if (!Array.isArray(questions) || questions.length === 0) {
      questionsDiv.innerHTML = `
        <p style="color:red;">
          Soru bulunamadı. Lütfen testi yeniden başlatın.
        </p>
      `;
      finishBtn.style.display = "none";
      return;
    }

    questions.forEach((q, i) => {
      const div = document.createElement("div");
      div.innerHTML = `<p><b>${i + 1})</b> ${q.question}</p>`;
      questionsDiv.appendChild(div);
    });

    finishBtn.addEventListener("click", () => {
      resultsDiv.innerHTML = "<p>Sonuç ekranı burada olacak.</p>";
      if (backBtn) backBtn.style.display = "block";
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        localStorage.removeItem("currentQuestions");
        window.location.href = "index.html";
      });
    }
  }
});
