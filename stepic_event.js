var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('style.css');
(document.head||document.documentElement).appendChild(style);

if (document.title.indexOf("Stepic") != -1) {
    deface();
}

function deface(){
    document.getElementById('id_password1').parentNode.remove();
    document.getElementById('id_password2').parentNode.remove();
    document.getElementById('id_email').parentNode.remove();
    document.getElementsByClassName('reg-form__right')[0].remove();
    document.getElementsByClassName('reg-form__title')[0].innerText = "Welcome to SECR.\nLet's play.";
    fields = document.getElementsByTagName('label');
    for (var i in fields) {
        if (fields[i].innerText == 'Last name') { fields[i].innerText = "Email to contact"; }
    }
    document.getElementsByClassName('reg-form__btn')[0].innerText = "Start Challenges!";
}

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
