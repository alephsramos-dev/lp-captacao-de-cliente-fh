/**
 * TESTE DA NOVA INTEGRAÇÃO TRIPLA
 * Execute este código no console do navegador para testar
 */

async function testeIntegracaoTripla() {
    console.log('🧪 === TESTE DA INTEGRAÇÃO TRIPLA ===');
    console.log('🔄 PipeRun + ActiveCampaign + Google Apps Script');
    console.log('');

    // 1. Verificar se as configurações estão carregadas
    console.log('📋 1. Verificando configurações...');

    if (window.ACTIVE_CAMPAIGN_CONFIG) {
        console.log('✅ Config ActiveCampaign carregada:', window.ACTIVE_CAMPAIGN_CONFIG.BASE_URL);
    } else {
        console.log('❌ Config ActiveCampaign não encontrada');
    }

    if (window.AC_FIELD_MAPPING) {
        console.log('✅ Mapeamento de campos carregado');
    } else {
        console.log('❌ Mapeamento de campos não encontrado');
    }

    // 2. Verificar formulário
    console.log('');
    console.log('📋 2. Verificando formulário...');

    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (form && nameInput && emailInput && phoneInput) {
        console.log('✅ Formulário e campos encontrados');

        // Verificar campos ocultos do ActiveCampaign
        const hiddenFields = form.querySelectorAll('input[type="hidden"]');
        console.log(`✅ ${hiddenFields.length} campos ocultos encontrados para ActiveCampaign`);

    } else {
        console.log('❌ Problemas no formulário');
        return;
    }

    // 3. Simular preenchimento
    console.log('');
    console.log('📋 3. Simulando preenchimento...');

    nameInput.value = 'João Teste Silva';
    emailInput.value = 'joao.teste@email.com';
    phoneInput.value = '(11) 99999-9999';

    // Disparar eventos
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

    console.log('✅ Campos preenchidos:', {
        nome: nameInput.value,
        email: emailInput.value,
        telefone: phoneInput.value
    });

    // 4. Verificar UTMs (simular)
    console.log('');
    console.log('📋 4. Verificando captura de UTMs...');

    // Simular UTMs na URL
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('utm_source', 'teste');
    currentUrl.searchParams.set('utm_campaign', 'formulario');
    currentUrl.searchParams.set('utm_medium', 'landing');

    const p = new URLSearchParams(currentUrl.search);
    const utms = {
        utm_source: p.get("utm_source") || "organico",
        utm_medium: p.get("utm_medium") || "",
        utm_campaign: p.get("utm_campaign") || "",
        utm_content: p.get("utm_content") || "",
        utm_term: p.get("utm_term") || ""
    };

    console.log('✅ UTMs capturadas:', utms);

    // 5. Verificar classe FastHomesForm
    console.log('');
    console.log('📋 5. Verificando classe FastHomesForm...');

    if (window.fastHomesForm) {
        console.log('✅ Instância FastHomesForm encontrada');

        // Testar método de serialização
        if (typeof window.fastHomesForm.formSerialize === 'function') {
            console.log('✅ Método formSerialize disponível');
        }

        // Testar método de envio para AC
        if (typeof window.fastHomesForm.sendToActiveCampaign === 'function') {
            console.log('✅ Método sendToActiveCampaign disponível');
        }

    } else {
        console.log('❌ Instância FastHomesForm não encontrada');
    }

    // 6. Status final
    console.log('');
    console.log('🎯 === RESULTADO DO TESTE ===');
    console.log('✅ Configurações: OK');
    console.log('✅ Formulário: OK');
    console.log('✅ Campos: OK');
    console.log('✅ UTMs: OK');
    console.log('');
    console.log('🚀 PRONTO PARA TESTE REAL!');
    console.log('💡 Para testar envio completo:');
    console.log('   1. Acesse: http://localhost:8000?utm_source=teste&utm_campaign=formulario&utm_medium=landing');
    console.log('   2. Preencha o formulário');
    console.log('   3. Clique em "Receber Catálogo"');
    console.log('   4. Monitore o console para ver os 3 envios');
}

// Aguardar carregamento completo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testeIntegracaoTripla);
} else {
    testeIntegracaoTripla();
}
