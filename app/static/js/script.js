document.addEventListener("DOMContentLoaded", () => {
    const fab = document.getElementById('floating-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('close-menu-btn');

    if (!fab) return;

    if (window.getComputedStyle(fab).display === 'none') return;

    // --- LÓGICA DE ARRASTO ---
    let isDragging = false;
    let hasDragged = false;
    let startX, startY, initialX, initialY;
    
    // Posição inicial
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

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            hasDragged = true;
        }

        currentX = initialX + dx;
        currentY = initialY + dy;

        fab.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        fab.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; 

        if (!hasDragged) {
            openMenu();
        }
    };

    fab.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);

    fab.addEventListener('touchstart', startDrag, { passive: true });
    document.addEventListener('touchmove', onDrag, { passive: true });
    document.addEventListener('touchend', endDrag);


    // --- ABRIR E FECHAR ---
    function openMenu() {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'pointer-events-auto');
        
        fab.style.opacity = '0';
        fab.style.pointerEvents = 'none';
    }

    function closeMenu() {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        
        fab.style.opacity = '1';
        fab.style.pointerEvents = 'auto';
    }

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
    });

    // Previne o scroll acidental no mobile enquanto arrasta
    fab.addEventListener('touchmove', (e) => {
        if (isDragging) e.preventDefault();
    }, { passive: false });
});

// =========================================
// CARROSSEL DE IMAGENS DO HERO (Fade Automático)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const heroImage = document.getElementById('hero-image');
    
    if (!heroImage) return; 

    // CAMINHOS DIRETOS (Sem Jinja, pois é um ficheiro .js)
    const images = [
        "/static/images/programas_webapp_centralizado.png",
        "/static/images/manutencao_centralizado.png", // Certifica-te que o nome e a extensão estão corretos
        "/static/images/mobile_texto_centralizado.png",
        "/static/images/web_lading_pic_centralizado.png"
    ];

    let currentIndex = 0;

    setInterval(() => {
        // 1. Fade out
        heroImage.style.opacity = '0';

        // 2. Troca a imagem e faz fade in
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length;
            heroImage.src = images[currentIndex];
            heroImage.style.opacity = '1';
        }, 500); // Tem de ser igual ao duration-500 do HTML

    }, 4000); // Muda a cada 4 segundos
});

// =========================================
// ROTAÇÃO ALEATÓRIA DE TEXTO (Card Flutuante)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const rotatingText = document.getElementById('rotating-text');
    
    if (!rotatingText) return; // Segurança se o elemento não existir

    // O array com as frases que queremos alternar
    const phrases = [
        "Alta Performance", 
        "Qualidade",
        "Confiabilidade",
        "Segurança", 
        "Baixo Custo"
    ];

    let currentIndex = 0;

    setInterval(() => {
        // 1. Faz o fade out do texto atual
        rotatingText.style.opacity = '0';

        // 2. Espera 300ms (tempo da transição do Tailwind) para trocar o texto
        setTimeout(() => {
            // Sorteia um novo índice aleatório
            let randomIndex = Math.floor(Math.random() * phrases.length);
            
            // Garante que não repete a mesma frase duas vezes seguidas
            while (randomIndex === currentIndex) {
                randomIndex = Math.floor(Math.random() * phrases.length);
            }
            
            currentIndex = randomIndex;
            
            // 3. Aplica o novo texto e faz o fade in
            rotatingText.textContent = phrases[currentIndex];
            rotatingText.style.opacity = '1';
        }, 300); // Igual ao duration-300 do HTML

    }, 3500); // Muda a cada 3.5 segundos (podes ajustar este tempo)
});

   