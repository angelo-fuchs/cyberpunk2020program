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
							"areas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
	var nextOrder = currentChar.notes.length + 1;
	currentChar.notes.push({"order": nextOrder, "value": ""});
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
	populateArmorAreaNode(currentChar);
	populateSkillNode(currentChar);
	populateWeaponNode(currentChar);
	populateInventoryNode(currentChar);
	populateCyberwareNode(currentChar);
	populateNotesNode(currentChar);
	populateCalculatedNode(currentChar);
}

function refreshPart(id, array) {
	var elem = getAndClearNode(id);
	if (id === "base" || id === "attributes" || id === "hits") {
		populateBaseAttrNode(elem, array, id);
	} else {
		throw "unexpected part " + id;
	}
}

function populateNotesNode(currentChar) {
	var dataArray = currentChar.notes;
	var node = getAndClearNode("notes");
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
	addAddButton(node, "note", "Notiz hinzufügen", function () {
		addNote();
	});
}

function getAttribute(currentChar, attribute) {
	for (var ii in currentChar.attributes) {
		var nextAttr = currentChar.attributes[ii];
		if (nextAttr.name === attribute) {
			return nextAttr.value;
		}
	}
	return 0;
}

function populateCalculatedNode(currentChar) {
	var node = getAndClearNode("calculatedData");
	makeACalcDiv(node, calculatePunch(currentChar), "Punch");
	makeACalcDiv(node, calculateKick(currentChar), "Kick");
	makeACalcDiv(node, calculateDamText(currentChar, true), "DAM");
	makeACalcDiv(node, calculateHumanity(currentChar), "Humanity");
	makeACalcDiv(node, calculateLift(currentChar), "Lift");
	makeACalcDiv(node, calculateCarry(currentChar), "Carry");
	makeACalcDiv(node, calculateThrow(currentChar), "Throw");
	makeACalcDiv(node, calculateRun(currentChar), "Run");
	makeACalcDiv(node, calculateLeap(currentChar), "Leap");
	makeACalcDiv(node, calculateJump(currentChar), "Jump");
	makeACalcDiv(node, calculateSwim(currentChar), "Swim");
	makeACalcDiv(node, calculateBTM(currentChar), "BTM");
	makeACalcDiv(node, calculateSave(currentChar), "Save");
	makeACalcDiv(node, calculateHealPerDay(currentChar), "Heal/Day");
}

function makeACalcDiv(node, value, name) {
	var calcDiv = makeNameDiv(node, name, name.toLowerCase() + "Div");
	makeValueDiv(calcDiv, value, node.id, name);
}

// DAM = DAmage Modifier
function calculateDamText(currentChar, withSero) {
	var bt = calculateBT(currentChar);
	switch (bt) {
		case "VW":
			return "-2";
		case "W":
			return "-1";
		case "A":
			return withSero ? "+0" : "";
		case "S":
			return "+1";
		case "VS":
			return "+2";
		default:
			return "+" + (getAttribute(currentChar, "Body") - 7);
	}
}

function calculateThrow(currentChar) {
	var body = getAttribute(currentChar, "Body");
	return (body * 10) + " m";
}

function calculateLift(currentChar) {
	var body = getAttribute(currentChar, "Body");
	return body * 40;
}

function calculateCarry(currentChar) {
	var body = getAttribute(currentChar, "Body");
	return body * 10;
}

function calculateBT(currentChar) {
	var body = getAttribute(currentChar, "Body");
	switch (body) {
		case "1":
		case "2":
			return "VW"; // Very weak
		case "3":
		case "4":
			return "W"; // Weak
		case "5":
		case "6":
		case "7":
			return "A"; // Average
		case "8":
		case "9":
			return "S"; // Strong
		case "10":
			return "VS"; // Very Strong
		default:
			return "SH"; // Superhuman
	}
}

function calculateSave(currentChar) {
	return getAttribute(currentChar, "Body");
}

