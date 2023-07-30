async function setupSettings() {
    try {
        let checkers = [
            'shiki_redirect',
            'oped_enabled',
            'oped_rusificate',
            'oped_youtube_search',
            'search_online'
        ];
        for(let i = 0; i < checkers.length; i++){
            let i_ = document.getElementById('i_' + checkers[i]);
            await chrome.storage.sync.get([checkers[i]]).then((result) => {
                i_.checked = result[checkers[i]];
            });
    
            let i_sub = document.getElementById('i_' + checkers[i] + '_sub');
            if(i_sub){
                let qu = i_sub.querySelectorAll('input');
                for(let j = 0; j < qu.length; j++){
                    qu[j].disabled = !i_.checked;
                }
            }
            i_.addEventListener("click", () => {
                let p = new Object();
                p[checkers[i]] = i_.checked;
                chrome.storage.sync.set(p);
    
                if(i_sub){
                    let qu = i_sub.querySelectorAll('input');
                    for(let j = 0; j < qu.length; j++){
                        qu[j].disabled = !i_.checked;
                    }
                }
            });
        }
    } catch {
        console.log('ShikiCh: Произошла неизвестная ошибка, попробуйте перезапустить браузер\nПодробнее: ' + e.name + ': ' + e.message);
    }
}

function main() {
    setupSettings();
}

main();