var time;
var search;
var block;

window.addEventListener("load", setup);

function setup() {
	block = document.getElementById("block");
	window.addEventListener("beforeunload", fadeout);
	
	clean(document.getElementById("window"));
	
	time = {
		parent: document.getElementById("timedate"),
		hour: document.getElementById("hour"),
		blink: document.getElementById("blink"),
		minute: document.getElementById("minute"),
		suffix: document.getElementById("suffix")
	};
	
	updateTime();
	
	search = {
		parent: document.getElementById("search"),
		box: document.getElementById("searchbox"),
		button: document.getElementById("searchbutton")
	};
	
	search.parent.addEventListener("submit", updateSearch);
}

function fadeout() {
	block.className = "fadeout";
}

function updateTime() {
	var now = new Date();
	
	time.hour.innerHTML = ((now.getHours() - 1) % 12) + 1;
	
	if (now.getSeconds() % 2 > 0) {
		time.blink.className = "off";
	} else {
		time.blink.className = "on";
	}
	
	time.minute.innerHTML = ("0" + now.getMinutes()).slice(-2);
	
	if (now.getHours() < 12) {
		time.suffix.innerHTML = " AM";
	} else {
		time.suffix.innerHTML = " PM";
	}
	
	window.setTimeout(updateTime, 100);
}

function updateSearch() {
	if (search.box.value.length > 0)
		location.assign("https://google.com/search?q=" + encodeURI(search.box.value));
	return true;
}

// From sitepoint.com/removing-useless-nodes-from-the-dom/
// I just fixed their awful formatting
// and made it not mess with syntax highlighting
function clean(node) {
	for (var n = 0; n < node.childNodes.length; n++) {
		var child = node.childNodes[n];
		
		if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
			node.removeChild(child);
			n--;
		} else if (child.nodeType === 1 && !/pre|code|blockquote/i.test(child.tagName)) {
			clean(child);
		}
	}
}