function calculateHealPerDay(currentChar) {
	return 1;
}

// Body Type Modifier (that gets subtracted from taken damage)
function calculateBTM(currentChar) {
	var bt = calculateBT(currentChar);
	switch (bt) {
		case "VW":
			return -0;
		case "W":
			return -1;
		case "A":
			return -2;
		case "S":
			return -3;
		case "VS":
			return -4;
		case "SH":
			return -5;
	}
}

function calculatePunch(currentChar) {
	return "1d6/2" + calculateDamText(currentChar);
}

function calculateKick(currentChar) {
	return "1d6" + calculateDamText(currentChar);
}

function calculateRun(currentChar) {
	var move = getAttribute(currentChar, "Move");
	return (move * 3) + " m/s";
}

function calculateLeap(currentChar) {
	var move = getAttribute(currentChar, "Move");
	var result = move * 100 * 3 / 4;
	return result + " m";
}

function calculateJump(currentChar) {
	return "???";
}

function calculateSwim(currentChar) {
	return "???";
}

function calculateHumanity(currentChar) {
	var emp = getAttribute(currentChar, "Emp");
	var initialHumanity = emp * 10;
	var remainingHumanity = initialHumanity;
	var cyberware = currentChar.cyberware;
	for (var ii in cyberware) {
		var nextItem = cyberware[ii];
		remainingHumanity = remainingHumanity - nextItem.humanitycost;
	}
	return initialHumanity + " / " + remainingHumanity;
}

function populateCyberwareNode(currentChar) {
	var dataArray = currentChar.cyberware;
	var node = getAndClearNode("cyberware");
	dataArray.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	makeHeader(node, "Cyberware");
	for (var ii in dataArray) {
		var nextItem = dataArray[ii];
		var myDiv = makeNameDiv(node, nextItem.name, "cyberitemDiv", true, false);
		var humanitycostDiv = makeHumanityCostDiv(myDiv, nextItem.humanitycost, node.id, nextItem.name);
		var costDiv = makeCostDiv(myDiv, nextItem.cost, node.id, nextItem.name);
		var locationDiv = makeLocationDiv(myDiv, nextItem.location, node.id, nextItem.name);
	}
	addAddButton(node, "cyberitem", "Cyberware hinzufügen", function () {
		addCyberitem();
	});
}

