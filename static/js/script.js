document.addEventListener("DOMContentLoaded", () => {
    
// =========================================
// 1. LÓGICA DO MENU MOBILE E BOTÃO ARRASTÁVEL (FAB)
// =========================================
const fab = document.getElementById('floating-menu');
const overlay = document.getElementById('mobile-menu-overlay');
const closeBtn = document.getElementById('close-menu-btn');

if (fab && overlay && window.getComputedStyle(fab).display !== 'none') {
    let isDragging = false;
    let hasDragged = false;
    let startX, startY, initialX, initialY;
    
    let currentX = window.innerWidth - 80; 
    let currentY = window.innerHeight - 100; 
    
    fab.style.left = '0';
    fab.style.top = '0';
    fab.style.transform = `translate(${currentX}px, ${currentY}px)`;

    const startDrag = (e) => {
        isDragging = true;
        hasDragged = false;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        startX = clientX;
        startY = clientY;
        initialX = currentX;
        initialY = currentY;
        fab.style.transition = 'none'; 
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const dx = clientX - startX;
        const dy = clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged = true;
        currentX = initialX + dx;
        currentY = initialY + dy;
        fab.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        fab.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; 
        if (!hasDragged) openMenu();
    };

    fab.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
    fab.addEventListener('touchstart', startDrag, { passive: true });
    document.addEventListener('touchmove', onDrag, { passive: true });
    document.addEventListener('touchend', endDrag);

    const openMenu = () => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'pointer-events-auto');
        fab.style.opacity = '0';
        fab.style.pointerEvents = 'none';
    };

    const closeMenu = () => {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        fab.style.opacity = '1';
        fab.style.pointerEvents = 'auto';
    };

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
    });

    // =========================================
    // AQUI ESTÁ A CORREÇÃO: Fechar ao clicar nos links
    // =========================================
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu-overlay nav a');
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu(); // Fecha o menu assim que o link é clicado
        });
    });

    fab.addEventListener('touchmove', (e) => {
        if (isDragging) e.preventDefault();
    }, { passive: false });
}

    // =========================================
    // 2. CARROSSEL DE IMAGENS DO HERO
    // =========================================
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        const images = [
            "/static/images/programas_webapp_centralizado.png",
            "/static/images/manutencao_centralizado.png",
            "/static/images/mobile_texto_centralizado.png",
            "/static/images/web_lading_pic_centralizado.png"
        ];
        let currentIndex = 0;

        setInterval(() => {
            heroImage.style.opacity = '0';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                heroImage.src = images[currentIndex];
                heroImage.style.opacity = '1';
            }, 500); 
        }, 9000); 
    }

    // =========================================
    // 3. ROTAÇÃO ALEATÓRIA DE TEXTO (Card Flutuante)
    // =========================================
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText) {
        const phrases = ["Alta Performance", "Qualidade", "Confiabilidade", "Segurança", "Baixo Custo"];
        let currentIndex = 0;

        setInterval(() => {
            rotatingText.style.opacity = '0';
            setTimeout(() => {
                let randomIndex = Math.floor(Math.random() * phrases.length);
                while (randomIndex === currentIndex) {
                    randomIndex = Math.floor(Math.random() * phrases.length);
                }
                currentIndex = randomIndex;
                rotatingText.textContent = phrases[currentIndex];
                rotatingText.style.opacity = '1';
            }, 300); 
        }, 3500); 
    }

    // =========================================
    // 4. ESCONDER/MOSTRAR HEADER NO SCROLL (MOBILE)
    // =========================================
    const header = document.getElementById('main-header');
    
    if (header) {
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            // Aplica apenas no mobile
            if (window.innerWidth < 768) {
                // Pega a posição atual (com suporte para todos os browsers)
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Se o utilizador está a descer E já passou dos 50px iniciais
                if (scrollTop > lastScrollTop && scrollTop > 50) {
                    header.style.transform = 'translateY(-100%)'; // Esconde
                } 
                // Se o utilizador está a subir (scrollTop é menor que o anterior)
                else if (scrollTop < lastScrollTop) {
                    header.style.transform = 'translateY(0)'; // Mostra IMEDIATAMENTE
                }
                
                // Se chegar ao topo da página, força a mostrar
                if (scrollTop <= 0) {
                    header.style.transform = 'translateY(0)';
                }
                
                // Atualiza a posição para o próximo ciclo
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
            } else {
                // Se for desktop, o header está sempre visível
                header.style.transform = 'translateY(0)';
            }
        }, { passive: true });
    }
});


