const URLS = ["zoom.us/postattendee", "example.com/close-me"]

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
  if (URLS.includes(parsed.host + parsed.pathname + parsed.hash)) return true;

  return false;
}

// Auto-close forbidden tabs
//
// chrome.tabs.onUpdated.addListener((tabId, change, tab)=>{
//
//   // Prevents finished loading from throwing an error when trying to redelete a deleted tab
//   if (!change.url) {
//     console.log("event discarded")
//     return;
//   }
//
//   if (tabIsOnBlacklist(tab.url)) chrome.tabs.close(tabId);
// })

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
