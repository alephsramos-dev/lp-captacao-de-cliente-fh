// teste-backend-turbo.js
// Script para testar o backend no Turbo Cloud
// Rode com: node teste-backend-turbo.js

const fetch = require('node-fetch');

async function testTurboBackend() {
    const BACKEND_URL = 'http://fasthomesac.fastsistemasconstrutivos.com.br';
    
    console.log('🧪 TESTANDO BACKEND NO TURBO CLOUD');
    console.log('===================================');
    console.log('URL:', BACKEND_URL);

    try {
        // 1. Testar se backend está online
        console.log('\n🔄 Testando se backend está online...');
        const testResponse = await fetch(`${BACKEND_URL}/api/test`, {
            timeout: 10000 // 10 segundos
        });
        
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('✅ Backend está online!');
            console.log('📊 Configuração:', testData);
        } else {
            throw new Error(`Backend retornou: ${testResponse.status} ${testResponse.statusText}`);
        }

        // 2. Testar envio de lead
        console.log('\n🔄 Testando envio de lead...');
        const leadData = {
            name: 'Teste Turbo Cloud',
            email: `teste-turbo-${Date.now()}@fasthomes.com.br`,
            phone: '(11) 99999-8888',
            utm_source: 'teste-turbo',
            utm_medium: 'script',
            utm_campaign: 'teste-backend',
            utm_term: 'tag-automatica',
            utm_content: 'teste-integracao',
            page_referrer: 'script-teste-turbo'
        };

        console.log('📧 Dados do lead:', leadData);

        const leadResponse = await fetch(`${BACKEND_URL}/api/activecampaign-with-tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData),
            timeout: 15000 // 15 segundos
        });

        if (leadResponse.ok) {
            const leadResult = await leadResponse.json();
            console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
            console.log('📊 Resultado completo:', JSON.stringify(leadResult, null, 2));
            
            if (leadResult.success) {
                console.log('\n✅ RESUMO DO SUCESSO:');
                console.log(`👤 Contato criado: ${leadResult.contact.name} (ID: ${leadResult.contact.id})`);
                console.log(`📧 Email: ${leadResult.contact.email}`);
                
                if (leadResult.tag && leadResult.tag.applied) {
                    console.log(`🎯 Tag aplicada: "${leadResult.tag.name}" (ID: ${leadResult.tag.id})`);
                    console.log('🏆 INTEGRAÇÃO 100% FUNCIONAL!');
                } else {
                    console.log('⚠️ Contato criado mas tag não foi aplicada');
                }
            }
        } else {
            const errorText = await leadResponse.text();
            console.error('❌ Erro no envio do lead:', errorText);
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        
        if (error.message.includes('timeout')) {
            console.log('\n💡 TIMEOUT - Possíveis causas:');
            console.log('   1. Backend está iniciando (aguarde alguns minutos)');
            console.log('   2. URL incorreta');
            console.log('   3. Firewall/rede bloqueando');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 DNS/URL - Possíveis causas:');
            console.log('   1. URL incorreta');
            console.log('   2. Domínio não existe');
            console.log('   3. Backend não foi deployado');
        } else {
            console.log('\n💡 Verifique:');
            console.log('   1. Se o backend foi deployado no Turbo Cloud');
            console.log('   2. Se a URL está correta');
            console.log('   3. Se o backend está rodando');
        }
    }
}

// Executar teste
testTurboBackend();
