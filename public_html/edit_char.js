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
							"reliability": "Normal",
							"damage": "1d6",
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


function addItem() {
	var name = window.prompt("Name");
	if (name === undefined || name === null) {
		return; // clicked cancel.
	} else if (name === "") {
		window.alert("Name darf nicht leer und muss eindeutig sein");
	} else {
		var currentChar = makeCharFromForm();
		currentChar.inventory.push(
						{
							"name": name,
							"weight": 0,
							"amount": 0,
							"cost": 0,
							"location": ""
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
		          "areas": [0,0,0,0,0,0,0,0,0,0,0,0,0],
							"hard": false,
							"layer": 0,
							"encumberence": 0
						});
		refreshValues(currentChar);
	}
}

function addCyberitem() {
	var name = window.prompt("Name");
	if (name === undefined || name === null) {
		return; // clicked cancel.
	} else if (name === "") {
		window.alert("Name darf nicht leer und muss eindeutig sein");
	} else {
		var currentChar = makeCharFromForm();
		currentChar.cyberware.push(
						{
							"name": name,
							"cost": "0",
							"hc": "0",
							"location": "Keine"
						});
		refreshValues(currentChar);
	}
}

function addNote() {
	var currentChar = makeCharFromForm();
	var nextOrder = currentChar.notes.length +1;
	currentChar.notes.push( { "order": nextOrder, "value": "" } );
	refreshValues(currentChar);
}

function refreshChar() {
	var currentChar = makeCharFromForm();
	refreshValues(currentChar);
}

function refreshValues(currentChar) {
	refreshPart("base", currentChar.base);
	refreshPart("attributes", currentChar.attributes);
	refreshPart("hits", currentChar.hits);
	populateArmorNode(currentChar);
	populateSkillNode(currentChar);
	populateWeaponNode(currentChar);
	populateInventoryNode(currentChar);
	populateCyberwareNode(currentChar);
	populateNotesNode(currentChar);
}

function refreshPart(id, array) {
	var elem = document.getElementById(id);
	utilities.clearNode(elem);
	if (id === "base" || id === "attributes" || id === "hits") {
		populateBaseAttrNode(elem, array, id);
	} else {
		throw "unexpected part " + id;
	}
}

function populateNotesNode(currentChar) {
	var dataArray = currentChar.notes;
	var node = document.getElementById("notes");
	utilities.clearNode(node);
	dataArray.sort(function (a, b) {
		var result = a.order - b.order;
		if (result === 0 || result === undefined) {
			return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
		} else {
			return result;	
		}
	});
	makeHeader(node, "Notizen");
	for (var ii in dataArray) {
		var nextItem = dataArray[ii];
		var myDiv = utilities.makeLabeledDiv(node, "notes");
		var orderDiv = utilities.makeGenericInputDiv(myDiv, nextItem.order, node.id, ii, "order", "Reihenfolge");
		var orderDiv = utilities.makeTextAreaDiv(myDiv, nextItem.value, node.id, ii, "value", "Notiz");
	}
	addAddButton(node, "note", "Notiz hinzufügen", function() {
		addNote();
	});
}

function populateCyberwareNode(currentChar) {
	var dataArray = currentChar.cyberware;
	var node = document.getElementById("cyberware");
	utilities.clearNode(node);
	dataArray.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	makeHeader(node, "Cyberware");
	for (var ii in dataArray) {
		var nextItem = dataArray[ii];
		var myDiv = makeNameDiv(node, nextItem.name, "cyberitemDiv", true);
		var humanitycostDiv = makeHumanityCostDiv(myDiv, nextItem.cost, node.id, nextItem.name);
		var costDiv = makeCostDiv(myDiv, nextItem.cost, node.id, nextItem.name);
		var locationDiv = makeLocationDiv(myDiv, nextItem.location, node.id, nextItem.name);
	}
	addAddButton(node, "cyberitem", "Cyberware hinzufügen", function() {
		addCyberitem();
	});
}

function populateInventoryNode(currentChar) {
	var dataArray = currentChar.inventory;
	var node = document.getElementById("inventory");
	utilities.clearNode(node);
	dataArray.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	makeHeader(node, "Ausrüstung");
	
	for (var ii in dataArray) {
		var nextItem = dataArray[ii];
		var myDiv = makeNameDiv(node, nextItem.name, "itemDiv", true);
		var weightDiv = makeWeightDiv(myDiv, nextItem.weight, node.id, nextItem.name);
		var amountDiv = makeAmountDiv(myDiv, nextItem.amount, node.id, nextItem.name);
		var costDiv = makeCostDiv(myDiv, nextItem.cost, node.id, nextItem.name);
		var locationDiv = makeLocationDiv(myDiv, nextItem.location, node.id, nextItem.name);
	}
	
	addAddButton(node, "item", "Gegenstand hinzufügen", function() {
		addItem();
	});
}

function makeWeightDiv(myDiv, value, nodeId, name) {
	var weightDiv = utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "weight", "Gewicht");
	weightDiv.appendChild(document.createTextNode(" kg pro Stück"));
	return weightDiv;
}

function makeHumanityCostDiv(myDiv, value, nodeId, name) {
	var costDiv = utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "humanitycost", "Menschlichkeit");
	return costDiv;
}

function makeCostDiv(myDiv, value, nodeId, name) {
	var costDiv = utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "cost", "Kosten");
	costDiv.appendChild(document.createTextNode(" eb"));
	return costDiv;
}

function makeAmountDiv(myDiv, value, nodeId, name) {
	var amountDiv = utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "amount", "Anzahl");
	return amountDiv;
}

function makeLocationDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "location", "Aufbewahrungsort");
}

