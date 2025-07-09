/**
 * 🎯 Validação Final em Produção
 * 
 * Execute este script após implementar em produção para
 * validar se tudo está funcionando corretamente.
 */

window.validacaoProducao = function () {
    console.log('🎯 VALIDAÇÃO FINAL EM PRODUÇÃO');
    console.log('='.repeat(50));
    console.log('⏰ Timestamp:', new Date().toLocaleString('pt-BR'));

    // 1. Verificar estrutura do formulário
    console.log('\n📋 1. VERIFICANDO ESTRUTURA:');
    const form = document.getElementById('contactForm');

    if (!form) {
        console.error('❌ FALHA CRÍTICA: Formulário não encontrado!');
        return false;
    }

    const estruturaOK = form.method === 'POST' &&
        form.action.includes('activehosted.com/proc.php');

    console.log(`   Method: ${form.method} ${form.method === 'POST' ? '✅' : '❌'}`);
    console.log(`   Action: ${form.action}`);
    console.log(`   Estrutura: ${estruturaOK ? '✅ OK' : '❌ FALHA'}`);

    // 2. Verificar tags (mais crítico)
    console.log('\n🎯 2. VERIFICANDO TAGS (CRÍTICO):');
    let tagsOK = 0;
    const tagsEsperadas = [1, 2, 3, 4, 5];

    tagsEsperadas.forEach(id => {
        const tag = form.querySelector(`input[name="p[${id}]"]`);
        if (tag && tag.value === '1') {
            console.log(`   ✅ p[${id}] configurada corretamente`);
            tagsOK++;
        } else {
            console.log(`   ❌ p[${id}] ausente ou incorreta`);
        }
    });

    console.log(`   📊 Tags OK: ${tagsOK}/${tagsEsperadas.length}`);

    if (tagsOK === 0) {
        console.error('   🚨 FALHA CRÍTICA: Nenhuma tag configurada!');
        console.log('   💡 A tag "catalogo-fast-homes-solicitado" NÃO será aplicada!');
        return false;
    }

    // 3. Verificar campos UTM
    console.log('\n📋 3. VERIFICANDO CAMPOS UTM:');
    const camposUTM = [
        { name: 'field[6]', desc: 'utm_source' },
        { name: 'field[7]', desc: 'utm_medium' },
        { name: 'field[8]', desc: 'utm_campaign' },
        { name: 'field[9]', desc: 'utm_term' },
        { name: 'field[10]', desc: 'utm_content' },
        { name: 'field[11]', desc: 'page_referrer' },
        { name: 'field[12]', desc: 'current_url' }
    ];

    let utmsOK = 0;
    camposUTM.forEach(campo => {
        const input = form.querySelector(`input[name="${campo.name}"]`);
        if (input) {
            console.log(`   ✅ ${campo.desc}: "${input.value || 'vazio'}"`);
            utmsOK++;
        } else {
            console.log(`   ❌ ${campo.desc}: AUSENTE`);
        }
    });

    console.log(`   📊 Campos UTM: ${utmsOK}/${camposUTM.length}`);

    // 4. Verificar JavaScript
    console.log('\n📜 4. VERIFICANDO SCRIPTS:');
    console.log(`   fastHomesForm: ${typeof window.fastHomesForm !== 'undefined' ? '✅' : '❌'}`);
    console.log(`   Splide: ${typeof window.Splide !== 'undefined' ? '✅' : '❌'}`);

    // 5. Status geral
    console.log('\n📊 5. STATUS GERAL:');
    const statusGeral = estruturaOK && tagsOK > 0 && utmsOK >= 5;

    if (statusGeral) {
        console.log('   🎉 TUDO OK! Formulário pronto para produção');
        console.log('   ✅ Estrutura correta');
        console.log('   ✅ Tags configuradas');
        console.log('   ✅ UTMs mapeados');
        return true;
    } else {
        console.error('   ❌ PROBLEMAS ENCONTRADOS!');
        console.log('   🔧 Corrija os problemas antes de usar em produção');
        return false;
    }
};

