const URLS = ["example.com/close-me", "example.com/also-me"]

document.getElementById("clear").addEventListener("click", ()=>{
  chrome.runtime.sendMessage({action:"close-tabs"});
})
