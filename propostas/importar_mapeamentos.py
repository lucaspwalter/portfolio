import csv, json, re
from pathlib import Path

BASE=Path(__file__).parent
data=json.loads((BASE/'mapeamentos/consolidado.json').read_text())
with (BASE/'mapeamentos/importacao.csv').open('w',newline='',encoding='utf-8') as file:
    out=csv.writer(file)
    out.writerow(['Empresa','Segmento','Telefone','Cidade','Google Maps','Possui site?','Mensagem','PDF','Status','Primeiro contato','Último contato','Resposta','Opt-out','Observações','ID do modelo'])
    for x in data['rows']:
        out.writerow([x['name'],x['segmento'],re.sub(r'\D','',x['phone']),'Joinville',x['href'],'Não','','','Pendente','','','','Não','Google Maps exibe Adicionar website; verificado em 13/08/2026.',x['id']])
print(len(data['rows']))
