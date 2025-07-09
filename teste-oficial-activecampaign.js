/**
 * Teste Final - Formulário Oficial ActiveCampaign
 * 
 * Este script testa se o formulário está configurado exatamente
 * como o formulário oficial do ActiveCampaign que aplica tags automaticamente.
 */

window.testeFormularioOficial = function () {
    console.log('🧪 TESTE DO FORMULÁRIO OFICIAL INICIADO');
    console.log('='.repeat(50));

    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('❌ Formulário não encontrado!');
        return;
    }

    // 1. Verificar estrutura básica
    console.log('📋 1. ESTRUTURA BÁSICA:');
    console.log(`   Method: ${form.method}`);
    console.log(`   Action: ${form.action}`);
    console.log(`   ✅ Deve ser: POST para https://fastdrywall80017.activehosted.com/proc.php`);

    // 2. Verificar campos obrigatórios ActiveCampaign
    console.log('\n📋 2. CAMPOS OBRIGATÓRIOS AC:');
    const camposObrigatorios = ['u', 'f', 's', 'c', 'm', 'act', 'v', 'or'];
    camposObrigatorios.forEach(campo => {
        const input = form.querySelector(`input[name="${campo}"]`);
        if (input) {
            console.log(`   ✅ ${campo}: ${input.value}`);
        } else {
            console.log(`   ❌ ${campo}: AUSENTE`);
        }
    });

    // 3. Verificar tags (o mais importante!)
    console.log('\n🎯 3. TAGS (MAIS IMPORTANTE):');
    let tagsEncontradas = 0;
    for (let i = 1; i <= 10; i++) {
        const tag = form.querySelector(`input[name="p[${i}]"]`);
        if (tag) {
            console.log(`   ✅ p[${i}]: ${tag.value}`);
            tagsEncontradas++;
        }
    }
    console.log(`   📊 Total de tags configuradas: ${tagsEncontradas}`);
    if (tagsEncontradas === 0) {
        console.error('   ❌ NENHUMA TAG ENCONTRADA! Tags não serão aplicadas!');
    } else {
        console.log('   ✅ Tags configuradas - serão aplicadas automaticamente');
    }

    // 4. Verificar campos UTM
    console.log('\n📋 4. CAMPOS UTM:');
    const camposUTM = [
        'field[6]',   // utm_source
        'field[7]',   // utm_medium  
        'field[8]',   // utm_campaign
        'field[9]',   // utm_term
        'field[10]',  // utm_content
        'field[11]',  // page_referrer
        'field[12]'   // current_url
    ];

    camposUTM.forEach((campo, index) => {
        const input = form.querySelector(`input[name="${campo}"]`);
        const nomes = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'page_referrer', 'current_url'];
        if (input) {
            console.log(`   ✅ ${nomes[index]}: "${input.value}"`);
        } else {
            console.log(`   ❌ ${nomes[index]}: AUSENTE`);
        }
    });

    // 5. Verificar campos visíveis
    console.log('\n📋 5. CAMPOS VISÍVEIS:');
    const name = form.querySelector('input[name="fullname"]');
    const email = form.querySelector('input[name="email"]');
    const phone = form.querySelector('input[name="phone"]');

    console.log(`   Nome: ${name ? '✅' : '❌'} (name="${name?.name}")`);
    console.log(`   Email: ${email ? '✅' : '❌'} (name="${email?.name}")`);
    console.log(`   Telefone: ${phone ? '✅' : '❌'} (name="${phone?.name}")`);

    // 6. Comparar com formulário oficial
    console.log('\n🔍 6. COMPARAÇÃO COM FORMULÁRIO OFICIAL:');
    console.log('   Estrutura esperada do AC:');
    console.log('   - method="POST"');
    console.log('   - action="[...]/proc.php"');
    console.log('   - input[name="u"] (Lista)');
    console.log('   - input[name="f"] (Formulário)');
    console.log('   - input[name="act"] = "sub"');
    console.log('   - input[name="p[X]"] = "1" (Tags)');
    console.log('   - input[name="field[X]"] (Campos customizados)');

    // 7. Teste de preenchimento
    console.log('\n🧪 7. TESTE DE PREENCHIMENTO:');
    console.log('   Executando: window.preencherFormularioTeste()');
    window.preencherFormularioTeste();

    console.log('\n🎉 TESTE CONCLUÍDO!');
    console.log('='.repeat(50));
};

