/**
 * CLEMANT MATHEW JIJI - CYBERSECURITY & FORENSICS PORTFOLIO JAVASCRIPT
 * Features:
 * - Interactive Matrix/Network Particle Canvas
 * - Web Audio API High-Tech Sound Synthesizer (with Sound Toggle)
 * - Dynamic Role Typing Engine
 * - Interactive SOC Terminal Console with Rich Commands
 * - Skills Category Filter Engine
 * - Resume/CV Modal Lightbox & Print Controller
 * - Direct Copy-to-Clipboard with Cyber Toast Feedback
 * - Secure Contact Dispatch Simulation
 * - Responsive Navbar & ScrollSpy Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Web Audio API High-Tech Sound Synthesizer
    // ==========================================
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
    }

    function playCyberSound(type = 'click') {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'beep') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.setValueAtTime(1600, now + 0.04);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880, now + 0.08); // A5
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'terminal') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            }
        } catch (e) {
            // Audio context silently ignored if blocked by browser policy
        }
    }

    // Sound Toggle Button
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    if (soundToggle && soundIcon) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundIcon.className = 'fa-solid fa-volume-high';
                showToast('Audio Feedback: ENABLED', 'cyan');
                playCyberSound('beep');
            } else {
                soundIcon.className = 'fa-solid fa-volume-xmark';
                showToast('Audio Feedback: MUTED', 'dim');
            }
        });
    }

    // Add audio feedback to all buttons and links
    document.querySelectorAll('button, .cyber-btn, .nav-link, .preset-btn, .social-link').forEach(el => {
        el.addEventListener('mouseenter', () => playCyberSound('click'));
    });

    // ==========================================
    // 2. Interactive Background Particle Canvas
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);
        const maxDistance = 140;

        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 1.8 + 1;
                this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(0, 255, 170, ';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x != null && mouse.y != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2;
                        this.y -= (dy / dist) * force * 2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + '0.7)';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#00f0ff';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // ==========================================
    // 3. Dynamic Typing Engine
    // ==========================================
    const typingRoleEl = document.getElementById('typing-role');
    const roles = [
        "Entry-Level Cybersecurity Specialist",
        "Incident Response & Cyber Forensics",
        "Malware Forensics & Applied Cryptography",
        "Quantum Security (QKD) & Honeypot Researcher",
        "B.Tech CSE Student @ SJCET Palai"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeRoles() {
        if (!typingRoleEl) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingRoleEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingRoleEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2200; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(typeRoles, typingSpeed);
    }

    typeRoles();

    // ==========================================
    // 4. Interactive SOC Terminal Console
    // ==========================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    const presetButtons = document.querySelectorAll('.preset-btn');

    const terminalCommands = {
        'help': () => `
<span class="term-cyan">Available System Commands:</span>
  <span class="term-emerald">whoami</span>        - Display operator biography & background
  <span class="term-emerald">skills</span>        - List cybersecurity technical competencies
  <span class="term-emerald">projects</span>      - List featured projects (Quantum Comm, Honeypot, etc.)
  <span class="term-emerald">tools</span>         - Show security software arsenal (Nmap, Wireshark, etc.)
  <span class="term-emerald">education</span>     - Academic credentials at SJCET Palai
  <span class="term-emerald">experience</span>    - Internship, hackathons, and certifications
  <span class="term-emerald">scan</span>          - Run simulated network vulnerability audit
  <span class="term-emerald">resume</span>        - Open verified CV showcase
  <span class="term-emerald">contact</span>       - Direct communication endpoints
  <span class="term-emerald">clear</span>         - Clear the terminal screen
  <span class="term-emerald">date</span>          - Display current system timestamp
  <span class="term-emerald">sudo</span>          - Request elevated root privileges
`,
        'whoami': () => `
<span class="term-cyan">[OPERATOR PROFILE]</span>
<strong>Name:</strong> Clemant Mathew Jiji
<strong>Specialization:</strong> Entry-Level Cybersecurity Specialist (Incident Response & Forensics)
<strong>Institution:</strong> St. Joseph's College of Engineering and Technology (SJCET), Palai
<strong>Degree:</strong> B.Tech in Computer Science (2023 - 2027) | CGPA: 6.62
<strong>Hometown:</strong> Karuvanchal, Kannur, Kerala
<strong>Status:</strong> Ready for defensive security, SOC analysis & digital forensics opportunities.
`,
        'skills': () => `
<span class="term-cyan">[SECURITY CAPABILITIES]</span>
- Network Security & Intrusion Detection (IDPS)
- Incident Response & Threat Hunting
- Cyber Forensics & Malware Forensics
- Applied Cryptography & Ethical Hacking
- Risk Assessment and Management & Security Best Practices
`,
        'projects': () => `
<span class="term-cyan">[FEATURED RESEARCH & PROJECTS]</span>
1. <span class="term-emerald">Quantum Communication (Academic):</span> Simulated Quantum Key Distribution (QKD) using Qiskit & Python for quantum-secure transmission.
2. <span class="term-emerald">Honeypot-Based Threat Detection (Ongoing):</span> Building low-interaction honeypot architecture to log attacker activities and build IoC threat feeds.
3. <span class="term-emerald">Traffic Sniffing & Anomaly Triage:</span> Wireshark, Zenmap, and Nmap PCAP packet auditing.
4. <span class="term-emerald">Digital & Malware Forensics Lab:</span> Memory dump analysis, disk imaging & SHA-256 chain of custody verification.
`,
        'tools': () => `
<span class="term-cyan">[PRIMARY SECURITY TOOLS & SOFTWARE]</span>
- <span class="term-emerald">Nmap & Zenmap:</span> Network discovery, port scanning, NSE vulnerability auditing
- <span class="term-emerald">Wireshark:</span> Deep packet inspection, PCAP protocol analysis, anomaly triage
- <span class="term-emerald">Linux / Unix:</span> Kali Linux, Ubuntu, CLI mastery, log analysis via grep/awk
- <span class="term-emerald">Cryptography & Forensics:</span> Qiskit, Python, SHA-256, Autopsy
`,
        'education': () => `
<span class="term-cyan">[ACADEMIC DETAILS]</span>
- <strong>College:</strong> St. Joseph's College of Engineering and Technology (SJCET), Palai
- <strong>Course:</strong> Bachelor of Technology (B.Tech) - Computer Science
- <strong>Duration:</strong> 2023 — 2027 (Ongoing) | <strong>CGPA:</strong> 6.62 / 10
- <strong>Coursework:</strong> Applied Cryptography, Computer Networks, Cyber Forensics, Malware Forensics, Ethical Hacking, IDPS
`,
        'experience': () => `
<span class="term-cyan">[MILESTONES & CERTIFICATIONS]</span>
1. <strong>Industry Internship:</strong> Oil Industries, Kannur (June 2026) - System Operations & Security
2. <strong>Hackengers Round 3:</strong> Intercollegiate Hackathon Competition Participant
3. <strong>TECHFEST & KETCON 2024:</strong> Full Event Delegate & "Securing the Cloud" Workshop
4. <strong>CineHack.AI:</strong> National Level Film-Based Hackathon at FISAT (Oct 2025)
5. <strong>NCC Cadet:</strong> Attended Annual Training Camp (Leadership & Discipline)
`,
        'contact': () => `
<span class="term-cyan">[COMMUNICATION CHANNELS]</span>
- <strong>Phone:</strong> +91 7902945567
- <strong>Email:</strong> clemantmathewjiji@gmail.com
- <strong>LinkedIn:</strong> linkedin.com/in/clemant-mathew-jiji
- <strong>Location:</strong> Karuvanchal PO, Kannur District, Kerala - 670571
`,
        'scan': () => {
            return `<span class="term-cyan">[INITIATING SOC RECON SCAN...]</span>
[+] Target: Local Subnet (192.168.1.0/24)
[+] SYN Stealth Scan starting...
[+] Port 22/tcp  OPEN  (OpenSSH 8.9p1) -> <span class="term-emerald">SECURED</span>
[+] Port 80/tcp  OPEN  (HTTP/Nginx)    -> <span class="term-highlight">REDIRECTING TO 443</span>
[+] Port 443/tcp OPEN  (HTTPS/TLS 1.3) -> <span class="term-emerald">VALID CERTIFICATE [A+]</span>
[+] Honeypot Threat Traps: <span class="term-emerald">ACTIVE & LOGGING</span>
[+] Wireshark Packet Monitor: 0 Anomalies detected.
<span class="term-emerald">[✔] SOC AUDIT COMPLETE: 0 Active Breaches. Defense Matrix Healthy.</span>`;
        },
        'resume': () => {
            openResumeModal();
            return `<span class="term-emerald">[✔] Opened Verified CV Showcase in Lightbox Modal.</span>`;
        },
        'date': () => {
            return `<span class="term-cyan">${new Date().toUTCString()}</span>`;
        },
        'sudo': () => `<span class="term-error">Permission denied: Clemant Mathew Jiji has restricted root privileges for security integrity. Try 'whoami'.</span>`,
        'clear': () => {
            if (terminalOutput) terminalOutput.innerHTML = '';
            return null;
        }
    };

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        playCyberSound('terminal');

        // Append user prompt to output
        const cmdRow = document.createElement('div');
        cmdRow.className = 'term-line';
        cmdRow.innerHTML = `<span class="term-prompt">clemant@sjcet:~$</span> <span class="term-cmd">${escapeHTML(rawCmd)}</span>`;
        terminalOutput.appendChild(cmdRow);

        let responseHTML = '';
        if (terminalCommands[cmd]) {
            responseHTML = terminalCommands[cmd]();
        } else {
            responseHTML = `<span class="term-error">Command not recognized: '${escapeHTML(cmd)}'. Type <span class="term-highlight">'help'</span> for list of available commands.</span>`;
        }

        if (responseHTML !== null) {
            const respDiv = document.createElement('div');
            respDiv.className = 'term-line';
            respDiv.innerHTML = responseHTML;
            terminalOutput.appendChild(respDiv);
        }

        // Scroll terminal to bottom
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value;
                terminalInput.value = '';
                executeCommand(cmd);
            }
        });
    }

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) {
                if (terminalInput) terminalInput.value = '';
                executeCommand(cmd);
            }
        });
    });

    // ==========================================
    // 5. Skills Category Filter
    // ==========================================
    const filterButtons = document.querySelectorAll('.skills-filter-tabs .filter-btn');
    const skillCards = document.querySelectorAll('.skills-grid .skill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playCyberSound('beep');
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                }
            });
        });
    });

    // ==========================================
    // 6. Resume Modal & Print Functions
    // ==========================================
    const resumeModal = document.getElementById('resume-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const resumeModalBtnNav = document.getElementById('resume-modal-btn');
    const resumeHeroBtn = document.getElementById('open-resume-btn-hero');
    const resumeLightboxBtn = document.getElementById('open-resume-lightbox');
    const printResumeBtn = document.getElementById('print-resume-btn');

    function openResumeModal() {
        if (resumeModal) {
            resumeModal.classList.add('active');
            resumeModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            playCyberSound('beep');
        }
    }

    function closeResumeModal() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            resumeModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (resumeModalBtnNav) resumeModalBtnNav.addEventListener('click', openResumeModal);
    if (resumeHeroBtn) resumeHeroBtn.addEventListener('click', openResumeModal);
    if (resumeLightboxBtn) resumeLightboxBtn.addEventListener('click', openResumeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeResumeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeResumeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
            closeResumeModal();
        }
    });

    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            const printWin = window.open('assets/resume.jpg', '_blank');
            if (printWin) {
                printWin.focus();
                printWin.print();
            }
        });
    }

    // ==========================================
    // 7. Copy to Clipboard with Toast Notification
    // ==========================================
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'cyan') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-${type}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    playCyberSound('success');
                    showToast(`Copied to Clipboard: ${textToCopy}`, 'emerald');
                }).catch(() => {
                    showToast('Failed to copy', 'red');
                });
            }
        });
    });

    // ==========================================
    // 8. Contact Form Dispatch
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playCyberSound('success');

            const name = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const subject = document.getElementById('sender-subject').value;
            const message = document.getElementById('sender-message').value;

            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Encrypting & Transmitting...`;
            }

            setTimeout(() => {
                if (formFeedback) {
                    formFeedback.innerHTML = `<span class="term-emerald"><i class="fa-solid fa-check-double"></i> Transmission Confirmed! Thank you ${escapeHTML(name)}. I will reach back to ${escapeHTML(email)} shortly.</span>`;
                }
                showToast(`Transmission sent from ${name}`, 'emerald');
                contactForm.reset();

                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Transmit Message`;
                }
            }, 1200);
        });
    }

    // ==========================================
    // 9. Mobile Navbar & Scroll Spy
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            playCyberSound('beep');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar Scrolled Glass State & ScrollSpy
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) correspondingLink.classList.add('active');
            }
        });
    });
});