// =========================================
// LIMPEZA DO FORMULÁRIO AO SAIR DA PÁGINA
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const formOrcamento = document.getElementById('form-orcamento');
    
    if (formOrcamento) {
        // Função que limpa todos os campos do formulário
        const limparFormulario = () => {
            formOrcamento.reset(); // Limpa inputs de texto e selects
            // Limpa os checkboxes e radios explicitamente (por segurança)
            const checkboxes = formOrcamento.querySelectorAll('input[type="checkbox"], input[type="radio"]');
            checkboxes.forEach(cb => cb.checked = false);
        };

        // Deteta quando o utilizador sai da página (muda de URL, clica num link, fecha a aba)
        window.addEventListener('beforeunload', limparFormulario);
    }
});



// =========================================
// 5. MODAL DE DETALHES DOS SERVIÇOS
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const serviceCards = document.querySelectorAll('article[data-servico]');
    const modal = document.getElementById('service-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title-text');
    const modalIcon = document.getElementById('modal-icon');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');

    if (!modal) return;

    // --- BASE DE DADOS DOS SERVIÇOS ---
    const servicesData = {
        "websites": {
            title: "Websites Profissionais",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
            content: `
                <!-- NAVEGAÇÃO DAS ABAS -->
                <div class="flex flex-wrap border-b border-gray-200/50 mb-6 gap-2">
                    <button class="tab-btn active px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-essencial">Essencial</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-profissional">Profissional</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-business">Business</button>
                </div>

                <!-- CONTEÚDO DA ABA: ESSENCIAL -->
                <div id="tab-essencial" class="tab-content block">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Website Essencial</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 650 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Website institucional para apresentar o negócio, os serviços e os principais meios de contacto.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Estrutura simples de páginas informativas;</li><li>Apresentação da empresa, serviços e contactos.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Páginas essenciais e navegação;</li><li>Layout responsivo;</li><li>Títulos e descrições básicas.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Logótipo, textos, imagens, contactos, morada e horários quando aplicável.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui loja online, área reservada, sistema complexo de marcações ou manutenção mensal.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: PROFISSIONAL -->
                <div id="tab-profissional" class="tab-content hidden">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Website Profissional</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 950 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Website institucional mais completo, com maior profundidade de conteúdos e apresentação visual personalizada.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Várias páginas, equipa, portfólio;</li><li>Perguntas frequentes e formulários;</li><li>Organização de conteúdos.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Páginas conforme proposta;</li><li>Formulário ou canais de contacto;</li><li>Versão responsiva e SEO técnico inicial.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Conteúdos e imagens por página, dados comerciais e materiais de marca.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui comércio eletrónico, área de cliente ou integrações avançadas não orçamentadas.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: BUSINESS -->
                <div id="tab-business" class="tab-content hidden">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Website Business</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 1.450 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Presença digital abrangente para empresas que necessitam de mais conteúdos e funcionalidades específicas.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Arquitetura mais ampla e componentes personalizados;</li><li>Integrações com ferramentas externas quando acordadas.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Estrutura de páginas;</li><li>Funcionalidades e integrações aprovadas;</li><li>Testes e publicação.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Requisitos do negócio, conteúdos, acessos externos e responsável pelas aprovações.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Sistemas complexos, licenças externas e funcionalidades fora do âmbito são orçamentados à parte.</p>
                    </div>
                </div>
            `
        },
                "landing-pages": {
            title: "Landing Pages de Alta Conversão",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
            content: `
                <!-- NAVEGAÇÃO DAS ABAS -->
                <div class="flex flex-wrap border-b border-gray-200/50 mb-6 gap-2">
                    <button class="tab-btn active px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-lp-essencial">Essencial</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-lp-profissional">Profissional</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-lp-premium">Premium</button>
                </div>

                <!-- CONTEÚDO DA ABA: ESSENCIAL -->
                <div id="tab-lp-essencial" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Landing Page Essencial</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 350 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Página única focada num produto, serviço ou campanha, orientada para uma ação concreta: contactar, pedir orçamento ou reservar.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Apresentação da oferta, benefícios principais, chamadas para ação;</li><li>Contactos e formulário simples se acordado.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Uma página responsiva e secções essenciais;</li><li>Botões ou ligações de contacto;</li><li>Configuração técnica básica para publicação.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Logótipo, textos, imagens, contactos e ação que pretende que o visitante realize.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui várias páginas, redação extensa, fotografia/vídeo, anúncios ou funcionalidades complexas.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: PROFISSIONAL -->
                <div id="tab-lp-profissional" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Landing Page Profissional</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 500 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Página de campanha mais completa para explicar a oferta, responder a dúvidas e reforçar confiança.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Secções adicionais, benefícios, processo, perguntas frequentes;</li><li>Testemunhos fornecidos pelo cliente e formulário simples.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Página única com estrutura desenvolvida;</li><li>Chamadas para ação e adaptação a telemóveis;</li><li>Integração simples prevista.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Conteúdos, imagens, testemunhos autorizados e dados da oferta.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui gestão de anúncios, produção de testemunhos ou integrações não descritas.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: PREMIUM -->
                <div id="tab-lp-premium" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Landing Page Premium</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 750 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Página de campanha com personalização visual e funcional superior, adequada a ofertas que exigem apresentação diferenciada.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Direção visual específica e secções personalizadas;</li><li>Animações discretas e integrações previamente definidas.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Design personalizado e componentes próprios;</li><li>Funcionalidades acordadas e testes em vários ecrãs.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Objetivos, identidade visual, conteúdos, imagens e acessos necessários.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui investimento publicitário, produção audiovisual ou funcionalidades não aprovadas.</p>
                    </div>
                </div>
            `
        },
                "sistemas-web": {
            title: "Sistemas e Aplicações Web",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
            content: `
                <!-- NAVEGAÇÃO DAS ABAS -->
                <div class="flex flex-wrap border-b border-gray-200/50 mb-6 gap-2">
                    <button class="tab-btn active px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-sw-agendamento">Agendamento</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-sw-painel">Painel Admin</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-sw-app">App Personalizada</button>
                </div>

                <!-- CONTEÚDO DA ABA: AGENDAMENTO -->
                <div id="tab-sw-agendamento" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Sistema de Agendamento</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 650 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Sistema online para apresentar serviços, consultar disponibilidade e gerir pedidos ou marcações.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Escolha de serviço, horários, profissionais, duração e bloqueios;</li><li>Gestão administrativa, conforme o projeto.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Formulário de marcação e calendário;</li><li>Regras de disponibilidade e registo/consulta;</li><li>Área de gestão se prevista.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Serviços, duração, preços, horários, regras de cancelamento e dados dos profissionais.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> SMS pagos, pagamentos online, sincronizações externas e aplicações móveis nativas não estão incluídos por defeito.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: PAINEL ADMINISTRATIVO -->
                <div id="tab-sw-painel" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Painel Administrativo</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 450 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Área privada onde o responsável consulta e gere informação de uma aplicação sem alterar código.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Tabelas, filtros e pesquisa;</li><li>Operações para criar, consultar, editar ou remover registos.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Interface administrativa com listagens e pesquisa;</li><li>Operações acordadas;</li><li>Autenticação e permissões conforme requisitos.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Dados a gerir, perfis de utilizador e regras de acesso.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Migrações grandes, relatórios complexos ou integrações não descritas são orçamentados separadamente.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: APP PERSONALIZADA -->
                <div id="tab-sw-app" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Aplicação Web Personalizada</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 1.500 €</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Software usado através do navegador para gerir processos, centralizar informação ou automatizar tarefas.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Interface, backend/API e base de dados;</li><li>Autenticação, regras de negócio e integrações conforme análise.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Análise funcional, interface e lógica de negócio;</li><li>Dados, testes, entrega e instruções básicas.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Processos atuais, regras, tipos de utilizador, dados e prioridades.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Aplicações móveis nativas, infraestrutura paga, licenças e módulos não aprovados não estão incluídos.</p>
                    </div>
                </div>
            `
        },
                "seo-ads": {
            title: "Anúncios & SEO",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`,
            content: `
                <!-- NAVEGAÇÃO DAS ABAS (Com scroll horizontal no mobile) -->
                <div class="flex overflow-x-auto md:flex-wrap gap-2 mb-6 pb-2 border-b border-gray-200/50 custom-scrollbar">
                    <button class="tab-btn active whitespace-nowrap px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-seo-inicial">SEO Inicial</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-velocidade">Velocidade</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-analytics">Analytics</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-search">Search Console</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-negocio">Google Negócio</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-gads">Google Ads</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-meta">Meta Ads</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-hora">Hora Extra</button>
                </div>

                <!-- 1. SEO INICIAL -->
                <div id="tab-seo-inicial" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">SEO Inicial</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 120 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Otimização para ajudar os motores de pesquisa a compreender a estrutura e o conteúdo do website.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Revisão de títulos, descrições, cabeçalhos, URLs e indexabilidade;</li><li>Recomendações técnicas iniciais.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Ajustes básicos nas páginas acordadas;</li><li>Recomendações de melhoria.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Acesso ao website e informação sobre serviços, público e localização.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não garante posições; artigos contínuos, link building e SEO recorrente são serviços separados.</p>
                    </div>
                </div>

                <!-- 2. OTIMIZAÇÃO DE VELOCIDADE -->
                <div id="tab-seo-velocidade" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Otimização de Velocidade</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 100 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Análise e melhoria do desempenho para tornar o carregamento das páginas mais eficiente.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Análise de imagens, ficheiros CSS/JS, fontes, cache e recursos;</li><li>Aplicação quando tecnicamente possível.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Verificação inicial;</li><li>Otimizações possíveis;</li><li>Verificação depois das alterações.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Acesso técnico ao website e alojamento, quando necessário.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui mudança de alojamento, CDN paga ou reconstrução integral.</p>
                    </div>
                </div>

                <!-- 3. GOOGLE ANALYTICS -->
                <div id="tab-seo-analytics" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Configuração do Google Analytics</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 60 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Ferramenta para medir visitas e interações e compreender como os utilizadores usam o website.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Ligação/criação da propriedade;</li><li>Instalação da medição e verificação básica de eventos acordados.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Propriedade ligada;</li><li>Etiqueta instalada;</li><li>Recolha de dados verificada.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conta Google, acesso ao website e eventos que pretende medir.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Relatórios periódicos e análise avançada não incluídos; consentimento de cookies deve ser tratado quando aplicável.</p>
                    </div>
                </div>

                <!-- 4. GOOGLE SEARCH CONSOLE -->
                <div id="tab-seo-search" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Google Search Console</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 45 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Ferramenta que permite acompanhar a presença do website na Pesquisa Google e detetar questões de indexação.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Configuração da propriedade;</li><li>Verificação de titularidade e submissão do sitemap se disponível.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Propriedade configurada;</li><li>Titularidade verificada;</li><li>Sitemap submetido quando aplicável.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conta Google e acesso ao domínio ou alojamento para validação.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não garante indexação imediata nem posicionamento.</p>
                    </div>
                </div>

                <!-- 5. GOOGLE MEU NEGÓCIO -->
                <div id="tab-seo-negocio" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Google Meu Negócio</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 75 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Perfil gratuito apresentado na Pesquisa Google e no Google Maps, útil para empresas locais e negócios com área de serviço.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Configuração ou revisão de nome, categoria, descrição, localização/área, horário, telefone e website;</li><li>Orientações para imagens.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Dados comerciais configurados;</li><li>Apoio no processo de validação;</li><li>Orientação de utilização.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conta Google, nome comercial, morada/área, horário, contactos, categoria e imagens.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> A aprovação depende da Google; gestão contínua de avaliações, publicações ou anúncios não incluída.</p>
                    </div>
                </div>

                <!-- 6. GOOGLE ADS -->
                <div id="tab-seo-gads" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Google Ads</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Sob orçamento</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Publicidade paga na rede Google, incluindo anúncios que podem surgir quando as pessoas pesquisam por produtos ou serviços.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Definição de objetivos, campanhas, grupos, palavras-chave;</li><li>Segmentação geográfica, anúncios e medição de conversões, conforme contrato.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Configuração inicial ou gestão periódica;</li><li>Estrutura de campanhas e anúncios aprovados;</li><li>Acompanhamento acordado.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conta Google Ads, oferta, página de destino, localização, público, materiais e orçamento de anúncios.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> O investimento em anúncios é pago diretamente pelo cliente à Google. Não há garantia de vendas, contactos ou posições.</p>
                    </div>
                </div>

                <!-- 7. META ADS -->
                <div id="tab-seo-meta" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Meta Ads (Facebook e Instagram)</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Sob orçamento</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Publicidade paga em Facebook e Instagram, gerida através das ferramentas de anúncios da Meta.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Definição de objetivo, público, localização, posicionamentos, orçamento;</li><li>Anúncios com materiais fornecidos ou aprovados.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Configuração inicial ou gestão recorrente;</li><li>Campanhas e conjuntos de anúncios;</li><li>Medição básica se prevista.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conta empresarial/gestor de anúncios, página, perfil, criativos, público e orçamento.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> O investimento é pago diretamente à Meta. Produção contínua de conteúdos, resposta a mensagens e resultados não garantidos.</p>
                    </div>
                </div>

                <!-- 8. HORA ADICIONAL -->
                <div id="tab-seo-hora" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Hora Adicional de Desenvolvimento</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 35 €/hora</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Unidade de trabalho para pedidos fora do âmbito de um projeto ou contrato de manutenção.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Pequenas alterações, ajustes técnicos e apoio pontual;</li><li>Após descrição e aprovação do pedido.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Execução do trabalho previamente aprovado.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Descrição do pedido e materiais ou acessos necessários.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Pedidos extensos ou novas funcionalidades podem exigir orçamento próprio.</p>
                    </div>
                </div>
            `
        },
                "manutencao": {
            title: "Manutenção Tech & Hardware",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>`,
            content: `
                <!-- NAVEGAÇÃO DAS ABAS -->
                <div class="flex overflow-x-auto md:flex-wrap gap-2 mb-6 pb-2 border-b border-gray-200/50 custom-scrollbar">
                    <button class="tab-btn active whitespace-nowrap px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-manut-basic">Plano Basic</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-manut-profissional">Plano Profissional</button>
                    <button class="tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-manut-premium">Plano Premium</button>
                </div>

                <!-- CONTEÚDO DA ABA: BASIC -->
                <div id="tab-manut-basic" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Plano Basic</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 39 €/mês</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Acompanhamento essencial para websites com poucas alterações.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Verificações técnicas e pequenas atualizações acordadas.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Verificações periódicas;</li><li>Pequenas atualizações;</li><li>Apoio técnico básico dentro do limite contratado.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Acessos e informação necessários para manter o website.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui desenvolvimento ilimitado, novas funcionalidades ou custos de terceiros.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: PROFISSIONAL -->
                <div id="tab-manut-profissional" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Plano Professional</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 69 €/mês</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Acompanhamento regular para negócios que necessitam de apoio mais frequente.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Inclui acompanhamento essencial;</li><li>Maior margem para pequenas alterações de conteúdo.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Verificações;</li><li>Pequenas alterações;</li><li>Apoio técnico conforme limites do contrato.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Acessos e pedidos organizados por um responsável.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui reformulação integral, módulos novos ou serviços externos pagos.</p>
                    </div>
                </div>

                <!-- CONTEÚDO DA ABA: PREMIUM -->
                <div id="tab-manut-premium" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Plano Premium</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 119 €/mês</p>
                    
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Acompanhamento prioritário e maior volume de pequenas intervenções acordadas.</p>
                        <div>
                            <strong class="text-gray-900 block mb-1">O que pode incluir:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Inclui tarefas definidas dos níveis anteriores;</li><li>Prioridade de atendimento.</li></ul>
                        </div>
                        <div>
                            <strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong>
                            <ul class="list-disc pl-5 space-y-1"><li>Acompanhamento prioritário;</li><li>Pequenas intervenções dentro do volume contratado;</li><li>Apoio técnico.</li></ul>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong>
                            <p class="text-gray-600">Acessos, pedidos e responsável para validar alterações.</p>
                        </div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não significa disponibilidade ilimitada nem desenvolvimento sem custos adicionais.</p>
                    </div>
                </div>
            `
        }
    };

    // --- LÓGICA DE ABRIR O MODAL ---
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.getAttribute('data-servico');
            const data = servicesData[serviceKey];

            if (data) {
                modalTitle.textContent = data.title;
                modalIcon.innerHTML = data.icon;
                modalBody.innerHTML = data.content;

                // Abre o modal
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
                
                // Bloqueia o scroll do fundo
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // =========================================
    // AQUI ESTÁ O SEGREDO: EVENT DELEGATION NAS ABAS
    // =========================================
    modalBody.addEventListener('click', (e) => {
        // Verifica se o que foi clicado é um botão de aba (ou um filho dele)
        const tabBtn = e.target.closest('.tab-btn');
        if (!tabBtn) return; // Se não for uma aba, ignora o clique

        const targetId = tabBtn.getAttribute('data-target');
        const tabContents = modalBody.querySelectorAll('.tab-content');
        const tabBtns = modalBody.querySelectorAll('.tab-btn');

        // 1. Reset a todos os botões
        tabBtns.forEach(b => {
            b.classList.remove('active', 'text-brand-blue', 'bg-blue-50', 'border-brand-blue');
            b.classList.add('text-gray-500', 'border-transparent');
        });
        
        // 2. Esconde todos os conteúdos
        tabContents.forEach(c => {
            c.classList.add('hidden');
            c.classList.remove('block');
        });

        // 3. Ativa o botão que foi clicado
        tabBtn.classList.add('active', 'text-brand-blue', 'bg-blue-50', 'border-brand-blue');
        tabBtn.classList.remove('text-gray-500', 'border-transparent');

        // 4. Mostra o conteúdo correspondente
        const targetContent = modalBody.querySelector(`#${targetId}`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            targetContent.classList.add('block');
        }
    });

    // --- LÓGICA DE FECHAR O MODAL ---
    const closeModal = () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
            closeModal();
        }
    });
});