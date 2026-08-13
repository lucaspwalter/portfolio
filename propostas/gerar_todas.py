import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).parent
CAPTURAS = BASE / "capturas"
SAIDA = BASE / "pdfs"
MODELOS = json.loads((BASE / "modelos.json").read_text())
W, H = 1240, 1754
INK, CREAM, MUTED, WHITE = "#17212b", "#fff8ef", "#66717b", "#ffffff"
REGULAR = "/usr/share/fonts/OTF/SF-Pro-Rounded-Regular.otf"
BOLD = "/usr/share/fonts/OTF/SF-Pro-Rounded-Bold.otf"

def font(size, bold=False): return ImageFont.truetype(BOLD if bold else REGULAR, size)
def wrap(draw, text, face, width):
    out, current = [], ""
    for word in text.split():
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=face) <= width: current = trial
        else: out.append(current); current = word
    if current: out.append(current)
    return out
def paragraph(draw, text, x, y, face, fill, width, gap=1.3):
    for line in wrap(draw, text, face, width):
        draw.text((x, y), line, font=face, fill=fill); y += int(face.size * gap)
    return y
def footer(draw, number, accent, dark=False):
    draw.text((75, H-72), "PROPOSTA DEMONSTRATIVA • CONTEÚDO FICTÍCIO", font=font(15, True), fill="#ffffff99" if dark else MUTED)
    draw.text((1130, H-72), f"{number:02}", font=font(17, True), fill=accent)
def fit_image(page, path, box, border="#eadbca"):
    image = Image.open(path).convert("RGB")
    x, y, width, height = box
    ratio = min(width/image.width, height/image.height)
    image = image.resize((int(image.width*ratio), int(image.height*ratio)), Image.Resampling.LANCZOS)
    px, py = x+(width-image.width)//2, y+(height-image.height)//2
    ImageDraw.Draw(page).rounded_rectangle((px-8, py-8, px+image.width+8, py+image.height+8), radius=18, fill=border)
    page.paste(image, (px, py))
def build(model):
    accent, name, desc, mid = model["cor"], model["nome"], model["descricao"], model["id"]
    shot_dir = CAPTURAS / mid
    pages=[]
    p=Image.new("RGB",(W,H),INK); d=ImageDraw.Draw(p); fit_image(p,shot_dir/"hero.png",(75,0,1090,700),accent)
    d.rectangle((0,650,W,H),fill=INK); d.rectangle((75,710,185,720),fill=accent)
    d.text((75,775),"PROPOSTA DE SITE",font=font(25,True),fill=accent)
    y=paragraph(d,f"Uma presença digital feita para {name.lower()}.",75,850,font(68,True),WHITE,1060,1.08)
    paragraph(d,f"Modelo demonstrativo para {name.lower()}: visual profissional, conteúdo organizado e contato fácil em qualquer tela.",75,y+55,font(29),"#cbd2d8",960)
    footer(d,1,accent,True); pages.append(p)
    p=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(p)
    d.text((75,90),"POR QUE TER UM SITE?",font=font(20,True),fill=accent)
    d.text((75,160),"Seu endereço digital,\nsem depender só das redes.",font=font(58,True),fill=INK,spacing=4)
    paragraph(d,f"Um site próprio apresenta {name.lower()}, serviços, diferenciais e canais de contato. Clientes encontram informação rápida e a marca transmite mais confiança.",75,345,font(29),MUTED,1030)
    cards=[("01","Encontrabilidade","Informações acessíveis pelo Google e por link direto."),("02","Mais contatos","Chamadas claras para WhatsApp, orçamento ou agendamento."),("03","Marca forte","Cores, imagens e linguagem alinhadas à identidade do negócio."),("04","Experiência móvel","Navegação confortável no celular, tablet e computador.")]
    for i,(num,title,body) in enumerate(cards):
        x,y=75+(i%2)*555,650+(i//2)*390; d.rounded_rectangle((x,y,x+520,y+330),radius=22,fill=WHITE,outline="#eadbca",width=2)
        d.text((x+35,y+30),num,font=font(18,True),fill=accent); d.text((x+35,y+90),title,font=font(31,True),fill=INK); paragraph(d,body,x+35,y+155,font(23),MUTED,445)
    footer(d,2,accent); pages.append(p)
    for number,title,body,file in [(3,"Primeira impressão que apresenta",f"Imagem exclusiva, mensagem direta e botões estratégicos comunicam a proposta de {name.lower()} em segundos.","desktop.png"),(4,"Pronto para o celular","Menu compacto, leitura confortável e chamadas de ação grandes. Estrutura adaptada sem cortes.","mobile.png")]:
        p=Image.new("RGB",(W,H),WHITE); d=ImageDraw.Draw(p); d.text((75,80),"MODELO DEMONSTRATIVO",font=font(18,True),fill=accent); d.text((75,140),title,font=font(55,True),fill=INK)
        y=paragraph(d,body,75,225,font(27),MUTED,1060); fit_image(p,shot_dir/file,(75,y+65,1090,1050)); footer(d,number,accent); pages.append(p)
    p=Image.new("RGB",(W,H),INK); d=ImageDraw.Draw(p); d.text((75,105),"PRÓXIMOS PASSOS",font=font(20,True),fill=accent); d.text((75,190),"Da demonstração\npara a sua marca.",font=font(68,True),fill=WHITE,spacing=5)
    steps=["Conversa breve sobre público, atendimento e objetivos.","Definição das páginas, recursos e orçamento.","Aplicação da identidade, fotos, textos, serviços e contatos reais.","Revisão em celular e computador, aprovação e publicação."]
    y=500
    for i,step in enumerate(steps,1):
        d.ellipse((75,y,135,y+60),fill=accent); d.text((96,y+13),str(i),font=font(22,True),fill=WHITE); paragraph(d,step,170,y,font(29),"#d5dbe0",880); y+=205
    d.rounded_rectangle((75,1390,1165,1595),radius=24,fill=CREAM); d.text((115,1435),"Projeto personalizado",font=font(34,True),fill=INK); paragraph(d,"Layout, conteúdo, domínio, integrações e manutenção definidos conforme necessidade.",115,1500,font(23),MUTED,950); footer(d,5,accent,True); pages.append(p)
    SAIDA.mkdir(exist_ok=True); pages[0].save(SAIDA/f"proposta-{mid}.pdf","PDF",resolution=150,save_all=True,append_images=pages[1:])
for model in MODELOS: build(model)
print(f"{len(MODELOS)} PDFs gerados em {SAIDA}")
