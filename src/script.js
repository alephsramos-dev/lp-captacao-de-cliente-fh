/**
 * Fast Homes - High Ticket Landing Page JavaScript
 * Formulário de captação de leads com validação em tempo real
 * Integração tripla: PipeRun + ActiveCampaign + Google Apps Script
 */

// Configuração dos campos do ActiveCampaign (mapeamento para envio via proc.php)
// Usar a configuração global do config.js
const form_fields = window.AC_FIELD_MAPPING || {
    utm_source: 'u[6]',      // Campo UTM Source no AC
    utm_medium: 'u[7]',      // Campo UTM Medium no AC  
    utm_campaign: 'u[8]',    // Campo UTM Campaign no AC
    utm_content: 'u[10]',    // Campo UTM Content no AC
    utm_term: 'u[9]',        // Campo UTM Term no AC
    page_referrer: 'u[11]'   // Campo Page Referrer no AC (se houver)
};

class FastHomesForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.submitButton = document.getElementById('submitButton');

        this.loading = false;
        this.catalogUrl = '/catalogo-de-casas.pdf';

        this.formData = {
            name: '',
            email: '',
            phone: ''
        };

        this.init();
        this.setupActiveCampaignCallback();
    }

    init() {
        this.setupEventListeners();
        this.initializeCarousel();
        this.addInputAnimations();
        this.validateAll();
        console.log('Fast Homes High Ticket Form initialized');
        console.log("***** Integração TRIPLA: PipeRun + ActiveCampaign (via servidor Node.js) + Google Apps Script ***********");
        console.log("🔗 ActiveCampaign: Usando servidor Node.js em fasthomesac.fastsistemasconstrutivos.com.br");
        console.log("🏷️ Tag automática: catalogo-fast-homes-solicitado");
    }

    setupActiveCampaignCallback() {
        // Interceptar callback do ActiveCampaign para confirmação
        const _origShowThankYou = window._show_thank_you;
        window._show_thank_you = function (id, message, trackcmp_url, email) {
            console.log("✅ ActiveCampaign callback disparado:", { id, message, email });
            return _origShowThankYou && _origShowThankYou.apply(this, arguments);
        };
    }

    setupEventListeners() {
        // Form validation listeners with debouncing for better performance
        this.nameInput.addEventListener('input', this.debounce(() => this.handleNameInput(), 300));
        this.nameInput.addEventListener('blur', () => {
            const isValid = this.validateName();
            this.updateValidation('name', isValid);
        });

        this.emailInput.addEventListener('input', this.debounce(() => this.handleEmailInput(), 300));
        this.emailInput.addEventListener('blur', () => {
            const isValid = this.validateEmail();
            this.updateValidation('email', isValid);
        });

        this.phoneInput.addEventListener('input', () => this.handlePhoneInput());
        this.phoneInput.addEventListener('blur', () => {
            const isValid = this.validatePhone();
            this.updateValidation('phone', isValid);
        });

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
            const isValid = this.validateName();
            this.updateValidation('name', isValid);
        } else {
            this.clearValidation('name');
        }
    }

    handleEmailInput() {
        const value = this.emailInput.value;
        this.formData.email = value;

        if (value.length > 0) {
            const isValid = this.validateEmail();
            this.updateValidation('email', isValid);
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
            const isValid = this.validatePhone();
            this.updateValidation('phone', isValid);
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

        return isValid;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email) && email.length <= 254;

        return isValid;
    }

    validatePhone() {
        const phone = this.phoneInput.value;
        const cleanPhone = phone.replace(/\D/g, '');

        // Validate Brazilian mobile phone (11 digits)
        const isValid = cleanPhone.length === 11 && /^[1-9]{2}9[0-9]{8}$/.test(cleanPhone);

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
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const phoneValid = this.validatePhone();
        const isFormValid = nameValid && emailValid && phoneValid;

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
            // Preparar dados básicos
            const name = this.nameInput.value.trim();
            const email = this.emailInput.value.trim();
            const phone = this.phoneInput.value.replace(/\D/g, '');

            // Capturar UTMs da URL
            const p = new URLSearchParams(window.location.search);
            const utm_source = p.get("utm_source") || "organico";
            const utm_medium = p.get("utm_medium") || "";
            const utm_campaign = p.get("utm_campaign") || "";
            const utm_content = p.get("utm_content") || "";
            const utm_term = p.get("utm_term") || "";
            const page_referrer = window.location.href;

            // Adicionar campos UTM como campos ocultos no formulário (para ActiveCampaign)
            this.addHiddenFieldsToForm({
                utm_source, utm_medium, utm_campaign, utm_content, utm_term, page_referrer
            });

            // 1. ENVIAR PARA PIPERUN
            const lead = {
                id: `FORMULARIO - FAST-HOMES - ${name}`,
                title: `FORMULARIO - FAST-HOMES - ${name}`,
                company: "",
                name,
                email,
                tel: phone,
                personal_phone: phone,
                last_conversion: { source: "FORMULARIO - FAST-HOMES" },
                custom_fields: { utm_source, utm_medium, utm_campaign, utm_content, utm_term, page_referrer }
            };

            const payload = {
                rules: {
                    update: true,
                    status: "open",
                    equal_pipeline: true,
                    filter_status_update: "open"
                },
                leads: [lead]
            };

            console.log("📤 Enviando dados para PipeRun:", payload);

            await fetch("https://app.pipe.run/webservice/integradorJson?hash=1e28b707-3c02-4393-bb9d-d3826b060dcd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(res => res.json().then(data => {
                    console.log("✅ Lead enviado com sucesso ao PipeRun!", data);
                }))
                .catch(err => {
                    console.error("❌ Erro ao enviar PipeRun:", err);
                    throw err;
                });

            // 2. ENVIAR PARA ACTIVECAMPAIGN (via servidor backend com tag 'catalogo-fast-homes-solicitado')
            await this.sendToActiveCampaignWithTag();

            // 3. ENVIAR PARA GOOGLE APPS SCRIPT
            this.sendToGoogleScript(name, email, phone, utm_source, utm_medium, utm_campaign, utm_content, utm_term);

            // Sucesso!
            this.handleSubmitSuccess();

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

    addHiddenFieldsToForm(utmData) {
        // Adicionar campos UTM como campos ocultos no formulário (para ActiveCampaign)
        Object.entries(utmData).forEach(([key, value]) => {
            const fieldName = form_fields[key];
            if (fieldName && value) {
                let input = this.form.querySelector(`input[name="${fieldName}"]`);
                if (input) {
                    input.value = value;
                } else {
                    input = document.createElement("input");
                    input.type = "hidden";
                    input.name = fieldName;
                    input.value = value;
                    this.form.appendChild(input);
                }
            }
        });

        // Adicionar campos essenciais do ActiveCampaign se não existirem
        const config = window.ACTIVE_CAMPAIGN_CONFIG;
        const essentialFields = {
            'f': config.FORM_CONFIG.FORM_ID,    // Form ID
            's': config.FORM_CONFIG.LIST_ID,    // List ID  
            'c': config.FORM_CONFIG.VERSION,    // Version
            'm': config.FORM_CONFIG.LIST_ID,    // List ID (duplicated for compatibility)
            'act': config.FORM_CONFIG.ACTION,   // Action
            'v': config.FORM_CONFIG.VERSION,    // Version (duplicated)
            'or': window.location.href,         // Origin URL
            'tags[]': config.TAG_NAME           // Tag a ser aplicada
        };

        Object.entries(essentialFields).forEach(([fieldName, value]) => {
            if (value !== null && value !== undefined) {
                let input = this.form.querySelector(`input[name="${fieldName}"]`);
                if (!input) {
                    input = document.createElement("input");
                    input.type = "hidden";
                    input.name = fieldName;
                    input.value = value;
                    this.form.appendChild(input);
                    console.log(`✅ Campo AC adicionado: ${fieldName} = ${value}`);
                }
            }
        });

        console.log("📋 Campos do formulário preparados para ActiveCampaign");
    }

    async sendToActiveCampaignWithTag() {
        console.log("🔄 Enviando para ActiveCampaign via servidor Node.js...");

        try {
            // Preparar dados do contato
            const name = this.nameInput.value.trim();
            const email = this.emailInput.value.trim();
            const phone = this.phoneInput.value.replace(/\D/g, '');

            // Capturar UTMs da URL
            const p = new URLSearchParams(window.location.search);
            const utm_source = p.get("utm_source") || "organico";
            const utm_medium = p.get("utm_medium") || "";
            const utm_campaign = p.get("utm_campaign") || "";
            const utm_content = p.get("utm_content") || "";
            const utm_term = p.get("utm_term") || "";

            // Dados para envio ao servidor backend Node.js
            const contactData = {
                name: name,  // Enviando nome completo como esperado pelo backend
                email: email,
                phone: phone,
                utm_source: utm_source,
                utm_medium: utm_medium,
                utm_campaign: utm_campaign,
                utm_content: utm_content,
                utm_term: utm_term,
                page_referrer: document.referrer || 'Direct access'
            };

            console.log("📤 Enviando dados para servidor Node.js:", contactData);

            // Enviar para o servidor backend Node.js
            const response = await fetch('https://fasthomesac.fastsistemasconstrutivos.com.br/api/activecampaign-with-tag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ ActiveCampaign: ${result.message}`);
                console.log(`👤 Email: ${email} - Tag aplicada: ${result.tag?.applied ? 'SIM' : 'NÃO'}`);
                if (result.contact?.id) {
                    console.log(`🆔 ID do contato: ${result.contact.id}`);
                }
                if (result.tag?.id) {
                    console.log(`🏷️ ID da tag: ${result.tag.id} (${result.tag.name})`);
                }
            } else {
                console.warn(`⚠️ Aviso do servidor: ${result.message || result.error || 'Resposta inesperada'}`);
            }

        } catch (error) {
            console.error("❌ Erro ao enviar para ActiveCampaign via servidor backend:", error);
            
            // Fallback: tentar método proc.php como backup
            console.log("� Tentando método de fallback (proc.php)...");
            this.sendToActiveCampaignFallback();
        }
    }



    formSerialize(form) {
        if (!form || form.nodeName !== "FORM") return "";
        const q = [];
        for (let elem of form.elements) {
            if (!elem.name) continue;
            const name = encodeURIComponent(elem.name);
            let value = "";
            switch (elem.nodeName) {
                case "INPUT":
                    if ((elem.type === "checkbox" || elem.type === "radio") && !elem.checked) continue;
                    value = encodeURIComponent(elem.value);
                    break;
                case "TEXTAREA":
                    value = encodeURIComponent(elem.value);
                    break;
                case "SELECT":
                    if (elem.type === "select-multiple") {
                        for (let o of elem.options) {
                            if (o.selected) q.push(name + "=" + encodeURIComponent(o.value));
                        }
                        continue;
                    } else {
                        value = encodeURIComponent(elem.value);
                    }
                    break;
                default: continue;
            }
            q.push(name + "=" + value);
        }
        return q.join("&");
    }

    sendToGoogleScript(name, email, phone, utm_source, utm_medium, utm_campaign, utm_content, utm_term) {
        const base = "https://script.google.com/macros/s/AKfycbxgi3ql1nqW5tKc8pc-GrRYGBQBeyk4YXtpMMZFRfMam4a1v_SrjmssIQ-UcmR1-VkQew/exec";
        const params = new URLSearchParams();
        params.append("utm_source", utm_source || "");
        params.append("utm_medium", utm_medium || "");
        params.append("utm_campaign", utm_campaign || "");
        params.append("utm_content", utm_content || "");
        params.append("utm_term", utm_term || "");
        params.append("Nome", name || "");
        params.append("Email", email || "");
        params.append("Telefone", phone || "");
        params.append("Page_Path", window.location.pathname);
        params.append("Page_URL", window.location.href);

        const url = `${base}?${params.toString()}`;
        console.log("📤 Enviando dados para Google Apps Script (beacon):", url);

        const img = new Image();
        img.src = url;
    }

    handleSubmitSuccess() {
        this.showMessage('Dados enviados com sucesso!', 'success');

        // Track conversion
        this.trackConversion();

        // Reset form with animation
        this.resetFormWithAnimation();

        // Show success modal instead of redirecting
        setTimeout(() => {
            this.showSuccessModal();
        }, 1000);
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

    // redirectToCatalog() {
    //     // Track catalog access
    //     this.trackCatalogAccess();

    //     // Open catalog in new window/tab
    //     window.open(this.catalogUrl, '_blank');

    //     // Show confirmation message
    //     this.showMessage('Catálogo aberto! Verifique a nova aba do seu navegador.', 'success');
    // }

    // Modal methods
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('show');

            // Focus management for accessibility
            const closeBtn = modal.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.focus();
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Add escape key listener
            this.escapeKeyListener = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            };
            document.addEventListener('keydown', this.escapeKeyListener);
        }
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('show');

            // Restore body scroll
            document.body.style.overflow = '';

            // Remove escape key listener
            if (this.escapeKeyListener) {
                document.removeEventListener('keydown', this.escapeKeyListener);
                this.escapeKeyListener = null;
            }
        }
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

    // trackCatalogAccess() {
    //     // Track catalog download/access
    //     if (typeof gtag !== 'undefined') {
    //         gtag('event', 'download', {
    //             'event_category': 'engagement',
    //             'event_label': 'catalogo-premium-pdf',
    //             'value': 1
    //         });
    //     }

    //     console.log('Catalog access tracked');
    // }

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

    sendToActiveCampaignFallback() {
        console.log("🔄 Usando método de fallback (proc.php) para ActiveCampaign...");
        
        // Adicionar campos necessários ao formulário
        const config = window.ACTIVE_CAMPAIGN_CONFIG;
        
        // Capturar UTMs da URL
        const p = new URLSearchParams(window.location.search);
        const utmData = {
            utm_source: p.get("utm_source") || "organico",
            utm_medium: p.get("utm_medium") || "",
            utm_campaign: p.get("utm_campaign") || "",
            utm_content: p.get("utm_content") || "",
            utm_term: p.get("utm_term") || "",
            page_referrer: document.referrer || window.location.href
        };

        // Adicionar campos UTM como campos ocultos no formulário
        this.addHiddenFieldsToForm(utmData);

        // Usar o método proc.php como fallback
        const serialized = this.formSerialize(this.form).replace(/%0A/g, "\\n");
        const url = "https://fastdrywall80017.activehosted.com/proc.php?" + serialized + "&jsonp=true";

        console.log("📤 Fallback: Enviando dados para ActiveCampaign proc.php:", url);

        if (typeof window._load_script === "function") {
            window._load_script(url, null, true);
            console.log("✅ ActiveCampaign fallback: Usando _load_script nativo");
        } else {
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            script.onload = () => {
                console.log("✅ ActiveCampaign fallback: Script proc.php carregado com sucesso");
            };
            script.onerror = (error) => {
                console.error("❌ ActiveCampaign fallback: Falha ao carregar script proc.php");
            };
            document.head.appendChild(script);
        }
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

// Global function to close modal (called from HTML)
function closeModal() {
    if (window.fastHomesForm) {
        window.fastHomesForm.closeModal();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('successModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});
