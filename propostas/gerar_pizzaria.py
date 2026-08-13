from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).parent
SHOTS = BASE / "capturas-pizzaria"
OUT = BASE / "proposta-site-pizzaria.pdf"
W, H = 1240, 1754
INK, ORANGE, CREAM, MUTED, WHITE = "#17212b", "#c93608", "#fff6eb", "#66717b", "#ffffff"
REGULAR = "/usr/share/fonts/OTF/SF-Pro-Rounded-Regular.otf"
BOLD = "/usr/share/fonts/OTF/SF-Pro-Rounded-Bold.otf"

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)

def lines(draw, text, face, width):
    result, current = [], ""
    for word in text.split():
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=face) <= width:
            current = trial
        else:
            result.append(current)
            current = word
    if current:
        result.append(current)
    return result

def paragraph(draw, text, x, y, face, fill, width, gap=1.3):
    for line in lines(draw, text, face, width):
        draw.text((x, y), line, font=face, fill=fill)
        y += int(face.size * gap)
    return y

def footer(draw, number, dark=False):
    color = "#ffffff99" if dark else MUTED
    draw.text((75, H - 72), "PROPOSTA DEMONSTRATIVA • CONTEÚDO FICTÍCIO", font=font(15, True), fill=color)
    draw.text((1130, H - 72), f"{number:02}", font=font(17, True), fill=ORANGE)

def cover():
    page = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(page)
    hero = Image.open(SHOTS / "hero.png").convert("RGB")
    hero.thumbnail((W, 720), Image.Resampling.LANCZOS)
    page.paste(hero, ((W - hero.width) // 2, 0))
    draw.rectangle((0, 650, W, H), fill=INK)
    draw.rectangle((75, 710, 185, 720), fill=ORANGE)
    draw.text((75, 775), "PROPOSTA DE SITE", font=font(25, True), fill=ORANGE)
    y = paragraph(draw, "Uma presença digital feita para abrir o apetite.", 75, 850, font(70, True), WHITE, 1060, 1.08)
    paragraph(draw, "Modelo demonstrativo para pizzarias: visual marcante, cardápio organizado e contato fácil em qualquer tela.", 75, y + 55, font(29), "#cbd2d8", 960)
    footer(draw, 1, True)
    return page

def intro():
    page = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(page)
    draw.text((75, 90), "POR QUE TER UM SITE?", font=font(20, True), fill=ORANGE)
    draw.text((75, 160), "Seu endereço digital,\nsem depender só das redes.", font=font(58, True), fill=INK, spacing=4)
    paragraph(draw, "Um site próprio centraliza cardápio, horários, localização, diferenciais e canais de pedido. O cliente encontra informação rápida e a marca transmite mais confiança.", 75, 345, font(29), MUTED, 1030)
    cards = [
        ("01", "Encontrabilidade", "Informações essenciais acessíveis pelo Google e por link direto."),
        ("02", "Mais pedidos", "Chamadas claras para WhatsApp, delivery, reservas ou retirada."),
        ("03", "Marca forte", "Fotografia, cores e linguagem alinhadas à personalidade da pizzaria."),
        ("04", "Experiência móvel", "Navegação rápida e confortável no celular, onde muitos clientes decidem."),
    ]
    for i, (num, title, body) in enumerate(cards):
        x, y = 75 + (i % 2) * 555, 650 + (i // 2) * 390
        draw.rounded_rectangle((x, y, x + 520, y + 330), radius=22, fill=WHITE, outline="#eadbca", width=2)
        draw.text((x + 35, y + 30), num, font=font(18, True), fill=ORANGE)
        draw.text((x + 35, y + 90), title, font=font(31, True), fill=INK)
        paragraph(draw, body, x + 35, y + 155, font(23), MUTED, 445)
    footer(draw, 2)
    return page

def visual_page(number, title, body, filename):
    page = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(page)
    draw.text((75, 80), "MODELO DEMONSTRATIVO", font=font(18, True), fill=ORANGE)
    draw.text((75, 140), title, font=font(55, True), fill=INK)
    y = paragraph(draw, body, 75, 225, font(27), MUTED, 1060)
    shot = Image.open(SHOTS / filename).convert("RGB")
    max_w, max_h = 1090, 1050
    ratio = min(max_w / shot.width, max_h / shot.height)
    shot = shot.resize((int(shot.width * ratio), int(shot.height * ratio)), Image.Resampling.LANCZOS)
    sx, sy = (W - shot.width) // 2, y + 65
    draw.rounded_rectangle((sx - 8, sy - 8, sx + shot.width + 8, sy + shot.height + 8), radius=18, fill="#f4e8dc")
    page.paste(shot, (sx, sy))
    footer(draw, number)
    return page

def final():
    page = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(page)
    draw.text((75, 105), "PRÓXIMOS PASSOS", font=font(20, True), fill=ORANGE)
    draw.text((75, 190), "Da demonstração\npara a sua marca.", font=font(68, True), fill=WHITE, spacing=5)
    steps = [
        "Conversa breve sobre público, atendimento e objetivos.",
        "Definição das páginas, recursos e orçamento.",
        "Aplicação da identidade, fotos, textos, cardápio e contatos reais.",
        "Revisão em celular e computador, aprovação e publicação.",
    ]
    y = 500
    for i, step in enumerate(steps, 1):
        draw.ellipse((75, y, 135, y + 60), fill=ORANGE)
        draw.text((96, y + 13), str(i), font=font(22, True), fill=WHITE)
        paragraph(draw, step, 170, y, font(29), "#d5dbe0", 880)
        y += 205
    draw.rounded_rectangle((75, 1390, 1165, 1595), radius=24, fill=CREAM)
    draw.text((115, 1435), "Projeto personalizado", font=font(34, True), fill=INK)
    paragraph(draw, "Layout, conteúdo, domínio, integrações e manutenção definidos conforme necessidade.", 115, 1500, font(23), MUTED, 950)
    footer(draw, 5, True)
    return page

pages = [
    cover(), intro(),
    visual_page(3, "Primeira impressão que vende", "Imagem exclusiva, mensagem direta e botões estratégicos apresentam a proposta da pizzaria em segundos.", "desktop.png"),
    visual_page(4, "Pronto para o celular", "Menu compacto, leitura confortável e chamadas de ação grandes. Estrutura adaptada para telas pequenas sem cortes.", "mobile.png"),
    final(),
]
pages[0].save(OUT, "PDF", resolution=150, save_all=True, append_images=pages[1:])
print(OUT)
