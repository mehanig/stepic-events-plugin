// persistent set to TRUE in manifest? maybe shouldn't it?
'use strict;'

var url_redirect = {
    from: 'https://stepic.org/accounts/signup/',
    to:   'https://stepic.org/accounts/signup/?next=/lesson/15767/'
};

var logout_path = 'https://stepic.org/accounts/logout/'
var SESSION_TIME = 10000; // 10 sec

var ACTIVE_SESSION = false;
var REDRAW_INTERVAL = 1000; //1 sec
var panel_redraw = null;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting == "start_timer") {
            ACTIVE_SESSION = SESSION_TIME;
            session_timer(SESSION_TIME, sender);
            panel_redraw = setInterval(panel_draw, REDRAW_INTERVAL);
        }
});

function panel_draw(){
    if (ACTIVE_SESSION != false){
        ACTIVE_SESSION -= REDRAW_INTERVAL;
        chrome.tabs.query({}, function(tabs) {
            var message = {redraw: true, time: ACTIVE_SESSION};
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
        });
    }
}

//REDIRECTS
chrome.extension.onRequest.addListener(function(request, sender) {
    //requests after session timer
    if (request.redirect){
        chrome.tabs.update(sender.tab.id, {url: request.redirect});
    }
    //replaces url to redirect user to quiz after login
    // handles request from checker: bzzz
    if (sender.tab.url.startsWith(url_redirect.from) &&
            sender.tab.url != url_redirect.to) {
                chrome.tabs.update(sender.tab.id, {url: url_redirect.to});
    }
});

 chrome.webRequest.onBeforeRedirect.addListener(
    function(details) {
        if (details.method == 'POST' && details.url == logout_path && details.statusCode == 302){
            ACTIVE_SESSION = false;
            clearTimeout(panel_redraw);
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]);

function session_timer(session_time, sender) {
    setTimeout( function(){
        ACTIVE_SESSION = false;
        clearTimeout(panel_redraw);
        chrome.tabs.query({}, function(tabs) {
            var message = {logout: true, url: logout_path};
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
        });
    }  , SESSION_TIME );
}
