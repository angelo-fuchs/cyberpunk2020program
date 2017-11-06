var utilities = utilities || {};
function Char() {
	this.attributes = [
		{"name": "Body", "value": 0},
		{"name": "Ref", "value": 0},
		{"name": "Int", "value": 0},
		{"name": "Tech", "value": 0},
		{"name": "Luck", "value": 0},
		{"name": "Attr", "value": 0},
		{"name": "Cool", "value": 0},
		{"name": "Emp", "value": 0},
		{"name": "Move", "value": 0}
	];

	this.base = [
		{"name": "Handle", "value": "John Doe"},
		{"name": "Alter", "value": "120 Zyklen"},
		{"name": "Spieler", "value": "Jehova"},
		{"name": "Geschlecht", "value": "Herm"},
		{"name": "Größe", "value": "0,0001 pc"},
		{"name": "Gewicht", "value": "120 Scheffel"},
		{"name": "Haar", "value": "Nur an den Füßen"},
		{"name": "Augen", "value": "Gelegentlich"},
		{"name": "Stil", "value": "Lang und Hart"}];

	this.skills = [];
	this.armor = [];
	this.weapons = [];
	this.inventory = [];
	this.cyberware = [];
}

Char.prototype = {
	/**
	 * fills the properties of this character with the values from the JSON.
	 * @param {String} jsonString a JSON representation of the values from a Character
	 * @returns {undefined} nothing.
	 */
	load: function (jsonString) {
		var jsonObj = JSON.parse(jsonString);
		for (var ii in this.base) {
			var myBase = this.base[ii];
			for (var jj in jsonObj.base) {
				var nextBase = jsonObj.base[jj];
				if (utilities.equalsIgnoreCase(myBase.name, nextBase.name))
					myBase.value = nextBase.value;
			}
		}
		for (ii in this.attributes) {
			var myAttr = this.attributes[ii];
			for (var jj in jsonObj.attributes) {
				var nextAttr = jsonObj.attributes[jj];
				if (utilities.equalsIgnoreCase(myAttr.name, nextAttr.name))
					myAttr.value = nextAttr.value;
			}
		}
		this.skills = jsonObj.skills;
		this.weapons = jsonObj.weapons;
		this.inventory = jsonObj.inventory;
		this.armor = jsonObj.armor;
		this.cyberware = jsonObj.cyberware;
	},
	/**
	 * adds an element to the Character
	 * @param {Array} path the path to that element. Numbers are treated as arraynodes. 
	 *							First entry MUST be the lower case root array element (e.G. 'base', 'attributes', etc.)
	 *							Second entry MUST be the lower case name of that element (e.G. 'Attr', 'Handle', 'AK-47', etc.)
	 * @param {Object} value the value that element should have
	 * @returns {undefined} nothing
	 */
	addElement: function (path, value) {
		var baseArray = this.getBaseArrayByName(path[0]);
		var element = this.getOrCreateElementFromName(baseArray, path[1]);
		if(path.length === 3) { // the default case, we have a property that we set directly.
			element[path[2]] = value;
		} else {
			var subElement = element[path[2]];
			if(subElement === undefined) {
				subElement = [];
				element[path[2]] = subElement;
			}
			subElement[path[3]] = value;
		}
	},
	getOrCreateElementFromName: function (baseArray, name) {
		for (var jj in baseArray) { // currentElement is an Array at this point.
			var nextElement = baseArray[jj];
			if (utilities.equalsIgnoreCase(nextElement.name, name)) {
				baseArray = nextElement;
				return nextElement;
			}
		}
		var newElement = {"name": name};
		baseArray.push(newElement);
		return newElement;
	},
	getBaseArrayByName: function (name) {
		switch (name) {
			case 'attributes' :
				return this.attributes;
			case 'base' :
				return this.base;
			case 'skills' :
				return this.skills;
			case 'weapons' :
				return this.weapons;
			case 'armor' :
				return this.armor;
			case 'inventory' :
				return this.inventory;
			case 'cyberware' :
				return this.cyberware;
			default:
				throw 'unexpected base array entry: ' + name;
		}
	}
};
