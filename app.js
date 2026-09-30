// =========================================================================
// 1. CUSTOM CURSOR
// =========================================================================
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('custom-cursor-dot');

if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .project-card, .skills-card, .timeline-item, .suggested-btn');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

// =========================================================================
// 2. HEADER SCROLL & MOBILE NAVIGATION MENU
// =========================================================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

// =========================================================================
// 3. TYPEWRITER EFFECT
// =========================================================================
const words = ["full-stack applications.", "intelligent AI tools.", "scalable backend services.", "real-time chat solutions."];
let i = 0;
let timer;

function typeWriter(word, idx, callback) {
    const target = document.getElementById('typing-target');
    if (!target) return;
    if (idx < word.length) {
        target.innerHTML += word.charAt(idx);
        timer = setTimeout(() => typeWriter(word, idx + 1, callback), 80);
    } else {
        setTimeout(callback, 2000);
    }
}

function deleteWriter(word, idx, callback) {
    const target = document.getElementById('typing-target');
    if (!target) return;
    if (idx >= 0) {
        target.innerHTML = word.substring(0, idx);
        timer = setTimeout(() => deleteWriter(word, idx - 1, callback), 40);
    } else {
        setTimeout(callback, 500);
    }
}

function startTypewriterSequence() {
    const nextWord = () => {
        const word = words[i];
        typeWriter(word, 0, () => {
            deleteWriter(word, word.length, () => {
                i = (i + 1) % words.length;
                startTypewriterSequence();
            });
        });
    };
    nextWord();
}

document.addEventListener('DOMContentLoaded', () => {
    startTypewriterSequence();
});

// =========================================================================
// 4. REVEAL ANIMATIONS ON SCROLL (INTERSECTION OBSERVER)
// =========================================================================
const reveals = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
} else {
    // Fallback if IntersectionObserver is not supported
    reveals.forEach(el => el.classList.add('revealed'));
}

// Active link highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// =========================================================================
// 5. PROJECT GRID FILTERING
// =========================================================================
const filterButtons = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.classList.remove('hidden');
                // Re-trigger scroll reveal if it wasn't shown
                card.classList.add('revealed');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// =========================================================================
