const { chromium } = require('/tmp/pw-test/node_modules/playwright');
const fs = require('fs');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const seed=await browser.newPage();
  await seed.goto('http://127.0.0.1:4173/amostras.html',{waitUntil:'networkidle'});
  const modelos=await seed.evaluate(()=>MODELOS.map(({id,nome,categoria,descricao,cor})=>({id,nome,categoria,descricao,cor})));
  fs.writeFileSync('propostas/modelos.json',JSON.stringify(modelos,null,2)); await seed.close();
  for(const model of modelos){
    const dir=`propostas/capturas/${model.id}`; fs.mkdirSync(dir,{recursive:true});
    for(const item of [{name:'desktop',w:1440,h:1100,scale:1.2},{name:'mobile',w:390,h:844,scale:1.5}]){
      const page=await browser.newPage({viewport:{width:item.w,height:item.h},deviceScaleFactor:item.scale});
      await page.goto(`http://127.0.0.1:4173/demos/modelo.html?tipo=${model.id}`,{waitUntil:'networkidle'});
      await page.locator('.hero').screenshot({path:`${dir}/${item.name}.png`});
      if(item.name==='desktop') await page.locator('.hero-imagem img').screenshot({path:`${dir}/hero.png`});
      await page.close();
    }
  }
  await browser.close(); console.log(`${modelos.length} modelos capturados`);
})();