window.testeCompleto = function () {
    console.log('🧪 TESTE COMPLETO DO FORMULÁRIO');
    console.log('='.repeat(50));

    // 1. Validar estrutura
    const estruturaOK = window.validacaoProducao();

    if (!estruturaOK) {
        console.error('❌ Teste interrompido - estrutura com problemas');
        return;
    }

    // 2. Preencher dados de teste
    console.log('\n📝 PREENCHENDO DADOS DE TESTE:');
    const form = document.getElementById('contactForm');

    // Dados de teste
    const dadosTeste = {
        fullname: 'Teste Validação Produção',
        email: 'teste.validacao@fasthomes.com.br',
        phone: '(11) 99999-8888'
    };

    Object.entries(dadosTeste).forEach(([campo, valor]) => {
        const input = form.querySelector(`input[name="${campo}"]`);
        if (input) {
            input.value = valor;
            console.log(`   ✅ ${campo}: ${valor}`);
        } else {
            console.log(`   ❌ ${campo}: campo não encontrado`);
        }
    });

    // 3. Preencher UTMs de teste
    console.log('\n📋 PREENCHENDO UTMs DE TESTE:');
    const utmsTeste = {
        'field[6]': 'teste-producao',
        'field[7]': 'validacao',
        'field[8]': 'formulario-oficial',
        'field[9]': 'fast homes',
        'field[10]': 'teste-tag',
        'field[11]': document.referrer || 'teste-direto',
        'field[12]': window.location.href
    };

    Object.entries(utmsTeste).forEach(([campo, valor]) => {
        const input = form.querySelector(`input[name="${campo}"]`);
        if (input) {
            input.value = valor;
            console.log(`   ✅ ${campo}: ${valor}`);
        }
    });

    // 4. Mostrar dados finais
    console.log('\n📋 DADOS FINAIS DO FORMULÁRIO:');
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
        if (key.startsWith('p[') || key.startsWith('field[') ||
            ['fullname', 'email', 'phone'].includes(key)) {
            console.log(`   ${key}: ${value}`);
        }
    }

    console.log('\n⚠️  PRONTO PARA TESTE REAL!');
    console.log('   1. Verifique os dados acima');
    console.log('   2. Clique em "Receber Catálogo" se quiser testar');
    console.log('   3. Monitore o ActiveCampaign após o envio');
    console.log('   4. Confirme se a tag foi aplicada');
};

window.monitorarSubmit = function () {
    console.log('👀 MONITOR DE SUBMIT ATIVADO');

    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('❌ Formulário não encontrado para monitorar');
        return;
    }

    // Interceptar submit
    form.addEventListener('submit', function (e) {
        console.log('🚀 SUBMIT DETECTADO!');
        console.log('⏰ Timestamp:', new Date().toLocaleString('pt-BR'));

        // Mostrar dados sendo enviados
        const formData = new FormData(form);
        console.log('📤 DADOS SENDO ENVIADOS:');

        for (let [key, value] of formData.entries()) {
            console.log(`   ${key}: ${value}`);
        }

        console.log('\n🎯 TAGS QUE SERÃO APLICADAS:');
        for (let i = 1; i <= 5; i++) {
            const tag = form.querySelector(`input[name="p[${i}]"]`);
            if (tag && tag.value === '1') {
                console.log(`   ✅ Tag p[${i}] será aplicada`);
            }
        }

        console.log('\n📋 PRÓXIMOS PASSOS:');
        console.log('   1. Aguarde o processamento');
        console.log('   2. Verifique o ActiveCampaign');
        console.log('   3. Procure pelo email enviado');
        console.log('   4. Confirme a tag "catalogo-fast-homes-solicitado"');
    });

    console.log('✅ Monitor ativo - envie o formulário para ver os dados');
};

// Função para executar tudo de uma vez
window.validacaoCompleta = function () {
    console.clear();
    console.log('🎯 FAST HOMES - VALIDAÇÃO COMPLETA DE PRODUÇÃO');
    console.log('🔗 GitHub: lp-captacao-de-cliente-fh');
    console.log('📅 ' + new Date().toLocaleString('pt-BR'));
    console.log('='.repeat(60));

    // 1. Validação estrutural
    window.validacaoProducao();

    // 2. Ativar monitor
    setTimeout(() => {
        window.monitorarSubmit();

        console.log('\n🎯 COMANDOS DISPONÍVEIS:');
        console.log('   window.testeCompleto() - Preenche e testa formulário');
        console.log('   window.validacaoProducao() - Re-valida estrutura');
        console.log('   window.debugTags() - Debug específico das tags');

    }, 1000);
};

// Auto-executar em produção após carregamento
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar carregamento completo
    setTimeout(() => {
        if (window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1') {
            console.log('🌐 AMBIENTE DE PRODUÇÃO DETECTADO');
            console.log('📋 Execute: window.validacaoCompleta()');
        } else {
            console.log('🛠️  AMBIENTE LOCAL - Validação manual disponível');
            console.log('📋 Execute: window.validacaoCompleta()');
        }
    }, 3000);
});
