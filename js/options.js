var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());
chrome.storage.local.get("data", function(login_data) {
    jsonViewer.showJSON(login_data.data, -1, 1);
});