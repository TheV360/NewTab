var block, background;
var storage, customize;
var header;
var time, date;
var search;
var icons, links;
var special;

var Module;

window.addEventListener("load", setup);

function setup() {
	// Clean text nodes
	clean(document.body);
	
	// Block
	block = document.getElementById("block");
	window.addEventListener("pageshow", fadeIn);
	
	// Storage
	storage = window.localStorage;
	if (storage.getItem("setup")!=="true") { resetStorage(); }
	
	// Background
	background = document.getElementById("background");
	background.className = "random" + (Math.floor(Math.random() * 3) + 1);
	
	// Header
	header = {
		clock: document.getElementById("header-clock"),
		customize: document.getElementById("header-customize")
	};
	header.customize.addEventListener("click", toggleMenu);
	
	// Customize
	customize = {
		parent: document.getElementById("customize"),
		buttons: {
			back: {
				element: "customize-backbutton",
				callback: toggleMenu
			},
			reset: {
				element: "customize-resetbutton",
				callback: resetStorage
			}
		},
		toggles: {
			images: "customize-imagestoggle",
			seconds: "customize-secondstoggle",
			military: "customize-militarytoggle",
			date: "customize-datetoggle",
			longdate: "customize-longdatetoggle",
			searchfocus: "customize-searchfocustoggle"
		},
		selects: {
			theme: "customize-themeselect",
			searchprovider: "customize-searchproviderselect"
		},
		texts: {
			customprovider: "customize-customprovidertext"
		},
		tabs: {
			backgrounds: {
				tab: "tab-backgrounds",
				content: "customize-backgrounds"
			},
			colors: {
				tab: "tab-colors",
				content: "customize-colors"
			},
			timedate: {
				tab: "tab-timedate",
				content: "customize-timedate"
			},
			search: {
				tab: "tab-search",
				content: "customize-search"
			},
			icons: {
				tab: "tab-icons",
				content: "customize-icons"
			},
			advanced: {
				tab: "tab-advanced",
				content: "customize-advanced"
			},
			about: {
				tab: "tab-about",
				content: "customize-about"
			},
		}
	}
	
	for (button in customize.buttons) {
		customize.buttons[button].element = document.getElementById(customize.buttons[button].element);
		customize.buttons[button].element.addEventListener("click", customize.buttons[button].callback);
	}
	
	for (toggle in customize.toggles) {
		customize.toggles[toggle] = document.getElementById(customize.toggles[toggle]);
		customize.toggles[toggle].addEventListener("click", checkBox(customize.toggles[toggle], toggle));
	}
	
	for (select in customize.selects) {
		customize.selects[select] = document.getElementById(customize.selects[select]);
		customize.selects[select].addEventListener("change", selectBox(customize.selects[select], select));
	}
	
	for (text in customize.texts) {
		customize.texts[text] = document.getElementById(customize.texts[text]);
		customize.texts[text].addEventListener("change", textBox(customize.texts[text], text));
	}
	
	for (tab in customize.tabs) {
		customize.tabs[tab].tab = document.getElementById(customize.tabs[tab].tab);
		customize.tabs[tab].content = document.getElementById(customize.tabs[tab].content);
		customize.tabs[tab].tab.addEventListener("click", tabClick(tab));
	}
	
	// Time
	time = {
		parent: document.getElementById("time"),
		hour: document.getElementById("time-hour"),
		blink: document.getElementById("time-blink"),
		minute: document.getElementById("time-minute"),
		second: document.getElementById("time-second"),
		suffix: document.getElementById("time-suffix"),
		seconds: false,
		military: false
	};
	date = {
		day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		enabled: false,
		long: false
	};
	
	// Search
	search = {
		parent: document.getElementById("search"),
		box: document.getElementById("search-box"),
		button: document.getElementById("search-submit"),
		new: false,
		provider: storage.getItem("searchprovider"),
		focus: storage.getItem("searchfocus") === "true"
	};
	
	search.button.addEventListener("mousedown", altSearch);
	search.parent.addEventListener("submit", goSearch);
	search.box.addEventListener("input", updateSearch);
	
	if (search.focus) {
		search.box.focus();
		search.box.select();
	}
	
	// Links
	links = document.querySelectorAll("a");
	
	for (i = 0; i < links.length; i++) {
		links[i].addEventListener("click", linkClick(links[i]));
	}
	
	// Special keys
	special = {
		shift: false,
		ctrl: false,
		alt: false
	}
	
	document.addEventListener("keydown", updateSpecial);
	document.addEventListener("keyup", updateSpecial);
	
	// Everything's good to go!
	update();
	updateTimeDate();
}

