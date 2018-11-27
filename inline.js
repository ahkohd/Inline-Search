/**
 * inline.js
 *
 * Use your favourite search engines on the fly
 * without having to open new tab.
 *
 * @author     Victor Aremu <victor.olorunbunmi@gmail.com>
 * @copyright  Copyright (c) 2018
 * @license    MIT license
 */



window.inlineSeachExt = {};

window.inlineSeachExt.overlayDisplayed = false;
window.inlineSeachExt.currentPageHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
window.inlineSeachExt.currentPageWidth = Math.max( document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);

(function () {
    document.onmousemove = handleMouseMove;

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event;
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        window.inlineSeachExt.extInlineSearchX = event.pageX;
        window.inlineSeachExt.extInlineSearchY = event.pageY;

    }
})();

window.inlineSeachExt.inline = function (inCtrl, overlayEnabled, last_engine) {
// console.log(inCtrl);

    window.inlineSeachExt.createShadowDOM();

    window.inlineSeachExt.doc_keyUp = function (e) {
        if (e.ctrlKey && e.keyCode == inCtrl) {

            if (overlayEnabled == 1) {
                window.inlineSeachExt.inline_search_withOverlay();
            }

            if (overlayEnabled == 0) {
                window.inlineSeachExt.inline_search_withoutOverlay();
            }
        }
    };

    document.addEventListener('keyup', window.inlineSeachExt.doc_keyUp, false);
};

chrome.storage.local.get(['n_inCtrl', 'n_overlay', 'n_last_engine'], function (result) {


    if (result.n_inCtrl == undefined && result.n_overlay == undefined && result.n_last_engine == undefined) {

        chrome.storage.local.set({
            n_inCtrl: "B",
            n_overlay: 1,
            n_last_engine: "inext-ch-google"
        }, function () {
            window.inlineSeachExt.last_engine = "inext-ch-google"; 
            window.inlineSeachExt.inline(("B").charCodeAt(0), 1, "inext-ch-google");
        });
    } else

    {
        window.inlineSeachExt.last_engine = result.n_last_engine; 
        window.inlineSeachExt.inline(result.n_inCtrl.charCodeAt(0), result.n_overlay, result.n_last_engine);


    }
});


window.inlineSeachExt.inline_search_withOverlay = function () {
    if (!window.inlineSeachExt.overlayDisplayed) {
        var ext_inlineSearchOverlay = document.createElement('div');
        ext_inlineSearchOverlay.id = "ext_inlineSearchOverlay";
        window.inlineSeachExt.shadow.appendChild(ext_inlineSearchOverlay);
        window.inlineSeachExt.inline_search_withoutOverlay();
    } else
    {
        window.inlineSeachExt.shadow.getElementById("ext_inlineSearchOverlay").remove();
        window.inlineSeachExt.shadow.getElementById("ext_InlineSearch_Panel").remove();
        window.inlineSeachExt.overlayDisplayed = false;
    }
    
};

window.inlineSeachExt.inline_search_withoutOverlay = function () {
    if (!window.inlineSeachExt.overlayDisplayed) {
        var ext_highlightedText = window.getSelection().toString();
        var ext_panel = document.createElement('div');
        ext_panel.id = "ext_InlineSearch_Panel";
        ext_panel.classList += "resize-drag";
        ext_panel.style.position = "absolute";
        ext_panel.style.zIndex = 2147483647;
        ext_panel.style.top = 0;
        ext_panel.style.left = 0;

        ext_panel.innerHTML =
            `<div class="flexBox1">
                        <div class="flexBox1-1">
                            <div class="inext-dropdown">
                                <button id="inextbtn-drop" class="inext-dropbtn ext-icon-perview">
                                    
                                </button>
                                <div id="inext-Dropdown" class="inext-dropdown-content">
                                    <a id="inext-ch-google" class="inext-ch-engine"><div class="ext-icon intext-google"></div> Google</a>
                                    <a id="inext-ch-wiki" class="inext-ch-engine"><div class="ext-icon intext-wiki"></div> Wikipedia</a>                                    
                                    <a id="inext-ch-bing" class="inext-ch-engine"><div class="ext-icon intext-bing"></div> Bing</a>
                                    <a id="inext-ch-yahoo" class="inext-ch-engine"><div class="ext-icon intext-yahoo"></div> Yahoo</a>
                                </div>
                            </div>
                        </div>
                        <div class="flexBox1-2">
                            <div class="flex-pane">
                                <div class="flexBox1-2-2">
                                    <input type="text" id="inext-search-box" value="${ext_highlightedText}" class="inext-search-text-box ignore-interact-inext"/>
                                </div>
                                <div class="flexBox1-2-3">
                                     <button id="inext-close-options-pane" class="ext-opt-icon intext-settings"></button>
                                    <button id="inext-close-panel-pane" class="ext-opt-icon intext-close"></button>
                                    <div id="inext-close-drag-pane" class="ext-opt-icon intext-drag"></div>    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flexBox2 ignore-interact-inext">
                        <div class="inext-search-conetnt">
                            <div id="search-content-iframe-inext"><div id="inext-place-holder"> <div class="google-loader"><div class="dot"></div></div> </div></div>
                        </div>
                    </div>`;

        var calculateOffsetX = window.inlineSeachExt.currentPageWidth - window.inlineSeachExt.extInlineSearchX;
        var calculateOffsetY = window.inlineSeachExt.currentPageHeight - window.inlineSeachExt.extInlineSearchY;
        if(calculateOffsetX <= 450 ) window.inlineSeachExt.extInlineSearchX -= (450 - calculateOffsetX);
        if(calculateOffsetY <= 450 ) window.inlineSeachExt.extInlineSearchY -= (450 - calculateOffsetY);

        

        ext_panel.style.transform = "translate(" + window.inlineSeachExt.extInlineSearchX + "px, " + window.inlineSeachExt.extInlineSearchY + "px)";
        ext_panel.setAttribute('data-x', window.inlineSeachExt.extInlineSearchX);
        ext_panel.setAttribute('data-y', window.inlineSeachExt.extInlineSearchY);
        window.inlineSeachExt.shadow.appendChild(ext_panel);

          


        window.inlineSeachExt.inext_dropdown = function () {
            window.inlineSeachExt.shadow.getElementById("inext-Dropdown").classList.toggle("inext-show");
        };

        window.inlineSeachExt.shadow.getElementById("inextbtn-drop").addEventListener('click', function (event) {
            event.stopPropagation();
            window.inlineSeachExt.inext_dropdown();

        });

        window.inlineSeachExt.changeEngine(window.inlineSeachExt.last_engine);



        var engines = window.inlineSeachExt.shadow.querySelectorAll(".inext-ch-engine");
        for(var e = 0; e < engines.length; e++)
        {
            engines[e].addEventListener("click", function(e){
                    window.inlineSeachExt.changeEngine(e.target.id);
            });
        }
        
        window.inlineSeachExt.shadow.getElementById("inext-search-box").addEventListener("keyup", function(e){
            if (e.keyCode == 13) {
                window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = '<div id="inext-place-holder"><div class="google-loader"><div class="dot"></div></div></div>';
                window.inlineSeachExt.createBrowser(window.inlineSeachExt.shadow.getElementById("inext-search-box").value);
            }
        });
        window.inlineSeachExt.shadow.getElementById("inext-close-panel-pane").onclick = function () {
            var overlay = window.inlineSeachExt.shadow.getElementById("ext_inlineSearchOverlay");
            if(overlay !== null )window.inlineSeachExt.shadow.getElementById("ext_inlineSearchOverlay").remove();
            window.inlineSeachExt.shadow.getElementById("ext_InlineSearch_Panel").remove();
            window.inlineSeachExt.overlayDisplayed = false;
        };


        window.inlineSeachExt.shadow.getElementById("inext-close-options-pane").onclick = function () {
            window.open(chrome.extension.getURL("redirect.html"));
        };

        window.inlineSeachExt.createBrowser(ext_highlightedText);

        window.onclick = function (event) {

            if (!event.target.matches('inext-dropbtn')) {
       
                var dropdowns = document.getElementById("inext-shadow-dom-local-scope").shadowRoot.querySelectorAll(".inext-dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('inext-show')) {
                        openDropdown.classList.remove('inext-show');
                    }
                }
            }
        };
        window.inlineSeachExt.panelDragResize();
        window.inlineSeachExt.overlayDisplayed = true;

    } else
    {
        window.inlineSeachExt.shadow.getElementById("ext_InlineSearch_Panel").remove();
        window.inlineSeachExt.overlayDisplayed = false;
    }
};


