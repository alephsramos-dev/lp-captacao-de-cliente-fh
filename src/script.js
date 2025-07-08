/**
 * Fast Homes - High Ticket Landing Page JavaScript
 * Formulário de captação de leads com validação em tempo real e redirecionamento para catálogo
 */

class FastHomesForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.submitButton = document.getElementById('submitButton');

        this.loading = false;
        this.catalogUrl = '/catalogo-de-casas.pdf'; // Configure o caminho do seu catálogo aqui

        this.formData = {
            name: '',
            email: '',
            phone: ''
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCarousel();
        this.addInputAnimations();
        this.validateAll();
        console.log('Fast Homes High Ticket Form initialized');
    }

    setupEventListeners() {
        // Form validation listeners with debouncing for better performance
        this.nameInput.addEventListener('input', this.debounce(() => this.handleNameInput(), 300));
        this.nameInput.addEventListener('blur', () => this.validateName());

        this.emailInput.addEventListener('input', this.debounce(() => this.handleEmailInput(), 300));
        this.emailInput.addEventListener('blur', () => this.validateEmail());

        this.phoneInput.addEventListener('input', () => this.handlePhoneInput());
        this.phoneInput.addEventListener('blur', () => this.validatePhone());

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Enhanced keyboard navigation
        [this.nameInput, this.emailInput, this.phoneInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.focusNextField(input);
                }
            });
        });
    }

    initializeCarousel() {
        if (typeof Splide !== 'undefined') {
            const splide = new Splide('#background-splide', {
                type: 'loop',
                perPage: 1,
                autoplay: true,
                interval: 6000,
                speed: 2500,
                arrows: false,
                pagination: false,
                drag: false,
                keyboard: false,
                rewind: false,
                pauseOnHover: false,
                pauseOnFocus: false,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            });

            splide.mount();
            console.log('Background carousel initialized with enhanced settings');
        }
    }

    addInputAnimations() {
        // Add staggered animations to form elements
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.animationDelay = `${0.6 + (index * 0.1)}s`;
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    focusNextField(currentInput) {
        const fields = [this.nameInput, this.emailInput, this.phoneInput];
        const currentIndex = fields.indexOf(currentInput);

        if (currentIndex >= 0 && currentIndex < fields.length - 1) {
            fields[currentIndex + 1].focus();
        } else if (currentIndex === fields.length - 1) {
            this.submitButton.focus();
        }
    }

    handleNameInput() {
        const value = this.nameInput.value;
        this.formData.name = value;

        if (value.length > 0) {
            this.validateName();
        } else {
            this.clearValidation('name');
        }
    }

    handleEmailInput() {
        const value = this.emailInput.value;
        this.formData.email = value;

        if (value.length > 0) {
            this.validateEmail();
        } else {
            this.clearValidation('email');
        }
    }

    handlePhoneInput() {
        const value = this.phoneInput.value;

        const formattedPhone = this.formatPhoneNumber(value);
        this.phoneInput.value = formattedPhone;
        this.formData.phone = formattedPhone;

        if (value.length > 0) {
            this.validatePhone();
        } else {
            this.clearValidation('phone');
        }
    }

    formatPhoneNumber(value) {
        let phone = value.replace(/\D/g, '');
        phone = phone.substring(0, 11);

        if (phone.length >= 11) {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (phone.length >= 10) {
            return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (phone.length >= 6) {
            return phone.replace(/(\d{2})(\d{4})/, '($1) $2');
        } else if (phone.length >= 2) {
            return phone.replace(/(\d{2})/, '($1) ');
        }

        return phone;
    }

    validateName() {
        const name = this.nameInput.value.trim();
        const isValid = name.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);

        this.updateValidation('name', isValid);
        return isValid;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email) && email.length <= 254;

        this.updateValidation('email', isValid);
        return isValid;
    }

    validatePhone() {
        const phone = this.phoneInput.value;
        const cleanPhone = phone.replace(/\D/g, '');

        // Validate Brazilian mobile phone (11 digits)
        const isValid = cleanPhone.length === 11 && /^[1-9]{2}9[0-9]{8}$/.test(cleanPhone);

        this.updateValidation('phone', isValid);
        return isValid;
    }

    updateValidation(field, isValid) {
        const input = document.getElementById(field);
        const icon = document.getElementById(field + 'Icon');

        input.classList.remove('valid', 'invalid');
        icon.classList.remove('fa-check', 'fa-times', 'valid', 'invalid');

        if (input.value.trim() !== '') {
            if (isValid) {
                input.classList.add('valid');
                icon.classList.add('fa-check', 'valid');
            } else {
                input.classList.add('invalid');
                icon.classList.add('fa-times', 'invalid');
            }
        }

        this.updateSubmitButton();
    }

    clearValidation(field) {
        const input = document.getElementById(field);
        const icon = document.getElementById(field + 'Icon');

        input.classList.remove('valid', 'invalid');
        icon.classList.remove('fa-check', 'fa-times', 'valid', 'invalid');

        this.updateSubmitButton();
    }

    validateAll() {
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const phoneValid = this.validatePhone();

        return nameValid && emailValid && phoneValid;
    }

    updateSubmitButton() {
        const isFormValid = this.validateAll();
        this.submitButton.disabled = !isFormValid || this.loading;

        if (isFormValid && !this.loading) {
            this.submitButton.classList.add('ready');
        } else {
            this.submitButton.classList.remove('ready');
        }
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_content: urlParams.get('utm_content') || '',
            utm_term: urlParams.get('utm_term') || '',
        };
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || 'Direct access'
        };
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateAll()) {
            this.showMessage("Por favor, preencha todos os campos corretamente.", 'error');
            this.shakeForm();
            return;
        }

        this.setLoading(true);

        try {
            const formData = this.prepareFormData();
            const response = await this.submitToAPI(formData);

            if (response.success) {
                this.handleSubmitSuccess();
            } else {
                throw new Error(response.message || 'Erro na submissão');
            }

        } catch (error) {
            console.error('Submit error:', error);
            this.handleSubmitError(error);
        } finally {
            this.setLoading(false);
        }
    }

    prepareFormData() {
        const name = this.nameInput.value.trim();
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.replace(/\D/g, '');

        const utms = this.getUTMParameters();
        const deviceInfo = this.getDeviceInfo();
        const interesse = `Interesse: ${window.location.pathname} - High Ticket Lead`;

        return {
            rules: {
                update: "false",
                filter_status_update: "open",
                equal_pipeline: "true",
                status: "open",
                validate_cpf: "false",
            },
            leads: [{
                id: `FORMULARIO FOLDER - FAST HOMES - ${name} - ${this.generateUniqueId()}`,
                user: name,
                email: email,
                name: name,
                personal_phone: phone,
                mobile_phone: phone,
                last_conversion: {
                    source: "FORMULARIO - FAST HOMES - FOLDER",
                },
                custom_fields: {
                    uniqueId: this.generateUniqueId(),
                    utm_source: utms.utm_source,
                    utm_medium: utms.utm_medium,
                    utm_campaign: utms.utm_campaign,
                    utm_content: utms.utm_content,
                    utm_term: utms.utm_term,
                    page_referrer: document.referrer || "Acesso direto",
                    current_url: window.location.href,
                    device_info: JSON.stringify(deviceInfo),
                },
                notas: {
                    interesse: interesse,
                    observacoes: `Lead veio do Folder da Fast Homes capturado via página de captação de Leads em ${new Date().toLocaleString('pt-BR')}`,
                    fonte: "Página de Captação de Leads - Fast Homes - ASR"
                }
            }]
        };
    }

    async submitToAPI(payload) {
        const response = await fetch('https://app.pipe.run/webservice/integradorJson?hash=1e28b707-3c02-4393-bb9d-d3826b060dcd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        return { success: true, data };
    }

    handleSubmitSuccess() {
        this.showMessage('Dados enviados com sucesso! Redirecionando para o catálogo...', 'success');

        // Track conversion
        this.trackConversion();

        // Reset form with animation
        this.resetFormWithAnimation();

        // Redirect to catalog after 2 seconds
        setTimeout(() => {
            this.redirectToCatalog();
        }, 2000);
    }

    handleSubmitError(error) {
        console.error('Submission error:', error);
        this.showMessage('Houve um erro ao enviar o formulário. Tente novamente em alguns instantes.', 'error');
        this.shakeForm();
    }

    resetFormWithAnimation() {
        // Add exit animation to form elements
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.style.animation = 'fadeOutUp 0.3s ease-out forwards';
            }, index * 100);
        });

        // Reset form data
        setTimeout(() => {
            this.form.reset();
            this.formData = { name: '', email: '', phone: '' };

            // Clear validations
            ['name', 'email', 'phone'].forEach(field => this.clearValidation(field));

            // Re-animate form elements
            formGroups.forEach((group, index) => {
                group.style.animation = `fadeInUp 0.6s ease-out ${0.6 + (index * 0.1)}s both`;
            });
        }, 800);
    }

    redirectToCatalog() {
        // Track catalog access
        this.trackCatalogAccess();

        // Open catalog in new window/tab
        window.open(this.catalogUrl, '_blank');

        // Show confirmation message
        this.showMessage('Catálogo aberto! Verifique a nova aba do seu navegador.', 'success');
    }

    shakeForm() {
        const container = document.querySelector('.form-container');
        container.style.animation = 'shakeX 0.6s ease-out';

        setTimeout(() => {
            container.style.animation = '';
        }, 600);
    }

    trackConversion() {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                'value': 1.0,
                'currency': 'BRL',
                'event_category': 'High Ticket Lead',
                'event_label': 'Form Submission'
            });
        }

        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_category: 'High Ticket',
                content_name: 'Fast Homes Catalog Request'
            });
        }

        console.log('High ticket conversion tracked');
    }

    trackCatalogAccess() {
        // Track catalog download/access
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'engagement',
                'event_label': 'catalogo-premium-pdf',
                'value': 1
            });
        }

        console.log('Catalog access tracked');
    }

    setLoading(loading) {
        this.loading = loading;

        if (loading) {
            this.submitButton.innerHTML = '<span class="spinner"></span><span class="button-text">Enviando...</span>';
            this.submitButton.disabled = true;
            this.submitButton.style.pointerEvents = 'none';
        } else {
            this.submitButton.innerHTML = '<span class="button-text">Acessar catálogo exclusivo</span><i class="button-icon fas fa-arrow-right"></i>';
            this.submitButton.disabled = !this.validateAll();
            this.submitButton.style.pointerEvents = 'auto';
        }
    }

    showMessage(text, type = 'info') {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;

        this.form.insertBefore(message, this.form.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'fadeOutUp 0.3s ease-out forwards';
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
    }
}

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes fadeOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes shakeX {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .submit-button.ready {
        background: linear-gradient(135deg, var(--accent-color), #f59e0b);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check for required dependencies
    if (typeof Splide === 'undefined') {
        console.warn('Splide library not loaded - carousel will not work');
    }

    // Initialize form
    window.fastHomesForm = new FastHomesForm();

    // Add device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }

    console.log(`Fast Homes High Ticket Landing Page loaded successfully`);
});
