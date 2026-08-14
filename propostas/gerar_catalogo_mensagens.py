import csv, json
import re, unicodedata
from pathlib import Path
base=Path(__file__).parent
models=json.loads((base/'modelos.json').read_text())
portfolio='https://lucaspwalter.github.io/portfolio/'
def filename(name):
    plain=unicodedata.normalize('NFKD',name).encode('ascii','ignore').decode()
    slug=re.sub(r'[^A-Za-z0-9]+','-',plain).strip('-')
    return f'Proposta-Comercial-Site-{slug}-Lucas-Walter.pdf'
with (base/'catalogo-mensagens.csv').open('w',newline='',encoding='utf-8') as f:
    writer=csv.writer(f)
    writer.writerow(['Segmento','ID do modelo','Link da amostra','Arquivo PDF','Mensagem padrão','Status'])
    for m in models:
        link=f"{portfolio}demos/modelo.html?tipo={m['id']}"
        pdf=f"{portfolio}propostas/pdfs/{filename(m['nome'])}"
        msg=(f"Olá! Tudo bem? Meu nome é Lucas e estou iniciando minha carreira no desenvolvimento de sites profissionais.\n\n"
             f"Preparei um modelo demonstrativo específico para {m['nome'].lower()}, responsivo para celulares e computadores, pensado para apresentar serviços e facilitar o contato com clientes.\n\n"
             f"Estou enviando um PDF com a proposta e imagens do projeto. Demonstração completa:\n{link}\n\n"
             f"Portfólio:\n{portfolio}\n\n"
             "Posso personalizar identidade visual, textos, imagens, serviços e contatos para sua empresa. Caso tenha interesse, explico como funciona, sem compromisso.")
        writer.writerow([m['nome'],m['id'],link,pdf,msg,'Pendente'])
print('47 mensagens geradas')
