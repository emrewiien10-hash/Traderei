import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.dirname(root), out=path.join(root,'www');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of ['assets','agb.html','datenschutz.html','impressum.html'])await cp(path.join(repo,name),path.join(out,name),{recursive:true});
let html=await readFile(path.join(repo,'index.html'),'utf8');
html=html.replace('width=device-width, initial-scale=1.0','width=device-width, initial-scale=1.0, viewport-fit=cover');
html=html.replace('<script>', '<script src="/assets/native.js"></script>\n<script>');
html=html.replaceAll('!window.isSecureContext', '(!window.TradereiNative.isNative && !window.isSecureContext)');
html=html.replaceAll('navigator.geolocation','window.TradereiNative.geolocation');
// Confirmation stays on the HTTPS website; users can then sign in in the app.
html=html.replace('options: { data: { first_name:', "options: { emailRedirectTo: 'https://www.traderei.at', data: { first_name:");
html=html.replace('</style>', `
body{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}
.app{height:calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))}
#sheetOverlay .sheet{padding-bottom:calc(24px + env(safe-area-inset-bottom))}
</style>`);
await writeFile(path.join(out,'index.html'),html);
await build({entryPoints:[path.join(root,'src/native.js')],outfile:path.join(out,'assets/native.js'),bundle:true,format:'iife',target:'es2022',minify:true});
console.log('Mobile web assets built in mobile/www');
