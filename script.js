const subjects = {
  Mat: ["Çarpanlar ve Katlar", "Üslü İfadeler"],
  Fen: ["Mevsimler ve İklim", "DNA ve Genetik Kod"]
};

document.addEventListener("DOMContentLoaded", () => {
  const lesson = document.getElementById("lesson");
  const topic = document.getElementById("topic");
  const btn = document.getElementById("generateBtn");

  function fillTopics() {
    topic.innerHTML = "";
    subjects[lesson.value].forEach(t => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      topic.appendChild(o);
    });
  }

  fillTopics();
  lesson.addEventListener("change", fillTopics);

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Oluşturuluyor...";

    const difficulty =
      document.querySelector('input[name="difficulty"]:checked')?.value;

    if (!difficulty) {
      alert("Zorluk seçiniz");
      reset();
      return;
    }

    try {
      const res = await fetch(
        "https://lgssorubankasi.onrender.com/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lesson: lesson.value,
            topic: topic.value,
            difficulty,
            count: document.getElementById("count").value
          })
        }
      );

      const data = await res.json();

      // 🔒 FRONTEND GÜVENLİK KALKANI
      if (
        !data ||
        !data.ok ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        alert("Soru üretilemedi. Lütfen tekrar deneyin.");
        reset();
        return;
      }

      localStorage.setItem("questions", JSON.stringify(data.questions));
      window.location.href = "test.html";

    } catch (e) {
      alert("Sunucuya ulaşılamadı");
      reset();
    }

    function reset() {
      btn.disabled = false;
      btn.textContent = "Test Oluştur";
    }
  });
});