function populateArmorNode(currentChar) {
	var dataArray = currentChar.armor;
	var node = document.getElementById("armor");
	utilities.clearNode(node);
	dataArray.sort(function (a, b) {
		var layerCompare = a.layer - b.layer;
		if (layerCompare !== 0)
			return layerCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	
	makeHeader(node, "Rüstung");
	
	for (var ii in dataArray) {
		var nextArmor = dataArray[ii];
		var myDiv = makeNameDiv(node, nextArmor.name, "armorDiv", true);
		var areasDiv = makeAreasDiv(myDiv, nextArmor.areas, node.id, nextArmor.name);
		var hleDiv = utilities.makeElement(myDiv, "div", "hleDiv");
		var hardnessDiv = makeHardnessDiv(hleDiv, nextArmor.hard, node.id, nextArmor.name);
		var layerDiv = makeLayerDiv(hleDiv, nextArmor.layer, node.id, nextArmor.name);
		var encumbranceDiv = makeEncumbranceDiv(hleDiv, nextArmor.encumberence, node.id, nextArmor.name);
	}
	addAddButton(node, "armor", "Rüstung hinzufügen", function() {
		addArmor();
	});
}

function makeHardnessDiv(myDiv, value, nodeId, name) {
	return utilities.makeCheckboxDiv(myDiv, value, nodeId, name, "hard", "Hart");
}

function makeLayerDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "layer", "Schicht");
}

function makeEncumbranceDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "encumberence", "Behinderung");
}

function makeAreasDiv(myDiv, value, nodeId, name) {
//	var areasDiv = makeNameDiv(myDiv, "Gebiete", "areaNameDiv");
	var areasDiv = utilities.makeElement(myDiv, "div", "areaNameDiv");
	var sectionDiv = utilities.makeElement(areasDiv, "div", "sectionDiv");
	makeAreaInput(sectionDiv, value, "Kopf", nodeId, name, 0);
	makeAreaInput(sectionDiv, value, "Hand", nodeId, name, 1);
	makeAreaInput(sectionDiv, value, "Arm, links", nodeId, name, 2);
	sectionDiv = utilities.makeElement(areasDiv, "div", "sectionDiv");
	makeAreaInput(sectionDiv, value, "Arm, rechts", nodeId, name, 3);
	makeAreaInput(sectionDiv, value, "Schulter", nodeId, name, 4);
	makeAreaInput(sectionDiv, value, "Brust", nodeId, name, 5);
	sectionDiv = utilities.makeElement(areasDiv, "div", "sectionDiv");
	makeAreaInput(sectionDiv, value, "Bauch", nodeId, name, 6);
	makeAreaInput(sectionDiv, value, "Eingeweide", nodeId, name, 7);
	makeAreaInput(sectionDiv, value, "Oberschenkel", nodeId, name, 8);
	sectionDiv = utilities.makeElement(areasDiv, "div", "sectionDiv");
	makeAreaInput(sectionDiv, value, "Bein, links", nodeId, name, 9);
	makeAreaInput(sectionDiv, value, "Bein, rechts", nodeId, name, 10);
	makeAreaInput(sectionDiv, value, "Fuss, links", nodeId, name, 11);
	makeAreaInput(sectionDiv, value, "Fuss, rechts", nodeId, name, 12);
	return areasDiv;
}

function makeAreaInput(myDiv, value, distance, nodeId, name, position) {
	return utilities.makeGenericInputDiv(myDiv, value[position], nodeId, name, "areas", distance, position);
}

function populateWeaponNode(currentChar) {
	var dataArray = currentChar.weapons;
	var node = document.getElementById("weapons");
	utilities.clearNode(node);
	dataArray.sort(function (a, b) {
		var skillCompare = a.skill.toLowerCase().localeCompare(b.skill.toLowerCase());
		if (skillCompare !== 0)
			return skillCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	makeHeader(node, "Waffen");
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
		var reliabilityDiv = makeReliabilityDiv(racDiv, nextWeapon.reliability, node.id, nextWeapon.name);
		var damageDiv = makeDamageDiv(racDiv, nextWeapon.damage, node.id, nextWeapon.name);
	}
	addAddButton(node, "weapon", "Waffe hinzufügen", function() {
		addWeapon();
	});
}

function addAddButton(node, type, text, callback) {
	var buttonDiv = utilities.makeElement(node, "div", type + "Div");
	var addButton = utilities.makeElement(buttonDiv, "input", "addButton");
	addButton.value = text;
	addButton.type = "button";
	addButton.onclick = callback;
}

function makeHeader(parentNode, name) {
	var headerDiv = utilities.makeElement(parentNode, "div", "headerDiv");
	var headerH2 = utilities.makeElement(headerDiv, "h2", "headerH2");
	headerH2.innerHTML = name;
	return headerDiv;
}

function makeFiremodesDiv(myDiv, value, nodeId, name) {
	var firemodesDiv = utilities.makeElement(myDiv, "div", "firemodesDiv");
	var nameDiv = utilities.makeElement(firemodesDiv, "div", "firemodeTitleDiv");
	nameDiv.innerHTML = "Feuerfrequenzen";
	for (var ii in value)
		utilities.makeGenericInputDiv(firemodesDiv, value[ii], nodeId, name, "firemodes", undefined, ii);
	return firemodesDiv;
}

function makeReliabilityDiv(parentDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(parentDiv, value, nodeId, name, "reliability", "Zuverl&auml;ssigkeit");
}

function makeDamageDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "damage", "Schaden");
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
	var bonusDiv = makeNameDiv(myDiv, "Bonus", "bonusNameDiv");
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

function populateSkillNode(currentChar) {
	var dataArray = currentChar.skills;
	var node = document.getElementById("skills");
	utilities.clearNode(node);
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
	nameDiv.innerHTML = "<b>" + name + "</b>";
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
