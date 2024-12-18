chrome.tabs.onCreated.addListener(updateTabs);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isValidUrl(tab.url)) {
    updateFaviconAndTitle(tabId, tab.index + 1);
  }
});

function updateTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab, index) => {
      if (isValidUrl(tab.url)) {
        updateFaviconAndTitle(tab.id, index + 1);
      }
    });
  });
}

function updateFaviconAndTitle(tabId, tabIndex) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: modifyTab,
    args: [tabIndex]
  });
}

function modifyTab(tabIndex) {
  const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
  link.type = "image/png";
  link.rel = "icon";
  link.href = chrome.runtime.getURL("icon.png");
  document.getElementsByTagName("head")[0].appendChild(link);

  document.title = `Tab ${tabIndex}`;
}

function isValidUrl(url) {
  // Exclude restricted Chrome and Web Store pages
  return url && !url.startsWith("chrome://") && !url.startsWith("https://chrome.google.com/webstore/");
}
