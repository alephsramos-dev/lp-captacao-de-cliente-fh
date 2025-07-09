/**
 * Configurações do Active Campaign
 * 
 * CONFIGURAÇÃO SIMPLIFICADA PARA USO VIA proc.php (método que funciona)
 * 
 * INSTRUÇÕES:
 * 1. Os campos UTM já estão mapeados corretamente
 * 2. A integração usa proc.php (contorna CORS)
 * 3. A tag será aplicada automaticamente
 */

const ACTIVE_CAMPAIGN_CONFIG = {
    // URL base do Active Campaign
    BASE_URL: 'https://fastdrywall80017.activehosted.com',
    
    // API Key - CONFIGURE ANTES DE USAR A INTEGRAÇÃO DIRETA
    API_KEY: '26bced605b889cf36e760aefc67231ae3256429c1622218b0830a3a224b6e464dc4c0f4e', // Configure com sua API key do ActiveCampaign

    // Campos de formulário que serão enviados para ActiveCampaign
    // Estes são os IDs dos campos personalizados no AC
    CUSTOM_FIELDS: {
        UTM_SOURCE: 6,         // Campo UTM Source
        UTM_MEDIUM: 7,         // Campo UTM Medium  
        UTM_CAMPAIGN: 8,       // Campo UTM Campaign (note: AC tem typo 'CAMPAING')
        UTM_CONTENT: 10,       // Campo UTM Content
        UTM_TERM: 9,           // Campo UTM Term
        PAGE_REFERRER: 11      // Campo Page Referrer (se existir)
    },

    // Configurações do formulário ActiveCampaign
    FORM_CONFIG: {
        LIST_ID: 1,           // ID da lista no AC
        FORM_ID: 1,           // ID do formulário no AC  
        ACTION: 'sub',        // Ação: subscribe
        VERSION: 2            // Versão da API de formulários
    },

    // Tag que será aplicada (será aplicada automaticamente pelo formulário do AC)
    TAG_NAME: 'catalogo-fast-homes-solicitado',
    TAG_ID: null // Será descoberto dinamicamente ou configurado manualmente
};

// Mapeamento dos campos UTM para os campos do ActiveCampaign (formato proc.php)
const AC_FIELD_MAPPING = {
    utm_source: 'u[6]',      // Campo UTM Source no AC
    utm_medium: 'u[7]',      // Campo UTM Medium no AC  
    utm_campaign: 'u[8]',    // Campo UTM Campaign no AC
    utm_content: 'u[10]',    // Campo UTM Content no AC
    utm_term: 'u[9]',        // Campo UTM Term no AC
    page_referrer: 'u[11]'   // Campo Page Referrer no AC (se houver)
};

// Exportar para uso global
window.ACTIVE_CAMPAIGN_CONFIG = ACTIVE_CAMPAIGN_CONFIG;
window.AC_FIELD_MAPPING = AC_FIELD_MAPPING;
