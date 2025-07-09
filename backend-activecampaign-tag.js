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
    LIST_ID: 1, // ID da lista "Leads"
    LIST_NAME: 'Leads',
    CUSTOM_FIELDS: {
        UTM_SOURCE: 6,
        UTM_MEDIUM: 7,
        UTM_CAMPAIGN: 8,
        UTM_CONTENT: 10,
        UTM_TERM: 9,
        PAGE_REFERRER: 11
    }
};

// Configuração CORS mais específica para resolver problemas de preflight
const corsOptions = {
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500', 
        'https://127.0.0.1:5500',
        'https://localhost:5500',
        'https://fasthomesac.fastsistemasconstrutivos.com.br',
        'http://fasthomesac.fastsistemasconstrutivos.com.br',
        '*' // Para desenvolvimento - remover em produção
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Para suportar navegadores legados
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware adicional para CORS em todas as rotas
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    
    // Responder a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    
    next();
});

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

// Função para adicionar contato à lista
async function addContactToList(contactId, listId) {
    const addToListUrl = `${ACTIVE_CAMPAIGN_CONFIG.API_URL}/api/3/contactLists`;
    
    const addToListData = {
        contactList: {
            list: listId,
            contact: contactId,
            status: 1 // 1 = active, 2 = unsubscribed
        }
    };

    try {
        console.log('Adicionando contato à lista...');
        console.log('Contact ID:', contactId);
        console.log('List ID:', listId);
        
        const response = await fetch(addToListUrl, {
            method: 'POST',
            headers: {
                'Api-Token': ACTIVE_CAMPAIGN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addToListData)
        });

        const responseData = await response.text();
        
        if (response.ok) {
            console.log('Contato adicionado à lista com sucesso');
            return { success: true, data: responseData };
        } else {
            console.log('Erro ao adicionar à lista:', response.status, responseData);
            return { success: false, error: responseData, status: response.status };
        }
    } catch (error) {
        console.error('Erro na requisição de adicionar à lista:', error);
        return { success: false, error: error.message };
    }
}

// Função para construir mensagem de sucesso
function buildSuccessMessage(tagResult, listResult) {
    let message = 'Lead processado com sucesso!';
    
    if (tagResult && tagResult.success) {
        message += ' Tag aplicada.';
    }
    
    if (listResult && listResult.success) {
        message += ' Adicionado à lista "Leads".';
    }
    
    return message;
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

        // 6. Adicionar contato à lista "Leads"
        console.log(`📋 Adicionando contato à lista "${ACTIVE_CAMPAIGN_CONFIG.LIST_NAME}"...`);
        const addedToList = await addContactToList(contactId, ACTIVE_CAMPAIGN_CONFIG.LIST_ID);

        // 7. Resposta final
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
            list: {
                id: ACTIVE_CAMPAIGN_CONFIG.LIST_ID,
                name: ACTIVE_CAMPAIGN_CONFIG.LIST_NAME,
                added: addedToList
            },
            message: buildSuccessMessage({ success: tagApplied }, { success: addedToList })
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
