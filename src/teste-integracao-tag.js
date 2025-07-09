/**
 * Script de teste para ActiveCampaign Tag Integration
 * Execute este script no console do navegador para testar a integração
 */

async function testarIntegracaoTag() {
    console.log('🧪 INICIANDO TESTE DE INTEGRAÇÃO ACTIVECAMPAIGN TAG');
    console.log('==================================================');

    // Verificar se as classes estão carregadas
    if (!window.ActiveCampaignTagManager) {
        console.error('❌ ActiveCampaignTagManager não encontrado. Verifique se o script foi carregado.');
        return;
    }

    if (!window.ACTIVE_CAMPAIGN_CONFIG) {
        console.error('❌ ACTIVE_CAMPAIGN_CONFIG não encontrado. Verifique o arquivo config.js.');
        return;
    }

    const config = window.ACTIVE_CAMPAIGN_CONFIG;
    console.log('📋 Configuração carregada:', config);

    // Verificar API Key
    if (!config.API_KEY) {
        console.warn('⚠️ API_KEY não configurada. Teste limitado ao modo fallback.');
        console.log('📝 Para testar integração completa, configure API_KEY em src/config.js');
        return testeFallback();
    }

    // Teste de integração completa
    console.log('🔄 Iniciando teste de integração completa...');

    try {
        const tagManager = new window.ActiveCampaignTagManager(config);

        // Dados de teste
        const dadosTeste = {
            email: 'teste-' + Date.now() + '@exemplo.com',
            firstName: 'Teste',
            lastName: 'ActiveCampaign',
            phone: '(11) 99999-9999',
            fieldValues: [
                {
                    field: config.CUSTOM_FIELDS.UTM_SOURCE,
                    value: 'teste-script'
                }
            ]
        };

        console.log('📧 Dados de teste:', dadosTeste);

        // Executar processo completo
        const resultado = await tagManager.processContactWithTag(
            dadosTeste,
            config.TAG_NAME,
            'Tag de teste aplicada via script'
        );

        if (resultado.success) {
            console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
            console.log('📊 Resultado:', resultado);
            console.log('🎯 Tag aplicada:', config.TAG_NAME);
            console.log('👤 Contato ID:', resultado.contact.id);
            console.log('🏷️ Tag ID:', resultado.tagId);
        } else {
            console.error('❌ TESTE FALHOU:', resultado.error);
        }

    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
        console.log('🔄 Tentando modo fallback...');
        testeFallback();
    }
}

function testeFallback() {
    console.log('🔄 TESTE MODO FALLBACK');
    console.log('========================');

    const config = window.ACTIVE_CAMPAIGN_CONFIG;
    
    // Simular dados de lead
    const leadTeste = {
        name: 'Teste Fallback',
        email: 'teste-fallback@exemplo.com',
        personal_phone: '(11) 88888-8888',
        custom_fields: {
            utm_source: 'teste',
            utm_medium: 'script',
            utm_campaign: 'teste-fallback',
            utm_content: '',
            utm_term: ''
        }
    };

    // Simular processo de fallback
    leadTeste.custom_fields.active_campaign_data = JSON.stringify({
        base_url: config.BASE_URL,
        tag_name: config.TAG_NAME,
        tag_id: config.TAG_ID,
        fields_mapping: config.CUSTOM_FIELDS,
        contact_data: {
            email: leadTeste.email,
            firstName: leadTeste.name.split(' ')[0],
            lastName: leadTeste.name.split(' ').slice(1).join(' '),
            phone: leadTeste.personal_phone
        },
        utm_fields: leadTeste.custom_fields
    });

    leadTeste.custom_fields.integration_target = 'active_campaign';
    leadTeste.custom_fields.ac_tag = config.TAG_NAME;
    leadTeste.custom_fields.integration_status = 'pending_cors_workaround';

    console.log('✅ FALLBACK CONFIGURADO COM SUCESSO!');
    console.log('📋 Dados estruturados para Pipe.run:', leadTeste);
    console.log('🎯 Tag programada:', config.TAG_NAME);
    console.log('📝 Status: Aguardando integração via webhook/automação');
}

function verificarConfiguracao() {
    console.log('🔍 VERIFICAÇÃO DE CONFIGURAÇÃO');
    console.log('================================');

    const config = window.ACTIVE_CAMPAIGN_CONFIG;
    const checks = [
        { nome: 'BASE_URL', valor: config.BASE_URL, obrigatorio: true },
        { nome: 'API_KEY', valor: config.API_KEY ? '***configurada***' : null, obrigatorio: false },
        { nome: 'TAG_NAME', valor: config.TAG_NAME, obrigatorio: true },
        { nome: 'CUSTOM_FIELDS', valor: Object.keys(config.CUSTOM_FIELDS).length + ' campos', obrigatorio: true }
    ];

    checks.forEach(check => {
        const status = check.valor ? '✅' : (check.obrigatorio ? '❌' : '⚠️');
        console.log(`${status} ${check.nome}: ${check.valor || 'não configurado'}`);
    });

    console.log('\n📝 Para configurar API_KEY: edite src/config.js');
    console.log('📖 Consulte: CONFIGURACAO_API_ACTIVECAMPAIGN.md');
}

// Executar verificação automaticamente
verificarConfiguracao();

// Disponibilizar funções globalmente para teste manual
window.testarIntegracaoTag = testarIntegracaoTag;
window.verificarConfiguracao = verificarConfiguracao;

console.log('\n🧪 COMANDOS DISPONÍVEIS:');
console.log('- testarIntegracaoTag(): Teste completo da integração');
console.log('- verificarConfiguracao(): Verificar configuração atual');
