// this is the Javascript managing the edit_char.html page and shound only be loaded there.

var utilities = utilities || {};
var loadSave = loadSave || {};

function refresh(char) {
	refreshValues(char);
}

function newChar() {
	refreshValues(new Char());
}

function addWeapon() {
	var name = window.prompt("Name");
	if (name === undefined || name === null) {
		return; // clicked cancel.
	} else if (name === "") {
		window.alert("Name darf nicht leer und muss eindeutig sein");
	} else {
		var currentChar = makeCharFromForm();
		currentChar.weapons.push(
						{"name": name,
							"skill": "-",
							"bonus": [0, 0, 0, 0],
							"ammunition": 0,
							"range": 0,
							"firemodes": [0, 0, 0],
							"concealability": "Nicht"
						});
		refreshValues(currentChar);
	}
}

function addSkill() {
	var name = window.prompt("Name");
	if (name === undefined || name === null) {
		return; // clicked cancel.
	} else if (name === "") {
		window.alert("Name darf nicht leer und muss eindeutig sein");
	} else {
		var currentChar = makeCharFromForm();
		currentChar.skills.push(
						{
							"name": name,
							"value": 0,
							"base": "Attr",
							"factor": 1
						});
		refreshValues(currentChar);
	}
}


function addArmor() {
	var name = window.prompt("Name");
	if (name === undefined || name === null) {
		return; // clicked cancel.
	} else if (name === "") {
		window.alert("Name darf nicht leer und muss eindeutig sein");
	} else {
		var currentChar = makeCharFromForm();
		currentChar.armor.push(
						{
							"name": name,
							"areas": ["Torso"],
							"sp": 0,
							"hard": false,
							"encumberence": 0
						});
		refreshValues(currentChar);
	}
}

function refreshChar() {
	var currentChar = makeCharFromForm();
	refreshValues(currentChar);
}

function refreshValues(currentChar) {
	refreshPart("base", currentChar.base);
	refreshPart("attributes", currentChar.attributes);
	refreshPart("armor", currentChar.armor);
	refreshPart("skills", currentChar.skills);
	refreshPart("weapons", currentChar.weapons);
	refreshPart("inventory", currentChar.inventory);
}

function refreshPart(id, array) {
	var elem = document.getElementById(id);
	utilities.clearNode(elem);
	if (id === "base" || id === "attributes") {
		populateBaseAttrNode(elem, array, id);
	} else if (id === "skills") {
		populateSkillNode(elem, array);
	} else if (id === "weapons") {
		populateWeaponNode(elem, array);
	} else if (id === "armor") {
		populateArmorNode(elem, array);
	}
}

function populateArmorNode(node, dataArray) {
	
}

function populateWeaponNode(node, dataArray) {
	dataArray.sort(function (a, b) {
		var skillCompare = a.skill.toLowerCase().localeCompare(b.skill.toLowerCase());
		if (skillCompare !== 0)
			return skillCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	var headerDiv = utilities.makeElement(node, "div", "headerDiv");
	var headerH2 = utilities.makeElement(headerDiv, "h2", "headerH2");
	headerH2.innerHTML = "Waffen";
	for (var ii in dataArray) {
		var nextWeapon = dataArray[ii];
		var myDiv = makeNameDiv(node, nextWeapon.name, "weaponDiv", true);
		var skillDiv = makeSkillDiv(myDiv, nextWeapon.skill, node.id, nextWeapon.name);
		var bonusDiv = makeBonusDiv(myDiv, nextWeapon.bonus, node.id, nextWeapon.name);
		var racDiv = utilities.makeElement(myDiv, "div", "racDiv");
		var rangeDiv = makeRangeDiv(racDiv, nextWeapon.range, node.id, nextWeapon.name);
		var ammunitionDiv = makeAmmunitionDiv(racDiv, nextWeapon.ammunition, node.id, nextWeapon.name);
		var concealabilityDiv = makeConcealabilityDiv(racDiv, nextWeapon.concealability, node.id, nextWeapon.name);
		var firemodesDiv = makeFiremodesDiv(myDiv, nextWeapon.firemodes, node.id, nextWeapon.name);
	}
	var buttonDiv = utilities.makeElement(node, "div", "weaponDiv");
	var addButton = utilities.makeElement(buttonDiv, "input", "addButton");
	addButton.value = "Waffe hinzufügen";
	addButton.type = "button";
	addButton.onclick = function () {
		addWeapon();
	};
}

function makeFiremodesDiv(myDiv, value, nodeId, name) {
	var firemodesDiv = utilities.makeElement(myDiv, "div", "firemodesDiv");
	var nameDiv = utilities.makeElement(firemodesDiv, "div", "firemodeTitleDiv");
	nameDiv.innerHTML = "Feuerfrequenzen";
	for (var ii in value)
		utilities.makeGenericInputDiv(firemodesDiv, value[ii], nodeId, name, "firemodes", undefined, ii);
	return firemodesDiv;
}

function makeConcealabilityDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "concealability", "kleinstes Versteck");
}

function makeAmmunitionDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "ammunition", "Magazingröße");
}

function makeRangeDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "range", "Reichweite");
}