// 6. INTERACTIVE AI ASSISTANT CHATBOT LOGIC
// =========================================================================
const chatToggleBtn = document.getElementById('ai-chat-toggle');
const chatPanel = document.getElementById('ai-chat-panel');
const panelCloseBtn = document.getElementById('panel-close-btn');
const chatMessagesContainer = document.getElementById('chat-messages-container');
const chatUserInput = document.getElementById('chat-user-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const suggestedQuestionsBox = document.getElementById('suggested-questions-box');

// AI Knowledge Base
const aiKnowledge = {
    greetings: "Hi there! I am Sheetal's virtual twin assistant. Ask me anything about his technical skill set, university projects, or academic background!",
    projects: "Sheetal has built 4 key production-grade projects: \n1. **Automated Pityriasis Alba Detection Using Deep Learning (78.84% accuracy)** \n2. **Mental Health Wellness Platform (MERN stack)** \n3. **AI-Powered Travel Planner (React/Node + 3 external APIs)** \n4. **Real-Time Chat App (React Native, Socket.IO, Docker)**. \nWhich one would you like to know more about?",
    skills: "Sheetal's developer skills include: \n- **Languages**: C, C++, Python, JavaScript \n- **Frontend**: HTML5, CSS3, React.js, React Native \n- **Backend**: Node.js, Express.js, REST APIs, Socket.IO \n- **Databases**: MongoDB, MySQL, SQLite \n- **DevOps**: Docker, Git/GitHub, Postman, VS Code \n- **AI/ML**: Machine Learning, Generative AI, Data Science, Model Training & Deployment",
    contact: "You can reach Sheetal Kumar via: \n- **Email**: sheetalkumar.kr001@gmail.com \n- **Phone**: +91 8083280965 \n- **LinkedIn**: linkedin.com/in/sheetal-kumar-510b86257 \n- **GitHub**: github.com/KIRI001 \nHe is currently based in Bangalore, Karnataka.",
    education: "Sheetal is a final-year Computer Science & Engineering B.Tech undergraduate (2022-2026) at **Dumka Engineering College, Jharkhand** with a cumulative GPA of **7.1 / 10**.",
    certifications: "His certifications include: \n- **MERN Stack Development** (Codec) \n- **Data Science** (Ardent) \n- **Generative AI** (Lawazia Tech) \n- **Python Programming** (Coursera)",
    interests: "In his leisure time, Sheetal enjoys playing Badminton and Volleyball, Reading, Writing, Event Management, and contributing to Open Source projects.",
    
    // Project Specifics
    skin: "The project **Automated Pityriasis Alba Detection Using Deep Learning** is built using **Python, CNN, Deep Learning, Flask, and React.js**. \nKey Achievements: \n- Developed an AI-powered skin disease detection system for identifying Pityriasis Alba. \n- Trained and evaluated CNN-based models on annotated dermatology datasets. \n- Achieved **78.84% accuracy** and **95.31% recall** on the test dataset. \n- Built an image upload and prediction pipeline for real-time disease detection. \n- Used Roboflow for image annotation and dataset preprocessing.",
    mental: "The **Mental Health Wellness Platform** is a full-stack MERN (MongoDB, Express, React, Node) application. \nKey Features: \n- Supports anonymous journaling and medicine tracking. \n- Used JWT authentication and bcrypt password hashing (0 security vulnerabilities). \n- Built-in medicine reminders and responsive UI across 5+ device breakpoints.",
    travel: "The **AI-Powered Travel Planner** is a React, Node, and MongoDB app that helps generate custom itineraries. \nKey Features: \n- Leverages 3 third-party APIs to plan trips in **under 2 minutes**. \n- Has a drag-and-drop schedule planner UI with MongoDB session persistence. \n- 99% uptime via robust API error handling and retry logic.",
    chat: "The **Real-Time Chat Application** is a cross-platform mobile chat app built with **React Native, Socket.IO, Node.js, and Docker**. \nKey Highlights: \n- latency **under 200ms** across 10+ concurrent chat sessions. \n- Containerised backend with Docker, reducing setup to **under 5 minutes**. \n- Offline storage configuration ensuring zero message loss."
};

// Toggle Chat Panel
if (chatToggleBtn && chatPanel) {
    chatToggleBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('hidden');
        document.querySelector('.chat-icon-open').classList.toggle('hidden');
        document.querySelector('.chat-icon-close').classList.toggle('hidden');
        scrollChatToBottom();
    });

    panelCloseBtn.addEventListener('click', () => {
        chatPanel.classList.add('hidden');
        document.querySelector('.chat-icon-open').classList.remove('hidden');
        document.querySelector('.chat-icon-close').classList.add('hidden');
    });
}

// Send Message handler
function handleUserMessage(messageText) {
    if (!messageText.trim()) return;

    // 1. Render User Message
    renderMessage(messageText, 'user-message');
    chatUserInput.value = '';
    scrollChatToBottom();

    // 2. Render typing indicator
    const typingIndicator = renderTypingIndicator();
    scrollChatToBottom();

    // 3. Process AI Response
    setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();
        
        const responseText = matchAiResponse(messageText);
        renderMessage(responseText, 'bot-message');
        scrollChatToBottom();
    }, 1000);
}

if (chatSendBtn && chatUserInput) {
    chatSendBtn.addEventListener('click', () => handleUserMessage(chatUserInput.value));
    chatUserInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage(chatUserInput.value);
        }
    });
}

// Suggested queries click handlers
if (suggestedQuestionsBox) {
    suggestedQuestionsBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.suggested-btn');
        if (!btn) return;
        const queryType = btn.getAttribute('data-query');
        
        let userQueryText = btn.textContent.substring(2); // Strip icon
        renderMessage(userQueryText, 'user-message');
        scrollChatToBottom();

        const typingIndicator = renderTypingIndicator();
        scrollChatToBottom();

        setTimeout(() => {
            typingIndicator.remove();
            let botResponse = "";
            if (queryType === 'projects') botResponse = aiKnowledge.projects;
            else if (queryType === 'experience') botResponse = aiKnowledge.skin;
            else if (queryType === 'skills') botResponse = aiKnowledge.skills;
            else if (queryType === 'contact') botResponse = aiKnowledge.contact;
            
            renderMessage(botResponse, 'bot-message');
            scrollChatToBottom();
        }, 800);
    });
}

