'use strict;'

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('style.css');
(document.head||document.documentElement).appendChild(style);
//fires first event, used to determine if redirect should be used,
// didn't fired if redirect handled by Ember (from step 1 to step2 eg)
chrome.extension.sendRequest({checker: "bzzz"});


if (document.title.indexOf("Stepic") != -1) {
    deface();
    replaceRegButton();
    skip_tutorial();
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

function skip_tutorial(){
    try {
        for (var i = 0; i < 10; i++) {
          $('.introjs-nextbutton')[0].click();
        }
        setTimeout((function() {
          $('.introjs-donebutton')[0].click();
        }), 1000);
    } catch(err){
        //pass
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
    chrome.runtime.sendMessage({greeting: "start_timer"}, function(response) {
      console.log(response.farewell);
    });
}

chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.redraw == true) {
        skip_tutorial();
        panel_update_or_create(msg.time / 1000);
        chrome.runtime.sendMessage({redraw_result:true});
    } else if (msg.logout == true) {
        var handler = function(data) {
            chrome.extension.sendRequest({redirect: "https://stepic.org"});
        };
        $.ajax({
            url : 'https://stepic.org/accounts/logout/',
            type: "POST",
            data : {csrfmiddlewaretoken: getCookie("csrftoken")},
            success: handler,
            error: handler
        });
    }
});

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function email_generator(name) {
    return name + (new Date).getTime() + '@test.com';
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
