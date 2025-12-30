document.addEventListener("DOMContentLoaded", () => {

  const generateBtn = document.getElementById("generateBtn");
  if (!generateBtn) return;

  let locked = false;

  generateBtn.addEventListener("click", async () => {
    if (locked) return;

    const lesson = document.getElementById("lesson").value;
    const topic = document.getElementById("topic").value;
    const difficultyInput =
      document.querySelector('input[name="difficulty"]:checked');
    const count = document.getElementById("count").value;

    // 🔥 ZORUNLU KONTROLLER (400’ü %100 bitirir)
    if (!lesson || !topic || !count) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (!difficultyInput) {
      alert("Lütfen zorluk seviyesi seçin.");
      return;
    }

    const difficulty = difficultyInput.value;

    locked = true;
    generateBtn.disabled = true;
    generateBtn.textContent = "Oluşturuluyor...";

    try {
      const res = await fetch(
        "https://lgssorubankasi.onrender.com/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson, topic, difficulty, count })
        }
      );

      if (res.status === 429) {
        alert("Çok fazla istek. Lütfen 1 dakika bekleyin.");
        reset();
        return;
      }

      const data = await res.json();

      if (!data.ok || !Array.isArray(data.questions) || data.questions.length === 0) {
        alert("Soru üretilemedi.");
        reset();
        return;
      }

      localStorage.setItem(
        "currentQuestions",
        JSON.stringify(data.questions)
      );

      window.location.href = "test.html";

    } catch (e) {
      alert("Sunucuya ulaşılamadı.");
      reset();
    }

    function reset() {
      locked = false;
      generateBtn.disabled = false;
      generateBtn.textContent = "Test Oluştur";
    }
  });
});
