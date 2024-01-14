const lang = {
 "ru": {
   "title": "Калькулятор навыков",
   "char-level-label": "Введите уровень персонажа:",
   "skill-name-label": "Выберите навык из списка:",
   "skill-level-label": "Введите уровень навыка:",
   "add-button": "Добавить",
   "added-skills-label": "Добавленные навыки:",
   "calculate-button": "Рассчитать",
   "char-level-result-label": "Уровень персонажа:",
   "skill-name-header": "Название навыка",
   "skill-level-header": "Уровень навыка",
   "skill-name-result-header": "Название навыка",
   "skill-max-level-result-header": "Максимальный уровень навыка",
   "silver-result-header": "Количество серебра",
   "camp-points-result-header": "Количество лагерных очков",
   "alert-message": 'Пожалуйста, введите корректные значения',
   "total-label": "<strong>Итого</strong>"
 },
 "en": {
   "title": "Undawn Calculator",
   "char-level-label": "Character level:",
   "skill-name-label": "Select a skill from the list:",
   "skill-level-label": "Skill level:",
   "add-button": "Add",
   "added-skills-label": "Added skills:",
   "calculate-button": "Calculate",
   "char-level-result-label": "Character level:",
   "skill-name-header": "Name",
   "skill-level-header": "Skill level",
   "skill-name-result-header": "Name",
   "skill-max-level-result-header": "Max skill level",
   "silver-result-header": "Silver",
   "camp-points-result-header": "Camp Points",
   "alert-message": 'Please enter valid values',
   "total-label": "<strong>Total</strong>"
 }
 };

document.addEventListener("DOMContentLoaded", () => {
    const ruButton = document.getElementById("ru-button");
    const enButton = document.getElementById("en-button");

    ruButton.addEventListener("click", () => {
        changeLanguage("ru");
    });

    enButton.addEventListener("click", () => {
        changeLanguage("en");
    });

    const selectedLanguage = localStorage.getItem("selectedLanguage") || 'ru';
    changeLanguage(selectedLanguage);
});

function changeLanguage(languageCode) {
    const elements = document.querySelectorAll("[data-lang]");
    elements.forEach((element) => {
        const key = element.dataset.lang;
        if (lang[languageCode] && lang[languageCode][key]) {
            element.textContent = lang[languageCode][key];
        }
    });

    localStorage.setItem("selectedLanguage", languageCode);
}