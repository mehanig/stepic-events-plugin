//Runs in Chrome background completeley.
// persistent set to TRUE? maybe shouldn't it?
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    alert(message.greeting);
    console.log(message);
})
