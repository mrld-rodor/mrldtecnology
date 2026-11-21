let isNavigating = false; // Variável global para controlar o scroll dos links

document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. LÓGICA DO MENU MOBILE E BOTÃO ARRASTÁVEL (FAB)
    // =========================================
    const fab = document.getElementById('floating-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('close-menu-btn');

    if (fab && overlay && window.getComputedStyle(fab).display !== 'none') {
        let isDragging = false;
        // let isNavigating = false; // NOVO: Bloqueio de scroll
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

                const mobileMenuLinks = document.querySelectorAll('#mobile-menu-overlay nav a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                closeMenu();
                
                const href = link.getAttribute('href');
                if (href.startsWith('#') || href.includes('/#')) {
                    const mainHeader = document.getElementById('main-header');
                    if (mainHeader && window.innerWidth < 768) {
                        mainHeader.style.transform = 'translateY(-100%)';
                        
                        // NOVO: Ativa o bloqueio por 1 segundo
                        isNavigating = true; 
                        setTimeout(() => {
                            isNavigating = false;
                        }, 1000); // 1 segundo é tempo suficiente para o scroll suave acabar
                    }
                }
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
        }, 6000); 
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
            // NOVO: Se estivermos num scroll provocado por um clique em link, ignora a lógica do header
            if (isNavigating) return; 

            if (window.innerWidth < 768) {
                // ... resto do código do header
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop && scrollTop > 50) {
                    header.style.transform = 'translateY(-100%)'; 
                } else if (scrollTop < lastScrollTop) {
                    header.style.transform = 'translateY(0)'; 
                }
                
                if (scrollTop <= 0) {
                    header.style.transform = 'translateY(0)';
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
            } else {
                header.style.transform = 'translateY(0)';
            }
        }, { passive: true });
    }

    // =========================================
    // 5. CARROSSEL DE IMAGENS FINAL (Serviços)
    // =========================================
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (track) {
        const images = track.querySelectorAll('img');
        const totalImages = images.length;
        let currentIndex = 0;
        let autoPlayInterval;

        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('w-2', 'h-2', 'rounded-full', 'transition-all', 'duration-300', 'pointer-events-auto', 'cursor-pointer');
            if (i === 0) dot.classList.add('bg-white', 'w-6'); 
            else dot.classList.add('bg-white/50');
            
            dot.addEventListener('click', () => goToImage(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        function updateDots(index) {
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('bg-white', 'w-6');
                    dot.classList.remove('bg-white/50', 'w-2');
                } else {
                    dot.classList.add('bg-white/50', 'w-2');
                    dot.classList.remove('bg-white', 'w-6');
                }
            });
        }

        function goToImage(index) {
            currentIndex = index;
            const scrollAmount = track.clientWidth * currentIndex;
            track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            updateDots(currentIndex);
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            goToImage(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            goToImage(currentIndex);
        });

        let scrollTimeout;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = track.scrollLeft;
                const imageWidth = track.clientWidth;
                currentIndex = Math.round(scrollLeft / imageWidth);
                updateDots(currentIndex);
            }, 100);
        });

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalImages;
                goToImage(currentIndex);
            }, 4000); 
        };

        startAutoPlay();

        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', () => clearInterval(autoPlayInterval), { passive: true });
        track.addEventListener('touchend', startAutoPlay);
    }
});

// =========================================
// 6. LIMPEZA DO FORMULÁRIO AO SAIR DA PÁGINA
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const formOrcamento = document.getElementById('form-orcamento');
    if (formOrcamento) {
        const limparFormulario = () => {
            formOrcamento.reset();
            const checkboxes = formOrcamento.querySelectorAll('input[type="checkbox"], input[type="radio"]');
            checkboxes.forEach(cb => cb.checked = false);
        };
        window.addEventListener('beforeunload', limparFormulario);
    }
});

