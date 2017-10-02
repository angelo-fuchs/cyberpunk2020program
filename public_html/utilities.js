/**
 * Some utilities functions that can be used throughout the program.
 */
utilities = {
	/**
	 * Function returns list of input name:value sets from a form.
	 * Basis taken from: http://stackoverflow.com/questions/23139876/getting-all-form-values-by-javascript
	 * @param {form} form
	 * @returns {Map<String, String>} Key Value Pairs, empty if param not a form.
	 */
	serialize: function (form) {

		var data = new Map();
		if (!form || form.nodeName !== "FORM") {
			return data;
		}
		for (var ii = form.elements.length - 1; ii >= 0; ii = ii - 1) {
			if (form.elements[ii].name === "") {
				continue;
			}
			switch (form.elements[ii].nodeName) {
				case 'INPUT':
					switch (form.elements[ii].type) {
						case 'text':
						case 'hidden':
						case 'password':
						case 'button':
						case 'reset':
						case 'submit':
							data.set(form.elements[ii].name, form.elements[ii].value);
							break;
						case 'checkbox':
						case 'radio':
							if (form.elements[ii].checked) {
								data.set(form.elements[ii].name, form.elements[ii].value);
							}
							break;
					}
					break;
				case 'file':
					break;
				case 'TEXTAREA':
					data.set(form.elements[ii].name, form.elements[ii].value);
					break;
				case 'SELECT':
					switch (form.elements[ii].type) {
						case 'select-one':
							data.set(form.elements[ii].name, form.elements[ii].value);
							break;
						case 'select-multiple':
							for (var jj = form.elements[ii].options.length - 1; jj >= 0; jj = jj - 1) {
								if (form.elements[ii].options[jj].selected) {
									data.set(form.elements[ii].name, form.elements[ii].options[jj].value);
								}
							}
							break;
					}
					break;
				case 'BUTTON':
					switch (form.elements[ii].type) {
						case 'reset':
						case 'submit':
						case 'button':
							data.set(form.elements[ii].name, form.elements[ii].value);
							break;
					}
					break;
			}
		}
		return data;
	},
	/**
	 * compares two strings ignoring their case.
	 * @param {string} strTerm first string
	 * @param {string} strToSearch second string
	 * @returns {Boolean}
	 */
	equalsIgnoreCase: function (strTerm, strToSearch)
	{
		strToSearch = strToSearch.toLowerCase();
		strTerm = strTerm.toLowerCase();
		return strToSearch === strTerm;
	},

	/** removes all children from this node.
	 * 
	 * @param {Element} node the node to be cleared
	 * @returns nothing
	 */
	clearNode: function (node) {
		while (node.childNodes.length > 0) {
			var nextChild = node.childNodes[0];
			node.removeChild(nextChild);
		}
	},

	/**
	 * Creates a div that contains a name and an input element.
	 * @param {Element} parentDiv
	 * @param {String} value
	 * @param {type} area
	 * @param {type} name
	 * @param {type} type
	 * @param {type} label
	 * @param {type} position
	 * @returns {undefined}
	 */
	makeGenericInputDiv: function (parentDiv, value, area, name, type, label, position) {
		var genericDiv = this.makeElement(parentDiv, "div", type + "Div");
		if (label !== undefined) {
			genericDiv.innerHTML = label + ": ";
		}
		var genericInput = this.makeElement(genericDiv, "input", type + "Input, valueInput");
		genericInput.value = value;
		genericInput.name = this.uniqueInputname(area, name, type, position);
	},
	makeElement: function (parentNode, type, className) {
		var childNode = document.createElement(type);
		parentNode.appendChild(childNode);
		childNode.className = className;
		return childNode;
	},
	g_uniqueNameSeparator: '~',
	uniqueInputname: function (area, name, type, position) {
		var uniqueInputname = area + this.g_uniqueNameSeparator + name + this.g_uniqueNameSeparator + type;
		if (position !== undefined) {
			uniqueInputname += this.g_uniqueNameSeparator + position;
		}
		return uniqueInputname.toLowerCase();
	},
	arrayFromUniqueInputName: function (name) {
		return name.split(this.g_uniqueNameSeparator);
	}
};