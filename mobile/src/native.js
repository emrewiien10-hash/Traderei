import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';
const native=Capacitor.isNativePlatform();
window.TradereiNative={isNative:native,
  geolocation: native ? {getCurrentPosition(success,failure,options={}){
    Geolocation.getCurrentPosition({enableHighAccuracy:!!options.enableHighAccuracy,timeout:options.timeout||15000,maximumAge:options.maximumAge||0})
      .then(success).catch(e=>failure?.({code:/permission|denied|0003/i.test(e.message+' '+e.code)?1:2,message:e.message}));
  }} : navigator.geolocation
};
if(native){
  let picking=false;
  document.addEventListener('click',async event=>{
    const input=event.target.closest?.('input[type="file"]');
    if(input&&['photoFileInput','avatarFileInput'].includes(input.id)){
      event.preventDefault();if(picking)return;picking=true;
      try{
        const result=await Camera.pickImages({quality:90,limit:input.multiple?3:1});
        const transfer=new DataTransfer();
        for(const [i,photo] of result.photos.slice(0,input.multiple?3:1).entries()){
          const response=await fetch(photo.webPath);const blob=await response.blob();
          transfer.items.add(new File([blob],`photo-${Date.now()}-${i}.${photo.format||'jpeg'}`,{type:blob.type||'image/jpeg'}));
        }
        if(transfer.files.length){input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));}
      }catch(e){if(!/cancel/i.test(e.message||''))window.showToastMsg?.('Fotoauswahl nicht möglich. Bitte Berechtigung prüfen.');}
      finally{picking=false;}
      return;
    }
    const anchor=event.target.closest?.('a[href]');
    if(!anchor)return;
    const url=new URL(anchor.href,location.href);
    const sameLocal=url.hostname===location.hostname&&url.protocol===location.protocol;
    if(['http:','https:'].includes(url.protocol)&&!sameLocal){
      event.preventDefault();try{await Browser.open({url:url.href});}catch{window.showToastMsg?.('Link konnte nicht geöffnet werden.');}
    }else if(anchor.target==='_blank'&&sameLocal){
      event.preventDefault();await Browser.open({url:'https://www.traderei.at'+url.pathname+url.search+url.hash});
    }
  },true);
  App.addListener('backButton',()=>{
    const dialog=document.querySelector('dialog[open]');
    if(dialog){dialog.dispatchEvent(new Event('cancel',{cancelable:true}));if(dialog.open&&dialog.id!=='cookieDialog')dialog.close();return;}
    const sheet=document.getElementById('sheetOverlay');
    if(sheet?.classList.contains('open')){window.closeSheet?.();return;}
    if(!document.getElementById('view-feed')?.classList.contains('active')){window.showView?.('feed');return;}
    App.minimizeApp();
  });
}
