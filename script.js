var time;
var block;

window.addEventListener("load", setup);

function setup() {
	block = document.getElementById("block");
	window.addEventListener("beforeunload", fade);
	
	clean(document.getElementById("window"));
	document.getElementById("window").style = "";
	
	time = [
		document.getElementById("hour"),
		document.getElementById("blink"),
		document.getElementById("minute"),
		document.getElementById("suffix")
	];
	
	updateTime();
}

function fade() {
	block.className = "fade";
}

function updateTime() {
	var now = new Date();
	
	time[0].innerHTML = now.getHours() % 12;
	
	if (now.getSeconds() % 2 > 0) {
		time[1].className = "off";
	} else {
		time[1].className = "on";
	}
	
	time[2].innerHTML = ("0" + now.getMinutes()).slice(-2);
	
	if (now.getHours() < 12) {
		time[3].innerHTML = " AM";
	} else {
		time[3].innerHTML = " PM";
	}
	
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
