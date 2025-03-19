const data = {
    "languages": ["English", "Spanish", "Cantonese (Traditional)", "Mandarin (Simplified)", "Filipino (Tagalog)", "Vietnamese", "Russian"],
    "diet": {
        "English": "There are no specific dietary restrictions. Please continue to eat a healthy and balanced diet.",
        "Spanish": "No hay restricciones dietéticas específicas. Continúe con una alimentación sana y equilibrada.",
        "Cantonese (Traditional)": "沒有特定的飲食限制。請繼續保持健康均衡的飲食。",
        "Mandarin (Simplified)": "没有特定的饮食限制。请继续保持健康均衡的饮食。",
        "Filipino (Tagalog)": "Walang partikular na paghihigpit sa pagkain. Ipagpatuloy ang malusog at balanseng diyeta.",
        "Vietnamese": "Không có hạn chế chế độ ăn cụ thể. Vui lòng tiếp tục ăn uống lành mạnh và cân bằng.",
        "Russian": "Нет особых диетических ограничений. Пожалуйста, продолжайте придерживаться здорового и сбалансированного питания."
    }
};
// Ensure DOM elements exist
document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("language-select");
    const translationText = document.getElementById("translation");
    if (!languageSelect || !translationText) {
        console.error("Missing necessary DOM elements.");
        return;
    }
    // Populate dropdown with language options
    data.languages.forEach(lang => {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = lang;
        languageSelect.appendChild(option);
    });
    // Default translation (English)
    translationText.textContent = data.diet["English"];
    // Update translation on dropdown selection
    languageSelect.addEventListener("change", () => {
        const selectedLanguage = languageSelect.value;
        translationText.textContent = data.diet[selectedLanguage] || "Translation not available.";
    });
});
