/**
 * Script para Descobrir IDs dos Campos Personalizados do Active Campaign
 * Versão que funciona através do backend (sem CORS)
 */

async function discoverFieldsViaBackend() {
    console.log('=== DESCOBRINDO CAMPOS VIA TESTE DE SUBMISSÃO ===');

    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    // Função para testar um campo específico
    async function testFieldId(fieldId, fieldName) {
        try {
            const testContact = {
                contact: {
                    email: `test-${Date.now()}@teste.com`,
                    firstName: 'Teste',
                    lastName: 'Campo',
                    fieldValues: [
                        {
                            field: fieldId,
                            value: `Teste ${fieldName}`
                        }
                    ]
                }
            };

            const response = await fetch(`${config.BASE_URL}/api/3/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': config.API_KEY
                },
                body: JSON.stringify(testContact)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Campo ID ${fieldId} (${fieldName}) existe e funciona!`);

                // Deletar o contato de teste
                if (result.contact && result.contact.id) {
                    await fetch(`${config.BASE_URL}/api/3/contacts/${result.contact.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Api-Token': config.API_KEY
                        }
                    });
                }

                return true;
            } else {
                console.log(`❌ Campo ID ${fieldId} (${fieldName}) não existe ou erro: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Erro ao testar campo ID ${fieldId} (${fieldName}): ${error.message}`);
            return false;
        }
    }

    // Testar IDs de 1 a 20 para encontrar os campos
    console.log('🔍 Testando IDs de campos de 1 a 20...');
    const validFields = [];

    for (let i = 1; i <= 20; i++) {
        const isValid = await testFieldId(i, `Campo ${i}`);
        if (isValid) {
            validFields.push(i);
        }

        // Delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('');
    console.log('✅ CAMPOS VÁLIDOS ENCONTRADOS:');
    console.log('IDs válidos:', validFields);

    console.log('');
    console.log('💡 CONFIGURAÇÃO SUGERIDA PARA config.js:');
    console.log('');
    console.log('CUSTOM_FIELDS: {');

    if (validFields.length >= 1) console.log(`    UTM_SOURCE: ${validFields[0]},      // UTM Source`);
    if (validFields.length >= 2) console.log(`    UTM_MEDIUM: ${validFields[1]},      // UTM Medium`);
    if (validFields.length >= 3) console.log(`    UTM_CAMPAIGN: ${validFields[2]},    // UTM Campaign`);
    if (validFields.length >= 4) console.log(`    UTM_TERM: ${validFields[3]},        // UTM Term`);
    if (validFields.length >= 5) console.log(`    UTM_CONTENT: ${validFields[4]},     // UTM Content`);
    if (validFields.length >= 6) console.log(`    REFERRER: ${validFields[5]},        // Referrer/Origem`);
    if (validFields.length >= 7) console.log(`    DEVICE_INFO: ${validFields[6]}      // Device Info/Título`);

    console.log('}');

    return validFields;
}

// Função mais simples baseada nos campos que você tem
function configureKnownFields() {
    console.log('=== CONFIGURAÇÃO BASEADA NOS CAMPOS CONHECIDOS ===');
    console.log('');
    console.log('Com base nos campos que você tem no Active Campaign:');
    console.log('- Origem -> %ORIGEM%');
    console.log('- Título -> %TITULO%');
    console.log('- Tags -> %CUSTOMTAGS%');
    console.log('- Nome Completo -> %NOME_COMPLETO%');
    console.log('- Tipo de Lead -> %TIPO_DE_LEAD%');
    console.log('- UTM Source -> %UTM_SOURCE%');
    console.log('- UTM Medium -> %UTM_MEDIUM%');
    console.log('- UTM Campaing -> %UTM_CAMPAING%');
    console.log('- UTM Term -> %UTM_TERM%');
    console.log('- UTM Content -> %UTM_CONTENT%');
    console.log('');
    console.log('💡 CONFIGURAÇÃO SUGERIDA (baseada em ordem típica):');
    console.log('');
    console.log('CUSTOM_FIELDS: {');
    console.log('    UTM_SOURCE: 6,      // UTM Source');
    console.log('    UTM_MEDIUM: 7,      // UTM Medium');
    console.log('    UTM_CAMPAIGN: 8,    // UTM Campaign');
    console.log('    UTM_TERM: 9,        // UTM Term');
    console.log('    UTM_CONTENT: 10,    // UTM Content');
    console.log('    REFERRER: 1,        // Origem');
    console.log('    DEVICE_INFO: 2      // Título');
    console.log('}');
    console.log('');
    console.log('⚠️ IMPORTANTE: Os IDs acima são estimativas!');
    console.log('Execute discoverFieldsViaBackend() para descobrir os IDs reais.');
}

console.log('🛠️ FERRAMENTAS DISPONÍVEIS:');
console.log('');
console.log('1. configureKnownFields() - Configuração baseada nos seus campos');
console.log('2. discoverFieldsViaBackend() - Descobrir IDs reais (recomendado)');
console.log('');
console.log('💡 Execute configureKnownFields() primeiro para ver sugestões!');
