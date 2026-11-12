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