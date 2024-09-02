// Get object that match the "value", push to array, return array
function getMatchingObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
	if (!obj.hasOwnProperty(i)) continue;
	if (typeof obj[i] == "object") {
	    objects = objects.concat(getMatchingObjects(obj[i], key, val));
	} else if (i == key && obj[key] == val) {
	    objects.push(obj);
	}
    }
    return objects;
}

// Event if another "series" is selected from dropdown
function getSelectedOption(selected)
{
    displayOptions.selected = selected.value;
    if (selected.value === "all") {
	displayOptions.filtered = false;
	haremJson.characters = originalOrder.slice();
    }
    else {
	displayOptions.filtered = true;
	haremJson.characters = getMatchingObjects(originalOrder, "series", displayOptions.selected);
    }
    displayData(haremJson, displayOptions);
}
