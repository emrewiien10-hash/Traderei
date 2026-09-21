/* traderei consent preferences, version 2026-09-21 */
(()=>{
 'use strict';
 const KEY='traderei-consent-v1',VERSION=1,AGE=180*24*60*60*1000;
 let choice=null,previousFocus=null;
 function read(){try{const v=JSON.parse(localStorage.getItem(KEY));return v&&v.version===VERSION&&typeof v.maps==='boolean'&&Number.isFinite(v.savedAt)&&v.savedAt<=Date.now()&&Date.now()-v.savedAt<AGE?v:null;}catch{return null;}}
 choice=read();
 const dialog=document.createElement('dialog');dialog.id='cookieDialog';dialog.setAttribute('aria-labelledby','cookieTitle');
 dialog.innerHTML='<h2 id="cookieTitle">Cookies & externe Dienste</h2><p>Notwendige Speicherfunktionen ermöglichen Anmeldung und das Merken deiner Auswahl. Externe Karten und die Bezirkssuche laden wir nur mit deiner Zustimmung. Ohne diese Dienste kannst du traderei weiterhin nutzen.</p><p>Verantwortlich: Hüseyin Emre Akdin · <a href="mailto:kontakt@traderei.at">kontakt@traderei.at</a></p><div id="cookieDetails" hidden><p><strong>Notwendig – immer aktiv:</strong> Anmeldung und Sitzung (Supabase), Sicherheitsfunktionen sowie diese Auswahl. Deine Auswahl wird für bis zu 180 Tage in diesem Browser gespeichert.</p><label class="cookie-option"><input type="checkbox" id="cookieMaps"> <span><strong>Externe Karten & Bezirkssuche</strong><br>OpenStreetMap Foundation: IP-Adresse, Browserdaten, angeforderte Kartenausschnitte und bei der Ortssuche der ausgewählte Bezirk. Zweck: Kartenanzeige und Ermittlung eines Kartenpunkts. Die Auswahl erlaubt beide zusammengehörigen Kartenfunktionen. Eine Geräteortung benötigt zusätzlich deine Browserfreigabe.</span></label><p>Kein Werbe- oder Analyse-Tracking ist im Anwendungscode eingebunden. <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">Datenschutz bei OpenStreetMap</a></p></div><div class="cookie-actions"><button type="button" id="cookieAccept">Alle akzeptieren</button><button type="button" id="cookieReject">Nur notwendige</button><button type="button" id="cookieSettings">Einstellungen</button><button type="button" id="cookieSave" hidden>Auswahl speichern</button></div><p>Jederzeit änderbar über „Cookie-Einstellungen“. <a href="/datenschutz.html" target="_blank" rel="noopener">Datenschutz</a> · <a href="/impressum.html" target="_blank" rel="noopener">Impressum</a></p><p id="cookieStorageInfo" role="status"></p>';
 document.body.appendChild(dialog);
 const details=dialog.querySelector('#cookieDetails'),toggle=dialog.querySelector('#cookieMaps');
 function settings(expand=true){previousFocus=document.activeElement;toggle.checked=!!choice?.maps;details.hidden=!expand;dialog.querySelector('#cookieSave').hidden=!expand;dialog.querySelector('#cookieSettings').hidden=expand;if(!dialog.open)dialog.showModal();}
 function changed(){window.dispatchEvent(new CustomEvent('traderei-consent-change',{detail:{maps:!!choice?.maps}}));}
 function save(maps){choice={version:VERSION,maps:!!maps,savedAt:Date.now()};try{localStorage.setItem(KEY,JSON.stringify(choice));}catch{ /* Choice remains valid for this page only. */ }
 dialog.close();changed();previousFocus?.focus?.();}
 dialog.querySelector('#cookieAccept').onclick=()=>save(true);
 dialog.querySelector('#cookieReject').onclick=()=>save(false);
 dialog.querySelector('#cookieSettings').onclick=()=>settings(true);
 dialog.querySelector('#cookieSave').onclick=()=>save(toggle.checked);
 dialog.addEventListener('cancel',e=>{e.preventDefault();save(choice?.maps===true);});
 function allowed(){if(choice&&Date.now()-choice.savedAt>=AGE){choice=null;changed();}return !!choice?.maps;}
 window.TradereiConsent={mapsAllowed:allowed,open:()=>settings(true),requireMaps(){if(allowed())return true;settings(true);return false;}};
 document.addEventListener('click',e=>{if(e.target.closest('[data-cookie-settings]')){e.preventDefault();settings(true);}});
 window.addEventListener('storage',e=>{if(e.key!==KEY&&e.key!==null)return;choice=read();changed();if(dialog.open)toggle.checked=!!choice?.maps;});
 window.addEventListener('focus',()=>{allowed();});
 if(location.hash==='#cookie-einstellungen')settings(true);else if(!choice)settings(false);
})();