// Helpers
function renderMessage(text, senderClass) {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgElement = document.createElement('div');
    msgElement.className = `chat-message ${senderClass}`;
    
    // Replace newline markdown with HTML breaks, and bold formatting
    let formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/- \*\*(.*?)\*\*/g, '• <strong>$1</strong>');

    msgElement.innerHTML = `
        <div class="msg-bubble">${formattedText}</div>
        <span class="msg-time">${timeString}</span>
    `;
    chatMessagesContainer.appendChild(msgElement);
}

function renderTypingIndicator() {
    const msgElement = document.createElement('div');
    msgElement.className = `chat-message bot-message typing-indicator-msg`;
    msgElement.innerHTML = `
        <div class="msg-bubble">
            <span class="pulse-dot"></span>
            <span class="pulse-dot" style="animation-delay: 0.2s"></span>
            <span class="pulse-dot" style="animation-delay: 0.4s"></span>
        </div>
    `;
    chatMessagesContainer.appendChild(msgElement);
    return msgElement;
}

function scrollChatToBottom() {
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function matchAiResponse(userMsg) {
    const query = userMsg.toLowerCase();
    
    if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('greet')) {
        return aiKnowledge.greetings;
    }
    if (query.includes('skin') || query.includes('disease') || query.includes('diagnostic') || query.includes('dermatek') || query.includes('accuracy')) {
        return aiKnowledge.skin;
    }
    if (query.includes('mental') || query.includes('wellness') || query.includes('journal') || query.includes('medicine')) {
        return aiKnowledge.mental;
    }
    if (query.includes('travel') || query.includes('planner') || query.includes('itinerary')) {
        return aiKnowledge.travel;
    }
    if (query.includes('chat') || query.includes('socket') || query.includes('latency') || query.includes('realtime') || query.includes('real-time')) {
        return aiKnowledge.chat;
    }
    if (query.includes('project') || query.includes('work') || query.includes('portfolio') || query.includes('application')) {
        return aiKnowledge.projects;
    }
    if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('languages') || query.includes('react') || query.includes('python')) {
        return aiKnowledge.skills;
    }
    if (query.includes('education') || query.includes('college') || query.includes('gpa') || query.includes('university') || query.includes('dumka') || query.includes('b.tech')) {
        return aiKnowledge.education;
    }
    if (query.includes('certification') || query.includes('certificate') || query.includes('credential')) {
        return aiKnowledge.certifications;
    }
    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('hire')) {
        return aiKnowledge.contact;
    }
    if (query.includes('interest') || query.includes('hobby') || query.includes('hobbies') || query.includes('badminton')) {
        return aiKnowledge.interests;
    }

    // Default Fallback
    return "I'm not fully sure about that detail, but I can tell you about Sheetal's projects (MERN & AI), technical skills, college background, or direct contact details. Feel free to try typing one of those keywords!";
}

// =========================================================================
// 7. TOAST NOTIFICATION UTILITY
// =========================================================================
function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="${iconClass}" style="color: var(--color-secondary);"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================================================================
// 8. PARTICLE CONSTELLATION CANVAS BACKDROP
// =========================================================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 70);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.8 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
            ctx.fill();

            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// =========================================================================
// 9. ANIMATED NUMERIC SCROLL COUNTERS
// =========================================================================
function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetVal = parseFloat(el.getAttribute('data-counter-target'));
                const prefix = el.getAttribute('data-counter-prefix') || '';
                const suffix = el.getAttribute('data-counter-suffix') || '';
                const isFloat = targetVal % 1 !== 0;

                let current = 0;
                const duration = 1500;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quad
                    const easedProgress = progress * (2 - progress);

                    current = targetVal * easedProgress;

                    if (isFloat) {
                        el.textContent = `${prefix}${current.toFixed(2)}${suffix}`;
                    } else {
                        el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = `${prefix}${targetVal}${suffix}`;
                    }
                }
                requestAnimationFrame(updateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => observer.observe(el));
}

