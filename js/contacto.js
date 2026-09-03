/**
 * FERRETERÍA EL TORNILLO - LÓGICA DE INTERACCIÓN Y VALIDACIÓN
 * Vanilla JS para sitio One-Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INICIALIZACIÓN DE ELEMENTOS
  const contactForm = document.getElementById('contact-form');
  const nombreInput = document.getElementById('nombre');
  const mensajeInput = document.getElementById('mensaje');
  const nombreError = document.getElementById('nombre-error');
  const mensajeError = document.getElementById('mensaje-error');
  const formAlert = document.getElementById('form-alert');
  
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const currentYearSpan = document.getElementById('current-year');

  // Actualizar año en pie de página
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. MENÚ RESPONSIVO MÓVIL
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. SECCIÓN ACTIVA EN DESPLAZAMIENTO (SCROLLSPY)
  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy);

  // 4. FUNCIONES DE VALIDACIÓN Y ALERTAS DEL FORMULARIO
  
  /**
   * Muestra un mensaje de alerta en la caja de notificación principal
   * @param {string} message - Texto a mostrar
   * @param {'error'|'success'} type - Tipo de alerta
   */
  const showAlert = (message, type = 'error') => {
    if (!formAlert) return;

    formAlert.removeAttribute('hidden');
    formAlert.className = `alert-box alert-${type}`;

    const iconSvg = type === 'error'
      ? `<svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

    formAlert.innerHTML = `${iconSvg} <span>${message}</span>`;
  };

  /**
   * Limpia la alerta global y errores visuales
   */
  const clearAlert = () => {
    if (formAlert) {
      formAlert.setAttribute('hidden', 'true');
      formAlert.innerHTML = '';
    }
  };

  /**
   * Muestra error especifico en un campo de texto
   */
  const setFieldError = (inputEl, errorEl, message) => {
    inputEl.classList.add('is-invalid');
    inputEl.classList.remove('is-valid');
    if (errorEl) {
      errorEl.removeAttribute('hidden');
      errorEl.textContent = message;
    }
  };

  /**
   * Limpia error especifico en un campo
   */
  const clearFieldError = (inputEl, errorEl) => {
    inputEl.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.setAttribute('hidden', 'true');
      errorEl.textContent = '';
    }
  };

  // Limpieza en tiempo real mientras el usuario escribe
  if (nombreInput) {
    nombreInput.addEventListener('input', () => {
      const nombreVal = nombreInput.value.trim();
      if (nombreVal.length >= 2) {
        clearFieldError(nombreInput, nombreError);
        nombreInput.classList.add('is-valid');
      } else {
        nombreInput.classList.remove('is-valid');
      }
    });
  }

  if (mensajeInput) {
    mensajeInput.addEventListener('input', () => {
      const mensajeVal = mensajeInput.value.trim();
      if (mensajeVal.length > 0) {
        clearFieldError(mensajeInput, mensajeError);
        mensajeInput.classList.add('is-valid');
      } else {
        mensajeInput.classList.remove('is-valid');
      }
    });
  }

  // 5. EVENTO DE ENVÍO DEL FORMULARIO
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert();

      const nombreVal = nombreInput.value.trim();
      const mensajeVal = mensajeInput.value.trim();
      let isValid = true;

      // RESTRICCIÓN PRINCIPAL: Validar que el nombre tenga al menos 2 caracteres
      if (nombreVal.length === 0) {
        isValid = false;
        setFieldError(nombreInput, nombreError, 'El nombre es obligatorio.');
        showAlert('Por favor, ingresa tu nombre antes de enviar el formulario.', 'error');
        nombreInput.focus();
      } else if (nombreVal.length < 2) {
        isValid = false;
        setFieldError(nombreInput, nombreError, 'El nombre debe tener al menos 2 caracteres.');
        showAlert('El nombre ingresado es muy corto. Debe tener al menos 2 caracteres.', 'error');
        nombreInput.focus();
      } else {
        clearFieldError(nombreInput, nombreError);
      }

      // Validar mensaje
      if (mensajeVal.length === 0) {
        if (isValid) {
          // Solo enfocar si el nombre ya pasó la validación
          showAlert('Por favor, escribe un mensaje con tu consulta.', 'error');
          mensajeInput.focus();
        }
        setFieldError(mensajeInput, mensajeError, 'El mensaje no puede estar vacío.');
        isValid = false;
      } else {
        clearFieldError(mensajeInput, mensajeError);
      }

      // SI TODO ES VÁLIDO: Mostrar éxito
      if (isValid) {
        showAlert(`¡Gracias por contactarnos, ${nombreVal}! Hemos recibido tu mensaje correctamente. Te responderemos pronto.`, 'success');
        
        // Limpiar campos del formulario y clases visuales
        contactForm.reset();
        nombreInput.classList.remove('is-valid', 'is-invalid');
        mensajeInput.classList.remove('is-valid', 'is-invalid');
      }
    });
  }
});
