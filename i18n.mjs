import {exact,phrases} from './translations.mjs';
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const phrasePattern=new RegExp('(?<![\\p{L}])(?:'+Object.keys(phrases).sort((a,b)=>b.length-a.length).map(esc).join('|')+')(?![\\p{L}])','gu');
export function translate(text,lang='en'){
 if(lang!=='en'||typeof text!=='string')return text;
 const key=text.trim();let result=exact[key]??phrases[key];
 const step=key.match(/^(Stap|Onderdeel) (\d+) · (.*)$/);if(step)result=(step[1]==='Stap'?'Step':'Part')+' '+step[2]+' · '+translate(step[3]);
 if(result===undefined){
  const action=key.match(/^(.*) (plaatsen|vastzetten|voorbereiden|toevoegen|aansluiten)$/);
  result=action?({plaatsen:'Install',vastzetten:'Secure',voorbereiden:'Prepare',toevoegen:'Add',aansluiten:'Connect'}[action[2]]+' '+translate(action[1])):key.replace(phrasePattern,m=>phrases[m]);
 }
 return text.slice(0,text.indexOf(key))+result+text.slice(text.indexOf(key)+key.length);
}
export function initLanguage(){
 const select=document.getElementById('language');if(!select)return;
 let lang='nl';try{const query=new URL(location.href).searchParams.get('lang');lang=query==='en'||query==='nl'?query:localStorage.getItem('cyberstriker-language')||'nl'}catch{}
 if(!['nl','en'].includes(lang))lang='nl';
 const originals=new WeakMap(),attrs=new WeakMap();
 const skip=n=>n.parentElement?.closest('script,style,select,canvas,[data-no-translate]');
 function textNode(n){if(skip(n)||!n.data.trim())return;let saved=originals.get(n);if(!saved||n.data!==saved.rendered)saved={original:n.data};const value=translate(saved.original,lang);saved.rendered=value;originals.set(n,saved);if(n.data!==value)n.data=value;}
 function element(el){if(el.closest('script,style,select,canvas,[data-no-translate]'))return;let saved=attrs.get(el)||{};for(const key of ['aria-label','title','alt','content']){if(key==='content'&&!el.matches('meta[name="description"]'))continue;if(!el.hasAttribute(key))continue;const current=el.getAttribute(key);if(!saved[key]||current!==saved[key].rendered)saved[key]={original:current};const value=translate(saved[key].original,lang);saved[key].rendered=value;if(current!==value)el.setAttribute(key,value)}attrs.set(el,saved)}
 function scan(root){if(root.nodeType===3){textNode(root);return}if(root.nodeType!==1&&root.nodeType!==9)return;if(root.nodeType===1)element(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;n.nodeType===3?textNode(n):element(n)}}
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='childList')r.addedNodes.forEach(scan);else if(r.type==='characterData')textNode(r.target);else element(r.target)}});
 function apply(){document.documentElement.lang=lang;select.value=lang;scan(document.documentElement);try{localStorage.setItem('cyberstriker-language',lang)}catch{}document.dispatchEvent(new CustomEvent('languagechange',{detail:{language:lang}}));}
 select.addEventListener('change',()=>{lang=select.value;apply()});apply();observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','content']});
 window.assemblyLanguage={get:()=>lang,set:value=>{if(!['nl','en'].includes(value))return;lang=value;apply()}};
}
