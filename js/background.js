
function init() {
    refreshConfigFromFile();
    loadTemplateFromFile();
}

function refreshConfigFromFile() {
    fetch(chrome.runtime.getURL("config/data.json"))
    .then(response => response.json())
    .then(data => {
        chrome.storage.local.set({"data": data}, function() {
            console.log("save config");
        });
    });
};

function loadTemplateFromFile() {
    fetch(chrome.runtime.getURL("html/list.html"))
    .then(response => response.text())
    .then(data => {
        chrome.storage.local.set({"template": data}, function() {
            console.log("save template");
        });
    });
}


function checkUrl(tabId, changeInfo, tab) {
    // trick to get url's domain
    var url = document.createElement ('a');
    url.href = tab.url;
    
    if (changeInfo.status === "complete") {
        chrome.storage.local.get("data", function(login_data) {
            for (const domain in login_data.data) {
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
                    chrome.storage.local.get("template", function(data) {
                        chrome.tabs.executeScript(tabId, {
                            code: `var config = ${JSON.stringify(login_data.data[domain])}; var template = '${data.template}'`
                        }, function() {
                            chrome.tabs.executeScript(tabId, {
                                file: 'js/content.js'
                            });
                        });
                    });
                }
            }
        });
    }
};

chrome.tabs.onUpdated.addListener(checkUrl);

// init when window loaded
chrome.windows.onCreated.addListener(init);

// init when click on icon
chrome.browserAction.onClicked.addListener(init);

// init when extension installed
chrome.runtime.onInstalled.addListener(init);
