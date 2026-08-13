# Progresso — catálogo completo de amostras

Atualizado em: 2026-08-13 — imagens individuais concluídas

## Objetivo autorizado

Expandir `amostras.html` para catálogo filtrável por categoria. Criar uma demonstração para cada subsegmento listado pelo usuário. Cada demonstração deve ter identidade, conteúdo, composição, navbar e interações próprias; funcionar em celular, tablet e desktop.

## Escopo

- Saúde: clínica médica, odontologia, clínica estética, fisioterapia, psicologia e laboratório.
- Comércio: mercado, loja, farmácia, ótica, móveis e roupas.
- Serviços: advocacia, contabilidade, imobiliária, oficina, elétrica e limpeza.
- Alimentação: restaurante, pizzaria, cafeteria, padaria e confeitaria.
- Beleza: salão, barbearia, manicure e spa.
- Educação: escola, cursos, idiomas e reforço escolar.
- Animais: pet shop, banho e tosa, clínica veterinária e agropecuária.
- Construção: arquitetura, engenharia, materiais de construção e reformas.
- Hospedagem e eventos: hotel, pousada, buffet e fotografia.
- Fitness: academia, pilates, dança e personal trainer.

Veterinária apareceu também em Saúde na lista original; será mantida somente em Animais para evitar duplicação. Total: 47 subsegmentos únicos.

## Critérios obrigatórios

- Catálogo não exibirá todos os cartões de uma vez: filtros por categoria e busca.
- Marcas e dados fictícios, usando `XXX`; nenhuma cópia de logo ou identidade real.
- Layouts não podem parecer simples recolorações. Variar hero, navegação, grid, tipografia, formas, ritmo, CTAs e interação.
- Imagens com fonte permitida ou ativos próprios; sem copiar fotos de empresas usadas como referência.
- Menu hambúrguer funcional em telas estreitas.
- Sem rolagem horizontal em 320, 360, 375, 390, 414 e 430 px.
- Testar também 768, 1024, 1366 e 1920 px.
- Alvos de toque com pelo menos 44 px; texto legível; imagens sem colapso; navegação por teclado.
- Respeitar `prefers-reduced-motion`.
- Validar todos os 47 modelos automaticamente, não apenas amostra manual.
- Publicar somente após testes; aguardar GitHub Pages e validar produção.

## Pesquisa concluída

- Saúde/odontologia/estética: foco em agendamento acima da dobra, confiança, especialidades, equipe e fluxo móvel curto.
- Alimentação: cardápio, reserva/pedido, fotografia forte e personalidade por tipo.
- Beleza: portfólio visual, serviços, preços e agendamento; estética varia entre editorial, vintage, colorida e wellness.
- Construção: projetos, processo, capacidades e contato; arquitetura editorial não deve parecer loja de materiais.
- Referências consultadas: CustomersHand Dental, WebCitz MedSpa, SiteBuilderReport Pizza/Salon, Wix Food templates, Orbit AEC, Windmill Engineering, HubSpot Barbershop e Colorlib Nail Salon.

## Estado atual

- Repositório estava limpo antes deste arquivo.
- Auditoria inicial feita em `amostras.html`, `src/css/amostras.css`, `demos/clinica.html`, `src/css/demo-clinica.css`, `src/js/demo-menu.js` e `src/js/transicoes.js`.
- Catálogo atual contém 7 amostras: advocacia, pet shop, mercado, clínica genérica, restaurante, academia e imobiliária.
- Catálogo filtrável implementado com busca, 10 categorias e 47 modelos.
- Demonstração dinâmica implementada em `demos/modelo.html?tipo=<id>`.
- Cada modelo possui conteúdo, marca fictícia, símbolo, cor, imagem e estilo próprios; seis famílias estruturais alternam navbar, hero, tipografia, cards e composição.
- As colagens por categoria foram substituídas por 47 fotografias individuais, exclusivas e em WebP 1536 × 1024; a mesma imagem nítida aparece no catálogo e na demonstração correspondente.
- Formulário demonstrativo, menus hambúrguer, tecla Escape e estados móveis implementados.
- Teste Playwright repetido após a troca: 47 modelos em 10 viewports, 470 verificações; zero overflow, erro JS, falha de conteúdo ou menu.
- Viewports validados: 320, 360, 375, 390, 414, 430, 768, 1024, 1366 e 1920 px.
- Catálogo validado em 320 px: 47 cartões, 11 filtros, zero overflow.
- Inspeção visual feita em odontologia, oficina, pizzaria, arquitetura, manicure e hotel.
- Publicação principal: commit `2ea3caf`, workflow GitHub Pages `31729761366` concluído com sucesso.
- Produção validada em `https://lucaspwalter.github.io/portfolio/amostras.html`; catálogo, dados e imagem WebP responderam corretamente.

## Próximo passo exato

1. Revisar visualmente modelos publicados quando houver novo feedback.
2. Manter matriz Playwright após qualquer mudança estrutural ou responsiva.

## Plano de trabalho

- [x] Auditar arquitetura, conteúdo e responsividade atuais.
- [x] Concluir pesquisa de referências por categoria.
- [x] Criar catálogo filtrável e arquitetura dos 47 modelos.
- [x] Implementar todos os modelos.
- [x] Testar todos em celulares, tablet e desktop; corrigir falhas.
- [x] Commit, push, GitHub Pages e validação publicada.

## Regra de retomada

Ao restaurar em outra conversa, pedir: `Leia /home/lucas/Documentos/projetos/portfolio/PROGRESSO_AMOSTRAS.md e continue exatamente do próximo passo, sem refazer etapas concluídas.`
