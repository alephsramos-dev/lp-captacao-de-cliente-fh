/**
 * Webhook para Active Campaign - Solução CORS
 * 
 * Como o Active Campaign bloqueia requisições diretas do navegador,
 * vamos usar um webhook/proxy simples
 */

// Configurações do webhook
const WEBHOOK_CONFIG = {
    // Use um serviço como Zapier, Make.com, ou um webhook personalizado
    WEBHOOK_URL: 'https://hook.us1.make.com/YOUR_WEBHOOK_ID', // Substitua pela sua URL

    // Ou use o serviço CORS-anywhere (apenas para desenvolvimento)
    CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',

    // Ou use seu próprio endpoint
    CUSTOM_ENDPOINT: 'https://sua-api.vercel.app/active-campaign'
};

// Função para enviar via webhook
async function sendToActiveCampaignViaWebhook(contactData, utmData, tagName) {
    const payload = {
        contact: contactData,
        utms: utmData,
        tag: tagName,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(WEBHOOK_CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Webhook Success:', result);
            return { success: true, data: result };
        } else {
            throw new Error(`Webhook error: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Webhook Error:', error);
        return { success: false, error: error.message };
    }
}

// Função alternativa usando CORS proxy (apenas desenvolvimento)
async function sendToActiveCampaignViaCORS(contactData, utmData, tagName, config) {
    const proxyUrl = WEBHOOK_CONFIG.CORS_PROXY + config.BASE_URL + '/api/3/contacts';

    const payload = {
        contact: {
            email: contactData.email,
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            phone: contactData.phone,
            fieldValues: [
                { field: config.CUSTOM_FIELDS.UTM_SOURCE, value: utmData.utm_source || '' },
                { field: config.CUSTOM_FIELDS.UTM_MEDIUM, value: utmData.utm_medium || '' },
                { field: config.CUSTOM_FIELDS.UTM_CAMPAIGN, value: utmData.utm_campaign || '' },
                { field: config.CUSTOM_FIELDS.UTM_CONTENT, value: utmData.utm_content || '' },
                { field: config.CUSTOM_FIELDS.UTM_TERM, value: utmData.utm_term || '' }
            ].filter(field => field.value)
        }
    };

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': config.API_KEY,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ CORS Proxy Success:', result);

            // Adicionar tag
            if (result.contact && result.contact.id) {
                await addTagViaCORS(result.contact.id, tagName, config);
            }

            return { success: true, data: result };
        } else {
            throw new Error(`CORS Proxy error: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ CORS Proxy Error:', error);
        return { success: false, error: error.message };
    }
}

async function addTagViaCORS(contactId, tagName, config) {
    const proxyUrl = WEBHOOK_CONFIG.CORS_PROXY + config.BASE_URL + '/api/3/contactTags';

    const tagData = {
        contactTag: {
            contact: contactId,
            tag: tagName
        }
    };

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': config.API_KEY,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(tagData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Tag added via CORS:', result);
            return result;
        }
    } catch (error) {
        console.error('❌ Tag CORS Error:', error);
    }
}

// Exportar funções
window.WEBHOOK_CONFIG = WEBHOOK_CONFIG;
window.sendToActiveCampaignViaWebhook = sendToActiveCampaignViaWebhook;
window.sendToActiveCampaignViaCORS = sendToActiveCampaignViaCORS;
