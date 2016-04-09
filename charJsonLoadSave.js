var chars = new Array(4);
var nscs = new Array(10);

function charImport(callback) {
	var pom = document.createElement('input');
	pom.setAttribute('type', 'file');

	pom.style.display = 'none';
	document.body.appendChild(pom);

	pom.onchange = function() {
		var f = pom.files[0];
		loadCharFromFile(f, callback);
	}
	pom.click();

	document.body.removeChild(pom);
}

function loadCharFromFile(f, callback) {
	var r = new FileReader();
	r.onload = function() {
		var allText = r.result;
		importChar(allText);
		callback();
	}
	r.readAsText(f);
}

function importChar(which) {
	var newChar = new Char();
	newChar.load(which);
	if(window.confirm("Ok: Import as char, Cancel: Import as NSC"))
		chars.push(newChar);
	else
		nscs.push(newChar);
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
