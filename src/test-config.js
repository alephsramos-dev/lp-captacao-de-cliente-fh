/**
 * Script de Teste para Active Campaign
 * 
 * Execute este script no console do navegador para testar a integração
 * Abra o console (F12) e cole este código para verificar se está tudo configurado
 */

function testActiveCampaignConfig() {
    console.log('=== TESTE DE CONFIGURAÇÃO DO ACTIVE CAMPAIGN ===');

    // Verificar se a configuração foi carregada
    if (typeof window.ACTIVE_CAMPAIGN_CONFIG === 'undefined') {
        console.error('❌ Arquivo config.js não foi carregado corretamente');
        return false;
    }

    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    // Verificar Base URL
    if (config.BASE_URL === 'https://SUACONTAACTIVECAMPAIGN.api-us1.com') {
        console.error('❌ Base URL não foi configurada. Edite o arquivo config.js');
        return false;
    }

    // Verificar API Key
    if (config.API_KEY === 'SUA_API_KEY_AQUI') {
        console.error('❌ API Key não foi configurada. Edite o arquivo config.js');
        return false;
    }

    // Verificar formato da Base URL
    if (!config.BASE_URL.startsWith('https://') || !config.BASE_URL.includes('.api-')) {
        console.error('❌ Base URL não parece estar no formato correto');
        console.log('Formato esperado: https://suaconta.api-us1.com');
        return false;
    }

    // Verificar API Key
    if (config.API_KEY.length < 30) {
        console.warn('⚠️ API Key parece muito curta. Verifique se está correta');
    }

    console.log('✅ Configuração básica está OK!');
    console.log('Base URL:', config.BASE_URL);
    console.log('API Key:', config.API_KEY.substring(0, 10) + '...');
    console.log('Tag:', config.TAG_NAME);

    // Verificar campos personalizados
    const customFields = Object.values(config.CUSTOM_FIELDS).filter(field => field !== null);
    if (customFields.length > 0) {
        console.log('✅ Campos personalizados configurados:', customFields.length);
    } else {
        console.log('ℹ️ Nenhum campo personalizado configurado (opcional)');
    }

    console.log('=== TESTE CONCLUÍDO ===');
    return true;
}

// Executar teste automaticamente
testActiveCampaignConfig();
