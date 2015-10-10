// persistent set to TRUE in manifest? maybe shouldn't it?

'use strict;'
var url_redirect = {
    from: 'https://stepic.org/accounts/signup/',
    to:   'https://stepic.org/accounts/signup/?next=/lesson/15767/'
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting == "hello") {
            sendResponse({farewell: "goodbye"});
        }
        if (request.greeting == "registration") {
            sendResponse({farewell: "start"})
        }
});

//Listener for redirecting to proper page after registration
chrome.extension.onRequest.addListener(function(request, sender) {
    if (sender.tab.url.startsWith(url_redirect.from) &&
        sender.tab.url != url_redirect.to) {
            chrome.tabs.update(sender.tab.id, {url: url_redirect.to});
        }
});
