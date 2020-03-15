"use strict";
const URLS = ["zoom.us/postattendee"];
const DOMAINS = ["e*e.com"];

function urlIsOnBlacklist(url, blacklist) {
  let parsed = (url.startsWith("http://") || url.startsWith("https://")) ? url : "https://" + url;
  try {
    parsed = new URL(parsed);
  }
  catch (e) {
    console.log("Invalid URL!");
    console.error(e);
    return false;
  }
  if (bulkWildcardTest(parsed.host, DOMAINS) ||
      bulkWildcardTest(parsed.host + parsed.pathname, URLS) ||
      bulkWildcardTest(parsed.host + parsed.pathname + parsed.hash, URLS)) {

    return true;
  }
  else {

  }

  return false;
}

function bulkWildcardTest(input, wildcards) {
  return wildcards.some((wildcard)=>{
    return wildcardTest(input, wildcard)
  })
}

// https://stackoverflow.com/a/32402438
function wildcardTest(input, pattern) {
  var escapeRegex = (input) => input.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp("^" + pattern.split("*").map(escapeRegex).join(".*") + "$").test(input);
}

function closeBadTabs() {
  chrome.tabs.query({}, (tabs)=>{
    let targetedTabs = tabs
      .filter(tab=>urlIsOnBlacklist(tab.url))
      .map(tab=>tab.id)
    chrome.tabs.remove(targetedTabs)
  })
}

chrome.runtime.onMessage.addListener((message)=>{
  if (message.action === "close-tabs") closeBadTabs();
})

chrome.commands.onCommand.addListener((command)=>{
  if (command === "close-tabs") closeBadTabs();
});
