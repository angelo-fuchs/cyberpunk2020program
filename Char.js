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

this.base = [{"name": "Handle", "value": undefined},
{"name":"Age", "value": undefined}];

this.skills = [];
this.weapons = [];
this.inventory = [];
}

// equalsIgnoreCase
function eic(strTerm, strToSearch) 
{ 
	strToSearch = strToSearch.toLowerCase(); 
	strTerm = strTerm.toLowerCase(); 
	if(strToSearch==strTerm) 
	{ 
		return true; 
	} else { 
		return false; 
	} 
}

Char.prototype.load = function(jsonString) {
	var jsonObj = JSON.parse(jsonString);
	for(ii in this.base) {
		myBase = this.base[ii];
		for(jj in jsonObj.base) {
			nextBase = jsonObj.base[jj];
			if(eic(myBase.name,nextBase.name))
				myBase.value = nextBase.value;
		}
	}
	for(ii in this.attributes) {
		myAttr = this.attributes[ii];
		for(jj in jsonObj.attributes) {
			nextAttr = jsonObj.attributes[jj];
			if(eic(myAttr.name, nextAttr.name))
				myAttr.value = nextAttr.value;
		}
	}
	this.skills = jsonObj.skills;
	this.weapons = jsonObj.weapons;
	this.inventory = jsonObj.inventory;
}