window.inlineSeachExt.createShadowDOM = function()
{
    var div = document.createElement("div");
    div.style.height = window.inlineSeachExt.currentPageHeight+"px";
    div.style.width = window.inlineSeachExt.currentPageWidth+"px";
    div.id = "inext-shadow-dom-local-scope";
    document.getElementsByTagName("body")[0].appendChild(div);
    var shadow = div.attachShadow({mode: 'open'});
   
    shadow.innerHTML =
    `
        
       <style>
       
       /* width */
       ::-webkit-scrollbar {
           width: 5px !important;
       }

       /* Track */
       ::-webkit-scrollbar-track {
           background: transparent !important; 
       }
       
       /* Handle */
       ::-webkit-scrollbar-thumb {
           background: #999 !important;
           border-radius: 5px !important;
       }

       .inext-ch-engine{font-size: 14px !important;}
       #inext-Dropdown a
       {
            cursor: default;
       }
        
            @font-face {
                font-family: "Segoe UI";
                font-style: normal;
                font-weight: normal;
                src: local("Segoe UI"), url(chrome-extension://__MSG_@@extension_id__/fonts/Segoe-UI.ttf) format("truetype");
            }

         
            #inext-load-more
            {
                background: transparent;
                display: table;
                margin: 20px auto;
                width: 80%;
                border-radius: 500px;
                padding: 10px;
                font-family: Segoe UI, sans-serif;
                color: #999;
                outline: none;
                text-align:center;
                border: 1px solid #bbb;
                text-transform: uppercase;

            }

            #inext-load-more:hover
            {
                background: #f1f1f1;
            }

            .inext-search-conetnt
            {
                background: #eee !important;
                padding: 7px;
                overflow: hidden;
            }
            #inext-place-holder
            {
                margin-top: 9em;
            }

            .res-icon
            {
                border-right: 10px solid transparent;
            }
            .res-icon, .divider
            {
                margin: auto;
            }

            #search-content-iframe-inext
            {
                width: 100%;
                height: 100%;
                margin: 0;
                border-radius: 3px;
                background: transparent;
                overflow-y: scroll;
                overflow-x: hidden;

            }

            #inext-place-holder p
            {
                text-align: center;
                font-family: Segoe UI;
                color: #999;
                font-size: 16px !important;
                font-weight: lighter;
            }

            .icon-big
            {
                width: 100px !important;
                height: 100px !important;
                display: table !important;
                margin: 5px auto;
                opacity: .7;               
            }

            .inext-card
            {
                font-family: Segoe UI, Arial, sans-serif;
                margin: 10px auto 30px auto;
                background-color: #fff;
                padding: 0;
                border-radius: 3px;
                width: 96%;
                border: 0;
                text-align: left;
                outline: none !important;
                display: block;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important;
            }

            .inext-card p
            {
                padding: 15px;
                width: auto;
            }

            .inext-card .header
            {
                width: 100%;
                border-bottom: 1px solid #eee;
                padding: 15px;
                display: flex;
                align-content: flex-start;
            
            }

            .inext-card .header h1
            {
                width: 92%;
                font-family: Segoe UI, Arial, sans-serif;
                font-weight: 440;
                font-size: 16px;
                white-space: no-wrap;
                margin: 0;
                color: #291db1;
                padding: 0;
            }

            .inext-card .header p
            {
                color: #127231;
                padding: 0;
                margin: 0;
            }

            
            #ext_inlineSearchOverlay
            {
            
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                height: 100vh !important;
                z-index: 2147483647 !important;
                width: 100vw !important;
                pointer-events: all !important;
                background: rgba(0,0,0, .5) !important;
                
            }

            #ext_InlineSearch_Panel
            {
                position: absolute !important;
                pointer-events: all !important;
                display: flex !important;
                flex-direction: column !important;
                width: 400px;
                height: 400px;
                background: transparent !important;
            }



            .flexBox1
            {
                background: transparent !important;
                height: 20% !important;
                display: flex !important;
                flex-direction: row !important;
                
            }

            .flexBox1-1
            {
                background: transparent !important;
                width: 20% !important;
                display: flex !important;
            }

            .flexBox1-2
            {
                width: 80% !important;
                /* display: flex !important; */
                flex-direction: row !important;
                background: transparent !important;
            }

            .flex-pane
            {
                display: flex !important;
                flex-direction: row !important;
                background: white !important;
                border-radius: 500px !important;
                width: 100% !important;
                margin: auto !important;
                height: 50px !important;
                -webkit-border-radius: 500px !important;
                -moz-border-radius: 500px !important;
                -ms-border-radius: 500px !important;
                -o-border-radius: 500px !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important;

            }

            .flexBox1-2-1
            {
                background:transparent !important;
                width: 0% !important;
                display: flex !important;
                margin-left: 12px !important;
            }

            .flexBox1-2-2
            {
                background:transparent !important;
                width: 80% !important;
                margin-left: 12px !important;
                display: flex !important;
            }

            .inext-search-text-box
            {
                width: 100% !important;
                margin: auto !important;
                background: transparent !important;
                /* height: 5px !important;*/
                padding: 0 13px !important;
                margin: 0 !important;
                vertical-align: middle !important;
                color: #444 !important;
                border:0 !important;
                box-shadow: none !important;
                outline: none !important;
                font-size: 12px;
                font-weight: lighter !important;
                font-family: Montserrat, sans-serif !important;


            }

            .flexBox1-2-3
            {
                background: transparent !important;
                width: 30% !important;
                display: flex !important;
                padding-right: 12px !important;
            }


            .inext-search-conetnt
            {
                margin: auto !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 3px !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important;
                -webkit-border-radius: 3px !important;
                -moz-border-radius: 3px !important;
                -ms-border-radius: 3px !important;
                -o-border-radius: 3px !important;
            }

            .flexBox2
            {
                background: transparent !important;
                height: 80% !important;
            }



            /* Dropdown Button */
            .inext-dropbtn {
                background-color: white !important;
                width: 54px !important;
                height: 54px !important;
                margin: auto !important;
                vertical-align: middle !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important;
                border-radius: 50% !important;
                border: none !important;
                cursor: pointer !important;
                outline: none !important;
                -webkit-border-radius: 50% !important;
                -moz-border-radius: 50% !important;
                -ms-border-radius: 50% !important;
                -o-border-radius: 50% !important;
            }

            /* Dropdown button on hover & focus */
            .inext-dropbtn:hover, .inext-dropbtn:focus:not(:active){
                background-color: #eee !important;
            }

            /* The container <div> - needed to position the dropdown content */
            .inext-dropdown {
                position: relative !important;
                display: inline-block !important;
            }

            /* Dropdown Content (Hidden by Default) */
            .inext-dropdown-content {
                display: none !important;
                border-radius: 3px !important;
                position: absolute !important;
                margin-top: 12px !important;
                background-color: #fff !important;
                min-width: 160px !important;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) !important;
                -webkit-border-radius: 3px !important;
                -moz-border-radius: 3px !important;
                -ms-border-radius: 3px !important;
                -o-border-radius: 3px !important;
            }

            /* Links inside the dropdown */
            .inext-dropdown-content a {
                color: black !important;
                padding: 12px 16px !important;
                text-decoration: none !important;
                font-family: "Segoe UI",Arial,sans-serif !important;
                border-radius: 3px !important;
                display: block !important;
                -webkit-border-radius: 3px !important;
                -moz-border-radius: 3px !important;
                -ms-border-radius: 3px !important;
                -o-border-radius: 3px !important;
            }

            /* Change color of dropdown links on hover */
            .inext-dropdown-content a:hover {background-color: #eee !important; color: black !important; text-decoration: none !important;}

            /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
            .inext-show {display:block !important;}


            .ext-icon
            {
                width: 24px !important;
                height: 24px !important;
                display: inline-block !important;
                vertical-align: middle !important;
                margin-right: 10px !important;
            }

          

            .ext-opt-icon
            {
                width: 18px !important;
                height: 18px !important;
                background-color: white !important;
                outline: none !important;
                border: none !important;
                margin: auto !important;
                opacity: .7 !important;
                transform: ease .6s all !important;
                -webkit-transform: ease .6s all !important;
                -moz-transform: ease .6s all !important;
                -ms-transform: ease .6s all !important;
                -o-transform: ease .6s all !important;
            }

            
         

            .ext-opt-icon:hover
            {
                opacity: 1 !important;
            }

            .ext-icon-perview
            {
                background-position: center !important;
            }

            .ext-icon.intext-google, .ext-icon-perview.intext-google
            {

                background-image: url('data:image/png !important;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAADDklEQVRIDd1UaUgUYRh+v5m9zF3dFDc8C0IpzSMPAoVIKMRAqz9mx4+I6EeQ3RpmJFTkbhKlfzKiIgJBocvMiBA1Ss2DCmKlCDJdj9S88pqZna/v291x9lBz+1fDvPfzvu+83zEA//qDlhoAHwc9YLYERnEWjGADcJgFmqFBAujRAATAM9CLp1ExTC9Wh8IXjOHTzFUwkxYTWLEgQHKuRDxEIRMqFYskl7P0aIAPgxIEpgO+iLHOwCV1WiWerUHl1mx3HOPuAJHp9Ko4LaAlU6iYi1R1J5fx8TGmFDrFDS4gllhrmC7QQRkoxCbwJevNK7fCsPUEfBXXg44Uj2a3ICPfRpAeLx3O5sSfQAX32EFoseptDsp8kQgJzH5UYq2kpjvhM+xuUDDf0BW+1T3mYeMmVS5uVGNcrsR4G2C8mVABm+MB9NIhLxFmdgJggDiyLWEqgDfWBmS0VnlZzwMuL1Gj+jOJRhKyv6KYgtL5drsh8+D8j+QrZHshLWKFhWstzlTTGPlcKmwUbOMS43izpHorh+cClFKOc4P5aaTg30psu+72bOcGfXaXg6uV0Q7NaxGoHBOkJHmTAXWSTY6kgVbeAPVzYRUAzYnUdqZ+U5zHpPtKb5rrf6Suk3ARvpY+6VLIEyDxsUhGuz8TBZcnk6CFM2y89SL+j8f0fEXh3qahTfPFaZMIH8sTKinJDQK5h8aphF/VM2vpYQXarGE2tPJ2XVwuBS5El+4c2lPdvf2BQH6yUnyVZlgI0Y8VSrbLuGXPk0pezoUXSEEqFeQyxyp+doXiaZNaEB/562bZcc5nx4CoOfmOM8Ro+1PgVXc2hdooJ6zGeCPv3FmbQZhLA2LDhdq0tg4uKJnqy6XwiWCoMx+E9KDmt3dP5aU558lL5PBm9c6mpqiGPjjMZYkev344EG9qXT35Ot09Abk7JLu8NvFau2A4OiJqnE6aFJWlgZnhk1WD149kvs+XvbK2aAMKqaqK0Y76KYq/C7pdvYI2fBxUSnoC/BHHhyimekKZqaeRrKUoI2NwiuL/T/oNotT2k2/X6oYAAAAASUVORK5CYII=') !important;
                background-repeat: no-repeat !important;
            }

            .ext-icon.intext-wiki, .ext-icon-perview.intext-wiki
            {

                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABn0lEQVRIDe2TvUvCQRyHL7IiFCyLWiTKWhrrH2gocAnaI2quhiCwMQKXlpaglqIpyMVJCFojmpoiWnshMJIytVey7PkoFz8UK6uhQXme+3zve+f98FRjqq/qDfzVDYQ4KFfkCvMGfEK7dkgtMgy2t09dvE9rIfofeKgCeIBa3CCbUPQypFD9ICk6jTFnGMV2FB0MO3iMOstDljBCRwclSeeGBWOM+hFSTDLcox8t3RRZHMOy1LCia9BhU9QWL8UNZrEfr3ARnSwzOUEXfsoEqzk8Qj2QyBNmVD9OXmMzWnSdaSYz+CV17Dg1hSsZIi0+ihTqIbOkkzkmCXTjt5hmlw6KkU6iTNTXp6HMU894gfP4bRrZeYmv2INCv4xnCj3glvSiGGfIoA9LqC3pFBr6MnVQkKkLt3EVVUfIAdTDdskt3MQYVoSb3QnUz3GQfMNhbMUM6lOMkg9o/wuUlRFmew6TuIeWJQr178g1/DG61zTv1nfRR1paKNR/IQNYltqyK4WFR8KH57iCFvXdTOK4jr+ijXf7sZhmGl1Y5Z/fwDsfOmDMJEpOZgAAAABJRU5ErkJggg==') !important;
                background-repeat: no-repeat !important;
            }


            .ext-icon.intext-bing, .ext-icon-perview.intext-bing
            {

                background-image: url('data:image/png !important;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABy0lEQVRIDd1Uvy80URQ9d+zOTEEhn8QfIFGoKKiQCJIvaJWCQkNJbytRqCSokHyJRuRriGwisj/iXyAKkegURGQlZjd2rjNLJHbM251kC0zunXnvnvvOue/XAL/u0XyyT3PJnkZNLBEi0qYxQJc1Z99DcAwfh0iU0tKPQii3joAVnSN/oDIFkX2U3cXoPDNiEDAPrBf9XgKacf5qBm691Qd58WZgyQws50GzzqFm7Uk9hx2QmNwygSFM/APGXJ6uicrm37m3mrf/acYdUWWUYLXFEyiX0iR4pr+btlZOmqUnyDuXmnfG34GPTywBGcITKz/6GP250Umx3s8hIJZAZXDRmwNkGopAqFiJGV6xBWQUj/C9/xA9I2+BbrSEEX0Dg+27Cpo8os2w7AXOYIn9NnpNqyXgsVL+LoqnmnNX+Y+aJ2MLvW4zCXBDdZZr3QF1tkhuqpiFYBNIbFQrRwkUSJzjUuxwgKniZ+asw0+uyVDhDgjveVhA/XMexbfLRPYI87l0exArJQPeNeBFpFH+K4S3swtq7XJZ+qrwMvvbeJEVGfZu2K5pEpWh+2hCu73EGlIAHM7qAPBTMli6YL9xpplkt2bdgcYx/jSmVwuYgHvAYgfoAAAAAElFTkSuQmCC') !important;
                background-repeat: no-repeat !important;
            }

            .ext-icon.intext-yahoo, .ext-icon-perview.intext-yahoo
            {

                background-image: url('data:image/png !important;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAACMklEQVRIDeVTPWgUQRR+b/bn/IuCcNhYCylMabwEMQRBvdRKCm0M6BkSFLTRMmglBguDOdPZiNgo5jxTXZNEEMFC0gRSCFYGjRAuye3tzvO9y+2y3mZ/imvE5X3zvvcz8+3MzgL86w92bmD89HyvZ5hnEWi/0bRezHw697OzJxxfG3zbY5F9lQh/k+F9nlscWQ3XzXAgfH1za+3okZ43BHDCNd1ezl1nxJoFuSkAuo1Iqxsb9ZOdjaoz8XrlsgOK7u7maaxU+HBql0fHm/3VPiCakAqSutOaK0EIEQGplReL79hXGIqQnvAbRo5SctqAp9wjp1CZ/Xh+nnnE9hSQLgK6xb7BKJQGFq6w/8tKgwuXOHGGsdPuZRq1WIHny8U1IJiWKQT60WT/+8PCBeNDtUNE9Fg4X4bpVq8EeyBWQHrJcR/wx/4GgMccQ92XnEA72/fYH5eabngPmccaxlbahdJAdZQXesmhoxD6XNSktPrKsQ1Io+Wl4ivmsZYqIDNvFKo1QBgCgApDbISHWnn54jD7RJMbkNggRa1wQhF9YS4Ls4OmRpwUkgaV1iD1uaULK+xnGS3jbT9r51px0pBJQBYg250SLzBcK+ASJ0ElFcO1g43tuh//qP/a9HmazyywYxzY5y+Wz+dtn6f5zAIemoEAbnm5tIX9emYBvjWBQDPndn8HttMMBCzP676ARhUIOAq6f0SEGAgY2sy8g0x/snwww1TfddMbI4Xousa65P4P/AEoFqwJK1N1RgAAAABJRU5ErkJggg==') !important;
                background-repeat: no-repeat !important;
            }

            .ext-opt-icon.intext-close
            {
                background-image: url('data:image/png !important;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAABVklEQVQ4EeWSP07DMBTGbbfMbOkAJ0gikLhK/h0AJKQudAMkWoVSVjpTwQWSrAxMjbhDkjMQRRwh4XtRXdlpCjtEdvze8+ef37PN2P/4giA49Tzv/rdqXdedO45zouqE6jRN48KfQfiEsa9x3/eXnPMpOmm3msHWgpFl2dq27SHMa4zHyO4tTdMGPgvDUBiGscJmY0AWcRzPKC47l4Y6YtcHLLjDghfTNC9pLs/zZ8QuEFtEUTSlmNp7QSSQMNivQghW1/X5Pgg0TCuNArJTmZZlHcC/QiZngD32ZYL5tmmH3UY2PzoTZDDauAywEcWk3x17M6IF6pkA+AHQpKqqI/UCVNgOqAuhcqhM3OLwJ5gGIggWrbDTzu0g3j6NfTANhHcyB2QC8RLv5Aa21gBLkdkh5sdlWQqUv5YCDQTRF0RlkiS3UtAdAXvH2xpAlxRF8dmd/4P+N1KRuRnbINAVAAAAAElFTkSuQmCC') !important;
                background-repeat: no-repeat !important;
            }

           
            .ext-opt-icon.intext-drag
            {
                opacity: .5;
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAo0lEQVQ4Ed1SwQ0EIQhUcoVtEWo757WjFmFluo6BZOV7vJYsIAMh47jOvdb882Yxxil1rdWnlPKc8wvMe/8rpWQ9gx6cECzcbJEFmb3j0AiabHQF6BFCuIjocsvGGL211vXMau3vsyMHEZbLjCWCrTPgLjWK5dmxEee/08EIT/zciOswE4czenoGmKkfYuufDcKKJmCCB9AzwsZMI7NFwuyF+QYXs0UYV4JO+QAAAABJRU5ErkJggg==') !important;
                background-repeat: no-repeat !important;
            }

            .ext-opt-icon.intext-drag:hover
            {
                opacity: .7 !important;
            }


            .ext-opt-icon.intext-settings
            {
                background-image: url('data:image/png !important;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAB+ElEQVQ4EbWSTUtbQRSG595cszIoLmqqpS2Ii66E/oL8hXzTXWxLSheFWuiiFeoHiBIXLtxIIQtXhiT7/hYFQSxtLQFRpKvmo8873EyuNgqCDuedc+Y9Z87H3GvMHS3vpjz5fP5tr9d7ohjf94/q9fqO7GEIhpERruJ53qjOJLxAX5vIx+kkm83OlsvlERF08xhtk6AliXQ6/UBGKpUKisXijOw+3GiZTOZhLBbbx/GHLr7RQQZ7DETlBH4PfxZSRWYbjcYptnEdBUGwCZEASYLn0VeTQJkkSRYw1O0EegVYsYlo8xmXX1hmsP3F/NTpdJ4K+D9zFodyUmYS+zHsY3e73QMC16i2SIhNjv5C2xvovqwXCgVPcSHRI36b5/ils6etj1wuV8X5UmcCpmu12k/ZfVD9Efz38Fyl0OvQHryRCP4Vl5hxuuKiiMfjjqMzF6uYQBufOo5ex1kyg1UyxkRHMzxByYSLzktM8AO9Qmcdm4h2p+jgHTHRKqsUgDLVdrvtEfOKQstmsHySLDLFLtShx2aFSxWMj+A28pVu3uiCry2ExtDPdUzlLbgTcFX0Q8p3jOMCLAErvt3ZyHzKeM9brdZMs9n8wDhz0JdEnHyKwTHHHVfMjYbjP2HcM8gxIDnn4riMYbCPPcwRcu950EnZjPtb+t7xDzGXsl+u+uWtAAAAAElFTkSuQmCC') !important;
                background-repeat: no-repeat !important;
            }


            

            * {
            box-sizing: border-box;
          }
          
          .google-loader {
            height: 50px;
            width: 50px;
            position: relative;
            margin: 47px auto 0 auto;
          }
          .google-loader .dot {
            position: absolute;
            height: 100%;
            width: 100%;
            z-index: 1;
            border-radius: 25px;
            background: #df4a42;
            border-right: 0px solid #ffd649;
            border-left: 25px solid #df4a42;
            border-top: 0px solid transparent;
            border-bottom: 0px solid transparent;
            animation: flippingAnimation 2s linear infinite;
          }
          
          @keyframes opacity {
            to {
              opacity: 0;
            }
          }
          @keyframes flippingAnimation {
            /* RED TO YELLOW */
            0% {
              border-right: 0px solid #ffc500;
              display: block;
            }
            12.4% {
              background: #ed726c;
            }
            12.5% {
              border-right: 25px solid #ffd649;
              border-left: 25px solid #df4a42;
              background: #ffe486;
            }
            24.9% {
              border-right: 25px solid #ffd649;
              background: #ffd649;
              border-left: 0px solid #d8291f;
              border-top: 0px solid transparent;
              border-bottom: 0px solid transparent;
            }
            /* Yellow to Green */
            25% {
              border-right: 0px solid #ffd649;
              border-left: 0px solid #d8291f;
              border-top: 25px solid #ffd649;
              border-bottom: 0px solid #ffd649;
              background: #ffd649;
            }
            37.4% {
              background: #ffde6e;
            }
            37.5% {
              border-right: 0px solid transparent;
              border-left: 0px solid transparent;
              border-top: 25px solid #ffd649;
              border-bottom: 25px solid #28ad6b;
              background: #109f58;
            }
            49.9% {
              border-right: 0px solid transparent;
              border-left: 0px solid transparent;
              border-top: 0px solid #ffd649;
              border-bottom: 25px solid #28ad6b;
              background: #28ad6b;
            }
            /* Green to Blue */
            50% {
              border-top: 0px solid transparent;
              border-bottom: 0px solid transparent;
              border-left: 0px solid #377af6;
              border-right: 25px solid #28ad6b;
              background: #28ad6b;
            }
            62.4% {
              background: #2abb71;
            }
            62.5% {
              border-top: 0px solid transparent;
              border-bottom: 0px solid transparent;
              border-left: 25px solid #377af6;
              border-right: 25px solid #28ad6b;
              background: #518af4;
            }
            74.9% {
              border-top: 0px solid transparent;
              border-bottom: 0px solid transparent;
              border-left: 25px solid #377af6;
              border-right: 0px solid #28ad6b;
              background: #377af6;
            }
            /* Blue to Red */
            75% {
              border-top: 0px solid #df4a42;
              border-bottom: 25px solid #377af6;
              border-left: 0px solid transparent;
              border-right: 0px solid transparent;
              background: #377af6;
            }
            87.4% {
              background: #316bd7;
            }
            87.5% {
              border-top: 25px solid #df4a42;
              border-bottom: 25px solid #377af6;
              border-left: 0px solid transparent;
              border-right: 0px solid transparent;
              background: #f26c65;
            }
            100% {
              border-top: 25px solid #df4a42;
              border-bottom: 0px solid #377af6;
              border-left: 0px solid transparent;
              border-right: 0px solid transparent;
              background: #df4a42;
            }
          }
          

          #inext-search-error
          {
              height: 200px;
              display: table;
              margin:0 auto;
              width: 200px;
              background: url('data:image/png;base64,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') no-repeat;
          }


    </style>
    `;
    window.inlineSeachExt.shadow = shadow;

};


