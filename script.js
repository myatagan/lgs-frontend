document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // SAYFA TESPİTİ
  // ===============================
  const generateBtn = document.getElementById("generateBtn");
  const finishBtn   = document.getElementById("finishBtn");

  const isIndexPage = !!generateBtn;
  const isTestPage  = !!finishBtn;

  // ===============================
  // DERS → KONU
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

    let isGenerating = false; // çift tıklama kilidi

    function fillTopics(lesson) {
      topicSelect.innerHTML = "";
      (subjects[lesson] || []).forEach(t => {
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
      if (isGenerating) return;
      isGenerating = true;

      generateBtn.disabled = true;
      generateBtn.textContent = "Oluşturuluyor...";

      const lesson = lessonSelect.value;
      const topic = topicSelect.value;
      const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
      const count = document.getElementById("count").value;

      try {
        const res = await fetch("https://lgssorubankasi.onrender.com/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson, topic, difficulty, count })
        });

        const data = await res.json();

        // 🔥 ALTIN KONTROL – BOŞ TEST ASLA AÇILMAZ
        if (
          !data.ok ||
          !Array.isArray(data.questions) ||
          data.questions.length === 0
        ) {
          alert("Soru üretilemedi. Lütfen birkaç saniye sonra tekrar deneyin.");
          generateBtn.disabled = false;
          generateBtn.textContent = "Test Oluştur";
          isGenerating = false;
          return;
        }

        // SADECE BURADA KAYDEDİLİR
        localStorage.setItem(
          "currentQuestions",
          JSON.stringify(data.questions)
        );

        window.location.href = "test.html";

      } catch (err) {
        alert("Sunucuya ulaşılamadı. Lütfen tekrar deneyin.");
        generateBtn.disabled = false;
        generateBtn.textContent = "Test Oluştur";
        isGenerating = false;
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

    // 🔥 BOŞSA NET DAVRANIŞ
    if (!Array.isArray(questions) || questions.length === 0) {
      questionsDiv.innerHTML = `
        <p style="color:red;">
          Soru bulunamadı. Lütfen testi yeniden başlatın.
        </p>
      `;
      finishBtn.style.display = "none";
      return;
    }

    // Soruları göster
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
