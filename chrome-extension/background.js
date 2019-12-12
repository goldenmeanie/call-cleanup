const URLS = ["zoom.us/postattendee", "example.com/close-me"]

function tabIsOnBlacklist(tabId, tab) {
  if (!tab || !tab.url || !tab.id) return;
  let url = tab.url.split(/https?:\/\//).join("").split(/#|\?/)[0];
  if (URLS.includes(url)) chrome.tabs.remove(tabId);
}

// chrome.tabs.onUpdated.addListener((tabId, change, tab)=>{
//
//   // Prevents finished loading from throwing an error when trying to redelete a deleted tab
//   if (!change.url) {
//     console.log("event discarded")
//     return;
//   }
//
//   tabIsOnBlacklist(tabId, tab);
// })

function closeBadTabs() {
  chrome.tabs.query({}, (tabs)=>{
    let targetedTabs = tabs.filter((tab)=>{
      let url = tab.url.split(/https?:\/\//).join("").split("#")[0];
      return URLS.includes(url);
    }).map(tab=>tab.id)
    chrome.tabs.remove(targetedTabs)
  })
}

chrome.commands.onCommand.addListener(function(command) {
  if (command === "close-tabs") {
    closeBadTabs();
  }
});
