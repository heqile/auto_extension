var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());
var json = {"test":"toto"};
jsonViewer.showJSON(json);