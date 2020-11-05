
function addListItem(listElement, config) {
    parentElement = listElement.getElementsByClassName("dropdown-menu")[0];
    for (const login_info of config) {
        let item = document.createElement("a");
        item.setAttribute("class", "dropdown-item");
        item.setAttribute("onclick",`document.getElementById("_userid").value="${login_info['login']}";document.getElementById("_pwduser").value="${login_info['password']}";`)
        item.innerText = login_info["login"];
        parentElement.appendChild(item);
    }
};

// inject list to form
if (document.getElementById("extension-login-list") === null) {
    // add list template
    fetch(chrome.runtime.getURL("html/list.html"))
        .then(response => response.text())
        .then(data => {
            var element = document.createElement('login_list');
            element.innerHTML = data;
            addListItem(element, config);
            let loginInput = document.getElementById("_userid");
            if (loginInput !== null) {
                loginInput.insertAdjacentElement("afterend", element);
            }
        });
}

