window.addEventListener("load", setup);

function setup() {
	clean(document.getElementById("window"));
	document.getElementById("window").style = "";
	
	var time = document.getElementById("time");
	
	updateTime();
}

function updateTime() {
	var now = new Date();
	
	var timeSuffix;
	
	if (now.getHours() < 12) {
		timeSuffix = "AM";
	} else {
		timeSuffix = "PM";
	}
	
	time.innerHTML = String(now.getHours() % 12) + ":" + String(now.getMinutes()) + timeSuffix;
	
	window.setTimeout(updateTime, 100);
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