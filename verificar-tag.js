/**
 * Script para descobrir o TAG_ID correto no Active Campaign
 * Execute este código no console do navegador para encontrar a tag
 */

async function descobrirTagID() {
    const config = {
        BASE_URL: 'https://fastdrywall80017.api-us1.com',
        API_KEY: 'w26bced605b889cf36e760aefc67231ae3256429c1622218b0830a3a224b6e464dc4c0f4e',
        TAG_NAME: 'catalogo-fast-homes-solicitado'
    };

    try {
        console.log('🔍 Buscando tags no Active Campaign...');

        const response = await fetch(`${config.BASE_URL}/api/3/tags`, {
            method: 'GET',
            headers: {
                'Api-Token': config.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('📋 Todas as tags encontradas:', data.tags);

        // Procurar nossa tag específica
        const targetTag = data.tags.find(tag =>
            tag.tag.toLowerCase().includes('catalogo') ||
            tag.tag.toLowerCase().includes('fast') ||
            tag.tag.toLowerCase().includes('homes')
        );

        if (targetTag) {
            console.log(`✅ Tag encontrada: "${targetTag.tag}" - ID: ${targetTag.id}`);
            console.log(`🔧 Atualize o config.js com: TAG_ID: ${targetTag.id}`);
        } else {
            console.log('❌ Tag não encontrada. Crie a tag "catalogo-fast-homes-solicitado" no Active Campaign');
        }

    } catch (error) {
        console.error('❌ Erro ao buscar tags:', error);
        console.log('💡 Isso pode ser devido ao CORS. Execute este script diretamente no Active Campaign ou use Postman');
    }
}

// Execute a função
descobrirTagID();
