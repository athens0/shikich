const linkToSite = "https://shikimori.one/";

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function checkCurrentTab() {
    try{
        let tab = await getCurrentTab();
        const checkUrl = /^(http.:\/\/shikimori.(me|org|one).+)/.test(tab.url);
        if (tab.url != 'chrome://newtab/' && !checkUrl) {
            chrome.tabs.create({active: true, index: tab.index + 1, url: linkToSite});
        }else if(tab.url == 'chrome://newtab/') chrome.tabs.update(undefined, { active: true, url: linkToSite});
    }catch(e){
        console.log('ShikiCh: Произошла неизвестная ошибка, попробуйте перезапустить браузер\nПодробнее: ' + e.name + ': ' + e.message);
    }
}

function main() {
    chrome.storage.sync.get(["shiki_redirect"]).then((result) => {
        if(result.shiki_redirect) checkCurrentTab();
    });
}

main();