window.inlineSeachExt.panelDragResize = function () {

 
       interact(document.getElementById("inext-shadow-dom-local-scope").shadowRoot.querySelector(".resize-drag"))
        .draggable({
            inertia: true,
            ignoreFrom: '.ignore-interact-inext',
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: {
                    top: 0,
                    left: 0,
                    bottom: 1,
                    right: 1
                }
            },
            autoScroll: true,

            onmove: dragMoveListener
        })
        .resizable({
            edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
            },

            restrictEdges: {
                outer: 'parent',
                endOnly: true,
            },

            restrictSize: {
                min: {
                    width: 320,
                    height: 320
                },
                max: {
                    width: 410,
                    height: 410
                }
            },

            inertia: true,
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }).styleCursor(true).pointerEvents({
            ignoreFrom: '[no-pointer-event]',
          });


    function dragMoveListener(event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
   
};


window.inlineSeachExt.createBrowser = function(q)
{
   
    if(q==null || q==undefined || q=="" || q==" " || q=="  ")
    {
        window.inlineSeachExt.shadow.getElementById("inext-place-holder").innerHTML = "<p>Hmm, type something or a keyword to search ;-)</p>";
        
    } else
    {
        switch(window.inlineSeachExt.engineUsed)
        {
            case "google":
                window.inlineSeachExt.google(q, 0);
            break;
            case "wiki":
                window.inlineSeachExt.wiki(q, 0);
            break;
            case "bing":
                window.inlineSeachExt.bing(q, 0);
            break;
            case "yahoo":
                window.inlineSeachExt.yahoo(q, 0);
            break;
            default:
                window.inlineSeachExt.google(q, 0);
        }
    }
    

 
};