// =========================================
// 7. MODAL DE DETALHES DOS SERVIÇOS
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

    const servicesData = {
        "websites": {
            title: "Websites Profissionais",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
            content: `
                <div class="flex flex-wrap border-b border-gray-200/50 mb-6 gap-2">
                    <button class="tab-btn active px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-essencial">Essencial</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-profissional">Profissional</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-business">Business</button>
                </div>
                <div id="tab-essencial" class="tab-content block">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Website Essencial</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 650 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Website institucional para apresentar o negócio, os serviços e os principais meios de contacto.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Estrutura simples de páginas informativas;</li><li>Apresentação da empresa, serviços e contactos.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Páginas essenciais e navegação;</li><li>Layout responsivo;</li><li>Títulos e descrições básicas.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Logótipo, textos, imagens, contactos, morada e horários quando aplicável.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui loja online, área reservada, sistema complexo de marcações ou manutenção mensal.</p>
                    </div>
                </div>
                <div id="tab-profissional" class="tab-content hidden">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Website Profissional</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 950 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Website institucional mais completo, com maior profundidade de conteúdos e apresentação visual personalizada.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Várias páginas, equipa, portfólio;</li><li>Perguntas frequentes e formulários;</li><li>Organização de conteúdos.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Páginas conforme proposta;</li><li>Formulário ou canais de contacto;</li><li>Versão responsiva e SEO técnico inicial.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conteúdos e imagens por página, dados comerciais e materiais de marca.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui comércio eletrónico, área de cliente ou integrações avançadas não orçamentadas.</p>
                    </div>
                </div>
                <div id="tab-business" class="tab-content hidden">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Website Business</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 1.450 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Presença digital abrangente para empresas que necessitam de mais conteúdos e funcionalidades específicas.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Arquitetura mais ampla e componentes personalizados;</li><li>Integrações com ferramentas externas quando acordadas.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Estrutura de páginas;</li><li>Funcionalidades e integrações aprovadas;</li><li>Testes e publicação.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Requisitos do negócio, conteúdos, acessos externos e responsável pelas aprovações.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Sistemas complexos, licenças externas e funcionalidades fora do âmbito são orçamentados à parte.</p>
                    </div>
                </div>
            `
        },
        "landing-pages": {
            title: "Landing Pages de Alta Conversão",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
            content: `
                <div class="flex flex-wrap border-b border-gray-200/50 mb-6 gap-2">
                    <button class="tab-btn active px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-lp-essencial">Essencial</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-lp-profissional">Profissional</button>
                    <button class="tab-btn px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-lp-premium">Premium</button>
                </div>
                <div id="tab-lp-essencial" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Landing Page Essencial</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 350 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Página única focada num produto, serviço ou campanha, orientada para uma ação concreta: contactar, pedir orçamento ou reservar.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Apresentação da oferta, benefícios principais, chamadas para ação;</li><li>Contactos e formulário simples se acordado.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Uma página responsiva e secções essenciais;</li><li>Botões ou ligações de contacto;</li><li>Configuração técnica básica para publicação.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Logótipo, textos, imagens, contactos e ação que pretende que o visitante realize.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui várias páginas, redação extensa, fotografia/vídeo, anúncios ou funcionalidades complexas.</p>
                    </div>
                </div>
                <div id="tab-lp-profissional" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Landing Page Profissional</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 500 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Página de campanha mais completa para explicar a oferta, responder a dúvidas e reforçar confiança.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Secções adicionais, benefícios, processo, perguntas frequentes;</li><li>Testemunhos fornecidos pelo cliente e formulário simples.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Página única com estrutura desenvolvida;</li><li>Chamadas para ação e adaptação a telemóveis;</li><li>Integração simples prevista.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Conteúdos, imagens, testemunhos autorizados e dados da oferta.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui gestão de anúncios, produção de testemunhos ou integrações não descritas.</p>
                    </div>
                </div>
                <div id="tab-lp-premium" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Landing Page Premium</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 750 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Página de campanha com personalização visual e funcional superior, adequada a ofertas que exigem apresentação diferenciada.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Direção visual específica e secções personalizadas;</li><li>Animações discretas e integrações previamente definidas.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Design personalizado e componentes próprios;</li><li>Funcionalidades acordadas e testes em vários ecrãs.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Objetivos, identidade visual, conteúdos, imagens e acessos necessários.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui investimento publicitário, produção audiovisual ou funcionalidades não aprovadas.</p>
                    </div>
                </div>
            `
        },
        "sistemas-web": {
            title: "Sistemas e Aplicações Web",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
            content: `
                <div class="sticky top-0 z-30 bg-white -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-3 flex flex-nowrap overflow-x-auto w-full md:flex-wrap gap-2 border-b border-gray-200 custom-scrollbar">
                    <button class="tab-btn active flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-sw-agendamento">Agendamento</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-sw-painel">Painel Admin</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-sw-app">App Web</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-sw-android">App Android</button>
                </div>
                <div id="tab-sw-agendamento" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Sistema de Agendamento</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 650 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Sistema online para apresentar serviços, consultar disponibilidade e gerir pedidos ou marcações.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Escolha de serviço, horários, profissionais, duração e bloqueios;</li><li>Gestão administrativa, conforme o projeto.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Formulário de marcação e calendário;</li><li>Regras de disponibilidade e registo/consulta;</li><li>Área de gestão se prevista.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Serviços, duração, preços, horários, regras de cancelamento e dados dos profissionais.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> SMS pagos, pagamentos online, sincronizações externas e aplicações móveis nativas não estão incluídos por defeito.</p>
                    </div>
                </div>
                <div id="tab-sw-painel" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Painel Administrativo</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 450 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Área privada onde o responsável consulta e gere informação de uma aplicação sem alterar código.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Tabelas, filtros e pesquisa;</li><li>Operações para criar, consultar, editar ou remover registos.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Interface administrativa com listagens e pesquisa;</li><li>Operações acordadas;</li><li>Autenticação e permissões conforme requisitos.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Dados a gerir, perfis de utilizador e regras de acesso.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Migrações grandes, relatórios complexos ou integrações não descritas são orçamentados separadamente.</p>
                    </div>
                </div>
                <div id="tab-sw-app" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Aplicação Web Personalizada</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 1.500 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Software usado através do navegador para gerir processos, centralizar informação ou automatizar tarefas.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Interface, backend/API e base de dados;</li><li>Autenticação, regras de negócio e integrações conforme análise.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Análise funcional, interface e lógica de negócio;</li><li>Dados, testes, entrega e instruções básicas.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Processos atuais, regras, tipos de utilizador, dados e prioridades.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Aplicações móveis nativas, infraestrutura paga, licenças e módulos não aprovados não estão incluídos.</p>
                    </div>
                </div>
                <div id="tab-sw-android" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Desenvolvimento Android</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 1200€</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Aplicação nativa para Android, instalada a partir da Google Play Store em telemóveis e tablets, desde apps simples de apresentação até soluções com contas de utilizador, dados online e integrações.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Design dos ecrãs e navegação;</li><li>Login e contas de utilizador, base de dados e API;</li><li>Notificações push, integração com sistemas existentes;</li><li>Publicação na Google Play Store, conforme a complexidade.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Aplicação Android funcional;</li><li>Ficheiros de instalação (APK) e de publicação (AAB);</li><li>Funcionalidades acordadas e testes em vários dispositivos;</li><li>Instruções básicas.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Logótipo e identidade visual, textos e imagens, descrição das funcionalidades e dos utilizadores, conta Google Play Console, política de privacidade e acessos necessários (servidor, Firebase, sistemas externos).</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui versão iOS, pagamentos online, chat em tempo real, integrações não descritas, taxa da conta Google Play, servidor ou licenças de terceiros. A aprovação da Google não é garantida. O preço final depende da complexidade; apenas funcionalidades aprovadas na proposta são incluídas.</p>
                    </div>
                </div>
            `
        },
        "seo-ads": {
            title: "Anúncios & SEO",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`,
            content: `
                <div class="sticky top-0 z-30 bg-white -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-3 flex flex-nowrap overflow-x-auto w-full md:flex-wrap gap-2 border-b border-gray-200 custom-scrollbar">
                    <button class="tab-btn active flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-seo-inicial">SEO Inicial</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-velocidade">Velocidade</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-analytics">Analytics</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-search">Search Console</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-negocio">Google Negócio</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-gads">Google Ads</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-meta">Meta Ads</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-seo-hora">Hora Extra</button>
                </div>
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
                <div class="sticky top-0 z-30 bg-white -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-3 flex flex-nowrap overflow-x-auto w-full md:flex-wrap gap-2 border-b border-gray-200 custom-scrollbar">
                    <button class="tab-btn active flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-brand-blue bg-blue-50 rounded-t-xl border-b-2 border-brand-blue transition-all" data-target="tab-manut-basic">Plano Basic</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-manut-profissional">Plano Profissional</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-manut-premium">Plano Premium</button>
                    <button class="tab-btn flex-shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50 rounded-t-xl border-b-2 border-transparent transition-all" data-target="tab-manut-domicilio">Suporte Domicílio</button>
                </div>
                <div id="tab-manut-basic" class="tab-content block animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Plano Basic</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 39 €/mês</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Acompanhamento essencial para websites com poucas alterações.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Verificações técnicas e pequenas atualizações acordadas.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Verificações periódicas;</li><li>Pequenas atualizações;</li><li>Apoio técnico básico dentro do limite contratado.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Acessos e informação necessários para manter o website.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui desenvolvimento ilimitado, novas funcionalidades ou custos de terceiros.</p>
                    </div>
                </div>
                <div id="tab-manut-profissional" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Plano Professional</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 69 €/mês</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Acompanhamento regular para negócios que necessitam de apoio mais frequente.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Inclui acompanhamento essencial;</li><li>Maior margem para pequenas alterações de conteúdo.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Verificações;</li><li>Pequenas alterações;</li><li>Apoio técnico conforme limites do contrato.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Acessos e pedidos organizados por um responsável.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui reformulação integral, módulos novos ou serviços externos pagos.</p>
                    </div>
                </div>
                <div id="tab-manut-premium" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Plano Premium</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: 119 €/mês</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Acompanhamento prioritário e maior volume de pequenas intervenções acordadas.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Inclui tarefas definidas dos níveis anteriores;</li><li>Prioridade de atendimento.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Acompanhamento prioritário;</li><li>Pequenas intervenções dentro do volume contratado;</li><li>Apoio técnico.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Acessos, pedidos e responsável para validar alterações.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não significa disponibilidade ilimitada nem desenvolvimento sem custos adicionais.</p>
                    </div>
                </div>
                <div id="tab-manut-domicilio" class="tab-content hidden animate-[fadeIn_0.3s_ease-in-out]">
                    <h4 class="text-xl font-bold text-gray-900 mb-1">Manutenção PC a Domicílio</h4>
                    <p class="text-brand-blue font-bold text-lg mb-4">Preço de referência: Desde 40 €</p>
                    <div class="space-y-4 text-sm md:text-base">
                        <p><strong class="text-gray-900">Definição:</strong> Assistência técnica informática presencial para resolver problemas no seu computador ou portátil, sem sair de casa.</p>
                        <div><strong class="text-gray-900 block mb-1">O que pode incluir:</strong><ul class="list-disc pl-5 space-y-1"><li>Formatação e instalação de sistema operativo (Windows/Linux);</li><li>Instalação de programas essenciais (Office, antivírus, drivers);</li><li>Recuperação de contas de utilizador e acessos a e-mails;</li><li>Limpeza profunda de vírus, malware e otimização do sistema.</li></ul></div>
                        <div><strong class="text-gray-900 block mb-1">Entregáveis habituais:</strong><ul class="list-disc pl-5 space-y-1"><li>Diagnóstico inicial do problema;</li><li>Equipamento a funcionar corretamente;</li><li>Explicação clara das alterações efetuadas.</li></ul></div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100"><strong class="text-gray-900 block mb-1">O que precisamos do cliente:</strong><p class="text-gray-600">Acesso ao equipamento, palavras-passe (se aplicável) e licenças de software originais.</p></div>
                        <p class="text-red-500/80 text-xs mt-2"><strong>Limites habituais:</strong> Não inclui substituição de peças de hardware danificadas, nem recuperação de dados em discos fisicamente danificados. O deslocamento fora da área base pode ter custo adicional.</p>
                    </div>
                </div>
            `
        }
    };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.getAttribute('data-servico');
            const data = servicesData[serviceKey];

            if (data) {
                modalTitle.textContent = data.title;
                modalIcon.innerHTML = data.icon;
                modalBody.innerHTML = data.content;

                modal.classList.remove('opacity-0', 'pointer-events-none');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    modalBody.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (!tabBtn) return; 

        const targetId = tabBtn.getAttribute('data-target');
        const tabContents = modalBody.querySelectorAll('.tab-content');
        const tabBtns = modalBody.querySelectorAll('.tab-btn');

        tabBtns.forEach(b => {
            b.classList.remove('active', 'text-brand-blue', 'bg-blue-50', 'border-brand-blue');
            b.classList.add('text-gray-500', 'border-transparent');
        });
        
        tabContents.forEach(c => {
            c.classList.add('hidden');
            c.classList.remove('block');
        });

        tabBtn.classList.add('active', 'text-brand-blue', 'bg-blue-50', 'border-brand-blue');
        tabBtn.classList.remove('text-gray-500', 'border-transparent');

        const targetContent = modalBody.querySelector(`#${targetId}`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            targetContent.classList.add('block');
        }
    });

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

