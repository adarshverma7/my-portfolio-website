// Menu Toggle for Mobile
const sidemenu = document.getElementById('sidemenu');

function openmenu() {
    sidemenu.style.right = "0"; // Bring menu into view
}

function closemenu() {
    sidemenu.style.right = "-200px"; // Hide menu off-screen
}

// Highlight Active Menu Item on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
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

// GitHub API Integration to Fetch Repositories
const projectsList = document.getElementById('projects-list');

async function fetchGitHubRepos() {
    const username = 'adarshverma7'; // Replace with your GitHub username
    const url = `https://api.github.com/users/${username}/repos`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const repos = await response.json();

        // Filter out forks and sort by last updated
        const filteredRepos = repos
            .filter(repo => !repo.fork) // Exclude forked repositories
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Sort by latest updated

        projectsList.innerHTML = filteredRepos
            .map(
                (repo) => `
                <div class="project-card">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" target="_blank" class="btn">View on GitHub</a>
                </div>
            `
            )
            .join('');
    } catch (error) {
        console.error('Error fetching repositories:', error);
        projectsList.innerHTML = `<p class="error">Unable to fetch repositories. Please try again later.</p>`;
    }
}

fetchGitHubRepos();

const scriptURL = 'https://script.google.com/macros/s/AKfycbxWM9_d9Lbs4ZDItVgp0BzuBLVGVfQYWyeV8Sx1zRWW5lnuQL2MQbfMHsoKNFkCqoku/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true; 
    submitButton.textContent = "Sending..."; 

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: new FormData(form)
        });
        
        const text = await response.text();
        console.log('Response from server:', text); // Log for debugging
        
        if (response.ok) {
            msg.innerHTML = "Message sent successfully!";
            msg.style.color = "#4CAF50"; 
            form.reset();

            // Automatically clear the message after 4 seconds
            setTimeout(() => {
                msg.innerHTML = "";
            }, 4000);
        } else {
            throw new Error(text);
        }
    } catch (error) {
        console.error('Error!', error);
        msg.innerHTML = "Failed to send message. Please try again.";
        msg.style.color = "#ff004f"; 

        // Clear the error message after 4 seconds
        setTimeout(() => {
            msg.innerHTML = "";
        }, 4000);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit"; 
    }
});