window.inlineSeachExt.extractRootDomain = function (url) {
    
    function extractHostname(url) {
        var hostname;
    
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
    
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
    
        return hostname;
    }
    
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
};

window.inlineSeachExt.wiki = function(query, page)
{
    var url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${query}&sroffset=${page*10}`;

    var browserContent = window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext");

    fetch(url, {
        method: 'get'
    })
    .then(function(res){
        res.json().then(function(data){            
            
            var doc = data.query.search;


            if(doc.length == 0)
            {
                browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><p>Search result not found. <br> Try a different keyword </p></div>`;
                
            }

            if(page>0)window.inlineSeachExt.shadow.getElementById("inext-more-loader").remove();
     
            for(var i = 0; i < doc.length; i++)
            {
                if(page==0 && i==0) browserContent.innerHTML = "";
                var card = document.createElement("button");
                card.className += "inext-card";
                card.innerHTML = `<div class="header" onclick="javascript:window.open(${ '\'https://en.wikipedia.org/?curid='+doc[i].pageid+'\', \'_blank\''});window.focus()" style="flex-direction:column;"><h1 style="width: 100% !important;"> ${doc[i].title}</h1><p class="domain">Wikipedia</p></div><p> ${doc[i].snippet}</p>`;
                browserContent.appendChild(card);
            }


            if(doc.length > 0)
            {
                var loadMore = document.createElement("button");
                loadMore.innerHTML = "See more";
                loadMore.id = "inext-load-more";
                loadMore.onclick = function()
                {
                    window.inlineSeachExt.shadow.getElementById("inext-load-more").remove();

                    var loader = document.createElement("div");
                    loader.id = "inext-more-loader";
                    loader.style.marginBottom = "10px";
                    loader.innerHTML = `<div class="google-loader"><div class="dot"></div></div>`;
                    browserContent.appendChild(loader);
                    browserContent.scrollTo(0, browserContent.scrollHeight);
                    window.inlineSeachExt.wiki(query, (page+1));   
                };
                browserContent.appendChild(loadMore);

            }

        
        });
        
    })
    .catch(function(err){
        browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><div id="inext-search-error"></div>Ops! something went wrong try again.</div>`;
    });




};

window.inlineSeachExt.google = function(query, page)
{
    var url = `https://www.google.com/search?q=${query}&num=10&start=${page*10}`;
    var browserContent = window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext");
    fetch(url, {
        method: 'get'
    })
    .then(function(res){
        res.text().then(function(text){
            var googleDOM = new DOMParser();
            googleDOM = googleDOM.parseFromString(text, "text/html");
            googleDOM = googleDOM.body;
            var search = googleDOM.querySelector("#search").querySelectorAll(".g");
            var doc = [];


            for(var i = 0; i < search.length; i++)
            {
                    var title = " ";
                    var url = " ";
                    var elemUrl = search[i].querySelector("a");
                    if(elemUrl!=null) {title = elemUrl.childNodes[0].textContent; url = elemUrl.href;}
                    var elemMeta = search[i].querySelector(".slp");
                    if(elemMeta!=null) elemMeta = elemMeta.textContent;
                    var elemDesc = search[i].querySelector(".st");
                    if(elemDesc!=null) elemDesc = elemDesc.textContent;
                    doc.push({url: url, title: title, meta: elemMeta, desc: elemDesc, icon: ""});

            }

            
            if(doc.length == 0)
            {
            browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><p>Search result not found. <br> Try a different keyword </p></div>`;
                
            }
            if(page>0)window.inlineSeachExt.shadow.getElementById("inext-more-loader").remove();


            for(var x = 0; x < doc.length; x++)
            {
                if(page==0 && x==0) browserContent.innerHTML = "";
                if(doc[x].desc==null) continue;
                var card = document.createElement("button");
                
                card.className += "inext-card";
                var domain = window.inlineSeachExt.extractRootDomain(doc[x].url);
                card.innerHTML = `<div class="header" onclick="javascript:window.open(${ '\''+doc[x].url+'\', \'_blank\''});window.focus()" style="flex-direction:column;"><h1 style="width: 100% !important;"> ${doc[x].title}</h1><p class="domain">${domain}</p></div><p> ${doc[x].desc}</p>`;
                browserContent.appendChild(card);
            }


           
                
        

            if(doc.length > 0)
            {
                var loadMore = document.createElement("button");
                loadMore.innerHTML = "See more";
                loadMore.id = "inext-load-more";
                loadMore.onclick = function()
                {
                    window.inlineSeachExt.shadow.getElementById("inext-load-more").remove();

                    var loader = document.createElement("div");
                    loader.id = "inext-more-loader";
                    loader.style.marginBottom = "10px";
                    loader.innerHTML = `<div class="google-loader"><div class="dot"></div></div>`;
                    browserContent.appendChild(loader);
                    browserContent.scrollTo(0, browserContent.scrollHeight);
                    window.inlineSeachExt.google(query, (page+1));   
                };
                browserContent.appendChild(loadMore);

            }

            



            
        });
        
    })
    .catch(function(err){
            browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><div id="inext-search-error"></div>Ops! something went wrong try again.</div>`;
    });




};

window.inlineSeachExt.bing = function(query, page)
{
    var url = `https://www.bing.com/search?q=${query}&count=10&first=${page*10}`;
    var browserContent = window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext");

    fetch(url, {
        method: 'get'
    })
    .then(function(res){
        res.text().then(function(text){
            var bingDOM = new DOMParser();
            bingDOM = bingDOM.parseFromString(text, "text/html");
            bingDOM = bingDOM.body;
            var search = bingDOM.querySelector("#b_results").querySelectorAll(".b_algo");
            var doc = [];


            for(var i = 0; i < search.length; i++)
            {
                    var title = " ";
                    var url = " ";
                    var elemUrl = search[i].querySelector("h2 a");
                    if(elemUrl!=null) {title = elemUrl.textContent; url = elemUrl.href;}
                    var elemDesc = search[i].querySelector("p");
                    if(elemDesc!=null) elemDesc = elemDesc.textContent;
                    doc.push({url: url, title: title, meta: "", desc: elemDesc, icon: ""});

            }

            
            if(doc.length == 0)
            {
            browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><p>Search result not found. <br> Try a different keyword </p></div>`;
                
            }
            if(page>0)window.inlineSeachExt.shadow.getElementById("inext-more-loader").remove();


            
            for(var x = 0; x < doc.length; x++)
            {
                if(page==0 && x==0) browserContent.innerHTML = "";
                if(doc[x].desc==null) continue;
                var card = document.createElement("button");
                
                card.className += "inext-card";
                var domain = window.inlineSeachExt.extractRootDomain(doc[x].url);
                card.innerHTML = `<div class="header" onclick="javascript:window.open(${ '\''+doc[x].url+'\', \'_blank\''});window.focus()" style="flex-direction:column;"><h1 style="width: 100% !important;"> ${doc[x].title}</h1><p class="domain">${domain}</p></div><p> ${doc[x].desc}</p>`;
                browserContent.appendChild(card);
            }


    

            if(doc.length > 0)
            {
                var loadMore = document.createElement("button");
                loadMore.innerHTML = "See more";
                loadMore.id = "inext-load-more";
                loadMore.onclick = function()
                {
                    window.inlineSeachExt.shadow.getElementById("inext-load-more").remove();

                    var loader = document.createElement("div");
                    loader.id = "inext-more-loader";
                    loader.style.marginBottom = "10px";
                    loader.innerHTML = `<div class="google-loader"><div class="dot"></div></div>`;
                    browserContent.appendChild(loader);
                    browserContent.scrollTo(0, browserContent.scrollHeight);
                    window.inlineSeachExt.bing(query, (page+1));   
                };
                browserContent.appendChild(loadMore);

            }

            



            
        });
        
    })
    .catch(function(err){
            browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><div id="inext-search-error"></div>Ops! something went wrong try again.</div>`;
    });




};

window.inlineSeachExt.yahoo = function(query, page)
{
    var url = `https://search.yahoo.com/search?p=${query}&n=10&b=${page*10}`;
    var browserContent = window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext");

    fetch(url, {
        method: 'get'
    })
    .then(function(res){
        res.text().then(function(text){
            var bingDOM = new DOMParser();
            bingDOM = bingDOM.parseFromString(text, "text/html");
            bingDOM = bingDOM.body;
            var search = bingDOM.querySelector("#web").querySelectorAll(".algo");
            var doc = [];


            for(var i = 0; i < search.length; i++)
            {
                    var title = " ";
                    var url = " ";
                    var elemUrl = search[i].querySelector("h3 a");
                    if(elemUrl!=null) {title = elemUrl.textContent; url = elemUrl.href;}
                    var elemDesc = search[i].querySelector(".compText");
                    if(elemDesc!=null) elemDesc = elemDesc.textContent;
                    doc.push({url: url, title: title, meta: "", desc: elemDesc, icon: ""});

            }

            
            if(doc.length == 0)
            {
            browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><p>Search result not found. <br> Try a different keyword </p></div>`;
                
            }
            if(page>0)window.inlineSeachExt.shadow.getElementById("inext-more-loader").remove();


            
            for(var x = 0; x < doc.length; x++)
            {
                if(page==0 && x==0) browserContent.innerHTML = "";
                if(doc[x].desc==null) continue;
                var card = document.createElement("button");
                
                card.className += "inext-card";
                var domain = window.inlineSeachExt.extractRootDomain(doc[x].url);
                card.innerHTML = `<div class="header" onclick="javascript:window.open(${ '\''+doc[x].url+'\', \'_blank\''});window.focus()" style="flex-direction:column;"><h1 style="width: 100% !important;"> ${doc[x].title}</h1><p class="domain">${domain}</p></div><p> ${doc[x].desc}</p>`;
                browserContent.appendChild(card);
            }


    

            if(doc.length > 0)
            {
                var loadMore = document.createElement("button");
                loadMore.innerHTML = "See more";
                loadMore.id = "inext-load-more";
                loadMore.onclick = function()
                {
                    window.inlineSeachExt.shadow.getElementById("inext-load-more").remove();

                    var loader = document.createElement("div");
                    loader.id = "inext-more-loader";
                    loader.style.marginBottom = "10px";
                    loader.innerHTML = `<div class="google-loader"><div class="dot"></div></div>`;
                    browserContent.appendChild(loader);
                    browserContent.scrollTo(0, browserContent.scrollHeight);
                    window.inlineSeachExt.yahoo(query, (page+1));   
                };
                browserContent.appendChild(loadMore);

            }

            



            
        });
        
    })
    .catch(function(err){
            browserContent.innerHTML = `<div id="inext-place-holder" style="margin-top: 4em;text-align:center; color: #999;"><div id="inext-search-error"></div>Ops! something went wrong try again.</div>`;
    });




};

window.inlineSeachExt.changeEngine = function(id)
{
    switch(id)
    {
        case "inext-ch-google":
            chrome.storage.local.set({n_last_engine: "inext-ch-google"}, function(){
                window.inlineSeachExt.last_engine = "inext-ch-google";
                window.inlineSeachExt.shadow.getElementById("inextbtn-drop").className = "inext-dropbtn ext-icon-perview intext-google";
                window.inlineSeachExt.engineUsed = "google";
                var q = window.inlineSeachExt.shadow.getElementById("inext-search-box").value;
                if(q !="")
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><div class="google-loader"><div class="dot"></div></div></div>`;
                    window.inlineSeachExt.createBrowser(q);
                } else
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><p>Hmm, type something or a keyword to google.</p></div>`;

                }
            });
        break;
        case "inext-ch-wiki":
            chrome.storage.local.set({n_last_engine: "inext-ch-wiki"}, function(){
                window.inlineSeachExt.last_engine = "inext-ch-wiki";
                window.inlineSeachExt.shadow.getElementById("inextbtn-drop").className = "inext-dropbtn ext-icon-perview intext-wiki";
                window.inlineSeachExt.engineUsed = "wiki";
                var q = window.inlineSeachExt.shadow.getElementById("inext-search-box").value;
                if(q !="")
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><div class="google-loader"><div class="dot"></div></div></div>`;
                    window.inlineSeachExt.createBrowser(q);
                } else 
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><p>Hmm, type something or a keyword to wiki.</p></div>`;
                }    
            });
        break;
        case "inext-ch-bing":
            chrome.storage.local.set({n_last_engine: "inext-ch-bing"}, function(){
                window.inlineSeachExt.last_engine = "inext-ch-bing";
                window.inlineSeachExt.shadow.getElementById("inextbtn-drop").className = "inext-dropbtn ext-icon-perview intext-bing";
                window.inlineSeachExt.engineUsed = "bing";
                var q = window.inlineSeachExt.shadow.getElementById("inext-search-box").value;
                if(q !="")
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><div class="google-loader"><div class="dot"></div></div></div>`;
                    window.inlineSeachExt.createBrowser(q);
                }else
                {
                window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><p>Hmm, type something or a keyword to bing.</p></div>`;

                }          
            });
       
        break;
        case "inext-ch-yahoo":
            chrome.storage.local.set({n_last_engine: "inext-ch-yahoo"}, function(){
                window.inlineSeachExt.last_engine = "inext-ch-yahoo";
                window.inlineSeachExt.shadow.getElementById("inextbtn-drop").className = "inext-dropbtn ext-icon-perview intext-yahoo";
                window.inlineSeachExt.engineUsed = "yahoo";
                var q = window.inlineSeachExt.shadow.getElementById("inext-search-box").value;
                if(q !="")
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><div class="google-loader"><div class="dot"></div></div></div>`;
                    window.inlineSeachExt.createBrowser(q);
                } else
                {
                    window.inlineSeachExt.shadow.getElementById("search-content-iframe-inext").innerHTML = `<div id="inext-place-holder"><p>Hmm, type something or a keyword to yahoo.</p></div>`;
                }
            });
        break;
    }
};


