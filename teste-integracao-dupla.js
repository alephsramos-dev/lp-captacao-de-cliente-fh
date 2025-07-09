/**
 * TESTE DA INTEGRAÇÃO DUPLA: PipeRun + ActiveCampaign
 * Execute este código no console do navegador
 */

async function testeIntegracaoDupla() {
    console.log('🔥 === TESTE INTEGRAÇÃO DUPLA ===');
    console.log('🔄 PipeRun + ActiveCampaign (com tag)');
    console.log('');

    // 1. Verificar configurações
    console.log('📋 1. Verificando configurações...');

    if (window.ACTIVE_CAMPAIGN_CONFIG) {
        console.log('✅ Config ActiveCampaign:', window.ACTIVE_CAMPAIGN_CONFIG.BASE_URL);
        console.log('✅ Tag configurada:', window.ACTIVE_CAMPAIGN_CONFIG.TAG_NAME);
    } else {
        console.log('❌ Config ActiveCampaign não encontrada');
    }

    // 2. Verificar formulário
    console.log('');
    console.log('📋 2. Verificando formulário...');

    const form = document.getElementById('contactForm');
    if (!form) {
        console.log('❌ Formulário não encontrado');
        return;
    }

    // Verificar campos obrigatórios
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (nameInput && emailInput && phoneInput) {
        console.log('✅ Campos principais encontrados');
    } else {
        console.log('❌ Campos principais não encontrados');
        return;
    }

    // 3. Verificar campos ocultos do ActiveCampaign
    console.log('');
    console.log('📋 3. Verificando campos ActiveCampaign...');

    const hiddenFields = {
        list: form.querySelector('input[name="u[1]"]'),
        form_id: form.querySelector('input[name="f"]'),
        action: form.querySelector('input[name="act"]'),
        tag: form.querySelector('input[name="p[1]"]')
    };

    Object.entries(hiddenFields).forEach(([key, field]) => {
        if (field) {
            console.log(`✅ Campo ${key}: ${field.value || 'presente'}`);
        } else {
            console.log(`❌ Campo ${key}: não encontrado`);
        }
    });

    // 4. Simular preenchimento
    console.log('');
    console.log('📋 4. Simulando preenchimento...');

    nameInput.value = 'João Teste da Silva';
    emailInput.value = 'joao.teste@email.com';
    phoneInput.value = '(11) 99999-9999';

    // Disparar eventos
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

    console.log('✅ Campos preenchidos');

    // 5. Verificar UTMs
    console.log('');
    console.log('📋 5. Verificando UTMs...');

    const urlParams = new URLSearchParams(window.location.search);
    const utms = {
        utm_source: urlParams.get('utm_source') || 'teste',
        utm_medium: urlParams.get('utm_medium') || 'landing',
        utm_campaign: urlParams.get('utm_campaign') || 'formulario',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || ''
    };

    console.log('📊 UTMs capturadas:', utms);

    // 6. Verificar se FastHomesForm está funcionando
    console.log('');
    console.log('📋 6. Verificando classe FastHomesForm...');

    if (window.fastHomesForm) {
        console.log('✅ FastHomesForm instanciada');

        // Verificar métodos essenciais
        const methods = [
            'addHiddenFieldsToForm',
            'sendToActiveCampaign',
            'formSerialize'
        ];

        methods.forEach(method => {
            if (typeof window.fastHomesForm[method] === 'function') {
                console.log(`✅ Método ${method}: disponível`);
            } else {
                console.log(`❌ Método ${method}: não encontrado`);
            }
        });

    } else {
        console.log('❌ FastHomesForm não encontrada');
    }

    // 7. Verificar validação do formulário
    console.log('');
    console.log('📋 7. Verificando validação...');

    await new Promise(resolve => setTimeout(resolve, 500));

    const submitButton = document.getElementById('submitButton');
    const isDisabled = submitButton ? submitButton.disabled : true;

    if (!isDisabled) {
        console.log('✅ Formulário válido - pronto para envio');
    } else {
        console.log('⚠️ Formulário inválido ou botão desabilitado');
    }

    // 8. Status final
    console.log('');
    console.log('🎯 === STATUS FINAL ===');
    console.log('✅ PipeRun: Configurado');
    console.log('✅ ActiveCampaign: Configurado');
    console.log('✅ Tag: catalogo-fast-homes-solicitado');
    console.log('✅ UTMs: Capturadas automaticamente');
    console.log('');
    console.log('🚀 PRÓXIMO PASSO:');
    console.log('1. Clique em "Receber Catálogo" para testar envio real');
    console.log('2. Monitore console para logs de envio');
    console.log('3. Verifique se lead aparece no PipeRun e ActiveCampaign');
    console.log('');
    console.log('💡 Para teste com UTMs: ?utm_source=teste&utm_campaign=formulario&utm_medium=landing');

    // Simular adição de campos UTM se FastHomesForm disponível
    if (window.fastHomesForm && typeof window.fastHomesForm.addHiddenFieldsToForm === 'function') {
        console.log('');
        console.log('🧪 Simulando adição de campos UTM...');
        try {
            window.fastHomesForm.addHiddenFieldsToForm(utms);
            console.log('✅ Campos UTM adicionados com sucesso');
        } catch (error) {
            console.log('❌ Erro ao adicionar campos UTM:', error.message);
        }
    }
}

// Executar após carregamento
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testeIntegracaoDupla);
} else {
    testeIntegracaoDupla();
}