function fadeIn() {
	block.className = "fadein";
	
	var time = window.getComputedStyle(block).getPropertyValue("--animation-block-fadein");
	
	return timeToMilliseconds(time);
}

function fadeOut() {
	block.className = "fadeout";
	
	var time = window.getComputedStyle(block).getPropertyValue("--animation-block-fadeout");
	
	return timeToMilliseconds(time);
}

function timeToMilliseconds(time) {
	if (time && time.indexOf("s" > 0)) {
		// Convert from CSS units to milliseconds
		if (time.indexOf("ms") > 0) {
			time = parseFloat(time);
		} else if (time.indexOf("s" > 0)) {
			time = parseFloat(time) * 1000;
		}
	} else {
		console.log("Time invalid! Falling back to .5 seconds.");
		time = 500;
	}
}

function checkBox(element, item) {
	var result;
	
	result = storage.getItem(item) === "true";
	
	if (result) {
		element.className = "";
	} else {
		element.className = "off";
	}
	
	return function() {
		result = toggleStorage(item);
		
		if (result) {
			element.className = "";
		} else {
			element.className = "off";
		}
		
		update();
	}
}

function selectBox(element, item) {
	var result;
	var toggles;
	
	result = storage.getItem(item);
	
	toggles = [];
	
	for (i = 0; i < element.options.length; i++) {
		toggles.push(element.options[i].value);
	}
	
	if (toggles.indexOf(result) >= 0) {
		element.selectedIndex = toggles.indexOf(result);
	} else {
		element.selectedIndex = 0;
	}
	
	return function(e) {
		storage.setItem(item, e.target.value);
		
		result = e.target.value;
		
		if (toggles.indexOf(result) >= 0) {
			element.selectedIndex = toggles.indexOf(result);
		} else {
			element.selectedIndex = 0;
		}
		
		update();
	}
}

function textBox(element, item) {
	var result;
	
	result = storage.getItem(item);
	
	if (result) {
		element.value = result;
	} else {
		element.value = "";
	}
	
	return function() {
		storage.setItem(item, element.value);
		
		update();
	}
}

function tabClick(name) {
	var tab = customize.tabs[name].tab;
	var content = customize.tabs[name].content;
	
	return function() {
		var other = document.querySelectorAll("#customize-tabs li.on");
		
		for (element in other) {
			other[element].className = "";
		}
		
		tab.className = "on";
		
		other = document.querySelectorAll("#customize-tabcontent div.on");
		
		for (element in other) {
			other[element].className = "";
		}
		
		content.className = "on";
	}
}

function linkClick(link) {
	return function(event) {
		var callback = function() { document.location.assign(link.href); };
		var time = window.getComputedStyle(link).getPropertyValue("--animation-block-fadeout");
		
		time = timeToMilliseconds(time);
		
		window.setTimeout(callback, time);
		fadeOut();
		
		event.preventDefault();
	}
}

function resetStorage() {
	if (storage.getItem("setup")!=="true" || confirm("Reset customization settings to defaults?\nThis will delete all your custom CSS and it cannot be undone.")) {
		storage.clear();
		
		storage.setItem("setup", "true");
		
		storage.setItem("theme", "");
		storage.setItem("images", "false");
		
		storage.setItem("seconds", "false");
		storage.setItem("military", "false");
		
		storage.setItem("date", "false");
		storage.setItem("longdate", "false");
		
		storage.setItem("searchfocus", "false");
		storage.setItem("searchprovider", document.getElementById("customize-searchproviderselect").options[0].value);
		storage.setItem("customprovider", "");
	}
}