// =========================================================================
// 10. 3D CARD PERSPECTIVE TILT EFFECT
// =========================================================================
function initCardTilt() {
    const tiltCards = document.querySelectorAll('.project-card, .skills-card, .playground-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// =========================================================================
// 11. RECRUITER FAST-TRACK MODAL CONTROLLER
// =========================================================================
function initRecruiterModal() {
    const modal = document.getElementById('recruiter-modal');
    const openBtn = document.getElementById('btn-recruiter-mode');
    const closeBtn = document.getElementById('recruiter-modal-close');
    const copyBtn = document.getElementById('btn-copy-brief');
    const resumeBtn = document.getElementById('btn-download-resume');

    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const briefText = `Sheetal Kumar - Candidate Summary\nRole: Full-Stack & AI Engineer\nEducation: B.Tech CSE (2022-2026 Batch, Dumka Eng College, GPA: 7.1)\nKey Stats: 95.31% AI Model Recall | 500+ LeetCode Solved | <200ms Socket Latency\nEmail: sheetalkumar.kr001@gmail.com | Phone: +91 8083280965\nGitHub: https://github.com/KIRI001`;
            navigator.clipboard.writeText(briefText).then(() => {
                showToast("Candidate Brief copied to clipboard!");
            });
        });
    }

    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            // Close recruiter modal and open resume modal
            modal.classList.add('hidden');
            const resumeModal = document.getElementById('resume-modal');
            if (resumeModal) resumeModal.classList.remove('hidden');
        });
    }
}

// =========================================================================
// 11b. RESUME MODAL CONTROLLER
// =========================================================================
function initResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    if (!resumeModal) return;

    const closeBtn = document.getElementById('resume-modal-close');
    const printBtn = document.getElementById('btn-print-resume');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            resumeModal.classList.add('hidden');
        });
    }

    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) resumeModal.classList.add('hidden');
    });

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

