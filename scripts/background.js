try{
    chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
        if(details.url.startsWith('https://shikimori.me/animes/')){
            console.log('executed at ' + details.url);
            chrome.scripting.executeScript({
                files: ['scripts/oped.js', 'scripts/blokino-search.js'],
                target: {tabId: details.tabId}
            });
            chrome.scripting.insertCSS({
                files: ['css/oped.css'],
                target: {tabId: details.tabId}
            });
        }
    });
}catch(e){
    console.log(e);
}