function toggleStorage(item, toggles, step = 1) {
	var value;
	
	value = storage.getItem(item);
	
	if (toggles) {
		var index;
		
		if (value === null) value = toggles[0];
		
		storage.setItem(item, toggles[mod(toggles.indexOf(value) + step, toggles.length)]);
	} else {
		if (value === null) value = "false";
		
		storage.setItem(item, (storage.getItem(item) !== "true").toString());
		
		return value !== "true";
	}
	
	updateStorage();
}

function toggleMenu() {
	if (document.getElementById("customize").className === "") {
		document.getElementById("customize").className = "on";
	} else {
		document.getElementById("customize").className = "";
	}
	
	update();
}

function update() {
	updateStorage();
	updateSearch();
}

function updateStorage() {
	document.documentElement.className = storage.getItem("theme");
	if (storage.getItem("searchprovider")!=="") {
		search.provider = storage.getItem("searchprovider");
	} else if (storage.getItem("customprovider")!=="") {
		search.provider = storage.getItem("customprovider");
	} else {
		search.provider = false;
	}
	background.className = "random" + (Math.floor(Math.random() * 3) + 1);
	if (storage.getItem("images") === "true")
		background.className += " images";
	search.focus = storage.getItem("searchfocus") === "true";
	time.seconds = storage.getItem("seconds") === "true";
	time.military = storage.getItem("military") === "true";
	date.enabled = storage.getItem("date") === "true";
	date.long = storage.getItem("longdate") === "true";
}

function updateTimeDate() {
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
		
		if (date.long) {
			search.box.placeholder = date.day[now.getDay()] + ", " + date.month[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
		} else {
			search.box.placeholder = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
		}
	} else {
		time.parent.className = "";
		search.box.title = "";
		search.box.placeholder = "Search";
	}
	
	window.setTimeout(updateTimeDate, 100);
}

function updateSearch() {
	//Very dumb code, but...
	if (search.new || special.shift) {
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
	var time = window.getComputedStyle(search.box).getPropertyValue("--animation-block-fadeout");
	var callback;
	
	if (search.provider) {
		var searchURL = search.provider.replace("%s", encodeURI(search.box.value));
		
		// override search.new if you're holding shift (or ctrl and alt, but there's no feedback for those...)
		if (special.shift || special.ctrl || special.alt) search.new = true;
		
		if (search.box.value.length > 0) {
			callback = function() {
				if (search.new) {
					window.open(searchURL);
				} else {
					location.assign(searchURL);
				}
			};
			
			window.setTimeout(callback, timeToMilliseconds(time));
			fadeOut();
		}
	} else {
		toggleMenu();
		tabClick("search")();
	}
	
	return true;
}

// I wrote this function name before knowing that holding alt and searching
// will result in a new tab! That's sorta neat. Unfortunately, I have to use shift...
// Thanks for reading my source code. I hope you tolerate it...
function altSearch(event) {
	if (search.box.value.length > 0 && event.which == 2) {
		search.new = !search.new;
		updateSearch();
	}
}

// Hey, spoiling the surprise isn't fun... find it out yourself...
function eggStart() {
	var eggCanvas = document.createElement("canvas");
	var eggContext;
	var eggScript = document.createElement("script");
	
	eggCanvas.width = "128";
	eggCanvas.height = "128";
	
	eggContext = eggCanvas.getContext("2d");
	eggContext.imageSmoothingEnabled = false;
	
	eggScript.type = "text/javascript";
	eggScript.src = "assets.js";
	
	customize.tabcontent.about.appendChild(eggCanvas);
	customize.tabcontent.about.appendChild(eggScript);
	
	Module = {canvas: eggCanvas};
}

function spaceLeft() {
	var space = 0;
	
	for (item in storage) {
		if (storage.hasOwnProperty(item)) {
			space += storage[item].length;
		}
	}
	
	return 512000000 - (space * 2);
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

function mod(n, m) {
	return ((n % m) + m) % m;
}