// =========================================================================
// 12. PROJECT ARCHITECTURE DEEP-DIVE MODALS
// =========================================================================
const projectSpecsData = {
    skin: {
        title: "Automated Pityriasis Alba Detection Using Deep Learning",
        category: "Deep Learning & Computer Vision",
        github: "https://github.com/KIRI001",
        benchmarks: [
            { label: "Recall Rate", val: "95.31%" },
            { label: "Overall Accuracy", val: "78.84%" },
            { label: "Preprocessing Framework", val: "Roboflow 224x224" }
        ],
        svgArch: `
        <svg class="arch-svg" viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="50" width="130" height="70" rx="10" fill="#0d1525" stroke="#06b6d4" stroke-width="2"/>
            <text x="75" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Input Image</text>
            <text x="75" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Dermatology Scan</text>
            
            <path d="M 140 85 L 180 85" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow)"/>
            
            <rect x="180" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#a855f7" stroke-width="2"/>
            <text x="250" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Roboflow Preprocess</text>
            <text x="250" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Resize &amp; Augment</text>

            <path d="M 320 85 L 360 85" stroke="#a855f7" stroke-width="2"/>

            <rect x="360" y="50" width="150" height="70" rx="10" fill="#0d1525" stroke="#ec4899" stroke-width="2"/>
            <text x="435" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">CNN Feature Maps</text>
            <text x="435" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Dense Softmax Layer</text>

            <path d="M 510 85 L 550 85" stroke="#a855f7" stroke-width="2"/>

            <rect x="550" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#10b981" stroke-width="2"/>
            <text x="620" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Flask REST Output</text>
            <text x="620" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">95.31% Confidence</text>
        </svg>`,
        description: "The Deep Learning Diagnostic Engine trains custom Convolutional Neural Networks (CNNs) on annotated dermatology image patches. Preprocessed via Roboflow, the Flask backend runs real-time inference with softmax probability output."
    },
    mental: {
        title: "Mental Health Wellness Platform (MERN Stack)",
        category: "Full-Stack Web Application",
        github: "https://github.com/KIRI001",
        benchmarks: [
            { label: "Security Audit", val: "JWT & Bcrypt" },
            { label: "Active Test Users", val: "50+ Users" },
            { label: "Device Breakpoints", val: "5 Fully Tested" }
        ],
        svgArch: `
        <svg class="arch-svg" viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="50" width="130" height="70" rx="10" fill="#0d1525" stroke="#3b82f6" stroke-width="2"/>
            <text x="75" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">React.js Client</text>
            <text x="75" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">State &amp; Context</text>

            <path d="M 140 85 L 200 85" stroke="#06b6d4" stroke-width="2"/>

            <rect x="200" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#06b6d4" stroke-width="2"/>
            <text x="270" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Express Auth Router</text>
            <text x="270" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">JWT Validation</text>

            <path d="M 340 85 L 400 85" stroke="#06b6d4" stroke-width="2"/>

            <rect x="400" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#a855f7" stroke-width="2"/>
            <text x="470" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Reminder Cron</text>
            <text x="470" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Scheduled Dispatcher</text>

            <path d="M 540 85 L 590 85" stroke="#06b6d4" stroke-width="2"/>

            <rect x="590" y="50" width="100" height="70" rx="10" fill="#0d1525" stroke="#10b981" stroke-width="2"/>
            <text x="640" y="85" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">MongoDB</text>
        </svg>`,
        description: "Built using the MERN stack with strict JWT token validation. Features anonymous encrypted journaling logs and automated medicine intake schedule reminders."
    },
    travel: {
        title: "AI-Powered Travel Planner Application",
        category: "MERN Stack + Multi-API Integration",
        github: "https://github.com/KIRI001",
        benchmarks: [
            { label: "Planning Time", val: "< 2 Minutes" },
            { label: "External APIs", val: "3 Integrated" },
            { label: "Service Uptime", val: "99% Live Logic" }
        ],
        svgArch: `
        <svg class="arch-svg" viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="50" width="130" height="70" rx="10" fill="#0d1525" stroke="#06b6d4" stroke-width="2"/>
            <text x="75" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Traveler UI</text>
            <text x="75" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Itinerary Builder</text>

            <path d="M 140 85 L 200 85" stroke="#a855f7" stroke-width="2"/>

            <rect x="200" y="50" width="150" height="70" rx="10" fill="#0d1525" stroke="#a855f7" stroke-width="2"/>
            <text x="275" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Node Aggregator Engine</text>
            <text x="275" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Retry &amp; Fallback Logic</text>

            <path d="M 350 85 L 410 85" stroke="#a855f7" stroke-width="2"/>

            <rect x="410" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#ec4899" stroke-width="2"/>
            <text x="480" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">3x External APIs</text>
            <text x="480" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Maps, Places, AI</text>

            <path d="M 550 85 L 590 85" stroke="#a855f7" stroke-width="2"/>

            <rect x="590" y="50" width="100" height="70" rx="10" fill="#0d1525" stroke="#10b981" stroke-width="2"/>
            <text x="640" y="85" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">MongoDB</text>
        </svg>`,
        description: "Aggregates live place recommendations and maps datasets across 3 external APIs, generating optimized trip plans in under 2 minutes with session storage."
    },
    chat: {
        title: "Real-Time Mobile Chat Platform",
        category: "React Native + Socket.IO + Docker",
        github: "https://github.com/KIRI001",
        benchmarks: [
            { label: "Message Latency", val: "< 200ms" },
            { label: "Deployment Setup", val: "< 5 Minutes" },
            { label: "Message Loss", val: "0% (Offline Queue)" }
        ],
        svgArch: `
        <svg class="arch-svg" viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#3b82f6" stroke-width="2"/>
            <text x="80" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">React Native App</text>
            <text x="80" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Mobile WebSockets</text>

            <path d="M 150 85 L 210 85" stroke="#06b6d4" stroke-width="2"/>

            <rect x="210" y="50" width="160" height="70" rx="10" fill="#0d1525" stroke="#06b6d4" stroke-width="2"/>
            <text x="290" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Socket.IO Server</text>
            <text x="290" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Bi-directional Duplex</text>

            <path d="M 370 85 L 430 85" stroke="#06b6d4" stroke-width="2"/>

            <rect x="430" y="50" width="140" height="70" rx="10" fill="#0d1525" stroke="#a855f7" stroke-width="2"/>
            <text x="500" y="80" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">Docker Container</text>
            <text x="500" y="98" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">Isolated Microservice</text>

            <path d="M 570 85 L 600 85" stroke="#06b6d4" stroke-width="2"/>

            <rect x="600" y="50" width="90" height="70" rx="10" fill="#0d1525" stroke="#10b981" stroke-width="2"/>
            <text x="645" y="85" fill="#ffffff" font-size="12" font-family="monospace" text-anchor="middle">SQLite</text>
        </svg>`,
        description: "Full duplex real-time chat architecture containerized with Docker for 1-command startup. Features offline message caching to prevent data drops."
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('project-modal-close');
    const closeBtnFooter = document.getElementById('project-modal-close-btn');
    const modalBody = document.getElementById('project-modal-body');
    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');

    if (!modal) return;

    document.querySelectorAll('.btn-project-specs').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = projectSpecsData[key];

            if (data) {
                modalTitle.textContent = data.title;
                modalCategory.textContent = data.category;

                let benchmarksHtml = data.benchmarks.map(b => `
                    <div class="benchmark-item">
                        <h5>${b.label}</h5>
                        <div class="benchmark-val">${b.val}</div>
                    </div>
                `).join('');

                modalBody.innerHTML = `
                    <div class="benchmarks-grid">
                        ${benchmarksHtml}
                    </div>

                    <div class="arch-diagram-box">
                        <h4 style="font-size:13px; color:var(--text-muted); margin-bottom:12px; text-transform:uppercase;">System Micro-Architecture Diagram</h4>
                        ${data.svgArch}
                    </div>

                    <div class="recruiter-bio-box" style="margin-bottom:0;">
                        <h4 style="font-size:15px; margin-bottom:6px;">Engineering Notes &amp; Data Flow:</h4>
                        <p>${data.description}</p>
                    </div>
                `;

                modal.classList.remove('hidden');
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    if (closeBtnFooter) closeBtnFooter.addEventListener('click', () => modal.classList.add('hidden'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
}

// =========================================================================
// 13. LIVE INTERACTIVE AI MODEL PLAYGROUND SIMULATOR
// =========================================================================
function initAiPlayground() {
    const sampleBtns = document.querySelectorAll('.sample-btn');
    const runBtn = document.getElementById('run-inference-btn');
    const scanLine = document.getElementById('scanner-line');
    const labelTag = document.getElementById('scan-label-tag');
    const confBar = document.getElementById('confidence-bar-fill');
    const confVal = document.getElementById('confidence-val');

    const samplePresets = {
        sample1: { label: "Pityriasis Alba (Mild Patch)", conf: "95.31%", width: "95.31%" },
        sample2: { label: "Classical Alba (High Severity)", conf: "98.70%", width: "98.7%" },
        sample3: { label: "Healthy Skin (Control Negative)", conf: "4.12%", width: "4.12%" }
    };

    let selectedSample = "sample1";

    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sampleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSample = btn.getAttribute('data-sample');
            showToast(`Loaded Scan Target: ${btn.textContent.trim()}`);
        });
    });

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            scanLine.classList.add('scanning');
            runBtn.disabled = true;
            runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing Inference...';

            // Reset UI step indicators
            const steps = document.querySelectorAll('.step-item');
            steps.forEach(s => s.classList.remove('step-done'));

            setTimeout(() => {
                document.getElementById('step-preprocess').classList.add('step-done');
            }, 400);

            setTimeout(() => {
                document.getElementById('step-features').classList.add('step-done');
            }, 900);

            setTimeout(() => {
                document.getElementById('step-classification').classList.add('step-done');
                scanLine.classList.remove('scanning');
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Execute CNN Inference';

                const preset = samplePresets[selectedSample];
                if (labelTag) labelTag.textContent = preset.label;
                if (confBar) confBar.style.width = preset.width;
                if (confVal) confVal.textContent = preset.conf;

                showToast(`Inference Complete: ${preset.conf} Confidence`, "fa-solid fa-brain");
            }, 1500);
        });
    }
}

