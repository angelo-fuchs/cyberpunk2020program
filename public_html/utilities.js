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
	 * Creates a div that contains a name and a text area.
	 * @param {Element} parentDiv the container for the new div
	 * @param {String} value the value that should be displayed
	 * @param {String} area section of the object (e.G. weapons for a character)
	 * @param {String} name the name of the input in its area (e.G. ak-47 for a weapon in a character)
	 * @param {String} type The aspect of the element (e.G. ammunition for the ak-47)
	 * @param {String} label The text that should accompany the input
	 * @returns {Element} the newly created div
	 */
	makeTextAreaDiv: function (parentDiv, value, area, name, type, label, position) {
		var genericDiv = this.makeLabeledDiv(parentDiv, type, label);
		var genericInput = this.makeElement(genericDiv, "textarea", type + "Input, valueInput");
		genericInput.value = value;
		genericInput.name = this.uniqueInputname(area, name, type);
		return genericDiv;
	},
	/**
	 * Creates a div that contains a name and an input element.
	 * @param {Element} parentDiv the container for the new div
	 * @param {String} value the value that should be displayed
	 * @param {String} area section of the object (e.G. weapons for a character)
	 * @param {String} name the name of the input in its area (e.G. ak-47 for a weapon in a character)
	 * @param {String} type The aspect of the element (e.G. ammunition for the ak-47)
	 * @param {String} label The text that should accompany the input
	 * @param {int} position the position inside the array, optional
	 * @returns {Element} the newly created div
	 */
	makeGenericInputDiv: function (parentDiv, value, area, name, type, label, position) {
		var genericDiv = this.makeLabeledDiv(parentDiv, type, label);
		var genericInput = this.makeElement(genericDiv, "input", type + "Input, valueInput");
		genericInput.value = value;
		genericInput.name = this.uniqueInputname(area, name, type, position);
		return genericDiv;
	},
	/**
	 * Creates a div that contains a name and an input element.
	 * @param {Element} parentDiv the container for the new div
	 * @param {boolean} value the value that should be displayed
	 * @param {String} area section of the object (e.G. weapons for a character)
	 * @param {String} name the name of the input in its area (e.G. ak-47 for a weapon in a character)
	 * @param {String} type The aspect of the element (e.G. ammunition for the ak-47)
	 * @param {String} label The text that should accompany the input
	 * @param {int} position the position inside the array, optional
	 * @returns {Element} the newly created div
	 */
	makeCheckboxDiv: function (parentDiv, value, area, name, type, label, position) {
		var genericDiv = this.makeLabeledDiv(parentDiv, type, label);
		var checkbox = this.makeElement(genericDiv, "input", type + "Input, valueInput");
		checkbox.type = "checkbox";
		if(value) {
			checkbox.checked = 'checked';
		} else {
			checkbox.checked = '';
		}
		checkbox.value = 'true';
		checkbox.name = this.uniqueInputname(area, name, type, position);
		return genericDiv;
	},
	
	/**
	 * Creates a div that contains a name and an input element.
	 * @param {Element} parentDiv the container for the new div
	 * @param {String} type The aspect of the element (e.G. ammunition for the ak-47)
	 * @param {String} label The text that should accompany the input
	 * @returns {Element} the newly created div
	 */
	makeLabeledDiv: function (parentDiv, type, label) {
		var genericDiv = this.makeElement(parentDiv, "div", type + "Div");
		if (label !== undefined) {
			genericDiv.innerHTML = label + ": ";
		}
		return genericDiv;
	},
	/**
	 * Create an element with a given class name.
	 * @param {Element} parentNode the container for the new Element
	 * @param {String} type The type of the element (e.G. div, input)
	 * @param {String} className The class that this element should have
	 * @returns {Element} the newly created Element.
	 */
	makeElement: function (parentNode, type, className) {
		var childNode = document.createElement(type);
		parentNode.appendChild(childNode);
		childNode.className = className;
		return childNode;
	},
	/**
	 * This separator must be constant during a run. It is required for the frontend fields.
	 */
	g_uniqueNameSeparator: '~',
	g_uniqueCssNameSeparator: '-',
	/**
	 * Create a unique string from the given parameters.
	 * This function uses a simple char (-) as separator.
	 * That is unusuable for the input fields, but well suited for CSS ids.
	 * Actually its only unique if the combination of parameters is.
	 * @param {String} area section of the object (e.G. weapons for a character)
	 * @param {String} name the name of the input in its area (e.G. ak-47 for a weapon in a character)
	 * @param {String} type The aspect of the element (e.G. ammunition for the ak-47)
	 * @param {String} position the position inside the array, optional
	 * @returns {String} a concatenation of the parameters with the uniqueNameSeparator.
	 */
	uniqueCssName: function (area, name, type, position) {
		return this.uniqueName(area, name, type, position, this.g_uniqueCssNameSeparator);
	},
	/**
	 * Create a unique string from the given parameters.
	 * Actually its only unique if the combination of parameters is.
	 * @param {String} area section of the object (e.G. weapons for a character)
	 * @param {String} name the name of the input in its area (e.G. ak-47 for a weapon in a character)
	 * @param {String} type The aspect of the element (e.G. ammunition for the ak-47)
	 * @param {String} position the position inside the array, optional
	 * @returns {String} a concatenation of the parameters with the uniqueNameSeparator.
	 */
	uniqueInputname: function (area, name, type, position) {
		return this.uniqueName(area, name, type, position, this.g_uniqueNameSeparator);
	},
	uniqueName: function (area, name, type, position, separator) {
		var uniqueInputname = area + separator + name + separator + type;
		if (position !== undefined) {
			uniqueInputname += separator + position;
		}
		uniqueInputname = uniqueInputname.replace(" ", "");
		return uniqueInputname.toLowerCase();
	},
	/**
	 * undoes the action of uniqueInputName
	 * @param {String} name a name generated by uniqueInputName
	 * @returns {array} the elements of the input as array
	 */
	arrayFromUniqueInputName: function (name) {
		return name.split(this.g_uniqueNameSeparator);
	}
};