function makeBonusDiv(myDiv, value, nodeId, name) {
	var bonusDiv = makeNameDiv(myDiv, "Bonus", "bonusNameDiv");//makeElement(myDiv, "div", "bonusDiv");
//	makeNameDiv(bonusDiv, "Bonus", "bonusNameDiv");
	makeBonusInput(bonusDiv, value[0], "Nah", nodeId, name, 0);
	makeBonusInput(bonusDiv, value[1], "Medium", nodeId, name, 1);
	makeBonusInput(bonusDiv, value[2], "Weit", nodeId, name, 2);
	makeBonusInput(bonusDiv, value[3], "Extrem", nodeId, name, 3);
	return bonusDiv;
}

function makeBonusInput(myDiv, value, distance, nodeId, name, position) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "bonus", distance, position);
}

// this is in weapons area.
function makeSkillDiv(myDiv, value, nodeId, name) {
	var skillDiv = utilities.makeElement(myDiv, "div", "skillDiv");
	var skillSelect = utilities.makeElement(skillDiv, "select", "skillSelect");
	skillSelect.name = utilities.uniqueInputname(nodeId, name, "skill");
	makeOption(skillSelect, "Boxen", value);
	makeOption(skillSelect, "Gewehr", value);
	makeOption(skillSelect, "Pistole", value);
	makeOption(skillSelect, "Schwere Waffen", value);
	makeOption(skillSelect, "SMG", value);
	makeOption(skillSelect, "Werfen", value);
	return skillDiv;
}

function populateSkillNode(node, dataArray) {
	dataArray.sort(function (a, b) {
		var baseCompare = a.base.toLowerCase().localeCompare(b.base.toLowerCase());
		if (baseCompare !== 0)
			return baseCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	var currentAttr = "";
	for (var ii in dataArray) {
		var nextSkill = dataArray[ii];
		// print out Base as Header when it changes.
		if (nextSkill.base.toLowerCase() !== currentAttr) {
			currentAttr = nextSkill.base;
			var headerDiv = utilities.makeElement(node, "div", "headerDiv");
			var headerH2 = utilities.makeElement(headerDiv, "h2", "headerH2");
			headerH2.innerHTML = currentAttr;
			currentAttr = currentAttr.toLowerCase();
		}
		var myDiv = makeNameDiv(node, nextSkill.name, "skillDiv", true);
		var valueDiv = makeValueDiv(myDiv, nextSkill.value, node.id, nextSkill.name);
		var baseDiv = makeBaseDiv(myDiv, nextSkill.base, node.id, nextSkill.name);
		var factorDiv = makeFactorDiv(myDiv, nextSkill.factor, node.id, nextSkill.name);
	}
	var buttonDiv = utilities.makeElement(node, "div", "skillDiv");
	var addButton = utilities.makeElement(buttonDiv, "input", "addButton");
	addButton.value = "Fertigkeit hinzufügen";
	addButton.type = "button";
	addButton.onclick = function () {
		addSkill();
	};
}

function makeNameDiv(node, name, className, withHiddenInput) {
	var myDiv = utilities.makeElement(node, "div", className);
	var nameDiv = utilities.makeElement(myDiv, "div", "nameDiv");
	nameDiv.innerHTML = name;
	if (withHiddenInput) {
		var type = "name";
		var hiddenInput = utilities.makeElement(nameDiv, "input", type + "Input, hiddenInput");
		hiddenInput.value = name;
		hiddenInput.type = "hidden";
		hiddenInput.name = utilities.uniqueInputname(node.id, name, type);
	}
	return myDiv;
}

function makeValueDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "value");
}

function makeFactorDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "factor", "Faktor");
}

// nicht mit populateBaseAttrNode verwechseln. 
function makeBaseDiv(myDiv, value, nodeId, name) {
	baseDiv = utilities.makeElement(myDiv, "div", "baseDiv");
	baseSelect = utilities.makeElement(baseDiv, "select", "baseSelect");
	baseSelect.name = utilities.uniqueInputname(nodeId, name, "base");
	// Attr, Body, Cool, Emp, Int, Luck, Move, Ref, Tech
	makeOption(baseSelect, "Attr", value);
	makeOption(baseSelect, "Body", value);
	makeOption(baseSelect, "Cool", value);
	makeOption(baseSelect, "Emp", value);
	makeOption(baseSelect, "Int", value);
	makeOption(baseSelect, "Luck", value);
	makeOption(baseSelect, "Move", value);
	makeOption(baseSelect, "Ref", value);
	makeOption(baseSelect, "Tech", value);
}

function makeOption(select, value, selectedValue) {
	option = utilities.makeElement(select, "option");
	option.value = value;
	if (value.toLowerCase().localeCompare(selectedValue.toLowerCase()) === 0) {
		option.selected = "selected";
	}
	option.innerHTML = value;
}

// nicht mit makeBaseDiv verwechseln.
function populateBaseAttrNode(node, dataArray, id) {
	dataArray.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	for (var ii in dataArray) {
		nextData = dataArray[ii];
		myDiv = makeNameDiv(node, nextData.name, id + "Div");
		makeValueDiv(myDiv, nextData.value, node.id, nextData.name);
	}
}

function makeCharFromForm() {
	var charMap = utilities.serialize(document.getElementById("characterForm"));
	var currentChar = new Char();
	charMap.forEach(function (value, key) {
		currentChar.addElement(utilities.arrayFromUniqueInputName(key), value);
	});
	return currentChar;
}

function exportChar() {
	var currentChar = makeCharFromForm();
	loadSave.charExport(currentChar, "export");
}
