const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const interactiveElements = document.querySelectorAll('a, button');
const anchorIcon = document.querySelector('.anchor-icon');
const abandonLink = document.querySelector('.abandon-link');
const heroLogo = document.querySelector('.hero-logo');
const waterArea = document.querySelector('.water-area');
const heroContent = document.querySelector('.hero-content');
const heroSection = document.querySelector('#hero');
const shipyardSection = document.querySelector('#shipyard');
const navLinks = document.querySelectorAll('.main-nav a');
const navStatusMessage = document.querySelector('.nav-status-message');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

const followSpeed = 0.15;

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
});

const animateRing = () => {
  ringX += (mouseX - ringX) * followSpeed;
  ringY += (mouseY - ringY) * followSpeed;
  ring.style.transform = `translate(${ringX - ring.offsetWidth / 2}px, ${ringY - ring.offsetHeight / 2}px)`;
  window.requestAnimationFrame(animateRing);
};

window.requestAnimationFrame(animateRing);

interactiveElements.forEach((element) => {
  element.addEventListener('mouseenter', () => {
    ring.classList.add('is-hovering');
  });

  element.addEventListener('mouseleave', () => {
    ring.classList.remove('is-hovering');
  });
});

if (abandonLink) {
  abandonLink.addEventListener('mouseenter', () => {
    abandonLink.classList.add('slanted');
  });

  abandonLink.addEventListener('mouseleave', () => {
    abandonLink.classList.remove('slanted');
  });
}

if (navLinks.length && navStatusMessage) {
  let navMessageTimeout;

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navStatusMessage.classList.remove('show');
      void navStatusMessage.offsetWidth;
      navStatusMessage.classList.add('show');
      window.clearTimeout(navMessageTimeout);
      navMessageTimeout = window.setTimeout(() => {
        navStatusMessage.classList.remove('show');
      }, 1400);
    });
  });
}

if (heroLogo) {
  let hoverCooldownTimeout;
  const roleTitles = ['Product Manager', 'Rapid Prototyper', 'Product Designer'];
  let roleTitleIndex = 0;

  heroLogo.addEventListener('animationend', (event) => {
    if (event.animationName !== 'logo-burst') return;
    heroLogo.classList.remove('bursting');
  });

  heroLogo.addEventListener('click', () => {
    heroLogo.classList.remove('bursting');
    heroLogo.classList.add('hover-cooldown');
    window.clearTimeout(hoverCooldownTimeout);
    hoverCooldownTimeout = window.setTimeout(() => {
      heroLogo.classList.remove('hover-cooldown');
    }, 1800);
    void heroLogo.offsetWidth;
    heroLogo.classList.add('bursting');

    window.setTimeout(() => {
      const roleText = document.createElement('span');
      const logoRect = heroLogo.getBoundingClientRect();
      roleText.className = 'logo-role-burst';
      roleText.textContent = roleTitles[roleTitleIndex];
      roleText.style.left = `${logoRect.left + logoRect.width / 2}px`;
      roleText.style.top = `${logoRect.top + logoRect.height * 0.5}px`;
      document.body.appendChild(roleText);
      roleTitleIndex = (roleTitleIndex + 1) % roleTitles.length;
      window.setTimeout(() => {
        roleText.remove();
      }, 1550);
    }, 560);

    window.setTimeout(() => {
      const logoRect = heroLogo.getBoundingClientRect();
      const centerX = logoRect.left + logoRect.width / 2;
      const centerY = logoRect.top + logoRect.height / 2;
      const starCount = 8;

      for (let i = 0; i < starCount; i += 1) {
        const star = document.createElement('img');
        star.src = './star.svg';
        star.alt = '';
        star.className = 'logo-star';

        const edge = Math.floor(Math.random() * 4);
        let targetX = 0;
        let targetY = 0;

        if (edge === 0) {
          targetX = Math.random() * window.innerWidth;
          targetY = -20;
        } else if (edge === 1) {
          targetX = window.innerWidth + 20;
          targetY = Math.random() * window.innerHeight;
        } else if (edge === 2) {
          targetX = Math.random() * window.innerWidth;
          targetY = window.innerHeight + 20;
        } else {
          targetX = -20;
          targetY = Math.random() * window.innerHeight;
        }

        const startX = centerX + (Math.random() * 50 - 25);
        const startY = centerY + (Math.random() * 50 - 25);
        const dx = targetX - startX;
        const dy = targetY - startY;
        const rot = `${Math.random() * 1080 - 540}deg`;

        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.setProperty('--dx', `${dx}px`);
        star.style.setProperty('--dy', `${dy}px`);
        star.style.setProperty('--rot', rot);

        document.body.appendChild(star);
        window.setTimeout(() => {
          star.remove();
        }, 1250);
      }
    }, 620);
  });
}

if (anchorIcon && waterArea && heroSection && shipyardSection) {
  let hasDropped = false;
  let heroInView = false;
  let shipyardInView = false;

  const dropAnchor = () => {
    if (hasDropped) return;
    hasDropped = true;
    anchorIcon.classList.remove('respawn');
    anchorIcon.classList.remove('dropping');
    void anchorIcon.offsetWidth;
    anchorIcon.classList.add('dropping');
    window.setTimeout(() => {
      waterArea.classList.remove('splashing');
      void waterArea.offsetWidth;
      waterArea.classList.add('splashing');
      window.setTimeout(() => {
        waterArea.classList.remove('splashing');
      }, 760);
    }, 980);
  };

  const respawnAnchor = () => {
    if (!hasDropped) return;
    hasDropped = false;
    anchorIcon.classList.remove('dropping');
    anchorIcon.classList.remove('respawn');
    void anchorIcon.offsetWidth;
    anchorIcon.classList.add('respawn');
  };

  const maybeRespawn = () => {
    if (heroInView && !shipyardInView) {
      respawnAnchor();
    }
  };

  const shipyardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        shipyardInView = entry.isIntersecting;
        if (shipyardInView) {
          dropAnchor();
        } else {
          maybeRespawn();
        }
      });
    },
    { threshold: 0.35 }
  );

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroInView = entry.isIntersecting;
        maybeRespawn();
      });
    },
    { threshold: 0.6 }
  );

  shipyardObserver.observe(shipyardSection);
  heroObserver.observe(heroSection);
}
