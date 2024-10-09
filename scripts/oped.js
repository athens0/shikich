(() => {
    const inner = '<div class="c-column block_m"><div class="subheadline">Опенинги</div><div class="cc" id="op-list"></div></div><div class="c-column block_m"><div class="subheadline">Эндинги</div><div class="cc" id="ed-list"></div></div>';
    const innerH = '<div class="shade"></div><div class="expand"><span>Развернуть</span></div>';
    const insertAfter = (refn, newn) => {refn.parentNode.insertBefore(newn, refn.nextSibling);}
    const checkUrl = () => /^(http.:\/\/shikimori.(me|org|one)\/animes\/.+)/.test(window.location.href);
    const ylink = 'https://www.youtube.com/results?search_query=';
    const jikan = 'https://api.jikan.moe/v4/anime/';

    function insertMal(data, rusificate, youtube_search, oel){
        for(let i = 0; i < oel.length; i += 3){
            if(data[oel[i]].length > 0){
                for(let j = 0; j < data[oel[i]].length; j++){
                    let number = j + 1, ysearch = '';
                    if(/^[0-9]/.test(data[oel[i]][j][0])) number = /^[0-9]+:/.test(data[oel[i]][j]) ? data[oel[i]][j].match(/^[0-9]+/)[0] : number;
                    let innc = '<div class="oped-theme">#' + number + ': '
                    try{
                        data[oel[i]][j] = data[oel[i]][j].replace('""', '"');
                        data[oel[i]][j] = data[oel[i]][j].replace(number + ':', '').trim();
                        let mparts = data[oel[i]][j].split('"'), mid = 1;
                        for(let k = mid; k < mparts.length; k++) if(mparts[k]) {mid = k;break;}
                        let songname = mparts[mid];
                        for(let k = mid + 1; k < mparts.length; k++) if(mparts[k]) {mid = k;break;}
                        mparts = mparts[mid].split(' by ')[1];
                        if(mparts.includes('(eps ')) mparts = mparts.split('(eps ');
                        else if(mparts.includes('(ep ')) mparts = mparts.split('(ep ');
                        else mparts = mparts.split('(e ');
                        let eps = mparts[1], author = mparts[0];
                        if(rusificate) innc += songname+' от '+author+(eps ? ` (сери${eps.includes('-') ? 'и' : 'я'} ${eps}` : '');
                        else innc += data[oel[i]][j];
                        ysearch = songname.trim() + '+' + author.trim();
                    }catch(er){
                        innc = '<div class="oped-theme">' + data[oel[i]][j];
                        ysearch = data[oel[i]][j].trim();
                    }finally{
                        innc += (youtube_search ? ` | <a href="${ylink}${ysearch.replace(' ', '+')}">youtube</a>` : '') + '</div>';
                        oel[i+1].innerHTML += innc;
                    }
                }
            }else oel[i+1].innerHTML = `<div class="b-nothing_here">Нет ${oel[i+2]}</div>`;
        }
        checkHeight();
    }

    async function fetchMal(rusificate, youtube_search){
        try {
            let op_list = document.getElementById('op-list');
            let ed_list = document.getElementById('ed-list');
            let oel = ['openings', op_list, 'опенингов', 'endings', ed_list, 'эндингов'];
    
            let anime_id = window.location.href;
            anime_id = anime_id.match(/[0-9]+/)[0];
        
            (await fetch(jikan + anime_id + '/themes', {headers: {'Cache-Control': 'no-cache'}})).json().then(
                (data) => insertMal(data['data'], rusificate, youtube_search, oel));
            console.log('requested');
        } catch (e) {
            console.log('ShikiCh: Ошибка во время загрузки данных op/ed\nПодробнее: ' + e.name + ': ' + e.message);
        }
    }
    
    function loadData(){
        chrome.storage.sync.get(['oped_youtube_search']).then((resulty) => {
            chrome.storage.sync.get(['oped_rusificate']).then((resultr) => {
                fetchMal(resultr.oped_rusificate, resulty.oped_youtube_search);
            });
        });
    }
    
    function checkHeight(){
        try{
            let main = document.getElementById('oped_list');
            if(!main) return;
            if(main.offsetHeight >= 240){
                let shortener = document.createElement('div');
                shortener.className='b-height_shortener';
                shortener.id = 'shortener_oped';
                shortener.innerHTML = innerH;
                let spname = shortener.lastChild.firstChild;
                shortener.onclick = () => {
                    if(spname.textContent == 'Развернуть'){
                        spname.textContent = 'Скрыть';
                        main.style.maxHeight = 'max-content';
                    }else{
                        spname.textContent = 'Развернуть';
                        main.style.maxHeight = '240px';
                    }
                }
                if(document.getElementById('shortener_oped')) return;
                insertAfter(main, shortener);
            }
        } catch(e){
            console.log('ShikiCh: Ошибка во время обработки таблицы op/ed\nПодробнее: ' + e.name + ': ' + e.message);
        }
    }
    
    function createOPED() {
        chrome.storage.sync.get(['oped_enabled']).then((result) => {
            try{
                if(!result.oped_enabled || document.getElementById('oped_list') || !checkUrl()) return;

                let paste_after = document.getElementsByClassName('b-db_entry')[0];

                let main = document.createElement('div');
                main.className = 'cc-related-authors сс-oped-table';
                main.id = 'oped_list';
                main.innerHTML = inner;

                insertAfter(paste_after, main);

                loadData();
            } catch (e) {
                console.log('ShikiCh: Ошибка во время создания таблицы op/ed\nПодробнее: ' + e.name + ': ' + e.message);
            }
        });
    }
    
    function removeOPED(){
        try {
            let main = document.getElementById('oped_list');
            if(main) main.remove();
        } catch (e) {
            console.log('ShikiCh: Ошибка во время удаления таблицы op/ed\nПодробнее: ' + e.name + ': ' + e.message);
        }
    }
    
    
    function main() {
        try {
            removeOPED();
            document.addEventListener('page:load', createOPED);
            document.addEventListener('turbolinks:load', createOPED);
            document.addEventListener('DOMContentLoaded', createOPED);
            if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') createOPED();
        } catch (e) {
            console.log('ShikiCh: Ошибка во время инжекта скрипта\nПодробнее: ' + e.name + ': ' + e.message);
        }
    }
    
    main();
})();