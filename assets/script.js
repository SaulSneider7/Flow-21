// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Icon Load
    lucide.createIcons();

    // 2. Load Dynamic Content from JSON
    loadContentData();

    // 3. Set Current Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// --- Dynamic Content Loading ---
async function loadContentData() {
    try {
        const response = await fetch('assets/data.json');
        const data = await response.json();

        // A. Load Premiere (Estreno)
        if (data.premiere) {
            const vidFrame = document.getElementById('premiere-video');
            if (vidFrame && data.premiere.youtubeVideoId) {
                vidFrame.src = `https://www.youtube.com/embed/${data.premiere.youtubeVideoId}`;
            }

            const pTitle = document.getElementById('premiere-title');
            if (pTitle) pTitle.textContent = data.premiere.title;

            const pArtist = document.getElementById('premiere-artist');
            if (pArtist) pArtist.textContent = data.premiere.artist;

            const pDesc = document.getElementById('premiere-desc');
            if (pDesc) pDesc.textContent = data.premiere.description;

            const pLinkYt = document.getElementById('premiere-link-youtube');
            if (pLinkYt) pLinkYt.href = data.premiere.youtubeLink;

            const pLinkSp = document.getElementById('premiere-link-spotify');
            if (pLinkSp) pLinkSp.href = data.premiere.spotifyLink;
        }

        // B. Load Discography (Albumes)
        if (data.discography) {
            const grid = document.getElementById('discography-grid');
            if (grid) {
                grid.innerHTML = ''; // Clear loading state or previous content

                // Add albums from JSON
                data.discography.forEach((album, index) => {
                    const albumHTML = `
                    <article class="reveal group relative bg-urban-dark border border-white/5 rounded-xl overflow-hidden hover:border-urban-gold/50 transition-all duration-300" style="transition-delay: ${index * 100}ms;">
                        <div class="aspect-square overflow-hidden relative">
                            <img 
                                src="${album.coverUrl}" 
                                alt="Portada ${album.title}" 
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                                loading="lazy"
                            >
                            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col gap-4 backdrop-blur-sm">
                                <a href="${album.spotifyUrl}" target="_blank" class="flex items-center space-x-2 text-white hover:text-[#1DB954] font-bold uppercase tracking-wider">
                                    <i data-lucide="external-link" class="w-5 h-5"></i> <span>Spotify</span>
                                </a>
                                <a href="${album.youtubeUrl}" target="_blank" class="flex items-center space-x-2 text-white hover:text-[#FF0000] font-bold uppercase tracking-wider">
                                    <i data-lucide="youtube" class="w-5 h-5"></i> <span>YouTube</span>
                                </a>
                            </div>
                        </div>
                        <div class="p-6 relative">
                            <div class="absolute top-0 right-0 bg-urban-gold text-urban-black text-xs font-bold px-3 py-1 rounded-bl-lg">${album.year}</div>
                            <h3 class="font-display text-2xl font-bold text-white mb-1 group-hover:text-urban-gold transition-colors">${album.title}</h3>
                            <p class="text-gray-400 font-sans text-sm uppercase tracking-wide">${album.artist}</p>
                        </div>
                    </article>
                    `;
                    grid.insertAdjacentHTML('beforeend', albumHTML);
                });

                // Add "Next Release" Placeholder at the end
                const nextReleaseHTML = `
                <div class="reveal flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/10 rounded-xl p-8 text-center group hover:border-urban-gold/30 transition-colors h-full" style="transition-delay: ${data.discography.length * 100}ms;">
                    <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-urban-gold/20 transition-colors">
                        <i data-lucide="disc" class="w-8 h-8 text-gray-500 group-hover:text-urban-gold"></i>
                    </div>
                    <h3 class="font-display text-xl font-bold text-gray-500">PRÓXIMO LANZAMIENTO</h3>
                    <p class="text-gray-600 text-sm mt-2">Mientras tanto, te invitamos a seguirnos en nuestras redes sociales.</p>
                </div>
                `;
                grid.insertAdjacentHTML('beforeend', nextReleaseHTML);

                // Re-initialize icons for new elements
                lucide.createIcons();
                // Re-initialize reveal observer for new elements
                observeNewReveals();
            }
        }

        // C. Load Socials
        if (data.socials) {
            for (const [key, url] of Object.entries(data.socials)) {
                // Find links with data-social="key"
                const links = document.querySelectorAll(`a[data-social="${key}"]`);
                links.forEach(link => {
                    if (url) {
                        link.href = url;
                    } else {
                        link.style.display = 'none'; // Hide if no URL provided
                    }
                });
            }
        }

    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}


// --- Navbar Logic ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks = document.querySelectorAll('.nav-link');

// Change Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-urban-black/95', 'backdrop-blur-md', 'border-b', 'border-white/10', 'py-4', 'shadow-lg');
        navbar.classList.remove('py-6');
    } else {
        navbar.classList.remove('bg-urban-black/95', 'backdrop-blur-md', 'border-b', 'border-white/10', 'py-4', 'shadow-lg');
        navbar.classList.add('py-6');
    }
});

// Toggle Mobile Menu 
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const icon = mobileMenuBtn.querySelector('i');
        const isOpen = !mobileMenu.classList.contains('translate-x-full');
        if (isOpen) {
            // Close 
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Enable scrolling 
        } else {
            // Open 
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Disable scrolling while menu is open 
        }
        lucide.createIcons();
    });
}

// Close Mobile Menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        document.body.style.overflow = '';
        lucide.createIcons();
    });
});

// --- Highlight Active Link on Scroll ---
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section, header');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-urban-gold');
        link.classList.add('text-gray-300');
        const span = link.querySelector('span');
        if (span) span.classList.remove('w-full');
        if (span) span.classList.add('w-0');

        if (link.getAttribute('href').includes(current)) {
            link.classList.add('text-urban-gold');
            link.classList.remove('text-gray-300');
            if (span) span.classList.add('w-full');
            if (span) span.classList.remove('w-0');
        }
    });
});

// --- Scroll Reveal Animation ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // Only animate once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

// Initial observation
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => revealObserver.observe(el));

// Function to observe new elements added via JS
function observeNewReveals() {
    const newElements = document.querySelectorAll('.reveal:not(.active)');
    newElements.forEach(el => revealObserver.observe(el));
}