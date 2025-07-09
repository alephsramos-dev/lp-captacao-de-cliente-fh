/**
 * Script para Descobrir IDs dos Campos Personalizados do Active Campaign
 * 
 * Este script faz uma requisição para a API do Active Campaign para listar
 * todos os campos personalizados disponíveis e seus IDs
 */

async function discoverCustomFields() {
    console.log('=== DESCOBRINDO CAMPOS PERSONALIZADOS DO ACTIVE CAMPAIGN ===');

    // Verificar se a configuração foi carregada
    if (typeof window.ACTIVE_CAMPAIGN_CONFIG === 'undefined') {
        console.error('❌ Arquivo config.js não foi carregado corretamente');
        return false;
    }

    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    try {
        console.log('🔍 Buscando campos personalizados...');

        // Fazer requisição para listar campos personalizados
        const response = await fetch(`${config.BASE_URL}/api/3/fields`, {
            method: 'GET',
            headers: {
                'Api-Token': config.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.fields && data.fields.length > 0) {
            console.log('✅ Campos personalizados encontrados:');
            console.log('');

            // Organizar campos por tipo
            const fieldsByType = {};

            data.fields.forEach(field => {
                if (!fieldsByType[field.type]) {
                    fieldsByType[field.type] = [];
                }
                fieldsByType[field.type].push(field);
            });

            // Mostrar todos os campos
            Object.keys(fieldsByType).forEach(type => {
                console.log(`📋 Campos do tipo "${type}":`);
                fieldsByType[type].forEach(field => {
                    console.log(`  ID: ${field.id} | Nome: ${field.title} | Tipo: ${field.type}`);
                });
                console.log('');
            });

            // Sugerir campos relevantes para UTM
            console.log('💡 SUGESTÕES DE CAMPOS PARA UTM:');
            console.log('');

            const utmSuggestions = data.fields.filter(field =>
                field.title.toLowerCase().includes('utm') ||
                field.title.toLowerCase().includes('source') ||
                field.title.toLowerCase().includes('campaign') ||
                field.title.toLowerCase().includes('medium') ||
                field.title.toLowerCase().includes('content') ||
                field.title.toLowerCase().includes('term') ||
                field.title.toLowerCase().includes('referrer') ||
                field.title.toLowerCase().includes('device')
            );

            if (utmSuggestions.length > 0) {
                console.log('🎯 Campos que podem ser usados para UTM/tracking:');
                utmSuggestions.forEach(field => {
                    console.log(`  ID: ${field.id} | Nome: ${field.title} | Tipo: ${field.type}`);
                });
            } else {
                console.log('ℹ️ Nenhum campo relacionado a UTM encontrado.');
                console.log('💡 Você pode criar campos personalizados no Active Campaign para:');
                console.log('  - UTM Source');
                console.log('  - UTM Campaign');
                console.log('  - UTM Medium');
                console.log('  - UTM Content');
                console.log('  - UTM Term');
                console.log('  - Referrer');
                console.log('  - Device Info');
            }

            console.log('');
            console.log('📝 COMO USAR OS IDs:');
            console.log('');
            console.log('Copie os IDs desejados e cole no arquivo config.js:');
            console.log('');
            console.log('CUSTOM_FIELDS: {');
            console.log('    UTM_SOURCE: ID_DO_CAMPO,      // Substitua pelo ID do campo');
            console.log('    UTM_CAMPAIGN: ID_DO_CAMPO,    // Substitua pelo ID do campo');
            console.log('    UTM_MEDIUM: ID_DO_CAMPO,      // Substitua pelo ID do campo');
            console.log('    // ... outros campos');
            console.log('}');

        } else {
            console.log('ℹ️ Nenhum campo personalizado encontrado.');
            console.log('💡 Você pode criar campos personalizados no Active Campaign em Settings > Fields');
        }

    } catch (error) {
        console.error('❌ Erro ao buscar campos personalizados:', error);

        if (error.message.includes('401')) {
            console.error('🔐 Erro de autenticação. Verifique sua API Key.');
        } else if (error.message.includes('403')) {
            console.error('🚫 Acesso negado. Verifique as permissões da sua API Key.');
        } else if (error.message.includes('404')) {
            console.error('🔍 Endpoint não encontrado. Verifique a Base URL.');
        }

        return false;
    }

    console.log('=== DESCOBERTA CONCLUÍDA ===');
    return true;
}

// Também criar uma função para criar campos personalizados
async function createUTMFields() {
    console.log('=== CRIANDO CAMPOS PERSONALIZADOS PARA UTM ===');

    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    const fieldsToCreate = [
        { title: 'UTM Source', type: 'text', descript: 'Fonte do tráfego (UTM Source)' },
        { title: 'UTM Campaign', type: 'text', descript: 'Campanha (UTM Campaign)' },
        { title: 'UTM Medium', type: 'text', descript: 'Meio/Canal (UTM Medium)' },
        { title: 'UTM Content', type: 'text', descript: 'Conteúdo (UTM Content)' },
        { title: 'UTM Term', type: 'text', descript: 'Termo (UTM Term)' },
        { title: 'Referrer', type: 'text', descript: 'Página de referência' },
        { title: 'Device Info', type: 'textarea', descript: 'Informações do dispositivo' }
    ];

    try {
        const createdFields = [];

        for (const fieldData of fieldsToCreate) {
            console.log(`🔄 Criando campo: ${fieldData.title}`);

            const response = await fetch(`${config.BASE_URL}/api/3/fields`, {
                method: 'POST',
                headers: {
                    'Api-Token': config.API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ field: fieldData })
            });

            if (response.ok) {
                const result = await response.json();
                createdFields.push(result.field);
                console.log(`✅ Campo "${fieldData.title}" criado com ID: ${result.field.id}`);
            } else {
                const error = await response.text();
                console.log(`⚠️ Erro ao criar campo "${fieldData.title}": ${error}`);
            }
        }

        if (createdFields.length > 0) {
            console.log('');
            console.log('🎉 CAMPOS CRIADOS COM SUCESSO!');
            console.log('');
            console.log('📋 Copie e cole no seu config.js:');
            console.log('');
            console.log('CUSTOM_FIELDS: {');

            createdFields.forEach(field => {
                const fieldName = field.title.replace(/\s+/g, '_').toUpperCase();
                console.log(`    ${fieldName}: ${field.id},      // ${field.title}`);
            });

            console.log('}');
        }

    } catch (error) {
        console.error('❌ Erro ao criar campos personalizados:', error);
        return false;
    }

    console.log('=== CRIAÇÃO CONCLUÍDA ===');
    return true;
}

console.log('🛠️ FERRAMENTAS DISPONÍVEIS:');
console.log('');
console.log('1. discoverCustomFields() - Descobrir IDs dos campos existentes');
console.log('2. createUTMFields() - Criar campos personalizados para UTM');
console.log('');
console.log('💡 Execute uma das funções acima no console para começar!');
