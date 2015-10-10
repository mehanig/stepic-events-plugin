'use strict;'

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('style.css');
(document.head||document.documentElement).appendChild(style);

if (document.title.indexOf("Stepic") != -1) {
    deface();
    replaceRegButton();
}
//Bzzz to background and test if url should be redirected
chrome.extension.sendRequest({checker: "bzzz"});

function deface(){
    document.getElementsByClassName('reg-form__right')[0].remove();
    document.getElementsByClassName('reg-form__title')[0].innerText = "Welcome to CEE SECR.\nLet's play.";
    fields = document.getElementsByTagName('label');
    for (var i in fields) {
        if (fields[i].innerText == 'Last name') { fields[i].innerText = "Email to contact"; }
    }
    document.getElementsByClassName('reg-form__btn')[0].innerText = "Start Challenges!";
}

function hacked_registration(){
    username = document.getElementById('id_first_name').value;
    //Field says: enter Email but that's okay, hacked here; email -> surname;
    //email_generator() -> email;
    usersurname = document.getElementById('id_last_name').value;
    email = document.getElementById('id_email').value = email_generator(username);
    rand_password = getRandomInt(100000,9999999999999);
    pass = document.getElementById('id_password1').value = rand_password;
    pass2 = document.getElementById('id_password2').value = rand_password;
}

function email_generator(name) {
    return name + (new Date).getTime() + '@test.com';
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function replaceRegButton(){
    el = document.getElementsByClassName('reg-form__btn')[0];
    el.onclick = hacked_registration;
}

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