// =========================================
// 8. EFEITO DE BALANÇO NAS ABAS (A cada 9 segundos)
// =========================================
setInterval(() => {
    const modal = document.getElementById('service-modal');
    if (!modal || modal.classList.contains('opacity-0')) return;

    const tabContainers = modal.querySelectorAll('.custom-scrollbar');
    tabContainers.forEach(container => {
        if (container.scrollWidth > container.clientWidth) {
            if (container.matches(':hover') || container.matches(':active')) return;
            const distance = 40; 
            container.scrollTo({ left: distance, behavior: 'smooth' });
            setTimeout(() => { container.scrollTo({ left: 0, behavior: 'smooth' }); }, 600);
            setTimeout(() => { container.scrollTo({ left: distance, behavior: 'smooth' }); }, 1200);
            setTimeout(() => { container.scrollTo({ left: 0, behavior: 'smooth' }); }, 1800);
        }
    });
}, 9000);

// =========================================
// 9. GLOBO 3D DE TECNOLOGIAS (THREE.JS)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("1. DOM Carregado. A iniciar o globo...");

    const wrapper = document.getElementById('globe-wrapper');
    const canvasContainer = document.getElementById('globe-canvas');
    const pointsContainer = document.getElementById('globe-points');
    
    if (!wrapper || !canvasContainer || !pointsContainer) {
        console.error("ERRO: Elementos HTML não encontrados!");
        return;
    }

    if (typeof THREE === 'undefined') {
        console.error("ERRO: Three.js não está carregado! Verifica o CDN no head.");
        return;
    }

    // Atraso de 200ms para garantir que o browser já renderizou a página
    setTimeout(() => {
        const width = wrapper.clientWidth || 800;
        const height = wrapper.clientHeight || 500;
        console.log("2. Tamanho do contentor:", width, "x", height);

        const techProjects = [
            { name: "Landing Page", project: "Space Girassol", desc: "Interface moderna com interatividade única." },
            { name: "WebApp", project: "Dreamwalker Tales", desc: "Aplicação web progressiva para vendas." },
            { name: "PostgreSQL", project: "Varios", desc: "Sistema de gestão de dados robusto. Gosto de utiliza-lo nos meus projetos. Utilizei para desenvolver o banco de dados do WebApp do <a href='https://www.dreamwalkertales.online' target='_blank'><span class='text-blue-500 hover:underline'>Dreamwalker Tales</span></a>." },
            { name: "Tailwind", project: "Varios", desc: "Criação de layouts responsivos e super rápidos. É a framework que mais gosto de usar." },
            { name: "Flask", project: "Varios", desc: "Arquitetura de backend em Python. Meu framework favorito para desenvolvimento web. Utilizei para desenvolver a landing Page do <a href='https://www.spacegirassol.online' target='_blank'><span class='text-blue-500 hover:underline'>SpaceGirassol</span></a> e também do <a href='https://www.dreamwalkertales.online' target='_blank'><span class='text-blue-500 hover:underline'>Dreamwalker Tales</span></a>." },
            { name: "KivyMD", project: "Apps Mobile/Desktop", desc: "Arquitetura de backend em Python. Minha ferramenta preferida para desenvolvimento mobile." },
            { name: "Python", project: "Varios", desc: "É uma linguagem de programação versátil e poderosa. É a linguagem que mais uso, praticamente todos os meus projetos são desenvolvidos em Python." },
        ];

        // --- SETUP THREE.JS ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

        // NOVO: Lógica responsiva para afastar a câmara no telemóvel
        const isMobile = window.innerWidth < 768;
        camera.position.z = isMobile ? 18 : 18; 

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        canvasContainer.innerHTML = ''; // Limpa caso já exista um canvas
        canvasContainer.appendChild(renderer.domElement);
        console.log("3. Canvas do Three.js injetado no HTML");

        const group = new THREE.Group();
        scene.add(group);

        // --- A ESFERA DE LINHAS ---
        const sphereGeo = new THREE.SphereGeometry(5.5, 24, 24);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0x2b5f9e, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.5
        });
        const globe = new THREE.Mesh(sphereGeo, sphereMat);
        group.add(globe);

        // --- OS PONTOS HTML ---
        const pointElements = [];

        techProjects.forEach((tech, i) => {
            const phi = Math.acos(-1 + (2 * i) / techProjects.length);
            const theta = Math.sqrt(techProjects.length * Math.PI) * phi;
            const pos = new THREE.Vector3().setFromSphericalCoords(5.5, phi, theta);
            
            const el = document.createElement('button');
            el.className = 'globe-point';
            // Adiciona o span do ponto brilhante + o nome
            el.innerHTML = `<span class="globe-dot"></span> ${tech.name}`;
            el.onclick = () => openProjectModal(tech);

            pointsContainer.appendChild(el);
            pointElements.push({ el, pos: pos.clone() });
        });

        // --- INTERAÇÃO ---
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotationSpeed = { x: 0.002, y: 0.005 }; 
        let targetRotationSpeed = { ...rotationSpeed };

        canvasContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        canvasContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
            targetRotationSpeed.x = deltaMove.y * 0.005;
            targetRotationSpeed.y = deltaMove.x * 0.005;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            targetRotationSpeed = { x: 0.002, y: 0.005 }; 
        });

        canvasContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: false });

        canvasContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const deltaMove = { x: e.touches[0].clientX - previousMousePosition.x, y: e.touches[0].clientY - previousMousePosition.y };
            targetRotationSpeed.x = deltaMove.y * 0.005;
            targetRotationSpeed.y = deltaMove.x * 0.005;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: false });

        document.addEventListener('touchend', () => {
            isDragging = false;
            targetRotationSpeed = { x: 0.002, y: 0.005 };
        });

        // --- ANIMAÇÃO ---
        function animate() {
            requestAnimationFrame(animate);

            rotationSpeed.x += (targetRotationSpeed.x - rotationSpeed.x) * 0.05;
            rotationSpeed.y += (targetRotationSpeed.y - rotationSpeed.y) * 0.05;

            group.rotation.x += rotationSpeed.x;
            group.rotation.y += rotationSpeed.y;

            pointElements.forEach(item => {
                const rotatedPos = item.pos.clone().applyMatrix4(group.matrixWorld);
                const projected = rotatedPos.clone().project(camera);
                
                const x = (projected.x * 0.5 + 0.5) * width;
                const y = (-(projected.y) * 0.5 + 0.5) * height;

                item.el.style.position = 'absolute';
                item.el.style.left = `${x}px`;
                item.el.style.top = `${y}px`;
                item.el.style.zIndex = '20';

                if (rotatedPos.z < -1) { 
                    item.el.style.opacity = '0';
                    item.el.style.pointerEvents = 'none';
                } else {
                    item.el.style.opacity = '1';
                    item.el.style.pointerEvents = 'auto';
                    const scale = 1 - (rotatedPos.z * 0.05);
                    item.el.style.transform = `translate(-50%, -50%) scale(${Math.max(0.5, scale)})`;
                }
            });

            renderer.render(scene, camera);
        }

        animate();
        console.log("4. Globo a rodar!");

        // --- MODAL DE PROJETOS ---
        const projectModal = document.getElementById('project-modal');
        const projectModalContent = projectModal.querySelector('div.relative');
        const projectTitle = document.getElementById('project-title');
        const projectBody = document.getElementById('project-body');
        
        function openProjectModal(tech) {
            projectTitle.innerText = `Projeto: ${tech.project}`;
            projectBody.innerHTML = `
                <div class="space-y-4">
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p class="text-sm font-bold text-brand-blue mb-1">Tecnologia Principal:</p>
                        <p class="text-lg font-bold text-gray-900">${tech.name}</p>
                    </div>
                    <p class="text-base text-gray-700 leading-relaxed">${tech.desc}</p>
                    <div class="pt-6">
                        <a href="/orcamento" class="inline-block bg-brand-blue text-white px-6 py-2 rounded-full font-bold hover:bg-blue-800 transition-colors">Solicitar projeto semelhante</a>
                    </div>
                </div>
            `;
            projectModal.classList.remove('opacity-0', 'pointer-events-none');
            projectModalContent.classList.remove('scale-95');
            projectModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
        }

        function closeProjectModal() {
            projectModal.classList.add('opacity-0', 'pointer-events-none');
            projectModalContent.classList.remove('scale-100');
            projectModalContent.classList.add('scale-95');
            document.body.style.overflow = '';
        }

        document.getElementById('close-project-modal').onclick = closeProjectModal;
        document.getElementById('project-overlay').onclick = closeProjectModal;

        // NOVO: Recalcular o tamanho se a janela mudar (ex: rodar o telemóvel)
        window.addEventListener('resize', () => {
            const newWidth = wrapper.clientWidth || window.innerWidth;
            const newHeight = wrapper.clientHeight || 500;
            
            camera.aspect = newWidth / newHeight;
            
            // Recalcula a câmara no resize
            const isMobileResize = window.innerWidth < 768;
            camera.position.z = isMobileResize ? 28 : 18;

            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });

    }, 200); // Fim do setTimeout
});