 async function readData(language) {
   return new Promise(function(resolve, reject) {
     const xhr = new XMLHttpRequest();
     let dataFile;
     const selectedLanguage = language || localStorage.getItem("selectedLanguage") || 'ru';
     if (selectedLanguage === 'ru') {
       dataFile = 'data_ru.csv';
     } else {
       dataFile = 'data_en.csv';
     }
     xhr.open("GET", dataFile, true);
     xhr.onload = function() {
       if (xhr.status === 200) {
         const data = xhr.responseText;
         const lines = data.split("\n");
         const skills = [];
         for (let i = 0; i < lines.length; i++) {
           const values = lines[i].split(",");
           if (values.length === 5) {
             const skill = {
               name: values[0],
               level: parseInt(values[1]),
               campPoints: parseInt(values[2]),
               silver: parseInt(values[3]),
               characterLevel: parseInt(values[4])
             };
             skills.push(skill);
           }
         }
         skills.sort(function(a, b) {
           return a.characterLevel - b.characterLevel;
         });
         resolve(skills);
       } else {
         reject("Failed to fetch data");
       }
     };
    
     xhr.send();
   });
 }
 async function fillSkillList(language) {
  try {
    const skills = await readData(language);
    const skillList = document.getElementById("skill-name");
    const skillNames = {};
    for (let i = 0; i < skills.length; i++) {
      const name = skills[i].name;
      if (!skillNames[name]) {
        skillNames[name] = true;
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        skillList.appendChild(option);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

           function addSkill(skills) {
   const characterLevelInput = document.getElementById("character-level");
   const skillNameInput = document.getElementById("skill-name");
   const skillLevelInput = document.getElementById("skill-level");
   const characterLevel = characterLevelInput.value;
   const skillName = skillNameInput.value;
   const skillLevel = skillLevelInput.value;
   if (characterLevel && skillName && skillLevel && characterLevel >= 1 && characterLevel <= 119 && skillLevel >= 1 && skillLevel <= 99) {
     const table = document.getElementById("added-skills");
     let exists = false;
     for (let i = 1; i < table.rows.length; i++) {
       const cells = table.rows[i].cells;
       if (cells[0].innerHTML === skillName) {
         exists = true;
         const previousLevel = parseInt(cells[1].innerHTML);
         cells[1].innerHTML = skillLevel;
         break;
       }
     }
     if (!exists) {
       const row = table.insertRow();
       const cell1 = row.insertCell();
       const cell2 = row.insertCell();
       cell1.innerHTML = skillName;
       cell2.innerHTML = skillLevel;
     }
   } else {
     const languageCode = 'en'; // Set language code according to the current selection
     alert(lang[languageCode]["alert-message"]);
   }
 }
 function updateTotals(skills) {
   let totalSilver = 0;
   let totalCampPoints = 0;
   const characterLevel = parseInt(document.getElementById("character-level").value);
   const table = document.getElementById("added-skills");
   for (let i = 1; i < table.rows.length; i++) {
     const cells = table.rows[i].cells;
     const skillName = cells[0].innerHTML;
     const skillLevel = parseInt(cells[1].innerHTML);
     const selectedSkill = skills.find(skill => skill.name === skillName && skill.level === skillLevel);
     if (selectedSkill && skillLevel <= characterLevel) {
       totalSilver += selectedSkill.silver;
       totalCampPoints += selectedSkill.campPoints;
     }
   }
   document.getElementById("silver-result").innerHTML = totalSilver;
   document.getElementById("camp-points-result").innerHTML = totalCampPoints;
 }
           
           function calculateBetweenLevels(startLevel, endLevel, characterLevel, skillName, skills) {
 let totalSilver = 0;
 let totalCampPoints = 0;
 const selectedSkill = skills.find(skill => skill.name === skillName && skill.level === startLevel);
 if (selectedSkill && startLevel <= endLevel) {
   for (let i = startLevel; i <= endLevel; i++) {
     const currentSkillData = skills.find(skill => skill.name === skillName && skill.level === i);
     if (currentSkillData && currentSkillData.level <= characterLevel) {
       totalSilver += currentSkillData.silver;
       totalCampPoints += currentSkillData.campPoints;
     } else {
       break;
     }
   }
 }
 return {
   silver: totalSilver,
   campPoints: totalCampPoints
 };
 }
async function calculateResult(skills) {
 if (!skills) {
   skills = await readData();
 }
 const addedSkillsTable = document.getElementById("added-skills");
 const resultTable = document.getElementById("result");
 const characterLevel = parseInt(document.getElementById("character-level").value);
 while (resultTable.rows.length > 1) {
   resultTable.deleteRow(1);
 }
 document.getElementById("char-level-result").textContent = characterLevel;
 let totalSilver = 0;
 let totalCampPoints = 0;
 for (let i = 1; i < addedSkillsTable.rows.length; i++) {
   const skillName = addedSkillsTable.rows[i].cells[0].innerHTML;
   const skillLevel = parseInt(addedSkillsTable.rows[i].cells[1].innerHTML);
   const characterLevelInput = document.getElementById("character-level");
   const desiredCharacterLevel = parseInt(characterLevelInput.value);
   let maxSkillLevelForCharacter = 0;
   for (let j = 0; j < skills.length; j++) {
     const skill = skills[j];
     if (skill.characterLevel <= desiredCharacterLevel && skill.name === skillName) {
       maxSkillLevelForCharacter = Math.max(maxSkillLevelForCharacter, skill.level);
     }
   }
   const result = calculateBetweenLevels(skillLevel + 1, maxSkillLevelForCharacter, characterLevel, skillName, skills);
   const newRow = resultTable.insertRow(-1);
   const cellSkillName = newRow.insertCell(0);
   const cellMaxSkillLevel = newRow.insertCell(1);
   const cellSilver = newRow.insertCell(2);
   const cellCampPoints = newRow.insertCell(3);
   cellSkillName.textContent = skillName;
   cellMaxSkillLevel.textContent = maxSkillLevelForCharacter;
   cellSilver.textContent = result.silver;
   cellCampPoints.textContent = result.campPoints;
   totalSilver += result.silver;
   totalCampPoints += result.campPoints;
 }
 const totalRow = resultTable.insertRow(-1);
 const totalLabelCell = totalRow.insertCell();
 totalLabelCell.colSpan = 2;
 const totalSilverCell = totalRow.insertCell();
 const totalCampPointsCell = totalRow.insertCell();
 totalLabelCell.innerHTML = "<strong>Итого</strong>";
 totalSilverCell.textContent = totalSilver;
 totalCampPointsCell.textContent = totalCampPoints;
 }
           setup();
           var addButton = document.getElementById("add-button");
   addButton.onclick = function() {
       addSkill();
   };
   var calculateButton = document.getElementById("calculate-button");
   calculateButton.onclick = function() {
       calculateResult(skills);
   };
         
         async function setup() {
    const savedLanguage = localStorage.getItem("selectedLanguage") || 'ru';
    await fillSkillList(savedLanguage);
    const skills = await readData(savedLanguage);

    const addButton = document.getElementById("add-button");
    const calculateButton = document.getElementById("calculate-button");

    addButton.addEventListener("click", () => {
        addSkill(skills);
    });

    calculateButton.addEventListener("click", () => {
        calculateResult(skills);
    });

    // Trigger the language change script function after loading the data and setting up the event listeners
    changeLanguage(savedLanguage);
}



document.addEventListener("DOMContentLoaded", () => {
    setup();
});
