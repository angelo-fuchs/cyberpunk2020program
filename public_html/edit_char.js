// this is the Javascript managing the edit_char.html page and shound only be loaded there.

var utilities = utilities || {};

function refresh(char) {
	refreshValues(char);
}

function newChar() {
	refreshValues(new Char());
}

function refreshValues(currentChar) {
	refreshPart("base", currentChar.base);
	refreshPart("attributes", currentChar.attributes);
	refreshPart("skills", currentChar.skills);
	refreshPart("weapons", currentChar.weapons);
	refreshPart("inventory", currentChar.inventory);
}

function refreshPart(id, array) {
	var elem = document.getElementById(id);
	clearNode(elem);
	if (id === "base" || id === "attributes") {
		populateBaseAttrNode(elem, array, id);
	} else if (id === "skills") {
		populateSkillNode(elem, array);
	} else if (id === "weapons") {
		populateWeaponNode(elem, array);
	}
}

function clearNode(node) {
	while (node.childNodes.length > 0) {
		var nextChild = node.childNodes[0];
		node.removeChild(nextChild);
	}
}

function populateWeaponNode(node, dataArray) {
	dataArray.sort(function (a, b) {
		var skillCompare = a.skill.toLowerCase().localeCompare(b.skill.toLowerCase());
		if (skillCompare !== 0)
			return skillCompare;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	var headerDiv = makeElement(node, "div", "headerDiv");
	var headerH2 = makeElement(headerDiv, "h2", "headerH2");
	headerH2.innerHTML = "Waffen";
	for (var ii in dataArray) {
		var nextWeapon = dataArray[ii];
		var myDiv = makeNameDiv(node, nextWeapon.name, "weaponDiv");
		var skillDiv = makeSkillDiv(myDiv, nextWeapon.skill, node.id, nextWeapon.name);
		var bonusDiv = makeBonusDiv(myDiv, nextWeapon.bonus, node.id, nextWeapon.name);
		var racDiv = makeElement(myDiv, "div", "racDiv");
		var rangeDiv = makeRangeDiv(racDiv, nextWeapon.range, node.id, nextWeapon.name);
		var ammunitionDiv = makeAmmunitionDiv(racDiv, nextWeapon.ammunition, node.id, nextWeapon.name);
		var concealabilityDiv = makeConcealabilityDiv(racDiv, nextWeapon.concealability, node.id, nextWeapon.name);
		var firemodesDiv = makeFiremodesDiv(myDiv, nextWeapon.firemodes, node.id, nextWeapon.name);
	}
}

function makeGenericInputDiv(parentDiv, value, rowIdentifier, type, label) {
	var genericDiv = makeElement(parentDiv, "div", type + "Div");
	if (label !== undefined) {
		genericDiv.innerHTML = label + ": ";
	}
	var genericInput = makeElement(genericDiv, "input", type + "Input, valueInput");
	genericInput.value = value;
	genericInput.name = uniqueInputname(type + "-" + rowIdentifier);
}

function makeFiremodesDiv(myDiv, value, nodeId, name) {
	var firemodesDiv = makeElement(myDiv, "div", "firemodesDiv");
	var nameDiv = makeElement(firemodesDiv, "div", "firemodeTitleDiv");
	nameDiv.innerHTML = "Feuerfrequenzen";
	for (var ii in value)
		makeGenericInputDiv(firemodesDiv, value[ii], ii + "-" + nodeId + "-" + name, "firemode");
	return firemodesDiv;
}

function makeConcealabilityDiv(myDiv, value, nodeId, name) {
	return makeGenericInputDiv(myDiv, value, nodeId + "-" + name, "concealability", "kleinstes Versteck");
}

function makeAmmunitionDiv(myDiv, value, nodeId, name) {
	return makeGenericInputDiv(myDiv, value, nodeId + "-" + name, "ammunition", "Magazingröße");
}

function makeRangeDiv(myDiv, value, nodeId, name) {
	return makeGenericInputDiv(myDiv, value, nodeId + "-" + name, "range", "Reichweite");
}

function makeBonusDiv(myDiv, value, nodeId, name) {
	var bonusDiv = makeNameDiv(myDiv, "Bonus", "bonusNameDiv");//makeElement(myDiv, "div", "bonusDiv");
//	makeNameDiv(bonusDiv, "Bonus", "bonusNameDiv");
	makeBonusInput(bonusDiv, value[0], "Nah", nodeId, name);
	makeBonusInput(bonusDiv, value[1], "Medium", nodeId, name);
	makeBonusInput(bonusDiv, value[2], "Weit", nodeId, name);
	makeBonusInput(bonusDiv, value[3], "Extrem", nodeId, name);
	return bonusDiv;
}

function makeBonusInput(myDiv, value, distance, nodeId, name) {
	return makeGenericInputDiv(myDiv, value, distance + "-" + nodeId + "-" + name, "distance", distance);
}

function makeSkillDiv(myDiv, value, nodeId, name) {
	var skillDiv = makeElement(myDiv, "div", "skillDiv");
	var skillSelect = makeElement(skillDiv, "select", "skillSelect");
	skillSelect.name = uniqueInputname("skill-" + nodeId + "-" + name);
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
			var headerDiv = makeElement(node, "div", "headerDiv");
			var headerH2 = makeElement(headerDiv, "h2", "headerH2");
			headerH2.innerHTML = currentAttr;
			currentAttr = currentAttr.toLowerCase();
		}
		var myDiv = makeNameDiv(node, nextSkill.name, "skillDiv");
		var valueDiv = makeValueDiv(myDiv, nextSkill.value, node.id, nextSkill.name);
		var baseDiv = makeBaseDiv(myDiv, nextSkill.base, node.id, nextSkill.name);
		var factorDiv = makeFactorDiv(myDiv, nextSkill.factor, node.id, nextSkill.name);
	}
}

