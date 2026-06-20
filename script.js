// ===== DOM Elements =====
const nav = document.getElementById('nav');
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
const backtop = document.getElementById('backtop');
const contactForm = document.getElementById('contactForm');

// Terminal elements
const termToggle = document.getElementById('termToggle');
const termWidget = document.getElementById('termWidget');
const termClose = document.getElementById('termClose');
const termInput = document.getElementById('termInput');
const termBody = document.getElementById('termBody');

// ===== Mobile Navigation =====
navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navHamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !navHamburger.contains(e.target)) {
        navHamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    if (currentScroll > 500) {
        backtop.classList.add('visible');
    } else {
        backtop.classList.remove('visible');
    }

    // Hide scroll hint after scrolling
    const scrollHint = document.getElementById('scrollHint');
    if (scrollHint && currentScroll > 100) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
    }

    updateActiveNavLink();
}, { passive: true });

// ===== Back to Top =====
backtop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Interactive Terminal =====
let commandHistory = [];
let historyIndex = -1;
let currentTheme = 'dark';

// ===== Theme Management =====
function setTheme(theme) {
    if (theme === 'sepia' || theme === 'light') {
        document.body.classList.add('sepia-mode');
        currentTheme = 'sepia';
        // Clean up any inline styles that might have been set previously
        document.documentElement.removeAttribute('style');
    } else {
        document.body.classList.remove('sepia-mode');
        currentTheme = 'dark';
    }
}

// Auto-detect system theme on load
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    setTheme(e.matches ? 'light' : 'dark');
});

termToggle.addEventListener('click', () => {
    termWidget.classList.toggle('open');
    if (termWidget.classList.contains('open')) {
        termInput.focus();
    }
});

termClose.addEventListener('click', () => {
    termWidget.classList.remove('open');
});

termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = termInput.value.trim();
        if (cmd) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
            processCommand(cmd);
            termInput.value = '';
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            termInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            termInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            termInput.value = '';
        }
    }
});

function processCommand(cmd) {
    const parts = cmd.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    addOutput(`visitor@portfolio:~$ ${cmd}`, 'prompt-line');

    switch(baseCmd) {
        case 'help':
            addOutput('Available commands:', 'output');
            addOutput('  <span class="file">help</span>           - Show this help message', 'output');
            addOutput('  <span class="file">whoami</span>         - Display user info', 'output');
            addOutput('  <span class="file">ls</span>             - List portfolio sections', 'output');
            addOutput('  <span class="file">cat &lt;file&gt;</span>   - View file content (about, skills, experience, projects)', 'output');
            addOutput('  <span class="file">open &lt;page&gt;</span>  - Scroll to section (about, skills, experience, projects, contact)', 'output');
            addOutput('  <span class="file">date</span>           - Show current date', 'output');
            addOutput('  <span class="file">echo &lt;text&gt;</span> - Echo text back', 'output');
            addOutput('  <span class="file">clear</span>          - Clear terminal', 'output');
            addOutput('  <span class="file">theme</span>          - Toggle theme', 'output');
            addOutput('  <span class="file">neofetch</span>       - System info', 'output');
            addOutput('  <span class="file">contact</span>        - Show contact info', 'output');
            break;

        case 'whoami':
            addOutput('Name:    Apoorv Dubey', 'output');
            addOutput('Role:    Platform & Backend Engineer', 'output');
            addOutput('Status:  Open to opportunities', 'output');
            break;

        case 'ls':
            addOutput('total 5', 'output');
            addOutput('drwxr-xr-x  2 visitor  staff   about.himl', 'output');
            addOutput('-rw-r--r--  1 visitor  staff   skills.json', 'output');
            addOutput('drwxr-xr-x  2 visitor  staff   experience.log', 'output');
            addOutput('drwxr-xr-x  2 visitor  staff   projects.sh', 'output');
            addOutput('-rw-r--r--  1 visitor  staff   contact.rs', 'output');
            break;

        case 'cat':
            if (args.length === 0) {
                addOutput('cat: missing operand', 'error');
                addOutput('Try: cat &lt;file&gt; (about, skills, experience, projects)', 'error');
            } else {
                handleCat(args[0].toLowerCase().replace('.txt','').replace('.json','').replace('.log','').replace('.sh','').replace('.rs','').replace('.hml',''));
            }
            break;

        case 'open':
            if (args.length === 0) {
                addOutput('open: missing operand', 'error');
                addOutput('Try: open &lt;page&gt; (about, skills, experience, projects, contact)', 'error');
            } else {
                scrollToSection(args[0].toLowerCase());
            }
            break;

        case 'date':
            const now = new Date();
            addOutput(now.toString(), 'output');
            break;

        case 'sudo':
            addOutput('visitor is not in the sudoers file. This incident will be reported.', 'error');
            break;
            
        case 'rm':
            addOutput('rm: Permission denied. Nice try.', 'error');
            break;

        case 'echo':
            addOutput(args.join(' '), 'output');
            break;

        case 'clear':
            termBody.innerHTML = '';
            return;

        case 'theme':
            if (currentTheme === 'sepia') {
                setTheme('dark');
                addOutput('Theme switched to dark mode 🌙', 'output');
            } else {
                setTheme('sepia');
                addOutput('Theme switched to light/sepia mode 📜', 'output');
            }
            break;

        case 'neofetch':
        case 'screenfetch':
            addOutput('', 'output');
            addOutput('        <span class="highlight">visitor</span>@<span class="highlight">apoorv.dev</span>', 'output');
            addOutput('        <span class="dir">OS</span>:     Web Terminal v2026', 'output');
            addOutput('        <span class="dir">Host</span>:   Platform Engineer Portfolio', 'output');
            addOutput('        <span class="dir">Role</span>:   Platform & Backend Engineer', 'output');
            addOutput('        <span class="dir">Stack</span>:  Java, Python, GCP, Kafka, BigQuery', 'output');
            addOutput('        <span class="dir">Theme</span>:  Dark Terminal (Green)', 'output');
            addOutput('', 'output');
            addOutput('        🤖  Building large-scale multi-tenant SaaS infrastructure', 'output');
            break;

        case 'contact':
            addOutput('Email:    d123apoorv@gmail.com', 'output');
            addOutput('Phone:    +91-9260954937', 'output');
            addOutput('Location: Noida, U.P., India', 'output');
            addOutput('Status:   Open to opportunities', 'output');
            break;

        default:
            addOutput(`bash: ${baseCmd}: command not found`, 'error');
            addOutput('Type <span class="file">help</span> to see available commands.', 'error');
    }

    termBody.scrollTop = termBody.scrollHeight;
}

