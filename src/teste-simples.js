/**
 * Teste Simplificado para Active Campaign
 * Baseado no código que funciona
 */

function testeActiveCampaignSimples() {
    console.log('=== TESTE SIMPLIFICADO ACTIVE CAMPAIGN ===');
    console.log('');
    console.log('🎯 CONFIGURAÇÃO ATUAL:');

    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    console.log('Base URL:', config.BASE_URL);
    console.log('API Key:', config.API_KEY.substring(0, 10) + '...');
    console.log('Tag:', config.TAG_NAME);
    console.log('');
    console.log('📋 CAMPOS UTM:');
    console.log('UTM_SOURCE:', config.CUSTOM_FIELDS.UTM_SOURCE);
    console.log('UTM_CAMPAIGN:', config.CUSTOM_FIELDS.UTM_CAMPAIGN);
    console.log('UTM_MEDIUM:', config.CUSTOM_FIELDS.UTM_MEDIUM);
    console.log('UTM_CONTENT:', config.CUSTOM_FIELDS.UTM_CONTENT);
    console.log('UTM_TERM:', config.CUSTOM_FIELDS.UTM_TERM);
    console.log('');
    console.log('✅ PRONTO PARA TESTAR!');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('1. Abra: gerarURLComUTMs()');
    console.log('2. Copie a URL gerada');
    console.log('3. Abra em nova aba');
    console.log('4. Preencha o formulário');
    console.log('5. Envie e veja os logs no console');
    console.log('6. Verifique no Active Campaign');
}

function logActiveCampaignResult(response) {
    console.log('=== RESULTADO ACTIVE CAMPAIGN ===');

    if (response.activeCampaignResponse) {
        const ac = response.activeCampaignResponse;

        if (ac.success) {
            console.log('✅ SUCESSO no Active Campaign!');
            console.log('Contact ID:', ac.contact?.id);
            console.log('Tag aplicada:', ac.tag ? 'SIM' : 'NÃO');
        } else {
            console.log('❌ ERRO no Active Campaign:', ac.error);
        }
    } else {
        console.log('⚠️ Resposta do Active Campaign não encontrada');
    }

    console.log('=== FIM RESULTADO ===');
}

// Interceptar o método de sucesso para mostrar logs
if (window.fastHomesForm) {
    const originalHandleSubmitSuccess = window.fastHomesForm.handleSubmitSuccess;
    window.fastHomesForm.handleSubmitSuccess = function () {
        console.log('🎉 FORMULÁRIO ENVIADO COM SUCESSO!');
        originalHandleSubmitSuccess.call(this);
    };
}

console.log('🔧 TESTE SIMPLIFICADO CARREGADO!');
console.log('Execute: testeActiveCampaignSimples()');
