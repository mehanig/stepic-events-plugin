'use strict;'

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('style.css');
(document.head||document.documentElement).appendChild(style);

//fires first event, used to determine if redirect should be used,
// didn't fired if redirect handled by Ember (from step 1 to step2 eg)
chrome.extension.sendRequest({checker: "bzzz"});

//main channel for communication and events firing, connection is always opened
var port = chrome.runtime.connect({name: "panel_render"});
port.postMessage({connection: 'bzzz'});

if (document.title.indexOf("Stepic") != -1) {
    deface();
    replaceRegButton();
}

function deface(){
    var right_pane = document.getElementsByClassName('reg-form__right')[0];
    var title = document.getElementsByClassName('reg-form__title')[0];
    var button = document.getElementsByClassName('reg-form__btn')[0];
    if (undefined != right_pane){
        right_pane.remove();
    }
    if (undefined != title){
        title.innerText = "Welcome to CEE SECR.\nLet's play.";
    }
    fields = document.getElementsByTagName('label');
    for (var i in fields) {
        if (fields[i].innerText == 'Last name') { fields[i].innerText = "Email to contact"; }
    }
    if (undefined != button){
        button.innerText = "Start Challenges!";
    }
}

function replaceRegButton(){
    el = document.getElementsByClassName('reg-form__btn')[0];
    if (undefined != el) {
        el.onclick = hacked_registration;
    }
}

var panel_update_or_create = function(time){
    el = document.getElementsByClassName('event_timer_panel')[0];
    text = "Remaining time: " + time + 'sec';
    if (undefined != el) {
        el.innerText = text;
    } else {
        var x = document.createElement("P");
        x.setAttribute("class", "event_timer_panel");
        var t = document.createTextNode(text);
        x.appendChild(t);
        document.body.appendChild(x);
    }
};

function hacked_registration(){
    username = document.getElementById('id_first_name').value;
    //Field says: enter Email but that's okay, hacked here; email -> surname;
    //email_generator() -> email;
    usersurname = document.getElementById('id_last_name').value;
    email = document.getElementById('id_email').value = email_generator(username);
    rand_password = getRandomInt(100000,9999999999999);
    pass = document.getElementById('id_password1').value = rand_password;
    pass2 = document.getElementById('id_password2').value = rand_password;
    console.log("WTF");
    chrome.runtime.sendMessage({greeting: "start_timer"}, function(response) {
      console.log(response.farewell);
    });
}

port.onMessage.addListener(function(msg) {
    if (msg.redraw == true) {
        panel_update_or_create(msg.time / 1000);
        port.postMessage({redraw_result:true});
    }
});

function email_generator(name) {
    return name + (new Date).getTime() + '@test.com';
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// chrome.runtime.onRequest.addListener(function(request, sender) {
//     alert("RECEIVED", request.farewell);
//     console.log("AAAAAAAAAAAAAA");
// });

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    if(request.start_timer)
    {
        console.log('Received Start');
        alert(request);
        console.log('Received End');
    }
    if (request.draw_panel) {
        alert("DRAW!!!");
    }
});

// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//     console.log('sending hello');
//   // console.log(response.farewell);
// });