function handleCat(file) {
    switch(file) {
        case 'about':
            addOutput('const engineer = {', 'output');
            addOutput('  name: "Apoorv Dubey",', 'output');
            addOutput('  role: "Platform & Backend Engineer",', 'output');
            addOutput('  education: "B.Tech in CS @ UPES",', 'output');
            addOutput('  experience: "4+ years",', 'output');
            addOutput('  focus: "Multi-tenant SaaS, distributed systems, GCP"', 'output');
            addOutput('  tools: ["Java", "Python", "GCP", "Kafka", "BigQuery"]', 'output');
            addOutput('  repos: "30+ contributed"', 'output');
            addOutput('}', 'output');
            break;
        case 'skills':
            addOutput('{', 'output');
            addOutput('  "Full-Stack": ["Java Spring Boot", "Angular.js", "TypeScript", "Python"],', 'output');
            addOutput('  "Databases": ["PostgreSQL", "Redis", "MongoDB", "BigQuery", "AlloyDB"],', 'output');
            addOutput('  "Cloud": ["GCP", "AWS", "Azure", "Docker", "Kubernetes", "Terraform"],', 'output');
            addOutput('  "Data": ["SQL", "Apache Beam", "Data Pipelines", "ETL"],', 'output');
            addOutput('  "DevOps": ["JUnit 5", "GitHub Actions", "Jenkins", "Prometheus"]', 'output');
            addOutput('}', 'output');
            break;
        case 'experience':
            addOutput('UKG (2024-Present): AI Agent, Cloud Ops, Event Platform, Data Fix, Java 17 Migration', 'output');
            addOutput('Veritas/Cohesity (2022-2024): SaaS Platform, Microservices, Notification Architecture, EVLA Scale', 'output');
            break;
        case 'projects':
            addOutput('  AI-Powered Query Resolution Agent     - Python, LLMs, LangChain', 'output');
            addOutput('  Cloud Cost Optimization Toolkit       - GCP, Dataflow, Python, Terraform', 'output');
            addOutput('  Cross-Cloud Event Processing Platform - Kafka, Pub/Sub, Java', 'output');
            addOutput('  Smart Notification & Import/Export    - Angular, Spring Boot, Kafka, PostgreSQL', 'output');
            break;
        default:
            addOutput(`cat: ${file}: No such file or directory`, 'error');
    }
}

function scrollToSection(section) {
    const map = {
        'about': 'about',
        'skills': 'skills',
        'experience': 'experience',
        'projects': 'projects',
        'contact': 'contact',
        'home': 'hero'
    };
    const id = map[section];
    if (id) {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
            addOutput(`Opening ${section}...`, 'output');
        }
    } else {
        addOutput(`open: ${section}: No such section`, 'error');
    }
}

function addOutput(text, className) {
    const div = document.createElement('div');
    if (className === 'prompt-line') {
        div.innerHTML = `<span class="term-cmd">${text}</span>`;
    } else if (className === 'error') {
        div.innerHTML = `<span class="term-error">${text}</span>`;
    } else {
        div.innerHTML = text;
        div.className = 'term-output';
    }
    termBody.appendChild(div);
}

// ===== Scroll Animations =====
const animateElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// ===== Skill Bar Animations =====
const skillBars = document.querySelectorAll('.skill-bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--target-width', `${width}%`);
            bar.classList.add('visible');
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span class="btn-prefix">$</span> sending...';
    btn.disabled = true;

    fetch('https://formspree.io/f/xlgyrrgn', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Form submission failed');
        
        btn.innerHTML = '<span class="btn-prefix">$</span> sent ✓';
        btn.style.borderColor = '#00ff41';
        btn.style.color = '#00ff41';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.borderColor = '';
            btn.style.color = '';
            contactForm.reset();
        }, 2500);
    })
    .catch((error) => {
        btn.innerHTML = '<span class="btn-prefix">$</span> error ✗';
        btn.style.borderColor = '#ff4141';
        btn.style.color = '#ff4141';
        console.error('Formspree error:', error);

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2500);
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 60;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ===== Initialize =====
updateActiveNavLink();
