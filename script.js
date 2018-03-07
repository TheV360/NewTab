var block;
var storage;
var background;
var header;
var time;
var date;
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
	
	// Background
	background = document.getElementById("background");
	background.className = "random" + (Math.floor(Math.random() * 2) + 1);
	
	// Header
	header = {
		clock: document.getElementById("clock"),
		customize: document.getElementById("customize")
	};
	header.clock.addEventListener("click", toggleTheme);
	header.customize.addEventListener("click", toggleDate);
	
	// Time
	time = {
		parent: document.getElementById("timedate"),
		hour: document.getElementById("hour"),
		blink: document.getElementById("blink"),
		minute: document.getElementById("minute"),
		second: document.getElementById("second"),
		suffix: document.getElementById("suffix"),
		seconds: false,
		military: false
	};
	date = {
		day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		enabled: false,
		short: true
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
	updateDateTime();
	updateSearch();
}

function fadeout() {
	block.className = "fadeout";
}

function toggleStorage(item, toggles, step = 1) {
	var value;
	
	value = storage.getItem(item);
	
	if (toggles) {
		var index;
		
		storage.setItem(item, toggles[mod(toggles.indexOf(value) + step, toggles.length)]);
		
		console.log("result: " + storage.getItem(item).toString());
	} else {
		storage.setItem(item, !(storage.getItem(item) === "true"));
		
		console.log("result: " + storage.getItem(item).toString());
	}
	
	updateStorage();
}

function toggleTheme() {
	toggleStorage("theme", ["", "white", "red", "green", "blue"]);
}

function toggleDate() {
	toggleStorage("date");
	
	updateStorage();
	updateSearch();
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
	date.enabled = storage.getItem("date") === "true";
}

function updateDateTime() {
	var now = new Date();
	
	if (time.military) {
		time.hour.innerHTML = now.getHours();
	} else {
		time.hour.innerHTML = mod((now.getHours() - 1), 12) + 1;
	}
	
	if (now.getSeconds() % 2 > 0 && !time.seconds) {
		time.blink.className = "off";
	} else {
		time.blink.className = "on";
	}
	
	time.minute.innerHTML = ("0" + now.getMinutes()).slice(-2);
	
	if (time.seconds) {
		time.second.className = "on";
		time.second.innerHTML = ":" + ("0" + now.getSeconds()).slice(-2);
	} else {
		time.second.className = "off";
	}
	
	if (time.military) {
		time.suffix.innerHTML = "";
	} else {
		if (now.getHours() < 12) {
			time.suffix.innerHTML = " AM";
		} else {
			time.suffix.innerHTML = " PM";
		}
	}
	
	if (date.enabled) {
		time.parent.className = "on";
		search.box.title = "Click to Search";
		
		if (date.short) {
			search.box.placeholder = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate();
		} else {
			search.box.placeholder = date.day[now.getDay()] + ", " + date.month[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
		}
	} else {
		time.parent.className = "";
		search.box.title = "";
		search.box.placeholder = "Search";
	}
	
	window.setTimeout(updateDateTime, 100);
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
		search.box.className = "off";
		search.button.className = "off";
		search.button.title = "";
	}
	
	if (date.enabled) {
		search.box.className += " date";
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
