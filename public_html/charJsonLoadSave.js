/**
 * Opens a "Open File" Dialog and processes the loaded file as a character.
 * @param {function} callback a function with one parameter (Char) that will be called when the loading finished.
 * @returns {undefined} Nothing.
 */
function charImport(callback) {
	var pom = document.createElement('input');
	pom.setAttribute('type', 'file');

	pom.style.display = 'none';
	document.body.appendChild(pom);

	pom.onchange = function() {
		var f = pom.files[0];
		loadCharFromFile(f, callback);
	};
	pom.click();

	document.body.removeChild(pom);
}

function loadCharFromFile(f, callback) {
	var r = new FileReader();
	r.onload = function() {
		var allText = r.result;
		loadedChar = new Char();
		loadedChar.load(allText);
		callback(loadedChar);
	};
	r.readAsText(f);
}

function charExport(which, name) {
	var json = getJsonForChar(which);
	presentDownload(json, name + '.json');
}

function getJsonForChar(which) {
	return JSON.stringify(which);
}

function presentDownload(content, name) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(content));
  pom.setAttribute('download', name);

  pom.style.display = 'none';
  document.body.appendChild(pom);

  pom.click();

  document.body.removeChild(pom);
}
