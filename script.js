var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Configuration object for the application
const config = {
    // Define categories and their order
    categories: [
        'diet',
        'habit',
        'returns',
        'wc'
    ],
    // Define supported languages
    languages: [
        'english',
        'spanish',
        'cantonese (traditional)',
        'mandarin (simplified)',
        'filipino (tagalog)',
        'vietnamese',
        'russian'
    ]
};
// Import JSON data
let headers;
let phrases;
// Track selected language
let selectedLanguage = 'english';
// Function to populate dropdowns
function populateDropdown(category) {
    const select = document.getElementById(`select-${category}`);
    if (!select) {
        console.error(`Select element not found for category: ${category}`);
        return;
    }
    if (!phrases[category]) {
        console.error(`No phrases found for category: ${category}`);
        return;
    }
    console.log(`Populating dropdown for ${category}:`, phrases[category]);
    // Clear existing options
    select.innerHTML = '';
    // Add options for each phrase in the category
    phrases[category].forEach(phrase => {
        const option = document.createElement('option');
        option.value = phrase.id;
        option.textContent = phrase.english;
        select.appendChild(option);
    });
}
// Function to get a phrase by ID
function getPhrase(category, id) {
    var _a;
    return (_a = phrases[category]) === null || _a === void 0 ? void 0 : _a.find(p => p.id === id);
}
// Add intro text translations
const introText = {
    english: "You are admitted to the hospital for treatment and careful monitoring. You are now stable for discharge. Please carefully read the instructions and recommendations below.",
    spanish: "Ha sido admitido en el hospital para tratamiento y monitoreo cuidadoso. Ahora está estable para el alta. Por favor, lea cuidadosamente las instrucciones y recomendaciones a continuación.",
    "cantonese (traditional)": "你已經入院接受治療和仔細監察。你現在狀況穩定，可以出院了。請仔細閱讀以下的指示和建議。",
    "mandarin (simplified)": "您已被接收入院治疗并进行细心监护。现在您的状况稳定，可以出院了。请仔细阅读以下的说明和建议。",
    "filipino (tagalog)": "Ikaw ay na-admit sa ospital para sa paggamot at masusing pagmamanman. Ikaw ay ngayon ay stable na para sa discharge. Mangyaring basahin ng mabuti ang mga tagubilin at rekomendasyon sa ibaba.",
    vietnamese: "Bạn đã được nhập viện để điều trị và theo dõi cẩn thận. Bây giờ bạn đã ổn định để xuất viện. Vui lòng đọc kỹ các hướng dẫn và khuyến nghị dưới đây.",
    russian: "Вас приняли в больницу для лечения и тщательного наблюдения. Сейчас ваше состояние стабильно для выписки. Пожалуйста, внимательно прочитайте инструкции и рекомендации ниже."
};
// Function to update the text content
function updateTextContent() {
    const englishBox = document.getElementById('english-box');
    const translatedBox = document.getElementById('translated-box');
    const output = document.getElementById('output');
    if (!englishBox || !translatedBox || !headers || !phrases)
        return;
    let englishText = '';
    let translatedText = '';
    // Add intro text
    englishText += introText.english + '\n\n';
    translatedText += introText[selectedLanguage] + '\n\n';
    // Add content from each category
    config.categories.forEach(category => {
        const select = document.getElementById(`select-${category}`);
        if (!select || !select.value)
            return;
        const phrase = getPhrase(category, select.value);
        if (!phrase || !headers[category])
            return;
        // Add category header
        englishText += headers[category].english + '\n';
        translatedText += headers[category][selectedLanguage] + '\n';
        // Add phrase content
        englishText += phrase.english + '\n\n';
        translatedText += phrase[selectedLanguage] + '\n\n';
    });
    englishBox.textContent = englishText;
    translatedBox.textContent = translatedText;
}
// Function to render the UI
function render() {
    // Update text content
    updateTextContent();
}
// Function to initialize the UI
function initializeUI() {
    // Populate all dropdowns
    config.categories.forEach(category => {
        populateDropdown(category);
    });
}
// Function to copy text to clipboard
function copyToClipboard() {
    const output = document.getElementById('output');
    if (!output)
        return;
    output.select();
    document.execCommand('copy');
}
// Function to initialize medication dropdowns
function initializeMedDropdowns() {
    console.log('Starting initializeMedDropdowns');
    const frequencySelect = document.getElementById('med-frequency');
    const prnReasonSelect = document.getElementById('med-prn');
    console.log('Found elements:', {
        frequencySelect: frequencySelect ? 'yes' : 'no',
        prnReasonSelect: prnReasonSelect ? 'yes' : 'no',
    });
    if (!frequencySelect || !prnReasonSelect)
        return;
    console.log('medTranslations object:', medTranslations);
    console.log('Frequency keys:', Object.keys(medTranslations.frequencies));
    console.log('PRN reason keys:', Object.keys(medTranslations.prnReasons));
    // Populate frequency options
    Object.keys(medTranslations.frequencies).forEach(key => {
        const translations = medTranslations.frequencies[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = translations.english;
        frequencySelect.appendChild(option);
        console.log('Added frequency option:', key, translations.english);
    });
    // Populate PRN reason options
    Object.keys(medTranslations.prnReasons).forEach(key => {
        const translations = medTranslations.prnReasons[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = translations.english;
        prnReasonSelect.appendChild(option);
        console.log('Added PRN reason option:', key, translations.english);
    });
}

// Store medications
let medications = [];

// Function to add a medication
function addMedication() {
    const medicationInput = document.getElementById('med-name');
    const doseInput = document.getElementById('med-dose');
    const frequencySelect = document.getElementById('med-frequency');
    const prnReasonSelect = document.getElementById('med-prn');
    const englishBox = document.getElementById('english-box');
    const translatedBox = document.getElementById('translated-box');
    if (!medicationInput || !doseInput || !frequencySelect || !prnReasonSelect || !englishBox || !translatedBox) {
        console.error('Could not find all required elements:', {
            medicationInput: medicationInput ? 'found' : 'missing',
            doseInput: doseInput ? 'found' : 'missing',
            frequencySelect: frequencySelect ? 'found' : 'missing',
            prnReasonSelect: prnReasonSelect ? 'found' : 'missing',
            englishBox: englishBox ? 'found' : 'missing',
            translatedBox: translatedBox ? 'found' : 'missing'
        });
        return;
    }
    const medication = medicationInput.value.trim();
    const dose = doseInput.value.trim()
    const frequency = frequencySelect.value;
    const prnReason = prnReasonSelect.value;
    if (!medication) {
        console.error('No medication name provided');
        return;
    }
    if (!dose) {
        console.error('No dose provided');
        return;
    }
    if (!frequency) {
        console.error('No frequency selected');
        return;
    }

    if (medications.length == 0) {
        englishBox.textContent = (englishBox.textContent || '') + medTranslations.header.english + '\n';
        translatedBox.textContent = (translatedBox.textContent || '') + medTranslations.header[selectedLanguage] + '\n';
        medications.push({
            medication,
            dose,
            frequency
        });
    }

    // Get English text for English box
    const englishFrequencyText = medTranslations.frequencies[frequency].english;
    const englishPrnReasonText = prnReason ? medTranslations.prnReasons[prnReason].english : '';
    const englishText = `${medication} ${dose} - ${englishFrequencyText}${prnReason ? ` (${englishPrnReasonText})` : ''}`;
    // Get translated text for translated box
    const translatedFrequencyText = medTranslations.frequencies[frequency][selectedLanguage];
    const translatedPrnReasonText = prnReason ? medTranslations.prnReasons[prnReason][selectedLanguage] : '';
    const translatedText = `${medication} ${dose} - ${translatedFrequencyText}${prnReason ? ` (${translatedPrnReasonText})` : ''}`;
    // Add to both English and translated boxes
    englishBox.textContent = (englishBox.textContent || '') + englishText + '\n';
    translatedBox.textContent = (translatedBox.textContent || '') + translatedText + '\n';
    // Clear the input fields after adding
    medicationInput.value = '';
    frequencySelect.value = '';
    prnReasonSelect.value = '';
}
// Medication translations
const medTranslations = {
    header: {
        english: "Please start the medications below:",
        spanish: "Por favor, comience a tomar los siguientes medicamentos:",
        "cantonese (traditional)": "請開始服用以下藥物：",
        "mandarin (simplified)": "请开始服用以下药物：",
        "filipino (tagalog)": "Pakisimulan ang mga gamot sa ibaba:",
        vietnamese: "Hãy bắt đầu dùng các thuốc dưới đây:",
        russian: "Пожалуйста, начните принимать следующие лекарства:"
    },
    frequencies: {
        "once_morning": {
            english: "Once in the morning",
            spanish: "Una vez por la mañana",
            "cantonese (traditional)": "每日早上一次",
            "mandarin (simplified)": "每日早晨一次",
            "filipino (tagalog)": "Isang beses tuwing umaga",
            vietnamese: "Uống một lần vào buổi sáng",
            russian: "Один раз утром"
        },
        "once_afternoon": {
            english: "Once in the afternoon",
            spanish: "Una vez por la tarde",
            "cantonese (traditional)": "每日下午一次",
            "mandarin (simplified)": "每日下午一次",
            "filipino (tagalog)": "Isang beses tuwing hapon",
            vietnamese: "Uống một lần vào buổi chiều",
            russian: "Один раз днём"
        },
        "twice_daily": {
            english: "Twice a day",
            spanish: "Dos veces al día",
            "cantonese (traditional)": "每日兩次",
            "mandarin (simplified)": "每日两次",
            "filipino (tagalog)": "Dalawang beses sa isang araw",
            vietnamese: "Uống hai lần mỗi ngày",
            russian: "Два раза в день"
        },
        "three_times_daily": {
            english: "Three times a day",
            spanish: "Tres veces al día",
            "cantonese (traditional)": "每日三次",
            "mandarin (simplified)": "每日三次",
            "filipino (tagalog)": "Tatlong beses sa isang araw",
            vietnamese: "Uống ba lần mỗi ngày",
            russian: "Три раза в день"
        },
        "four_times_daily": {
            english: "Four times a day",
            spanish: "Cuatro veces al día",
            "cantonese (traditional)": "每日四次",
            "mandarin (simplified)": "每日四次",
            "filipino (tagalog)": "Apat na beses sa isang araw",
            vietnamese: "Uống bốn lần mỗi ngày",
            russian: "Четыре раза в день"
        },
        "bedtime": {
            english: "Before bedtime",
            spanish: "Antes de acostarse",
            "cantonese (traditional)": "睡前服一次",
            "mandarin (simplified)": "睡前服一次",
            "filipino (tagalog)": "Isang beses bago matulog",
            vietnamese: "Uống một lần trước khi ngủ",
            russian: "Один раз перед сном"
        },
        "weekly": {
            english: "Once weekly",
            spanish: "Una vez a la semana",
            "cantonese (traditional)": "每週一次",
            "mandarin (simplified)": "每周一次",
            "filipino (tagalog)": "Isang beses sa isang linggo",
            vietnamese: "Uống một lần mỗi tuần",
            russian: "Раз в неделю"
        },
        "alternate_days": {
            english: "Every other day",
            spanish: "Un día sí, un día no",
            "cantonese (traditional)": "隔日一次",
            "mandarin (simplified)": "隔日一次",
            "filipino (tagalog)": "Isang beses kada dalawang araw",
            vietnamese: "Uống cách ngày",
            russian: "Через день"
        }
    },
    prnReasons: {
        "pain": {
            english: "As needed for pain",
            spanish: "Según necesidad para el dolor",
            "cantonese (traditional)": "如有痛才服",
            "mandarin (simplified)": "按需要用于疼痛",
            "filipino (tagalog)": "Kung kinakailangan para sa pananakit",
            vietnamese: "Dùng khi cần giảm đau",
            russian: "По мере необходимости при боли"
        },
        "anxiety": {
            english: "As needed for anxiety",
            spanish: "Según necesidad para la ansiedad",
            "cantonese (traditional)": "如有焦慮才服",
            "mandarin (simplified)": "按需要用于焦虑",
            "filipino (tagalog)": "Kung kinakailangan para sa pagkabalisa",
            vietnamese: "Dùng khi cần cho lo âu",
            russian: "По мере необходимости при тревоге"
        },
        "chest_pain": {
            english: "As needed for chest pain",
            spanish: "Según necesidad para el dolor de pecho",
            "cantonese (traditional)": "如有胸痛才服",
            "mandarin (simplified)": "按需要用于胸痛",
            "filipino (tagalog)": "Kung kinakailangan para sa sakit sa dibdib",
            vietnamese: "Dùng khi cần cho đau ngực",
            russian: "По мере необходимости при боли в груди"
        },
        "shortness_of_breath": {
            english: "As needed for shortness of breath",
            spanish: "Según necesidad para la falta de aire",
            "cantonese (traditional)": "如氣促才服",
            "mandarin (simplified)": "按需要用于呼吸急促",
            "filipino (tagalog)": "Kung kinakailangan para sa hirap sa paghinga",
            vietnamese: "Dùng khi cần cho khó thở",
            russian: "По мере необходимости при одышке"
        },
        "nausea": {
            english: "As needed for nausea / vomiting",
            spanish: "Según necesidad para náuseas/vómitos",
            "cantonese (traditional)": "如噁心/嘔吐才服",
            "mandarin (simplified)": "按需要用于恶心/呕吐",
            "filipino (tagalog)": "Kung kinakailangan para sa pagduduwal/pagsusuka",
            vietnamese: "Dùng khi cần cho buồn nôn/nôn",
            russian: "По мере необходимости при тошноте/рвоте"
        }
    }
};
// Initialize language selector
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect)
        return;
    // Clear existing options
    languageSelect.innerHTML = '';
    // Add options for each language except English
    config.languages.forEach(lang => {
        if (lang !== 'english') {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
            languageSelect.appendChild(option);
        }
    });
    // Set initial selected language to Spanish (first non-English language)
    selectedLanguage = config.languages[1];
    languageSelect.value = selectedLanguage;
    // Add change event listener
    languageSelect.addEventListener('change', () => {
        selectedLanguage = languageSelect.value;
        render();
    });
}
// Add event listeners to all dropdowns
function addDropdownListeners() {
    config.categories.forEach(category => {
        const select = document.getElementById(`select-${category}`);
        if (select) {
            select.addEventListener('change', updateTextContent);
        }
    });
}
// Load JSON data
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting loadData');
            console.log('Attempting to fetch JSON files...');
            const [headersResponse, phrasesResponse] = yield Promise.all([
                fetch('headers.json'),
                fetch('phrases.json')
            ]);
            console.log('Headers response status:', headersResponse.status);
            console.log('Phrases response status:', phrasesResponse.status);
            if (!headersResponse.ok) {
                throw new Error(`Failed to load headers.json: ${headersResponse.status} ${headersResponse.statusText}`);
            }
            if (!phrasesResponse.ok) {
                throw new Error(`Failed to load phrases.json: ${phrasesResponse.status} ${phrasesResponse.statusText}`);
            }
            headers = yield headersResponse.json();
            phrases = yield phrasesResponse.json();
            console.log('Headers loaded:', headers);
            console.log('Phrases loaded:', phrases);
            // Initialize the UI after data is loaded
            console.log('Initializing UI components');
            initializeLanguageSelector();
            addDropdownListeners();
            initializeUI(); // Populate dropdowns
            console.log('About to initialize medication dropdowns');
            initializeMedDropdowns(); // Initialize medication dropdowns
            console.log('Finished initializing medication dropdowns');
            render(); // Initial text content update
        }
        catch (error) {
            console.error('Error loading data:', error);
            // Show error message to user
            const englishBox = document.getElementById('english-box');
            if (englishBox) {
                englishBox.textContent = 'Error loading data: ' + error.message;
            }
        }
    });
}
// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