window.preencherFormularioTeste = function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Preencher campos visíveis
    const name = form.querySelector('input[name="fullname"]');
    const email = form.querySelector('input[name="email"]');
    const phone = form.querySelector('input[name="phone"]');

    if (name) name.value = 'João Teste Silva';
    if (email) email.value = 'joao.teste@email.com';
    if (phone) phone.value = '(11) 99999-9999';

    // Preencher UTMs de teste
    const utmFields = {
        'field[6]': 'google',           // utm_source
        'field[7]': 'cpc',              // utm_medium
        'field[8]': 'teste-formulario', // utm_campaign
        'field[9]': 'fast homes',       // utm_term
        'field[10]': 'botao-catalogo',  // utm_content
        'field[11]': 'https://google.com', // page_referrer
        'field[12]': window.location.href  // current_url
    };

    Object.entries(utmFields).forEach(([fieldName, value]) => {
        const field = form.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            field.value = value;
            console.log(`   ✅ ${fieldName}: ${value}`);
        }
    });

    console.log('📝 Formulário preenchido para teste');
};

window.simularEnvio = function () {
    console.log('🚀 SIMULANDO ENVIO...');

    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('❌ Formulário não encontrado');
        return;
    }

    // Preencher formulário
    window.preencherFormularioTeste();

    // Verificar se tudo está correto
    console.log('📋 Dados que serão enviados:');
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
        console.log(`   ${key}: ${value}`);
    }

    console.log('\n🎯 IMPORTANTE:');
    console.log('   1. PipeRun: será enviado via API JavaScript');
    console.log('   2. ActiveCampaign: será enviado via POST do formulário');
    console.log('   3. Tags serão aplicadas automaticamente pelo AC');

    console.log('\n⚠️  Para testar realmente, clique no botão "Receber Catálogo"');
};

window.verificarIntegracao = function () {
    console.log('🔍 VERIFICAÇÃO COMPLETA DA INTEGRAÇÃO');
    console.log('='.repeat(60));

    // 1. Testar estrutura
    window.testeFormularioOficial();

    // 2. Aguardar um pouco e verificar scripts
    setTimeout(() => {
        console.log('\n📜 SCRIPTS CARREGADOS:');
        console.log(`   fastHomesForm: ${typeof window.fastHomesForm}`);
        console.log(`   Splide: ${typeof window.Splide}`);

        // 3. Verificar se a página está pronta
        console.log('\n✅ PÁGINA PRONTA PARA TESTE');
        console.log('   Execute: window.simularEnvio()');
        console.log('   Ou preencha manualmente e clique em "Receber Catálogo"');

    }, 1000);
};

// Auto-executar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🎯 FAST HOMES - FORMULÁRIO OFICIAL ACTIVECAMPAIGN');
        console.log('📋 Execute: window.verificarIntegracao() para teste completo');
    }, 2000);
});

window.debugTags = function () {
    console.log('🎯 DEBUG DAS TAGS ACTIVECAMPAIGN');
    console.log('='.repeat(40));

    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('❌ Formulário não encontrado');
        return;
    }

    console.log('📋 Tags configuradas no formulário:');
    let totalTags = 0;

    for (let i = 1; i <= 10; i++) {
        const tag = form.querySelector(`input[name="p[${i}]"]`);
        if (tag) {
            console.log(`   ✅ p[${i}] = ${tag.value} (ID: ${tag.id || 'sem id'})`);
            totalTags++;
        }
    }

    console.log(`\n📊 Total: ${totalTags} tags configuradas`);

    if (totalTags === 0) {
        console.error('❌ PROBLEMA: Nenhuma tag encontrada!');
        console.log('💡 SOLUÇÃO: Verifique se os campos p[1], p[2], etc. existem no HTML');
    } else {
        console.log('✅ Tags OK - serão aplicadas automaticamente no ActiveCampaign');
        console.log('🎯 Tag esperada: "catalogo-fast-homes-solicitado"');
    }

    console.log('\n📝 COMO VERIFICAR SE FUNCIONOU:');
    console.log('   1. Preencha o formulário e envie');
    console.log('   2. Vá no ActiveCampaign > Contatos');
    console.log('   3. Procure pelo email enviado');
    console.log('   4. Verifique se a tag foi aplicada');
};
