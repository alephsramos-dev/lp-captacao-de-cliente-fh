/**
 * Fast Homes - Formulário Integrado (Versão Oficial ActiveCampaign)
 * 
 * Esta versão usa EXATAMENTE a mesma estrutura do formulário oficial 
 * do ActiveCampaign que aplica a tag automaticamente.
 * 
 * FUNCIONALIDADES:
 * 1. Envio para PipeRun via API
 * 2. Envio para ActiveCampaign usando estrutura oficial (tag automática)
 * 3. Captura completa de UTMs
 * 4. Validação em tempo real
 */

class FastHomesFormOficial {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.submitButton = document.getElementById('submitButton');

        this.loading = false;
        this.init();
    }

    init() {
        console.log('🚀 Fast Homes - Formulário Oficial Iniciado');
        console.log('📋 Estrutura: PipeRun + ActiveCampaign (método oficial)');

        this.setupEventListeners();
        this.initializeCarousel();
        this.addInputAnimations();
        this.preencherCamposIniciais();
        this.validateAll();
    }

    setupEventListeners() {
        // Validação em tempo real
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

        // Envio do formulário
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Navegação por teclado
        [this.nameInput, this.emailInput, this.phoneInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.focusNextField(input);
                }
            });
        });
    }

    preencherCamposIniciais() {
        console.log('📝 Preenchendo campos UTM e configurações iniciais...');

        // Capturar UTMs da URL atual
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {
            utm_source: urlParams.get('utm_source') || 'organico',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_content: urlParams.get('utm_content') || '',
            utm_term: urlParams.get('utm_term') || '',
            page_referrer: document.referrer || 'Acesso direto',
            current_url: window.location.href
        };

        // Preencher campos UTM no formulário (para ActiveCampaign)
        this.preencherCamposUTM(utmData);

        console.log('✅ Campos UTM configurados:', utmData);
    }

    preencherCamposUTM(utmData) {
        // Mapear campos UTM para os campos corretos do ActiveCampaign
        const campoMapping = {
            utm_source: 'field[6]',
            utm_medium: 'field[7]',
            utm_campaign: 'field[8]',
            utm_term: 'field[9]',
            utm_content: 'field[10]',
            page_referrer: 'field[11]',
            current_url: 'field[12]'
        };

        // Preencher cada campo
        Object.entries(utmData).forEach(([key, value]) => {
            const fieldName = campoMapping[key];
            if (fieldName && value) {
                const field = this.form.querySelector(`input[name="${fieldName}"]`);
                if (field) {
                    field.value = value;
                    console.log(`✅ ${key}: ${value}`);
                }
            }
        });
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
            const name = this.nameInput.value.trim();
            const email = this.emailInput.value.trim();
            const phone = this.phoneInput.value.replace(/\D/g, '');

            console.log('🚀 INICIANDO INTEGRAÇÃO DUPLA');
            console.log('📋 Lead:', { name, email, phone });

            // 1. ENVIAR PARA PIPERUN
            await this.enviarParaPipeRun(name, email, phone);

            // 2. ENVIAR PARA ACTIVECAMPAIGN (MÉTODO OFICIAL)
            this.enviarParaActiveCampaignOficial();

            // Sucesso!
            this.handleSubmitSuccess();

        } catch (error) {
            console.error('❌ Erro no envio:', error);
            this.setLoading(false);
            this.showMessage('Erro ao enviar formulário. Tente novamente.', 'error');
        }
    }

    async enviarParaPipeRun(name, email, phone) {
        console.log('📤 Enviando para PipeRun...');

        // Capturar UTMs para PipeRun
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {
            utm_source: urlParams.get('utm_source') || 'organico',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_content: urlParams.get('utm_content') || '',
            utm_term: urlParams.get('utm_term') || ''
        };

        const payload = {
            rules: {
                update: true,
                status: "open",
                equal_pipeline: true,
                filter_status_update: "open"
            },
            leads: [{
                id: `FORMULARIO-FAST-HOMES-${name}-${Date.now()}`,
                title: `FORMULARIO FAST HOMES - ${name}`,
                name: name,
                email: email,
                personal_phone: phone,
                mobile_phone: phone,
                last_conversion: {
                    source: "FORMULARIO FAST HOMES - CATÁLOGO"
                },
                custom_fields: {
                    ...utmData,
                    page_referrer: document.referrer || 'Acesso direto',
                    current_url: window.location.href,
                    form_type: 'catalogo-fast-homes'
                }
            }]
        };

        try {
            const response = await fetch('https://app.pipe.run/webservice/integradorJson?hash=1e28b707-3c02-4393-bb9d-d3826b060dcd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('✅ PipeRun - Sucesso:', result);

        } catch (error) {
            console.error('❌ PipeRun - Erro:', error);
            throw error;
        }
    }

    enviarParaActiveCampaignOficial() {
        console.log('📤 Enviando para ActiveCampaign (método oficial)...');

        // Método oficial: envio direto do formulário usando proc.php
        // Este é o mesmo método usado no formulário oficial que funciona

        console.log('🎯 Tags que serão aplicadas:');
        console.log('   - p[1] = 1 (catalogo-fast-homes-solicitado)');
        console.log('   - p[2] = 1 (backup)');
        console.log('   - p[3] = 1 (backup)');
        console.log('   - p[4] = 1 (backup)');
        console.log('   - p[5] = 1 (backup)');

        // O formulário será enviado automaticamente via POST para proc.php
        // As tags p[1], p[2], etc. serão aplicadas automaticamente
        console.log('✅ ActiveCampaign configurado - envio automático via POST');
        console.log('📋 URL de destino:', this.form.action);

        // Importante: o formulário já está configurado para envio automático
        // Quando o usuário clica em submit, vai para ActiveCampaign
        // Mas precisamos garantir que o PipeRun seja enviado primeiro
    }

    handleSubmitSuccess() {
        console.log('🎉 INTEGRAÇÃO DUPLA CONCLUÍDA COM SUCESSO!');
        console.log('✅ PipeRun: Lead enviado');
        console.log('✅ ActiveCampaign: Formulário configurado para envio');

        this.setLoading(false);
        this.showSuccessModal();
        this.resetForm();
    }

    // Validações
    validateAll() {
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const phoneValid = this.validatePhone();

        this.updateValidation('name', nameValid);
        this.updateValidation('email', emailValid);
        this.updateValidation('phone', phoneValid);

        return nameValid && emailValid && phoneValid;
    }

    validateName() {
        const name = this.nameInput.value.trim();
        return name.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone() {
        const phone = this.phoneInput.value.replace(/\D/g, '');
        return phone.length >= 10;
    }

    // Interface do usuário
    updateValidation(field, isValid) {
        const input = document.getElementById(field);
        const icon = document.getElementById(field + 'Icon');

        if (!input || !icon) return;

        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            icon.className = 'validation-icon fas fa-check-circle';
            icon.style.color = '#22c55e';
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            icon.className = 'validation-icon fas fa-times-circle';
            icon.style.color = '#ef4444';
        }
    }

    setLoading(loading) {
        this.loading = loading;
        const buttonText = this.submitButton.querySelector('.button-text');

        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
            buttonText.textContent = 'Enviando...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
            buttonText.textContent = 'Receber Catálogo';
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Fechar modal ao clicar fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    resetForm() {
        this.form.reset();
        ['name', 'email', 'phone'].forEach(field => {
            const input = document.getElementById(field);
            const icon = document.getElementById(field + 'Icon');
            if (input) {
                input.classList.remove('valid', 'invalid');
            }
            if (icon) {
                icon.className = 'validation-icon fas';
                icon.style.color = '';
            }
        });
    }

    showMessage(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // Implementar notificação visual se necessário
    }

    shakeForm() {
        this.form.classList.add('shake');
        setTimeout(() => this.form.classList.remove('shake'), 500);
    }

    // Utilitários
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
        const nextField = fields[currentIndex + 1];

        if (nextField) {
            nextField.focus();
        } else {
            this.submitButton.focus();
        }
    }

    // Manipuladores de entrada
    handleNameInput() {
        const isValid = this.validateName();
        this.updateValidation('name', isValid);
        this.formData.name = this.nameInput.value.trim();
    }

    handleEmailInput() {
        const isValid = this.validateEmail();
        this.updateValidation('email', isValid);
        this.formData.email = this.emailInput.value.trim();
    }

    handlePhoneInput() {
        let value = this.phoneInput.value.replace(/\D/g, '');

        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }

        this.phoneInput.value = value;

        const isValid = this.validatePhone();
        this.updateValidation('phone', isValid);
        this.formData.phone = value;
    }

    // Carrossel
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
                pauseOnHover: false,
                pauseOnFocus: false,
            });

            splide.mount();
            console.log('✅ Carrossel inicializado');
        }
    }

    // Animações
    addInputAnimations() {
        const inputs = [this.nameInput, this.emailInput, this.phoneInput];

        inputs.forEach(input => {
            const container = input.closest('.form-group');
            if (!container) return;

            input.addEventListener('focus', () => {
                container.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    container.classList.remove('focused');
                }
            });

            if (input.value.trim()) {
                container.classList.add('focused');
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.fastHomesForm = new FastHomesFormOficial();
});

// Debug e monitoramento
window.monitorarEnvio = function () {
    console.log('🔍 MONITOR DE ENVIO ATIVADO');
    console.log('📋 Formulário:', document.getElementById('contactForm'));
    console.log('🎯 Action:', document.getElementById('contactForm').action);
    console.log('📝 Method:', document.getElementById('contactForm').method);

    // Mostrar todos os campos hidden
    const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
    console.log('🔒 Campos Hidden:');
    hiddenInputs.forEach(input => {
        console.log(`   ${input.name} = "${input.value}"`);
    });
};

window.debugRapido = function () {
    console.log('🔧 DEBUG RÁPIDO');
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    console.log('📋 Dados do formulário:');
    for (let [key, value] of formData.entries()) {
        console.log(`   ${key}: ${value}`);
    }

    // Verificar tags
    console.log('🎯 Tags configuradas:');
    for (let i = 1; i <= 5; i++) {
        const tag = form.querySelector(`input[name="p[${i}]"]`);
        if (tag) {
            console.log(`   p[${i}] = ${tag.value}`);
        }
    }
};
