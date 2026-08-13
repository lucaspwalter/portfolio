const { chromium } = require('/tmp/pw-test/node_modules/playwright');
const fs = require('fs');

const [,, id, nome, ...termos] = process.argv;
if (!id || !nome || !termos.length) throw new Error('Uso: node mapear_maps.js <id> <nome> <termos...>');
const bairros = ['Centro','América','Atiradores','Anita Garibaldi','Saguaçu','Costa e Silva','Vila Nova','Floresta','Itaum','Boehmerwald','Aventureiro','Iririú','Boa Vista','Comasa','Fátima','Guanabara','Jardim Iririú','Paranaguamirim','Itinga','Pirabeiraba','Adhemar Garcia','Jarivatuba','Morro do Meio','Nova Brasília','Santo Antônio','Bom Retiro','Glória','Bucarein','Jardim Paraíso','Zona Industrial Norte'];
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

(async()=>{
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1400,height:900}});
  const places = new Map();
  const queries = [...termos.map(t=>`${t} Joinville SC`), ...bairros.flatMap(b=>termos.map(t=>`${t} ${b} Joinville`))];
  for (const query of queries) {
    await page.goto('https://www.google.com/maps/search/'+encodeURIComponent(query),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1100);
    const feed=page.locator('[role="feed"]');
    if(await feed.count()) for(let i=0;i<5;i++){await feed.evaluate(el=>el.scrollBy(0,el.scrollHeight));await page.waitForTimeout(250);}
    const links=await page.locator('a[href*="/maps/place/"]').evaluateAll(as=>as.map(a=>({name:a.getAttribute('aria-label'),href:a.href})).filter(x=>x.name));
    for(const place of links) places.set(place.href.split('?')[0],place);
    if(places.size>=240) break;
  }
  const list=[...places.values()];
  const workers=await Promise.all([0,1,2,3,4].map(()=>browser.newPage({viewport:{width:1200,height:800}})));
  const details=[]; let next=0;
  async function inspect(worker){while(true){const index=next++; if(index>=list.length)return; const place=list[index]; try{
    await worker.goto(place.href,{waitUntil:'domcontentloaded',timeout:30000}); await worker.waitForTimeout(650);
    const text=await worker.locator('body').innerText(); const rows=text.split('\n').map(x=>x.trim()).filter(Boolean);
    const phone=(text.match(/\(47\)\s?9?\d{4}-\d{4}/)||[])[0]||'';
    const address=rows.find(x=>/Joinville\s*-\s*SC/.test(x)&&/(R\.|Rua|Av\.|Avenida|Rod\.|Alameda|Estrada)/.test(x))||'';
    details.push({name:place.name,href:place.href.split('?')[0],phone,address,joinville:/Joinville/.test(text),closed:/Fechado permanentemente|Permanently closed/.test(text),addWebsite:text.includes('Adicionar website')});
  }catch(error){details.push({name:place.name,href:place.href,error:error.message});}}}
  await Promise.all(workers.map(inspect)); await browser.close();
  const seen=new Set(); const qualified=details.filter(x=>{
    const phone=(x.phone||'').replace(/\D/g,'');
    if(!x.joinville||x.closed||!x.addWebsite||!phone||seen.has(phone))return false;
    seen.add(phone); return true;
  });
  const out={id,nome,terms:termos,profiles:list.length,qualified};
  fs.mkdirSync('propostas/mapeamentos',{recursive:true});
  fs.writeFileSync(`propostas/mapeamentos/${id}.json`,JSON.stringify(out,null,2));
  console.log(JSON.stringify({id,profiles:list.length,qualified:qualified.length}));
})();
