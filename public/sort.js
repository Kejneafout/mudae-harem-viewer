// Sort the array based on the numerical part of the "rank" property
function sortByRank(data) {
    data.sort((a, b) => {
	// Extract numerical part of rank (remove '#' sign and parse as integer)
	const rankA = parseInt(a.rank.substring(1));
	const rankB = parseInt(b.rank.substring(1));

	return rankA - rankB;
    });

    return (data);
}

// Sort the array based on the numerical part of the "value" property
function sortByKakera(data) {
    data.sort((a, b) => {
	// Extract numeric values from the strings
	const valueA = parseInt(a.value);
	const valueB = parseInt(b.value);

	return valueB - valueA;
    });

    return (data);
}

// Sort the array based on the numerical part of the "keys" property
function sortByKeys(data) {
    data.sort((a, b) => {
	// Extract numeric values from the strings
	const valueA = parseInt(a.keys);
	const valueB = parseInt(b.keys);

	// Put empty values at the end
	return (valueB || 0) - (valueA || 0) || valueB - valueA;
    });

    return (data);
}

// Sort the array alphabetically A-Z
function sortByAtoZ(data) {
    data.sort((a, b) => {
	const nameA = a.name.toLowerCase();
	const nameB = b.name.toLowerCase();

	return (nameA < nameB ? -1 : 1);
    });

    return (data);
}
