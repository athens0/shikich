(() => {
    const inner = '<div class="line"><a class="b-link_button dark" id="blokino-btn-link" href="" title="blokino">Онлайн просмотр</a></div><div class="kind">blokino.org</div>';
    const checkExist = () => (document.getElementsByClassName('watch-online')[0] ? true : false);
    const checkUrl = () => /^(http.:\/\/shikimori.(me|org|one)\/animes\/.+)/.test(window.location.href);
    const blokino = 'https://vip.blokino.org/text/poisk/?q=';

    function getUrl(prompt){
        if(prompt.length > 0){
            return blokino + prompt[0].replace(' ', '+');
        }
        return '/'
    }

    function setUrl(){
        let link = document.getElementById('blokino-btn-link');
        if(!link) return;

        let prompt = [];

        let query = document.querySelector('header.head h1')
        if(query){
            let pp = query.textContent;
            pp = pp.includes('/') ? pp.split('/')[0].trim() : pp.trim();
            prompt.push(pp);
        }

        link.href = getUrl(prompt);
    }

    function addButton(){
        removeButton();
        chrome.storage.sync.get(["search_online"]).then((result) => {
            try {
                if(!result.search_online || checkExist() || !checkUrl()) return;

                let btn = document.createElement('div');
                btn.id = 'blokino-btn';
                btn.className = 'watch-online';
                btn.innerHTML = inner;

                let parent = document.querySelector('.b-db_entry .c-info-right');
                if(!parent) return;

                parent.appendChild(btn);

                setUrl();
            } catch(e){
                console.log('ShikiCh: Ошибка во время добавления кнопки просмотра\nПодробнее: ' + e.name + ': ' + e.message);
            }
        });
    }

    function removeButton(){
        if(!checkExist) return;
        
        let btn = document.getElementById('blokino-btn');
        if(btn){
            btn.remove();
        }
    }

    function main(){
        try{
            document.addEventListener('page:load', addButton);
            document.addEventListener('turbolinks:load', addButton);
            document.addEventListener('DOMContentLoaded', addButton);
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") addButton();
        } catch (e) {
            console.log('ShikiCh: Ошибка во время инжекта скрипта\nПодробнее: ' + e.name + ': ' + e.message);
        }
    }

    main();
})();