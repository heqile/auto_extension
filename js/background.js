var login_data = {}

function init() {
    loadConfigFromFile();
};

function loadConfigFromFile() {
    fetch(chrome.runtime.getURL("config/data.json"))
    .then(response => response.json())
    .then(data => {
        login_data = data;
    });
};

function checkUrl(tabId, changeInfo, tab) {
    // trick to get url's domain
    var url = document.createElement ('a');
    url.href = tab.url;

    if (changeInfo.status === "complete") {
        for (const domain in login_data) {
            if (url.hostname === domain) {
                // inject code
                chrome.tabs.insertCSS(tabId, {
                    file: 'lib/css/bootstrap.min.css'
                });
                chrome.tabs.executeScript(tabId, {
                    file: 'lib/js/jquery-3.5.1.slim.min.js'
                });
                chrome.tabs.executeScript(tabId, {
                    file: 'lib/js/bootstrap.bundle.min.js'
                });
                // nested executeScript to pass config to content script
                chrome.tabs.executeScript(tabId, {
                    code: "var config = " + JSON.stringify(login_data[domain])
                }, function() {
                    chrome.tabs.executeScript(tabId, {
                        file: 'js/content.js'
                    });
                });
            }
        }
    }
};

chrome.tabs.onUpdated.addListener(checkUrl);

// init when window loaded
chrome.windows.onCreated.addListener(init);

// init when click on icon
chrome.browserAction.onClicked.addListener(init);

// init when extension installed
chrome.runtime.onInstalled.addListener(init);