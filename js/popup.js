document.getElementById("refresh").addEventListener("click", function(){
    chrome.runtime.sendMessage({action:"refresh"}, function(response){
        console.log(response);
    })
});

document.getElementById("options").addEventListener("click", function(){
    chrome.runtime.openOptionsPage();
});