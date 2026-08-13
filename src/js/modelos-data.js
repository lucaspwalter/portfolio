const CATEGORIAS = {
  saude: { nome: 'Saúde', imagem: 'saude.webp' },
  comercio: { nome: 'Comércio', imagem: 'comercio.webp' },
  servicos: { nome: 'Serviços', imagem: 'servicos.webp' },
  alimentacao: { nome: 'Alimentação', imagem: 'alimentacao.webp' },
  beleza: { nome: 'Beleza', imagem: 'beleza.webp' },
  educacao: { nome: 'Educação', imagem: 'educacao.webp' },
  animais: { nome: 'Animais', imagem: 'animais.webp' },
  construcao: { nome: 'Construção', imagem: 'construcao.webp' },
  hospedagem: { nome: 'Hospedagem e eventos', imagem: 'hospedagem-eventos.webp' },
  fitness: { nome: 'Fitness', imagem: 'fitness.webp' }
};

const MODELOS = [
  ['clinica-medica','Clínica Médica','saude','Cuidado que começa pela escuta.','Consultas, prevenção e acompanhamento próximo.',['Consultas','Especialidades','Agendamento'],'✚','#0f766e','#ccfbf1','sereno',0],
  ['odontologia','Odontologia','saude','Seu sorriso, tratado por inteiro.','Tecnologia, conforto e atendimento sem pressa.',['Prevenção','Estética dental','Implantes'],'◡','#075985','#e0f2fe','editorial',1],
  ['clinica-estetica','Clínica Estética','saude','Ciência para realçar sua essência.','Protocolos personalizados e resultados naturais.',['Facial','Corporal','Avaliação'],'✦','#9f5f68','#fff1f2','luxo',2],
  ['fisioterapia','Fisioterapia','saude','Volte a mover seus planos.','Reabilitação ativa para cada fase da vida.',['Ortopedia','Esportiva','Pilates clínico'],'↗','#256d5b','#ecfdf5','movimento',3],
  ['psicologia','Psicologia','saude','Um espaço seguro para você.','Escuta qualificada, vínculo e desenvolvimento.',['Individual','Casais','Online'],'◯','#7c5c46','#faf5ef','calmo',4],
  ['laboratorio','Laboratório','saude','Precisão que cuida.','Exames com agilidade, segurança e clareza.',['Coleta','Resultados','Atendimento domiciliar'],'⬡','#155e75','#ecfeff','tecnico',5],

  ['mercado','Mercado','comercio','Fresco todo dia. Perto de você.','Ofertas, variedade e praticidade no bairro.',['Hortifruti','Padaria','Encarte'],'M','#166534','#f0fdf4','varejo',0],
  ['loja','Loja','comercio','Achados para sua rotina.','Curadoria simples, compra fácil e novidades.',['Novidades','Coleções','Atendimento'],'◇','#b45309','#fff7ed','catalogo',1],
  ['farmacia','Farmácia','comercio','Cuidado sempre por perto.','Conveniência, orientação e entrega rápida.',['Medicamentos','Bem-estar','Entrega'],'✚','#0369a1','#eff6ff','limpo',2],
  ['otica','Ótica','comercio','Enxergue seu estilo.','Armações, lentes e atendimento especializado.',['Armações','Lentes','Exame visual'],'◉','#7c3aed','#f5f3ff','editorial',3],
  ['moveis','Móveis','comercio','Espaços com mais intenção.','Mobiliário para viver, trabalhar e receber.',['Sala','Quarto','Planejados'],'▰','#78350f','#fef3c7','arquitetural',4],
  ['roupas','Roupas','comercio','Vista o seu momento.','Peças versáteis e coleções com personalidade.',['Feminino','Masculino','Novidades'],'R','#be123c','#fff1f2','moda',5],

  ['advocacia','Advocacia','servicos','Estratégia jurídica com clareza.','Proteção para pessoas, patrimônio e empresas.',['Empresarial','Civil','Família'],'§','#1e293b','#f8fafc','institucional',0,'advocacia.html'],
  ['contabilidade','Contabilidade','servicos','Números claros. Decisões melhores.','Gestão contábil próxima e orientada ao crescimento.',['Fiscal','Pessoal','Consultoria'],'%','#164e63','#ecfeff','dados',1],
  ['imobiliaria','Imobiliária','servicos','Espaço para novos planos.','Curadoria de imóveis e negociação segura.',['Comprar','Alugar','Anunciar'],'⌂','#0c4a6e','#f0f9ff','imobiliario',2],
  ['oficina','Oficina','servicos','Seu carro pronto para seguir.','Diagnóstico transparente e serviço confiável.',['Revisão','Mecânica','Elétrica'],'⌁','#b91c1c','#fff7ed','industrial',3],
  ['eletrica','Elétrica','servicos','Energia com segurança.','Instalações e manutenção para casas e empresas.',['Instalação','Manutenção','Emergência'],'ϟ','#ca8a04','#fffbeb','eletrico',4],
  ['limpeza','Limpeza','servicos','Seu espaço leve outra vez.','Limpeza profissional com cuidado em cada detalhe.',['Residencial','Comercial','Pós-obra'],'✧','#0891b2','#ecfeff','claro',5],

  ['restaurante','Restaurante','alimentacao','Uma mesa. Muitas memórias.','Cozinha autoral, ingredientes frescos e atmosfera.',['Menu','Reservas','Experiência'],'R','#7f1d1d','#fff7ed','gastronomico',0],
  ['pizzaria','Pizzaria','alimentacao','Forno aceso. Massa viva.','Fermentação lenta e sabores que aproximam.',['Pizzas','Combos','Delivery'],'◒','#c2410c','#fff7ed','rustico',1],
  ['cafeteria','Cafeteria','alimentacao','Pausa boa tem aroma.','Cafés especiais, encontros e pequenos rituais.',['Cafés','Brunch','Grãos'],'☕','#713f12','#fefce8','aconchego',2],
  ['padaria','Padaria','alimentacao','O dia começa aqui.','Pães artesanais e fornadas frescas diariamente.',['Pães','Salgados','Encomendas'],'⌇','#a16207','#fffbeb','artesanal',3],
  ['confeitaria','Confeitaria','alimentacao','Celebre com mais sabor.','Doces delicados e criações sob encomenda.',['Bolos','Doces','Eventos'],'♡','#db2777','#fdf2f8','doce',4],

  ['salao','Salão','beleza','Seu estilo em movimento.','Corte, cor e cuidado com assinatura própria.',['Cabelo','Coloração','Tratamentos'],'S','#a8556b','#fff1f2','glam',0],
  ['barbearia','Barbearia','beleza','Clássico no corte. Atual na atitude.','Barba, cabelo e experiência sem pressa.',['Cortes','Barba','Combos'],'✂','#292524','#f5f5f4','vintage',1],
  ['manicure','Manicure','beleza','Cor até na ponta dos dedos.','Nail art, cuidado e acabamento impecável.',['Manicure','Nail art','Alongamento'],'✿','#7e22ce','#faf5ff','pop',2],
  ['spa','Spa','beleza','Desacelere por inteiro.','Rituais de bem-estar para corpo e mente.',['Massagens','Faciais','Rituais'],'≈','#3f6212','#f7fee7','wellness',3],

  ['escola','Escola','educacao','Aprender abre caminhos.','Formação humana, curiosidade e comunidade.',['Educação infantil','Fundamental','Famílias'],'A','#1d4ed8','#eff6ff','escolar',0],
  ['cursos','Cursos','educacao','Aprenda fazendo.','Formações práticas para transformar conhecimento em ação.',['Tecnologia','Negócios','Criatividade'],'▶','#c2410c','#fff7ed','workshop',1],
  ['idiomas','Idiomas','educacao','O mundo fala com você.','Aulas vivas para comunicação real.',['Inglês','Espanhol','Conversação'],'Aa','#0f766e','#f0fdfa','global',2],
  ['reforco','Reforço Escolar','educacao','Confiança para aprender melhor.','Acompanhamento individual e evolução no próprio ritmo.',['Matemática','Português','Organização'],'✓','#7c3aed','#f5f3ff','didatico',3],

  ['petshop','Pet Shop','animais','Carinho cabe em cada cuidado.','Produtos, serviços e uma rotina mais feliz para seu pet.',['Produtos','Assinaturas','Entrega'],'●','#166534','#f0fdf4','pet',0,'petshop.html'],
  ['banho-tosa','Banho e Tosa','animais','Limpo, leve e abanando o rabo.','Bem-estar, higiene e estética com manejo gentil.',['Banho','Tosa','Hidratação'],'✂','#0f766e','#ecfdf5','divertido',1],
  ['veterinaria','Clínica Veterinária','animais','Saúde para quem faz parte da família.','Atendimento clínico, prevenção e emergência.',['Consultas','Vacinas','Exames'],'♥','#0369a1','#eff6ff','clinico-pet',2],
  ['agropecuaria','Agropecuária','animais','Do campo para o campo.','Soluções para criação, cultivo e rotina rural.',['Rações','Ferramentas','Campo'],'▲','#4d7c0f','#f7fee7','rural',3],

  ['arquitetura','Arquitetura','construcao','Ideias que viram espaço.','Projetos com contexto, função e identidade.',['Residencial','Comercial','Interiores'],'⌂','#334155','#f8fafc','editorial-arq',0],
  ['engenharia','Engenharia','construcao','Precisão do projeto à entrega.','Planejamento técnico e execução responsável.',['Projetos','Obras','Laudos'],'△','#1e40af','#eff6ff','engenharia',1],
  ['materiais','Materiais de Construção','construcao','Sua obra começa bem aqui.','Materiais, orientação e entrega para cada etapa.',['Básicos','Acabamentos','Entrega'],'▦','#c2410c','#fff7ed','deposito',2],
  ['reformas','Reformas','construcao','Renove sem complicação.','Planejamento, execução e acabamento em um só time.',['Residencial','Comercial','Interiores'],'⌑','#92400e','#fffbeb','obra',3],

  ['hotel','Hotel','hospedagem','Sua estadia, elevada.','Conforto contemporâneo e hospitalidade atenta.',['Quartos','Experiências','Reservas'],'H','#064e3b','#ecfdf5','hotel',0],
  ['pousada','Pousada','hospedagem','Dias leves moram aqui.','Natureza, acolhimento e tempo sem pressa.',['Suítes','Natureza','Experiências'],'☼','#a16207','#fffbeb','natural',1],
  ['buffet','Buffet','hospedagem','Seu evento merece presença.','Gastronomia, produção e serviço para celebrar.',['Casamentos','Corporativo','Menus'],'✦','#9f1239','#fff1f2','evento',2],
  ['fotografia','Fotografia','hospedagem','Histórias que ficam.','Fotografia sensível para pessoas, marcas e eventos.',['Ensaios','Eventos','Marcas'],'◉','#18181b','#fafafa','portfolio',3],

  ['academia','Academia','fitness','Treine com propósito.','Estrutura, orientação e consistência para evoluir.',['Musculação','Cardio','Funcional'],'A','#65a30d','#0f172a','impacto',0,'academia.html'],
  ['pilates','Pilates','fitness','Força com consciência.','Movimento preciso, respiração e equilíbrio.',['Studio','Clínico','Individual'],'○','#a16207','#fffbeb','sereno-fit',1],
  ['danca','Dança','fitness','O corpo também fala.','Aulas para expressão, técnica e alegria.',['Contemporâneo','Ritmos','Infantil'],'♪','#c026d3','#fdf4ff','ritmo',2],
  ['personal','Personal Trainer','fitness','Seu objetivo. Seu plano.','Treino individual, acompanhamento e resultado sustentável.',['Avaliação','Treino','Acompanhamento'],'↗','#0284c7','#f0f9ff','performance',3]
].map(([id,nome,categoria,titulo,descricao,servicos,simbolo,cor,fundo,estilo,posicao,legado]) => ({
  id,nome,categoria,titulo,descricao,servicos,simbolo,cor,fundo,estilo,posicao,legado
}));

globalThis.CATEGORIAS = CATEGORIAS;
globalThis.MODELOS = MODELOS;
