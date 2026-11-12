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
                <p class="mb-4">Uma Landing Page não é apenas um site bonito; é uma máquina de vendas. O objetivo é único: levar o visitante a realizar uma ação (comprar, preencher um formulário, ligar).</p>
                <h3 class="font-bold text-gray-900 text-lg mb-2 mt-6">Porque escolher uma Landing Page?</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Focada 100% na conversão (sem distrações);</li>
                    <li>Copywriting persuasivo e chamadas à ação (CTA) claras;</li>
                    <li>Integração com ferramentas de análise (Google Analytics, Pixel da Meta);</li>
                    <li>Ideal para campanhas de tráfego pago (Google Ads, Meta Ads).</li>
                </ul>
            `
        },
        "sistemas-web": {
            title: "Sistemas e Aplicações Web",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
            content: `
                <p class="mb-4">Software feito à medida para o seu negócio. Automatize processos, reduza erros manuais e ganhe tempo com sistemas web personalizados.</p>
                <h3 class="font-bold text-gray-900 text-lg mb-2 mt-6">Exemplos de Sistemas:</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Agendamentos:</strong> Marcações online para clínicas, salões ou consultores;</li>
                    <li><strong>Painéis Administrativos:</strong> Áreas privadas para gerir stock, clientes ou encomendas;</li>
                    <li><strong>Plataformas de Ensino:</strong> Áreas de membros para cursos online.</li>
                </ul>
            `
        },
        "seo-ads": {
            title: "Anúncios & SEO",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`,
            content: `
                <p class="mb-4">Não basta ter um site; é preciso que os clientes o encontrem. Ajudamos o seu negócio a aparecer no topo do Google, seja através de anúncios pagos ou otimização orgânica.</p>
                <h3 class="font-bold text-gray-900 text-lg mb-2 mt-6">Serviços de Marketing:</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Google Ads:</strong> Anúncios de pesquisa para captar clientes com intenção de compra;</li>
                    <li><strong>Meta Ads:</strong> Publicidade no Facebook e Instagram para gerar notoriedade;</li>
                    <li><strong>SEO:</strong> Otimização de conteúdo e estrutura para subir no ranking do Google de forma gratuita;</li>
                    <li><strong>Google Meu Negócio:</strong> Criação e otimização do perfil da sua empresa no Google Maps.</li>
                </ul>
            `
        },
        "manutencao": {
            title: "Manutenção Tech & Hardware",
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>`,
            content: `
                <p class="mb-4">A tecnologia é a base do seu negócio. Garantimos que os seus equipamentos e software estão sempre a funcionar na máxima performance.</p>
                <h3 class="font-bold text-gray-900 text-lg mb-2 mt-6">O que fazemos:</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Montagem de Computadores:</strong> PCs à medida para gaming, design ou escritório, com as melhores peças do mercado;</li>
                    <li><strong>Manutenção de Software:</strong> Limpeza de vírus, formatação, otimização do sistema operativo;</li>
                    <li><strong>Manutenção de Hardware:</strong> Limpeza física, substituição de peças (SSD, RAM) e reparação de avarias.</li>
                </ul>
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