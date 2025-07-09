// test-backend.js
// Script para testar o backend ActiveCampaign
// Rode com: node test-backend.js

const fetch = require('node-fetch');

async function testBackend() {
    const BACKEND_URL = 'http://localhost:3001';
    
    console.log('🧪 TESTANDO BACKEND ACTIVECAMPAIGN');
    console.log('==================================');

    try {
        // 1. Testar se backend está online
        console.log('🔄 Testando se backend está online...');
        const testResponse = await fetch(`${BACKEND_URL}/api/test`);
        
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('✅ Backend está online:', testData);
        } else {
            throw new Error(`Backend offline: ${testResponse.status}`);
        }

        // 2. Testar envio de lead
        console.log('\n🔄 Testando envio de lead...');
        const leadData = {
            name: 'Teste Backend',
            email: `teste-backend-${Date.now()}@fasthomes.com.br`,
            phone: '(11) 99999-8888',
            utm_source: 'teste-backend',
            utm_medium: 'script',
            utm_campaign: 'teste-tag',
            utm_term: '',
            utm_content: '',
            page_referrer: 'script-teste'
        };

        console.log('📧 Dados do lead:', leadData);

        const leadResponse = await fetch(`${BACKEND_URL}/api/activecampaign-with-tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        if (leadResponse.ok) {
            const leadResult = await leadResponse.json();
            console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
            console.log('📊 Resultado:', leadResult);
            
            if (leadResult.tag && leadResult.tag.applied) {
                console.log(`🎯 Tag "${leadResult.tag.name}" aplicada com sucesso!`);
                console.log(`👤 Contato ID: ${leadResult.contact.id}`);
            } else {
                console.log('⚠️ Lead criado mas tag não foi aplicada');
            }
        } else {
            const errorData = await leadResponse.json();
            console.error('❌ Erro no envio do lead:', errorData);
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.log('\n💡 Certifique-se de que o backend está rodando:');
        console.log('   npm start');
        console.log('   ou');
        console.log('   node backend-activecampaign-tag.js');
    }
}

// Executar teste
testBackend();
