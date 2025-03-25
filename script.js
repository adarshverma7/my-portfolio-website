document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const sidemenu = document.getElementById('sidemenu');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    
    function openMenu() {
        sidemenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        sidemenu.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    
    // Close menu when clicking on a link (mobile)
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Tab Switching
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function openTab(tabName) {
        tabLinks.forEach(link => link.classList.remove('active-link'));
        tabContents.forEach(content => content.classList.remove('active-tab'));
        
        event.currentTarget.classList.add('active-link');
        document.getElementById(tabName).classList.add('active-tab');
    }
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            openTab(this.getAttribute('onclick').match(/'([^']+)'/)[1]);
        });
    });

    // Active Navigation Highlighting
    const sections = document.querySelectorAll('section, #header, #about, #services, #portfolio, #contact, #cta');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // GitHub Projects Loader
    const projectsList = document.getElementById('projects-list');
    
    async function fetchGitHubRepos() {
        const username = 'adarshverma7';
        const url = `https://api.github.com/users/${username}/repos`;
        const errorMsg = 'Unable to fetch projects. View my <a href="https://github.com/adarshverma7" target="_blank">GitHub profile</a> instead.';
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            
            const repos = await response.json();
            const filteredRepos = repos
                .filter(repo => !repo.fork && !repo.archived)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 6);
            
            if (filteredRepos.length === 0) {
                projectsList.innerHTML = `<p class="info-message">${errorMsg}</p>`;
                return;
            }
            
            projectsList.innerHTML = filteredRepos.map(repo => `
                <div class="project-card">
                    <h3>${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="btn btn-secondary">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            projectsList.innerHTML = `<p class="info-message">${errorMsg}</p>`;
        }
    }

    fetchGitHubRepos();
});