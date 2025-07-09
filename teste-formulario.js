/**
 * Teste rápido do formulário Fast Homes
 * Execute no console do navegador
 */

async function testarFormulario() {
    console.log('🧪 Iniciando teste do formulário...');

    // Simular preenchimento do formulário
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (!nameInput || !emailInput || !phoneInput) {
        console.error('❌ Campos do formulário não encontrados');
        return;
    }

    // Dados de teste
    nameInput.value = 'João Silva Teste';
    emailInput.value = 'joao.teste@email.com';
    phoneInput.value = '(11) 99999-9999';

    // Disparar eventos para ativar validação
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Aguardar um pouco para validação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se formulário está válido
    const submitButton = document.getElementById('submitButton');
    const isDisabled = submitButton.disabled;

    console.log('📋 Status do formulário:');
    console.log('Nome:', nameInput.value);
    console.log('Email:', emailInput.value);
    console.log('Telefone:', phoneInput.value);
    console.log('Botão habilitado:', !isDisabled);

    if (!isDisabled) {
        console.log('✅ Formulário válido! Pronto para envio.');

        // Verificar se configuração está carregada
        if (window.ACTIVE_CAMPAIGN_CONFIG) {
            console.log('✅ Configuração do Active Campaign carregada');
            console.log('Base URL:', window.ACTIVE_CAMPAIGN_CONFIG.BASE_URL);
            console.log('Tag:', window.ACTIVE_CAMPAIGN_CONFIG.TAG_NAME);
        } else {
            console.log('❌ Configuração do Active Campaign não encontrada');
        }

        // Simular UTMs para teste
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('utm_source')) {
            console.log('💡 Para teste completo, acesse: http://localhost:8000?utm_source=teste&utm_campaign=formulario&utm_medium=landing');
        }

        console.log('🚀 Para testar envio real, clique no botão "Baixar Catálogo"');

    } else {
        console.log('❌ Formulário inválido - verifique os campos');
    }
}

// Verificar se página carregou
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testarFormulario);
} else {
    testarFormulario();
}
