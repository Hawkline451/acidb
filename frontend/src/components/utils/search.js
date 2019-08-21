import React from "react";

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getSuggestions(value, list) {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') {
        return [];
    }
    const regex = new RegExp('^' + escapedValue, 'i');
    var result = list.filter(node => regex.test(node.organism_name));
    return  result.slice(0,5)
}

export function renderSuggestion(suggestion) {
    var value = suggestion.organism_name
    return ( <span > {value} </span>
    );
}