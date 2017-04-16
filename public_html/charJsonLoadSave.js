loadSave = {
	/**
	 * Opens a "Open File" Dialog and processes the loaded file as a character.
	 * @param {function} callback a function with one parameter (Char) that will be called when the loading finished.
	 * @returns {undefined} Nothing.
	 */
	charImport: function (callback) {
		var pom = document.createElement('input');
		pom.setAttribute('type', 'file');

		pom.style.display = 'none';
		document.body.appendChild(pom);

		pom.onchange = function () {
			var f = pom.files[0];
			loadCharFromFile(f, callback);
		};
		pom.click();

		document.body.removeChild(pom);
	},
	/**
	 * gets a file, reads the file, converts the read file to a Character and calls the callback with that Character.
	 * @param {File} f the file to be read
	 * @param {function] callback a function with one parameter (Char) that will be called when the loading finished.
	 */
	loadCharFromFile: function (f, callback) {
		var r = new FileReader();
		r.onload = function () {
			var allText = r.result;
			loadedChar = new Char();
			loadedChar.load(allText);
			callback(loadedChar);
		};
		r.readAsText(f);
	},
	/**
	 * converts the Char to a JSON String and presents a Download with the name of the character.
	 * @param {type} which the Character to be exported.
	 * @param {type} name the name of that character.
	 * @returns {undefined} nothing.
	 */
	charExport: function (which, name) {
		var json = getJsonForChar(which);
		presentDownload(json, name + '.json');
	},
	/**
	 * converts the Character to a JSON String.
	 * @param {type} which the Character to be coverted.
	 * @returns {String} The JSON of that Character.
	 */
	getJsonForChar: function (which) {
		return JSON.stringify(which);
	},
	/**
	 * Opens a 'save file' dialog.
	 * @param {type} content whats in the file
	 * @param {type} name default name of the file
	 * @returns {undefined} nothing
	 */
	presentDownload: function (content, name) {
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(content));
		pom.setAttribute('download', name);

		pom.style.display = 'none';
		document.body.appendChild(pom);

		pom.click();

		document.body.removeChild(pom);
	}
};