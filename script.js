var block;
var storage;
var background;
var time;
var search;
var bookmark;
var special;

window.addEventListener("load", setup);

function setup() {
	// Clean text nodes
	clean(document.getElementById("window"));
	
	// Block
	block = document.getElementById("block");
	window.addEventListener("beforeunload", fadeout);
	
	// Storage
	storage = window.localStorage;
	
	// background
	background = document.getElementById("background");
	
	// better code later
	background.className = "random" + (Math.floor(Math.random() * 2) + 1);
	
	// Time
	time = {
		parent: document.getElementById("timedate"),
		hour: document.getElementById("hour"),
		blink: document.getElementById("blink"),
		minute: document.getElementById("minute"),
		suffix: document.getElementById("suffix")
	};
	
	// Search
	search = {
		parent: document.getElementById("search"),
		box: document.getElementById("searchbox"),
		button: document.getElementById("searchbutton"),
		newTab: false
	};
	
	search.button.addEventListener("mousedown", altSearch);
	search.parent.addEventListener("submit", goSearch);
	search.box.addEventListener("input", updateSearch);
	
	// Bookmark
	bookmark = document.querySelectorAll(".icon a");
	
	/*bookmark.forEach(function(bookmarkItem) {
		bookmarkItem.addEventListener("click", getBookmark(bookmarkItem));
	});*/
	
	// Special keys
	special = {
		shift: false,
		ctrl: false,
		alt: false
	}
	
	document.addEventListener("keydown", updateSpecial);
	document.addEventListener("keyup", updateSpecial);
	
	// Everything's good to go!
	updateStorage();
	updateTime();
	updateSearch();
}

function fadeout() {
	block.className = "fadeout";
}

function toggleTheme() {
	if (storage.getItem("theme") == "white") {
		storage.setItem("theme", "");
	} else {
		storage.setItem("theme", "white");
	}
	
	updateStorage();
}

/*function getBookmark(bookmarkItem) {
	return function(e) {
		e.preventDefault();
		
		fadeout();
		window.setTimeout(function() { location.assign(bookmarkItem.href); }, 500);
		
		return false;
	}
}*/

function updateStorage() {
	document.documentElement.className = storage.getItem("theme");
}

function updateTime() {
	var now = new Date();
	
	time.hour.innerHTML = mod((now.getHours() - 1), 12) + 1;
	
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
	//Very dumb code, but...
	if (search.newTab || special.shift) {
		search.button.value = "\u25B7";
		search.button.title = "Search in new tab";
	} else {
		search.button.value = "\u25B6";
		search.button.title = "Search";
	}
	
	if (search.box.value.length > 0) {
		search.box.className = "on";
		search.button.className = "on";
	} else {
		search.box.className = "";
		search.button.className = "off";
		search.button.title = "";
	}
}

function updateSpecial(event) {
	special.shift = event.shiftKey;
	special.ctrl = event.ctrlKey;
	special.alt = event.altKey;
	
	updateSearch();
}

function goSearch(event) {
	var searchURL = "https://google.com/search?q=" + encodeURI(search.box.value);
	
	// override search.newTab if you're holding shift (or ctrl and alt, but there's no feedback for those...)
	if (special.shift || special.ctrl || special.alt) search.newTab = true;
	
	if (search.box.value.length > 0) {
		if (search.newTab) {
			window.open(searchURL);
		} else {
			location.assign(searchURL);
		}
	}
	
	return true;
}

// I wrote this function name before knowing that holding alt and searching
// will result in a new tab! That's sorta neat. Unfortunately, I have to use shift...
// Thanks for reading my source code. I hope you tolerate it...
function altSearch(event) {
	if (search.box.value.length > 0 && event.which == 2) {
		search.newTab = !search.newTab;
		updateSearch();
	}
}

/*function goBookmark() {
	
}*/

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

function mod(n, m) {
	return ((n % m) + m) % m;
}
