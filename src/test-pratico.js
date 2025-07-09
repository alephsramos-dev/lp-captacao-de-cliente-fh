/**
 * Método Prático para Descobrir IDs dos Campos
 * 
 * Como o CORS bloqueia requisições diretas, vamos usar uma abordagem prática:
 * 1. Testar o formulário com dados reais
 * 2. Ver no Active Campaign quais campos foram preenchidos
 * 3. Ajustar os IDs no config.js
 */

function testFormularioComUTMs() {
    console.log('=== TESTE PRÁTICO DO FORMULÁRIO ===');
    console.log('');
    console.log('📋 INSTRUÇÕES:');
    console.log('');
    console.log('1. Preencha o formulário com dados de teste');
    console.log('2. Envie o formulário');
    console.log('3. Vá no Active Campaign e verifique o contato criado');
    console.log('4. Veja quais campos UTM foram preenchidos');
    console.log('5. Ajuste os IDs no config.js conforme necessário');
    console.log('');
    console.log('💡 DADOS DE TESTE SUGERIDOS:');
    console.log('Nome: Teste UTM');
    console.log('Email: teste-utm@teste.com');
    console.log('Telefone: (11) 99999-9999');
    console.log('');
    console.log('🔍 APÓS ENVIAR, VERIFIQUE NO ACTIVE CAMPAIGN:');
    console.log('- Se o contato foi criado com nome "Teste UTM"');
    console.log('- Se a tag "catalogo-fast-homes-solicitado" foi aplicada');
    console.log('- Quais campos UTM foram preenchidos');
    console.log('');
    console.log('📊 CAMPOS ATUAIS NO CONFIG.JS:');
    console.log('UTM_SOURCE: 6 (deveria preencher com valor dos parâmetros UTM)');
    console.log('UTM_CAMPAIGN: 8 (deveria preencher com valor dos parâmetros UTM)');
    console.log('UTM_MEDIUM: 7 (deveria preencher com valor dos parâmetros UTM)');
    console.log('UTM_CONTENT: 10 (deveria preencher com valor dos parâmetros UTM)');
    console.log('UTM_TERM: 9 (deveria preencher com valor dos parâmetros UTM)');
    console.log('REFERRER: 1 (deveria preencher com página de origem)');
    console.log('DEVICE_INFO: 2 (deveria preencher com info do dispositivo)');
    console.log('');
    console.log('✅ PRONTO PARA TESTAR!');
}

function gerarURLComUTMs() {
    const currentUrl = window.location.href.split('?')[0];
    const utmParams = [
        'utm_source=google',
        'utm_medium=cpc',
        'utm_campaign=teste-campos',
        'utm_content=formulario',
        'utm_term=casa-teste'
    ].join('&');

    const urlComUTMs = `${currentUrl}?${utmParams}`;

    console.log('=== URL COM UTMs PARA TESTE ===');
    console.log('');
    console.log('📋 COPIE E COLE NO NAVEGADOR:');
    console.log('');
    console.log(urlComUTMs);
    console.log('');
    console.log('💡 ISSO ADICIONARÁ OS PARÂMETROS UTM:');
    console.log('utm_source=google');
    console.log('utm_medium=cpc');
    console.log('utm_campaign=teste-campos');
    console.log('utm_content=formulario');
    console.log('utm_term=casa-teste');
    console.log('');
    console.log('🔍 DEPOIS DE ABRIR A URL:');
    console.log('1. Preencha o formulário');
    console.log('2. Envie os dados');
    console.log('3. Vá no Active Campaign');
    console.log('4. Procure o contato criado');
    console.log('5. Veja se os campos UTM foram preenchidos com os valores acima');
    console.log('');
    console.log('✅ Se os campos não foram preenchidos, os IDs estão incorretos!');
}

function mostrarConfigAtual() {
    console.log('=== CONFIGURAÇÃO ATUAL ===');

    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    console.log('');
    console.log('🎯 CONFIGURAÇÃO DO ACTIVE CAMPAIGN:');
    console.log('Base URL:', config.BASE_URL);
    console.log('API Key:', config.API_KEY.substring(0, 10) + '...');
    console.log('Tag:', config.TAG_NAME);
    console.log('');
    console.log('📋 CAMPOS PERSONALIZADOS:');
    console.log('UTM_SOURCE:', config.CUSTOM_FIELDS.UTM_SOURCE);
    console.log('UTM_CAMPAIGN:', config.CUSTOM_FIELDS.UTM_CAMPAIGN);
    console.log('UTM_MEDIUM:', config.CUSTOM_FIELDS.UTM_MEDIUM);
    console.log('UTM_CONTENT:', config.CUSTOM_FIELDS.UTM_CONTENT);
    console.log('UTM_TERM:', config.CUSTOM_FIELDS.UTM_TERM);
    console.log('REFERRER:', config.CUSTOM_FIELDS.REFERRER);
    console.log('DEVICE_INFO:', config.CUSTOM_FIELDS.DEVICE_INFO);
    console.log('');
    console.log('💡 PRÓXIMOS PASSOS:');
    console.log('1. Execute gerarURLComUTMs()');
    console.log('2. Abra a URL gerada');
    console.log('3. Teste o formulário');
    console.log('4. Verifique no Active Campaign');
}

function criarConfigComIDs(utmSource, utmCampaign, utmMedium, utmContent, utmTerm, referrer, deviceInfo) {
    console.log('=== NOVA CONFIGURAÇÃO ===');
    console.log('');
    console.log('📋 COPIE E COLE NO config.js:');
    console.log('');
    console.log('CUSTOM_FIELDS: {');
    console.log(`    UTM_SOURCE: ${utmSource || 'null'},         // UTM Source -> %UTM_SOURCE%`);
    console.log(`    UTM_CAMPAIGN: ${utmCampaign || 'null'},       // UTM Campaign -> %UTM_CAMPAING%`);
    console.log(`    UTM_MEDIUM: ${utmMedium || 'null'},         // UTM Medium -> %UTM_MEDIUM%`);
    console.log(`    UTM_CONTENT: ${utmContent || 'null'},       // UTM Content -> %UTM_CONTENT%`);
    console.log(`    UTM_TERM: ${utmTerm || 'null'},           // UTM Term -> %UTM_TERM%`);
    console.log(`    REFERRER: ${referrer || 'null'},           // Origem -> %ORIGEM%`);
    console.log(`    DEVICE_INFO: ${deviceInfo || 'null'}         // Título -> %TITULO%`);
    console.log('}');
    console.log('');
    console.log('💡 EXEMPLO DE USO:');
    console.log('criarConfigComIDs(1, 2, 3, 4, 5, 6, 7)');
}

console.log('🛠️ FERRAMENTAS PRÁTICAS DISPONÍVEIS:');
console.log('');
console.log('1. testFormularioComUTMs() - Instruções para teste manual');
console.log('2. gerarURLComUTMs() - Gerar URL com parâmetros UTM');
console.log('3. mostrarConfigAtual() - Ver configuração atual');
console.log('4. criarConfigComIDs(1,2,3,4,5,6,7) - Gerar nova configuração');
console.log('');
console.log('💡 COMECE COM: testFormularioComUTMs()');
console.log('');
console.log('⚠️ PROBLEMA DE CORS RESOLVIDO!');
console.log('Não conseguimos testar via API diretamente, mas podemos testar');
console.log('via formulário e verificar no Active Campaign se funcionou!');