// =========================================================================
// 14. DEVELOPER CLI / COMMAND PALETTE (CTRL+K) ENGINE
// =========================================================================
function initCommandPalette() {
    const modal = document.getElementById('command-palette-modal');
    const openBtn = document.getElementById('btn-cli-toggle');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output-container');
    const cliTags = document.querySelectorAll('.cli-tag');

    if (!modal) return;

    function openCli() {
        modal.classList.remove('hidden');
        if (cliInput) {
            cliInput.focus();
            cliInput.value = '';
        }
    }

    function closeCli() {
        modal.classList.add('hidden');
    }

    if (openBtn) openBtn.addEventListener('click', openCli);

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modal.classList.contains('hidden')) openCli();
            else closeCli();
        }
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeCli();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCli();
    });

    cliTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const cmd = tag.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });

    if (cliInput) {
        cliInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const cmd = cliInput.value.trim();
                executeCommand(cmd);
                cliInput.value = '';
            }
        });
    }

    function executeCommand(cmd) {
        if (!cmd) return;
        const lowerCmd = cmd.toLowerCase().trim();

        appendCliLog(`sheetal@portfolio:~$ ${cmd}`, 'cmd-input');

        if (lowerCmd === 'help') {
            appendCliLog(`Available commands:\n- recruiter : Open 30-sec recruiter executive summary\n- projects  : View featured production projects\n- skills    : View full developer tech stack\n- leetcode  : Display 500+ solved problem breakdown\n- contact   : Display direct email & phone details\n- clear     : Reset terminal output`, 'cmd-output');
        } else if (lowerCmd === 'recruiter') {
            appendCliLog(`[SUCCESS] Launching Recruiter Mode overview...`, 'cmd-success');
            closeCli();
            const recruiterModal = document.getElementById('recruiter-modal');
            if (recruiterModal) recruiterModal.classList.remove('hidden');
        } else if (lowerCmd === 'projects') {
            appendCliLog(`[OUTPUT] Projects Loaded:\n1. Pityriasis Alba AI Detection (95.31% recall)\n2. Mental Health Wellness App (MERN)\n3. AI Travel Planner (3 APIs)\n4. Socket.IO Real-Time Chat (Docker)`, 'cmd-output');
            window.location.hash = '#projects';
        } else if (lowerCmd === 'skills') {
            appendCliLog(`[OUTPUT] Tech Stack Matrix:\nLanguages: Python, C++, C, JavaScript\nFrontend: React.js, React Native, HTML5, CSS3\nBackend: Node.js, Express.js, MongoDB, Socket.IO, Docker`, 'cmd-output');
        } else if (lowerCmd === 'leetcode') {
            appendCliLog(`[OUTPUT] LeetCode DSA Metrics: 500+ Solved\n- Easy: 180+\n- Medium: 280+\n- Hard: 40+`, 'cmd-output');
        } else if (lowerCmd === 'contact') {
            appendCliLog(`[OUTPUT] Contact Details:\nEmail: sheetalkumar.kr001@gmail.com\nPhone: +91 8083280965\nGitHub: github.com/KIRI001`, 'cmd-output');
        } else if (lowerCmd === 'clear') {
            if (cliOutput) cliOutput.innerHTML = `<p class="cli-welcome">Welcome to Sheetal's Developer Terminal. Type <span class="cmd-text">'help'</span> for list of interactive commands.</p>`;
        } else {
            appendCliLog(`Command '${cmd}' not recognized. Type 'help' for options.`, 'cmd-output');
        }

        if (cliOutput) cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function appendCliLog(text, className) {
        if (!cliOutput) return;
        const log = document.createElement('div');
        log.className = `cli-log-line ${className}`;
        log.style.whiteSpace = 'pre-line';
        log.textContent = text;
        cliOutput.appendChild(log);
    }
}

// =========================================================================
// CONTACT FORM HANDLER
// =========================================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Build mailto link with form data
        const body = `Hi Sheetal,\n\n${message}\n\n— ${name}\n(${email})`;
        const mailtoLink = `mailto:sheetalkumar.kr001@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(mailtoLink, '_blank');

        showToast("Opening your email client…", "fa-solid fa-envelope-circle-check");

        // Reset form after short delay
        setTimeout(() => {
            form.reset();
        }, 500);
    });
}

// =========================================================================
// INITIALIZE ALL EXPANDED RECRUITER MODULES ON LOAD
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initCounters();
    initCardTilt();
    initRecruiterModal();
    initResumeModal();
    initProjectModals();
    initAiPlayground();
    initCommandPalette();
    initContactForm();
});

