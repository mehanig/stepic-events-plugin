// persistent set to TRUE in manifest? maybe shouldn't it?

'use strict;'
var url_redirect = {
    from: 'https://stepic.org/accounts/signup/',
    to:   'https://stepic.org/accounts/signup/?next=/lesson/15767/'
};

var logout_path = 'https://stepic.org/accounts/logout/'
var SESSION_TIME = 10000; // 10 sec

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting == "hello") {
            sendResponse({farewell: "goodbye"});
        }
        if (request.greeting == "registration") {
            sendResponse({farewell: "start"});
            session_timer(SESSION_TIME, sender);
        }
        //Not used yet
        // if (request.greeting == "logout"){
        //     console.log('Logging out user');
        // }
});

//Listener and actions
chrome.extension.onRequest.addListener(function(request, sender) {
    //replaces url to redirect user to quiz after login
    if (sender.tab.url.startsWith(url_redirect.from) &&
        sender.tab.url != url_redirect.to) {
            chrome.tabs.update(sender.tab.id, {url: url_redirect.to});
        }
});

function session_timer(session_time, sender) {
    console.log('running!');
    setTimeout( function(){
        console.log('Ended; logging out');
        chrome.tabs.update(sender.tab.id, {url: logout_path});
    }  , SESSION_TIME );
}
