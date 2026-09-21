import sharp from 'sharp';
import {readFile,writeFile,mkdir,readdir,rm,copyFile} from 'node:fs/promises';
import path from 'node:path';
const svg=await readFile('resources/icon.svg');
const icon=await sharp(svg).resize(1024,1024).flatten({background:'#0D0E15'}).png().toBuffer();
await writeFile('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png',icon);
const small=await sharp(icon).resize(480,480).png().toBuffer();
const splash=await sharp({create:{width:2732,height:2732,channels:3,background:'#0D0E15'}}).composite([{input:small,gravity:'centre'}]).png().toBuffer();
for(const f of ['splash-2732x2732.png','splash-2732x2732-1.png','splash-2732x2732-2.png'])await writeFile('ios/App/App/Assets.xcassets/Splash.imageset/'+f,splash);
const res='android/app/src/main/res';
for(const dir of await readdir(res)){if(!dir.startsWith('drawable')&&!dir.startsWith('mipmap'))continue;for(const f of await readdir(path.join(res,dir)))if(f.endsWith('.png'))await rm(path.join(res,dir,f));}
await writeFile(res+'/drawable/traderei_logo.png',icon);
await writeFile(res+'/values/traderei_icons.xml',`<resources><item type="mipmap" name="ic_launcher">@drawable/traderei_logo</item><item type="mipmap" name="ic_launcher_round">@drawable/traderei_logo</item><color name="traderei_background">#0D0E15</color></resources>`);
await writeFile(res+'/drawable/traderei_foreground.xml',`<inset xmlns:android="http://schemas.android.com/apk/res/android" android:drawable="@drawable/traderei_logo" android:inset="18%" />`);
for(const name of ['ic_launcher','ic_launcher_round'])await writeFile(res+'/mipmap-anydpi-v26/'+name+'.xml',`<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/traderei_background"/><foreground android:drawable="@drawable/traderei_foreground"/></adaptive-icon>`);
await writeFile(res+'/drawable/splash.xml',`<layer-list xmlns:android="http://schemas.android.com/apk/res/android"><item android:drawable="@color/traderei_background"/><item android:width="128dp" android:height="128dp" android:gravity="center" android:drawable="@drawable/traderei_logo"/></layer-list>`);
console.log('traderei icons and launch screens generated');
