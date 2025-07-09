/**
 * Solução DEFINITIVA para Active Campaign
 * 
 * Como o CORS bloqueia requisições diretas, vamos usar o Make.com (Integromat)
 * que é um serviço gratuito e confiável para integrações
 */

// Substitua pela URL do seu webhook do Make.com
const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/YOUR_WEBHOOK_ID_HERE';

async function sendToActiveCampaignViaMake(formData) {
    const config = window.ACTIVE_CAMPAIGN_CONFIG;

    const payload = {
        // Dados do contato
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,

        // Configurações do Active Campaign
        acBaseUrl: config.BASE_URL,
        acApiKey: config.API_KEY,
        acTag: config.TAG_NAME,

        // UTMs
        utmSource: formData.utm_source || '',
        utmMedium: formData.utm_medium || '',
        utmCampaign: formData.utm_campaign || '',
        utmContent: formData.utm_content || '',
        utmTerm: formData.utm_term || '',

        // IDs dos campos no Active Campaign
        fieldIds: config.CUSTOM_FIELDS,

        // Metadados
        timestamp: new Date().toISOString(),
        source: 'Fast Homes Landing Page'
    };

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Make.com webhook success:', result);
            return { success: true, data: result };
        } else {
            throw new Error(`Make.com webhook error: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Make.com webhook error:', error);
        return { success: false, error: error.message };
    }
}

// Função para usar Netlify Functions (alternativa)
async function sendToActiveCampaignViaNetlify(formData) {
    const netlifyFunctionUrl = '/.netlify/functions/active-campaign';

    const payload = {
        contact: formData,
        config: window.ACTIVE_CAMPAIGN_CONFIG
    };

    try {
        const response = await fetch(netlifyFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Netlify Function success:', result);
            return { success: true, data: result };
        } else {
            throw new Error(`Netlify Function error: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Netlify Function error:', error);
        return { success: false, error: error.message };
    }
}

// Exportar funções
window.sendToActiveCampaignViaMake = sendToActiveCampaignViaMake;
window.sendToActiveCampaignViaNetlify = sendToActiveCampaignViaNetlify;
