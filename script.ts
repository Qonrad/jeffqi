// Configuration object for the application
const config = {
    // Define categories and their order
    categories: [
        'diet',
        'habit',
        'returns',
        'wc'
    ] as const,
    
    // Define supported languages
    languages: [
        'english',
        'spanish',
        'cantonese (traditional)',
        'mandarin (simplified)',
        'filipino (tagalog)',
        'vietnamese',
        'russian'
    ] as const
} as const;

// Derive types from config
type Category = typeof config.categories[number];
type Language = typeof config.languages[number];

// Create a type for translated text
type TranslatedText = { [key in Language]: string };

// Create the headers interface using the config categories
type TranslatedHeaders = {
    [K in Category]: TranslatedText;
};

// Import JSON data
let headers: TranslatedHeaders;
let phrases: { [key: string]: Array<{ id: string } & TranslatedText> };

// Track selected language
let selectedLanguage: Language = 'english';

// Function to populate dropdowns
function populateDropdown(category: string) {
    const select = document.getElementById(`select-${category}`) as HTMLSelectElement;
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
function getPhrase(category: string, id: string) {
    return phrases[category]?.find(p => p.id === id);
}

// Function to update the text content
function updateTextContent() {
    const englishBox = document.getElementById('english-box') as HTMLPreElement;
    const translatedBox = document.getElementById('translated-box') as HTMLPreElement;
    const output = document.getElementById('output') as HTMLTextAreaElement;
    
    if (!englishBox || !translatedBox || !headers || !phrases) return;

    let englishText = '';
    let translatedText = '';

    // Add header for medications if any exist
    if (output?.value) {
        englishText += medTranslations.header.english + '\n';
        translatedText += medTranslations.header[selectedLanguage] + '\n';
        englishText += output.value + '\n\n';
        translatedText += output.value + '\n\n';
    }

    // Add content from each category
    config.categories.forEach(category => {
        const select = document.getElementById(`select-${category}`) as HTMLSelectElement;
        if (!select || !select.value) return;

        const phrase = getPhrase(category, select.value);
        if (!phrase || !headers[category]) return;

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
    const output = document.getElementById('output') as HTMLTextAreaElement;
    if (!output) return;

    output.select();
    document.execCommand('copy');
}

// Function to initialize medication dropdowns
function initializeMedDropdowns() {
    const frequencySelect = document.getElementById('frequency-select') as HTMLSelectElement;
    const prnReasonSelect = document.getElementById('prn-reason-select') as HTMLSelectElement;
    
    if (!frequencySelect || !prnReasonSelect) return;

    // Populate frequency options
    Object.keys(medTranslations.frequencies).forEach(key => {
        const translations = medTranslations.frequencies[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = translations.english;
        frequencySelect.appendChild(option);
    });

    // Populate PRN reason options
    Object.keys(medTranslations.prnReasons).forEach(key => {
        const translations = medTranslations.prnReasons[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = translations.english;
        prnReasonSelect.appendChild(option);
    });
}

// Function to add a medication
function addMedication() {
    const medicationInput = document.getElementById('medication-input') as HTMLInputElement;
    const frequencySelect = document.getElementById('frequency-select') as HTMLSelectElement;
    const prnReasonSelect = document.getElementById('prn-reason-select') as HTMLSelectElement;
    const output = document.getElementById('output') as HTMLTextAreaElement;
    
    if (!medicationInput || !frequencySelect || !prnReasonSelect || !output) return;

    const medication = medicationInput.value.trim();
    const frequency = frequencySelect.value;
    const prnReason = prnReasonSelect.value;

    if (!medication) return;

    const frequencyText = medTranslations.frequencies[frequency][selectedLanguage];
    const prnReasonText = medTranslations.prnReasons[prnReason][selectedLanguage];

    const text = `${medication} - ${frequencyText}${prnReason ? ` (${prnReasonText})` : ''}`;
    output.value += text + '\n';
}

// Interface for medication translations
interface MedTranslations {
    frequencies: {
        [key: string]: TranslatedText;
    };
    prnReasons: {
        [key: string]: TranslatedText;
    };
    header: TranslatedText;
}

// Medication translations
const medTranslations: MedTranslations = {
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
    const languageSelect = document.getElementById('language-select') as HTMLSelectElement;
    if (!languageSelect) return;

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
    selectedLanguage = config.languages[1] as Language;
    languageSelect.value = selectedLanguage;

    // Add change event listener
    languageSelect.addEventListener('change', () => {
        selectedLanguage = languageSelect.value as Language;
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
async function loadData() {
    try {
        const [headersResponse, phrasesResponse] = await Promise.all([
            fetch('headers.json'),
            fetch('phrases.json')
        ]);
        
        if (!headersResponse.ok || !phrasesResponse.ok) {
            throw new Error('Failed to load JSON data');
        }
        
        headers = await headersResponse.json();
        phrases = await phrasesResponse.json();
        
        console.log('Headers loaded:', headers);
        console.log('Phrases loaded:', phrases);
        
        // Initialize the UI after data is loaded
        initializeLanguageSelector();
        addDropdownListeners();
        initializeUI();  // Populate dropdowns
        render();        // Initial text content update
    } catch (error) {
        console.error('Error loading data:', error);
        // Show error message to user
        const englishBox = document.getElementById('english-box');
        if (englishBox) {
            englishBox.textContent = 'Error loading data. Please make sure you are running this on a local server.';
        }
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();
}); 