document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksContainer.classList.toggle('active');
      
      // Update hamburger icon between menu and x
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navLinksContainer.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons(); // re-render icon
      }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target)) {
        if (navLinksContainer.classList.contains('active')) {
          navLinksContainer.classList.remove('active');
          const icon = navToggle.querySelector('i');
          if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
          }
        }
      }
    });
  }

  // ==========================================================================
  // STICKY HEADER SCROLL STATE
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial run on load

  // ==========================================================================
  // ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  
  const activeNavOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger active state when section takes up middle of page
    threshold: 0
  };

  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, activeNavOptions);

  sections.forEach(section => {
    activeNavObserver.observe(section);
  });

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS (TASTEFUL)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .scale-reveal');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before the element enters the viewport
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // If there are counter/glance numbers inside this section, animate them at 60fps
        const counters = entry.target.querySelectorAll('.counter, .glance-number');
        if (counters.length > 0) {
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const duration = 1500; // ms
            const increment = target / (duration / 16); // ~60fps step
            
            const updateCount = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = target;
              }
            };
            requestAnimationFrame(updateCount);
          });
        }
        
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // CONTACT FORM INTERACTIVE FEEDBACK
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Clear previous feedback states
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
      
      // Inputs value verification
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      
      if (!name || !email || !subject || !message) {
        formFeedback.classList.add('error');
        formFeedback.textContent = 'Please fill out all fields before sending.';
        return;
      }
      
      // Simulate form sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message <span style="display:inline-block;animation:spin 1s linear infinite;">↻</span>';
      
      setTimeout(() => {
        // Success state simulation
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        formFeedback.classList.add('success');
        formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. Aditya will connect with you soon.`;
        
        // Reset form inputs
        contactForm.reset();
        
        // Clear success message after 7 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
          setTimeout(() => {
            formFeedback.className = 'form-feedback';
            formFeedback.style.display = '';
            formFeedback.textContent = '';
          }, 300);
        }, 7000);
        
      }, 1500);
    });
  }
});

// Adding spin animation dynamically for form sending icon fallback
const spinStyle = document.createElement('style');
spinStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinStyle);