function makeNameDiv(node, name, className) {
	var myDiv = makeElement(node, "div", className);
	var nameDiv = makeElement(myDiv, "div", "nameDiv");
	nameDiv.innerHTML = name;
	return myDiv;
}

function makeValueDiv(myDiv, value, nodeId, name) {
	return makeGenericInputDiv(myDiv, value, nodeId + "-" + name, "value");
}

function makeFactorDiv(myDiv, value, nodeId, name) {
	return makeGenericInputDiv(myDiv, value, nodeId + "-" + name, "factor", "Faktor");
}

function uniqueInputname(name) {
	return name.toLowerCase();
	// TODO: leerzeichen, sonderzeichen, etc. entfernen.
}

// nicht mit populateBaseAttrNode verwechseln. 
function makeBaseDiv(myDiv, value, nodeId, name) {
	baseDiv = makeElement(myDiv, "div", "baseDiv");
	baseSelect = makeElement(baseDiv, "select", "baseSelect");
	baseSelect.name = uniqueInputname("base-" + nodeId + "-" + name);
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
	option = makeElement(select, "option");
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

function makeElement(parentNode, type, className) {
	var childNode = document.createElement(type);
	parentNode.appendChild(childNode);
	childNode.className = className;
	return childNode;
}

function exportChar() {
	var charMap = utilities.serialize(document.getElementById("characterForm"));
	currentChar = new Char();
	for (var ii in currentChar.attributes) {
		var nextAttr = currentChar.attributes[ii];
		nextAttr.value = charMap.get(uniqueInputname("value-attributes-" + nextAttr.name));
	}

	for (var ii in currentChar.base) {
		var nextBase = currentChar.base[ii];
		nextBase.value = charMap.get(uniqueInputname("value-base-" + nextBase.name));
	}

	charMap.forEach(function (value, key) {
		if (key.match('.*-attributes-.*')) {
			// ignore
		} else if (key.match('.*-base-.*')) {
			// ignore
		} else if (key.match('.*-skills-.*')) {
			console.log('Skill: ' + key);
		} else if (key.match('.*-weapon.*')) {
			console.log('Weapon: ' + key);
		} else {
			alert("Undefined key in export: " + key);
		}
	});

//Weapon: firemode-2-weapons-ak-47
//Weapon: firemode-1-weapons-ak-47
//Weapon: firemode-0-weapons-ak-47
//Weapon: concealability-weapons-ak-47
//Weapon: ammunition-weapons-ak-47
//Weapon: range-weapons-ak-47
//Weapon: distance-extrem-weapons-ak-47
//Weapon: distance-weit-weapons-ak-47
//Weapon: distance-medium-weapons-ak-47
//Weapon: distance-nah-weapons-ak-47
//Weapon: skill-weapons-ak-47
//Skill: factor-skills-waffentechnik

	charExport(currentChar, "export");
}
