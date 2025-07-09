// backend-activecampaign-tag.js
// Backend Node.js para enviar leads para ActiveCampaign com tag automática
// Rode com: node backend-activecampaign-tag.js

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Configurações da sua conta ActiveCampaign
const ACTIVE_CAMPAIGN_CONFIG = {
    API_URL: 'https://fastdrywall80017.api-us1.com',
    API_KEY: '26bced605b889cf36e760aefc67231ae3256429c1622218b0830a3a224b6e464dc4c0f4e',
    TAG_NAME: 'catalogo-fast-homes-solicitado',
    LIST_ID: 1,
    CUSTOM_FIELDS: {
        UTM_SOURCE: 6,
        UTM_MEDIUM: 7,
        UTM_CAMPAIGN: 8,
        UTM_CONTENT: 10,
        UTM_TERM: 9,
        PAGE_REFERRER: 11
    }
};

app.use(cors());
app.use(express.json());

// Função para buscar ou criar uma tag
async function findOrCreateTag(tagName) {
    try {
        // Buscar tag existente
        const searchResponse = await fetch(`${ACTIVE_CAMPAIGN_CONFIG.API_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`, {
            method: 'GET',
            headers: {
                'Api-Token': ACTIVE_CAMPAIGN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            const existingTag = searchData.tags?.find(tag => 
                tag.tag.toLowerCase() === tagName.toLowerCase()
            );

            if (existingTag) {
                console.log(`✅ Tag encontrada: ${tagName} (ID: ${existingTag.id})`);
                return existingTag.id;
            }
        }

        // Criar nova tag se não encontrar
        console.log(`🔄 Criando nova tag: ${tagName}`);
        const createResponse = await fetch(`${ACTIVE_CAMPAIGN_CONFIG.API_URL}/api/3/tags`, {
            method: 'POST',
            headers: {
                'Api-Token': ACTIVE_CAMPAIGN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tag: {
                    tag: tagName,
                    tagType: 'contact',
                    description: `Tag criada automaticamente para ${tagName}`
                }
            })
        });

        if (createResponse.ok) {
            const createData = await createResponse.json();
            console.log(`✅ Tag criada: ${tagName} (ID: ${createData.tag.id})`);
            return createData.tag.id;
        } else {
            throw new Error(`Erro ao criar tag: ${createResponse.status}`);
        }

    } catch (error) {
        console.error('❌ Erro ao buscar/criar tag:', error);
        throw error;
    }
}

// Função para aplicar tag a um contato
async function applyTagToContact(contactId, tagId) {
    try {
        const response = await fetch(`${ACTIVE_CAMPAIGN_CONFIG.API_URL}/api/3/contactTags`, {
            method: 'POST',
            headers: {
                'Api-Token': ACTIVE_CAMPAIGN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contactTag: {
                    contact: contactId.toString(),
                    tag: tagId.toString()
                }
            })
        });

        if (response.ok) {
            console.log(`✅ Tag aplicada ao contato ${contactId}`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Erro ao aplicar tag: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao aplicar tag:', error);
        return false;
    }
}

// Endpoint principal para receber leads
app.post('/api/activecampaign-with-tag', async (req, res) => {
    const { name, email, phone, utm_source, utm_medium, utm_campaign, utm_term, utm_content, page_referrer } = req.body;

    console.log('🔄 Recebido lead do frontend:', { name, email, phone });

    try {
        // 1. Preparar dados do contato
        const nameParts = name.split(' ');
        const contactData = {
            contact: {
                email: email,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                phone: phone,
                fieldValues: []
            }
        };

        // 2. Adicionar campos UTM se preenchidos
        const utmData = { utm_source, utm_medium, utm_campaign, utm_term, utm_content, page_referrer };
        Object.entries(utmData).forEach(([key, value]) => {
            const fieldId = ACTIVE_CAMPAIGN_CONFIG.CUSTOM_FIELDS[key.toUpperCase()];
            if (value && value.trim() && fieldId) {
                contactData.contact.fieldValues.push({
                    field: fieldId,
                    value: value.trim()
                });
            }
        });

        // 3. Criar/atualizar contato
        console.log('📝 Criando contato no ActiveCampaign...');
        const contactResponse = await fetch(`${ACTIVE_CAMPAIGN_CONFIG.API_URL}/api/3/contact/sync`, {
            method: 'POST',
            headers: {
                'Api-Token': ACTIVE_CAMPAIGN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        if (!contactResponse.ok) {
            throw new Error(`Erro ao criar contato: ${contactResponse.status}`);
        }

        const contactResult = await contactResponse.json();
        const contactId = contactResult.contact.id;
        console.log(`✅ Contato criado/atualizado: ${email} (ID: ${contactId})`);

        // 4. Buscar ou criar a tag
        const tagId = await findOrCreateTag(ACTIVE_CAMPAIGN_CONFIG.TAG_NAME);

        // 5. Aplicar tag ao contato
        const tagApplied = await applyTagToContact(contactId, tagId);

        // 6. Resposta final
        const result = {
            success: true,
            contact: {
                id: contactId,
                email: email,
                name: name
            },
            tag: {
                id: tagId,
                name: ACTIVE_CAMPAIGN_CONFIG.TAG_NAME,
                applied: tagApplied
            },
            message: tagApplied ? 
                `Lead criado e tag "${ACTIVE_CAMPAIGN_CONFIG.TAG_NAME}" aplicada com sucesso!` :
                `Lead criado com sucesso, mas houve problema ao aplicar a tag.`
        };

        console.log('🎉 Processo concluído:', result);
        res.status(200).json(result);

    } catch (error) {
        console.error('❌ Erro no processamento:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: 'Erro interno do servidor'
        });
    }
});

// Endpoint de teste
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend ActiveCampaign funcionando!',
        config: {
            API_URL: ACTIVE_CAMPAIGN_CONFIG.API_URL,
            TAG_NAME: ACTIVE_CAMPAIGN_CONFIG.TAG_NAME,
            API_KEY_CONFIGURED: !!ACTIVE_CAMPAIGN_CONFIG.API_KEY
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend ActiveCampaign rodando na porta ${PORT}`);
    console.log(`🔗 Endpoint: http://localhost:${PORT}/api/activecampaign-with-tag`);
    console.log(`🧪 Teste: http://localhost:${PORT}/api/test`);
    console.log(`🎯 Tag configurada: "${ACTIVE_CAMPAIGN_CONFIG.TAG_NAME}"`);
});
