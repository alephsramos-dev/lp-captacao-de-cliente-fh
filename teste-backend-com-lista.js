/**
 * Teste do backend com adição à lista "Leads"
 */

async function testarBackendComLista() {
    console.log('🧪 Testando backend com adição à lista "Leads"...');
    
    // Dados de teste
    const dadosTeste = {
        name: "Teste Lista",
        email: "teste.lista@example.com",
        phone: "11999999999",
        utm_source: "teste-lista",
        utm_medium: "form",
        utm_campaign: "teste-backend",
        utm_content: "botao-principal",
        utm_term: "catalogo",
        page_referrer: "https://teste.com"
    };

    try {
        // Testar localmente primeiro
        console.log('📡 Testando backend local...');
        const responseLocal = await fetch('http://localhost:3000/api/activecampaign-with-tag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosTeste)
        });

        if (responseLocal.ok) {
            const resultLocal = await responseLocal.json();
            console.log('✅ Teste local bem-sucedido:');
            console.log('- Contato:', resultLocal.contact);
            console.log('- Tag:', resultLocal.tag);
            console.log('- Lista:', resultLocal.list);
            console.log('- Mensagem:', resultLocal.message);
        } else {
            const errorLocal = await responseLocal.text();
            console.log('❌ Erro no teste local:', errorLocal);
        }

    } catch (error) {
        console.log('❌ Backend local não está rodando:', error.message);
    }

    try {
        // Testar no Turbo Cloud
        console.log('\n📡 Testando backend no Turbo Cloud...');
        const responseTurbo = await fetch('https://backend-activecampaign-tag-equip.turbo.build/api/activecampaign-with-tag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosTeste)
        });

        if (responseTurbo.ok) {
            const resultTurbo = await responseTurbo.json();
            console.log('✅ Teste Turbo Cloud bem-sucedido:');
            console.log('- Contato:', resultTurbo.contact);
            console.log('- Tag:', resultTurbo.tag);
            console.log('- Lista:', resultTurbo.list);
            console.log('- Mensagem:', resultTurbo.message);
        } else {
            const errorTurbo = await responseTurbo.text();
            console.log('❌ Erro no teste Turbo Cloud:', errorTurbo);
        }

    } catch (error) {
        console.log('❌ Erro ao conectar com Turbo Cloud:', error.message);
    }

    console.log('\n🎯 Teste concluído!');
}

// Executar teste
testarBackendComLista();
