/**
 * TESTE FINAL: Verificar se tag está funcionando
 * Execute este script após enviar o formulário
 */

function testeTagFinal() {
    console.log('🎯 === TESTE FINAL DA TAG ===');
    console.log('🔍 Verificando se tag foi aplicada...');
    console.log('');

    // 1. Verificar configuração atual
    console.log('📋 1. Configuração atual:');
    if (window.ACTIVE_CAMPAIGN_CONFIG) {
        console.log('✅ Tag Name:', window.ACTIVE_CAMPAIGN_CONFIG.TAG_NAME);
        console.log('✅ Tag Field:', window.ACTIVE_CAMPAIGN_CONFIG.TAG_FIELD);
        console.log('✅ Tag ID:', window.ACTIVE_CAMPAIGN_CONFIG.TAG_ID);
    }

    // 2. Verificar campos no formulário
    console.log('');
    console.log('📋 2. Campos de tag no formulário:');
    const form = document.getElementById('contactForm');
    if (form) {
        const tagFields = form.querySelectorAll('input[name^="p["]');
        tagFields.forEach(field => {
            console.log(`✅ ${field.name} = ${field.value}`);
        });
        console.log(`📊 Total de campos de tag: ${tagFields.length}`);
    }

    // 3. Simular envio e verificar logs
    console.log('');
    console.log('📋 3. Status do formulário:');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (nameInput?.value && emailInput?.value && phoneInput?.value) {
        console.log('✅ Formulário preenchido');
        console.log('📤 Dados que serão enviados:');
        console.log('- Nome:', nameInput.value);
        console.log('- Email:', emailInput.value);
        console.log('- Telefone:', phoneInput.value);

        // UTMs
        const urlParams = new URLSearchParams(window.location.search);
        console.log('- UTM Source:', urlParams.get('utm_source') || 'organico');
        console.log('- UTM Campaign:', urlParams.get('utm_campaign') || '(não definida)');
        console.log('- UTM Medium:', urlParams.get('utm_medium') || '(não definida)');

    } else {
        console.log('⚠️ Formulário não preenchido');
    }

    // 4. Instruções para verificação
    console.log('');
    console.log('🔍 COMO VERIFICAR SE A TAG FUNCIONOU:');
    console.log('');
    console.log('📧 NO ACTIVECAMPAIGN:');
    console.log('1. Acesse: https://fastdrywall80017.activehosted.com/app/contacts');
    console.log('2. Procure pelo email que você testou');
    console.log('3. Clique no contato');
    console.log('4. Na aba "Tags", verifique se aparece "catalogo-fast-homes-solicitado"');
    console.log('');
    console.log('📊 NO PIPERUN:');
    console.log('1. Acesse seu PipeRun');
    console.log('2. Procure pelo lead criado');
    console.log('3. Verifique se os dados UTM estão nos campos personalizados');
    console.log('');
    console.log('🧪 PARA TESTAR NOVAMENTE:');
    console.log('1. Use email diferente (ex: teste2@email.com)');
    console.log('2. Adicione UTMs na URL: ?utm_source=teste&utm_campaign=formulario');
    console.log('3. Preencha e envie o formulário');
    console.log('4. Verifique os resultados nos dois sistemas');

    // 5. Função para acompanhar envio em tempo real
    console.log('');
    console.log('🔄 MONITORAMENTO EM TEMPO REAL:');
    console.log('Execute: monitorarEnvio() - para acompanhar próximo envio');
}

function monitorarEnvio() {
    console.log('👀 Monitorando próximo envio do formulário...');
    console.log('📝 Preencha e envie o formulário agora');
    console.log('');

    // Interceptar callback do ActiveCampaign
    const originalCallback = window._show_thank_you;
    window._show_thank_you = function (id, message, trackcmp_url, email) {
        console.log('');
        console.log('🎉 === CALLBACK ACTIVECAMPAIGN RECEBIDO ===');
        console.log('✅ ID:', id);
        console.log('✅ Message:', message);
        console.log('✅ Email:', email);
        console.log('✅ URL:', trackcmp_url);
        console.log('');
        console.log('🎯 STATUS: ActiveCampaign recebeu os dados!');
        console.log('📧 Agora verifique se a tag foi aplicada no painel do ActiveCampaign');

        // Restaurar callback original
        if (originalCallback) {
            return originalCallback.apply(this, arguments);
        }
    };

    // Interceptar console.log para capturar logs do envio
    const originalLog = console.log;
    console.log = function (...args) {
        originalLog.apply(console, args);

        // Detectar logs importantes
        const message = args.join(' ');
        if (message.includes('✅ Lead enviado com sucesso ao PipeRun')) {
            originalLog('🎯 STATUS: PipeRun recebeu os dados!');
        }
        if (message.includes('✅ ActiveCampaign script carregado')) {
            originalLog('🎯 STATUS: ActiveCampaign processando dados...');
        }
    };

    // Configurar timeout para restaurar funções
    setTimeout(() => {
        console.log = originalLog;
        console.log('⏰ Monitoramento finalizado após 2 minutos');
    }, 120000);
}

// Função para debug rápido
function debugRapido() {
    console.log('🔧 === DEBUG RÁPIDO ===');

    const form = document.getElementById('contactForm');
    const allHiddenInputs = form.querySelectorAll('input[type="hidden"]');

    console.log('📋 Todos os campos ocultos:');
    allHiddenInputs.forEach(input => {
        console.log(`- ${input.name}: ${input.value}`);
    });

    console.log('');
    console.log('🎯 Campos de tag específicos:');
    const tagInputs = form.querySelectorAll('input[name^="p["]');
    tagInputs.forEach(input => {
        console.log(`- ${input.name}: ${input.value} ✅`);
    });

    if (tagInputs.length === 0) {
        console.log('❌ Nenhum campo de tag encontrado!');
        console.log('💡 Execute: window.fastHomesForm.configurarTagInteligente()');
    }
}

// Exportar funções
window.testeTagFinal = testeTagFinal;
window.monitorarEnvio = monitorarEnvio;
window.debugRapido = debugRapido;

// Executar teste automático
console.log('🚀 === TESTE AUTOMÁTICO DA TAG ===');
testeTagFinal();
