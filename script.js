document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTLER
  // ===============================
  const generateBtn = document.getElementById("generateBtn");
  const lessonSelect = document.getElementById("lesson");
  const topicSelect  = document.getElementById("topic");

  if (!generateBtn || !lessonSelect || !topicSelect) return;

  // ===============================
  // DERS → KONU HARİTASI (TAM)
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
    ],
    "Tur": [
      "1. Ünite: Fiilimsiler",
      "2. Ünite: Cümlenin Öğeleri",
      "3. Ünite: Fiil Çatısı",
      "4. Ünite: Sözcükte Anlam",
      "5. Ünite: Cümlede Anlam",
      "6. Ünite: Cümle Çeşitleri",
      "7. Ünite: Yazım Kuralları",
      "8. Ünite: Paragraf",
      "9. Ünite: Noktalama İşaretleri",
      "10. Ünite: Anlatım Bozuklukları"
    ],
    "Sos": [
      "1. Ünite: Bir Kahraman Doğuyor",
      "2. Ünite: Milli Uyanış",
      "3. Ünite: Milli Bir Destan – Ya İstiklal Ya Ölüm",
      "4. Ünite: Atatürkçülük ve Çağdaş Türkiye",
      "5. Ünite: Demokratikleşme Çabaları",
      "6. Ünite: Atatürk Dönemi Dış Politika",
      "7. Ünite: Atatürk'ün Ölümü ve Sonrası"
    ],
    "Ing": [
      "1. Ünite: Friendship",
      "2. Ünite: Teen Life",
      "3. Ünite: In The Kitchen",
      "4. Ünite: On The Phone",
      "5. Ünite: The Internet",
      "6. Ünite: Adventures",
      "7. Ünite: Tourism",
      "8. Ünite: Chores",
      "9. Ünite: Science",
      "10. Ünite: Natural Forces"
    ],
    "Dkab": [
      "1. Ünite: Kader İnancı",
      "2. Ünite: Zekat ve Sadaka",
      "3. Ünite: Din ve Hayat",
      "4. Ünite: Hz. Muhammed'in Örnekliği",
      "5. Ünite: Kur'an-ı Kerim ve Özellikleri"
    ]
  };

  // ===============================
  // KONU DOLDURMA (KRİTİK)
  // ===============================
  function fillTopics(lesson) {
    topicSelect.innerHTML = "";
    (subjects[lesson] || []).forEach(topic => {
      const opt = document.createElement("option");
      opt.value = topic;
      opt.textContent = topic;
      topicSelect.appendChild(opt);
    });
  }

  // İlk yükleme
  fillTopics(lessonSelect.value);

  // Ders değişince konu güncelle
  lessonSelect.addEventListener("change", () => {
    fillTopics(lessonSelect.value);
  });

  // ===============================
  // TEST OLUŞTUR
  // ===============================
  let locked = false;

  generateBtn.addEventListener("click", async () => {
    if (locked) return;

    const difficultyInput =
      document.querySelector('input[name="difficulty"]:checked');

    const countEl = document.getElementById("count");

    if (!difficultyInput) {
      alert("Lütfen zorluk seviyesi seçin.");
      return;
    }

    if (!countEl) {
      alert("Soru sayısı bulunamadı.");
      return;
    }

    locked = true;
    generateBtn.disabled = true;
    generateBtn.textContent = "Oluşturuluyor...";

    const payload = {
      lesson: lessonSelect.value,
      topic: topicSelect.value,
      difficulty: difficultyInput.value,
      count: countEl.value
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

      if (res.status === 429) {
        alert("Çok fazla istek. Lütfen bekleyin.");
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