function populateInventoryNode(currentChar) {
	var dataArray = currentChar.inventory;
	var node = getAndClearNode("inventory");
	dataArray.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	makeHeader(node, "Ausrüstung");

	for (var ii in dataArray) {
		var nextItem = dataArray[ii];
		var myDiv = makeNameDiv(node, nextItem.name, "itemDiv", true, false);
		var weightDiv = makeWeightDiv(myDiv, nextItem.weight, node.id, nextItem.name);
		var amountDiv = makeAmountDiv(myDiv, nextItem.amount, node.id, nextItem.name);
		var costDiv = makeCostDiv(myDiv, nextItem.cost, node.id, nextItem.name);
		var locationDiv = makeLocationDiv(myDiv, nextItem.location, node.id, nextItem.name);
	}

	addAddButton(node, "item", "Gegenstand hinzufügen", function () {
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

function getAndClearNode(nodeId) {
	var node = document.getElementById(nodeId);
	utilities.clearNode(node);
	return node;
}

function populateArmorAreaNode(currentChar) {
	var node = getAndClearNode("armorArea");
	var titleNode = utilities.makeElement(node, "span", "sectionTitle");
	titleNode.innerHTML = "HIT LOCATION TABLE";

	var table = utilities.makeElement(node, "div", "table");
	var headRow = utilities.makeElement(table, "div", "headRow");
	utilities.makeElement(headRow, "div").innerHTML = "Roll";
	utilities.makeElement(headRow, "div").innerHTML = "Location";
	utilities.makeElement(headRow, "div").innerHTML = "DAM";
	utilities.makeElement(headRow, "div").innerHTML = "AIM";
	utilities.makeElement(headRow, "div").innerHTML = "SP1";
	utilities.makeElement(headRow, "div").innerHTML = "SP2";
	utilities.makeElement(headRow, "div").innerHTML = "SP3";
	utilities.makeElement(headRow, "div").innerHTML = "Total";
	var areas = [
		["3-5", "Head", "2x", "-4"],
		["6", "Hand", "1/2", "-4"],
		["7", "L Arm", "1/2", "-2"],
		["8", "R Arm", "1/2", "-2"],
		["9", "Shoulders", "1x", "-2"],
		["10-11", "Chest", "1x", "-1"],
		["12", "Stomach", "1.5x", "-3"],
		["13", "Vitals", "1.5x", "-6"],
		["14", "Thighs", "1x", "-2"],
		["15", "L Leg", "1/2", "-2"],
		["16", "R Leg", "1/2", "-2"],
		["17", "L Foot", "1/2", "-4"],
		["18", "R Foot", "1/2", "-4"]
	];
	for (var areaCount in areas) { // attention! The order is important, do not change!
		var area = areas[areaCount];
		makeArmorArea(table, area, areaCount, currentChar);
	}
}

function makeArmorArea(table, area, areaCount, currentChar) {
	var armor = currentChar.armor;
	var rowDiv = utilities.makeElement(table, "div", "contentRow");
	for (var ii in area) {
		var entry = area[ii];
		utilities.makeElement(rowDiv, "div", "tableCell").innerHTML = entry;
	}
	var highestLayer = 1000000;
	var total = 0;
	for (var sps = 3; sps > 0; sps--) {
		var currentBestLayer = {
			"name": "Nothing",
			"areas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			"hard": false,
			"layer": -1,
			"encumberence": 0
		};
		for (var armorCount in armor) {
			var oneLayer = armor[armorCount];
			if (oneLayer.layer >= highestLayer)
				continue; // already done previously
			var areasOfLayer = oneLayer.areas;
			var protectionAtZone = areasOfLayer[areaCount];
			if (protectionAtZone > 0 &&
							oneLayer.layer > currentBestLayer.layer) {
				currentBestLayer = oneLayer;
			}
		}
		highestLayer = currentBestLayer.layer;
		var spDiv = utilities.makeElement(rowDiv, "div", "tableCell");
		spDiv.innerHTML = currentBestLayer.areas[areaCount];
		if (currentBestLayer.hard) {
			spDiv.class = "tableCell hardArmor";
		}
		total += (currentBestLayer.areas[areaCount] * 1);
	}
	var spDiv = utilities.makeElement(rowDiv, "div", "tableCell");
	spDiv.innerHTML = total;
}

function populateArmorNode(currentChar) {
	var dataArray = currentChar.armor;
	var node = getAndClearNode("armor");
	dataArray.sort(function (a, b) {
		var layerCompare = a.layer - b.layer;
		if (layerCompare !== 0)
			return layerCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	makeHeader(node, "Rüstung");

	for (var ii in dataArray) {
		var nextArmor = dataArray[ii];
		var myDiv = makeNameDiv(node, nextArmor.name, "armorDiv", true, false);
		var areasDiv = makeAreasDiv(myDiv, nextArmor.areas, node.id, nextArmor.name);
		var hleDiv = utilities.makeElement(myDiv, "div", "hleDiv");
		var hardnessDiv = makeHardnessDiv(hleDiv, nextArmor.hard, node.id, nextArmor.name);
		var layerDiv = makeLayerDiv(hleDiv, nextArmor.layer, node.id, nextArmor.name);
		var encumbranceDiv = makeEncumbranceDiv(hleDiv, nextArmor.encumberence, node.id, nextArmor.name);
	}
	addAddButton(node, "armor", "Rüstung hinzufügen", function () {
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
	var node = getAndClearNode("weapons");
	dataArray.sort(function (a, b) {
		var skillCompare = a.skill.toLowerCase().localeCompare(b.skill.toLowerCase());
		if (skillCompare !== 0)
			return skillCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	makeHeader(node, "Waffen");
	for (var ii in dataArray) {
		var nextWeapon = dataArray[ii];
		var myDiv = makeNameDiv(node, nextWeapon.name, "weaponDiv", true, false);
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
	addAddButton(node, "weapon", "Waffe hinzufügen", function () {
		addWeapon();
	});
}

var buttons = ['create_button', 'import_button', 'export_button', 'refresh_button', 'remove_button'];

function addAddButton(node, type, text, callback) {
	var buttonDiv = utilities.makeElement(node, "div", type + "Div");
	var addButton = utilities.makeElement(buttonDiv, "input", "addButton");
	addButton.value = text;
	addButton.id = "add" + type + "Button";
	if (!buttons.includes(addButton.id))
		buttons.push(addButton.id);
	addButton.type = "button";
	addButton.onclick = callback;
}

function removeButtons() {
	for (var ii in buttons) {
		var buttonId = buttons[ii];
		var button = document.getElementById(buttonId);
		button.parentNode.removeChild(button);
	}
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
	var bonusDiv = makeNameDiv(myDiv, "Bonus", "bonusNameDiv", false);
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
	makeOption(skillSelect, "Sniper", value);
	makeOption(skillSelect, "Werfen", value);
	return skillDiv;
}

function populateSkillNode(currentChar) {
	var allSkills = currentChar.skills;
	var skillsNode = getAndClearNode("skills");
	allSkills.sort(function (a, b) {
		var baseCompare = a.base.toLowerCase().localeCompare(b.base.toLowerCase());
		if (baseCompare !== 0)
			return baseCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	var currentAttr = "";
	var leftColumnNode = utilities.makeElement(skillsNode, "div", "leftSkillColumn");
	var leftCount = 0;
	var rightCount = 0;
	var rightColumnNode = utilities.makeElement(skillsNode, "div", "rightSkillColumn");
	var lastStop = 0;
	var skillAttrNode = undefined;
	var tableNode = leftColumnNode;
	for (var ii in allSkills) {
		var nextSkill = allSkills[ii];
		// print out Base as Header when it changes.
		if (nextSkill.base.toLowerCase() !== currentAttr) {
			if(skillAttrNode !== undefined) {
				var skillsInBlock = ii - lastStop +2; // 2 for header
				lastStop = ii;
				if(leftCount < rightCount || leftCount === 0) { // add to left column
					leftCount += skillsInBlock;
					leftColumnNode.appendChild(skillAttrNode);
				} else { // add to right column
					rightCount += skillsInBlock;
					rightColumnNode.appendChild(skillAttrNode);
				}
			}
			currentAttr = nextSkill.base;
			skillAttrNode = utilities.makeElement(skillsNode, "div", "skillAttrDiv");
			tableNode = makeSkillHeadArea(skillAttrNode, currentAttr);
			currentAttr = currentAttr.toLowerCase();
		}
<<<<<<< HEAD
		var myDiv = makeNameDiv(node, nextSkill.name, "skillDiv", true, false);
		var valueDiv = makeValueDiv(myDiv, nextSkill.value, node.id, nextSkill.name);
		var baseDiv = makeBaseDiv(myDiv, nextSkill.base, node.id, nextSkill.name);
		var factorDiv = makeFactorDiv(myDiv, nextSkill.factor, node.id, nextSkill.name);
=======
		makeOneSkillRow(tableNode, nextSkill, skillsNode);
	}
	var skillsInBlock = ii - lastStop +2; // 2 for header
	if(leftCount < rightCount || leftCount === 0) { // add to left column
		leftCount += skillsInBlock;
		leftColumnNode.appendChild(skillAttrNode);
	} else { // add to right column
		rightCount += skillsInBlock;
		rightColumnNode.appendChild(skillAttrNode);
>>>>>>> skills are now properly cleaned up for display.
	}
	var buttonColumn;
	if(leftCount < rightCount || leftCount === 0) { // add to left column
		buttonColumn = leftColumnNode;
	} else { // add to right column
		buttonColumn = rightColumnNode;
	}
	var buttonArea = utilities.makeElement(buttonColumn, "div", "skillAttrDiv");
	addAddButton(buttonArea, "skill", "Fertigkeit hinzufügen", function () {
		addSkill();
	});
}

function makeOneSkillRow(tableNode, nextSkill, skillsNode) {
	var myRow = makeNameCell(tableNode, nextSkill.name, "skillDiv", true);
	var valueCell = utilities.makeElement(myRow, "td", "cell");
	makeValueDiv(valueCell, nextSkill.value, skillsNode.id, nextSkill.name);
	var baseCell = utilities.makeElement(myRow, "td", "cell");
	makeBaseDiv(baseCell, nextSkill.base, skillsNode.id, nextSkill.name);
	var factorCell = utilities.makeElement(myRow, "td", "cell");
	makeFactorDiv(factorCell, nextSkill.factor, skillsNode.id, nextSkill.name);
}

function makeSkillHeadArea(skillAttrNode, currentAttr) {
	var headNode = utilities.makeElement(skillAttrNode, "div", "headerDiv");
	var headerH2 = utilities.makeElement(headNode, "h2", "headerH2");
	headerH2.innerHTML = currentAttr;
	var tableNode = utilities.makeElement(skillAttrNode, "table", "table");
	var headRow = utilities.makeElement(tableNode, "tr", "headRow");
	utilities.makeElement(headRow, "td", "nameDiv").innerHTML = "Name";
	utilities.makeElement(headRow, "td", "valueDiv").innerHTML = "Level";
	utilities.makeElement(headRow, "td", "baseDiv").innerHTML = "Basis";
	utilities.makeElement(headRow, "td", "factorDiv").innerHTML = "Faktor";
	return tableNode;
}

function makeNameCell(node, name, className, withHiddenInput) {
	var myTr = utilities.makeElement(node, "tr", className);
	myTr.id = utilities.uniqueCssName(className, name, "OuterDiv");
	var nameDiv = utilities.makeElement(myTr, "td", "nameDiv");
	nameDiv.innerHTML = "<b>" + name + "</b>";
	if (withHiddenInput) {
		var type = "name";
		var hiddenInput = utilities.makeElement(nameDiv, "input", type + "Input, hiddenInput");
		hiddenInput.value = name;
		hiddenInput.type = "hidden";
		hiddenInput.name = utilities.uniqueInputname(node.id, name, type);
	}
	return myTr;
}

function makeNameDiv(node, name, className, withInput, hideInput) {
	var myDiv = utilities.makeElement(node, "div", className);
	myDiv.id = utilities.uniqueCssName(className, name, "OuterDiv");
	var nameDiv = utilities.makeElement(myDiv, "div", "nameDiv");
	if (withInput === true) {
		var type = "name";
		var input = utilities.makeElement(nameDiv, "input", type + "Input");
		if (hideInput === true) {
			input.type = "hidden";
		} else {
			input.type = "text";
		}
		input.value = name;
		input.name = utilities.uniqueInputname(node.id, name, type);
	} else {
		nameDiv.innerHTML = name;
	}
	return myDiv;
}

function makeValueDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "value");
}

function makeFactorDiv(myDiv, value, nodeId, name) {
	return utilities.makeGenericInputDiv(myDiv, value, nodeId, name, "factor");
}

// nicht mit populateBaseAttrNode verwechseln. 
function makeBaseDiv(myDiv, value, nodeId, name) {
	baseDiv = utilities.makeElement(myDiv, "div", "baseDiv");
	baseSelect = utilities.makeElement(baseDiv, "select", "baseSelect valueInput");
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
		myDiv = makeNameDiv(node, nextData.name, id + "Div", false);
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
