// persistent set to TRUE in manifest? maybe shouldn't it?
'use strict;'

var url_redirect = {
    from: 'https://stepic.org/accounts/signup/',
    to:   'https://stepic.org/accounts/signup/?next=/lesson/15767/'
};

var logout_path = 'https://stepic.org/accounts/logout/'
var SESSION_TIME = 100000; // 100 sec

var ACTIVE_SESSION = false;
var REDRAW_INTERVAL = 1000; //1 sec
var connection = null;
var StepicTabs = [];
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
    if (ACTIVE_SESSION != false && (connection != null) ){
        ACTIVE_SESSION -= REDRAW_INTERVAL;
        connection.postMessage({redraw: true, time: ACTIVE_SESSION});
    }
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "panel_render");
  connection = port;
  port.onMessage.addListener(function(msg) {
      if (1 == 2){
          console.log('hmm');
          port.postMessage({answer: "Madame... Bovary"});
      }
  });
});

//REDIRECTS
chrome.extension.onRequest.addListener(function(request, sender) {
    //replaces url to redirect user to quiz after login
        if (sender.tab.url.startsWith(url_redirect.from) &&
            sender.tab.url != url_redirect.to) {
                chrome.tabs.update(sender.tab.id, {url: url_redirect.to});
    }

});

 chrome.webRequest.onBeforeRedirect.addListener(
    function(details) {
        if (details.method == 'POST' && details.url == logout_path && details.statusCode == 302){
            console.log(details.url, details.method, details.statusCode);
            ACTIVE_SESSION = false;
            clearTimeout(panel_redraw);

        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]);

function session_timer(session_time, sender) {
    setTimeout( function(){
        console.log('Ended; logging out');
        chrome.tabs.update(sender.tab.id, {url: logout_path});
        ACTIVE_SESSION = false;
    }  , SESSION_TIME );
}
