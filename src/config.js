/**
 * Configurações do Active Campaign
 * 
 * CONFIGURAÇÃO PARA USO VIA SERVIDOR BACKEND NODE.JS
 * Servidor: fasthomesac.fastsistemasconstrutivos.com.br
 * 
 * INSTRUÇÕES:
 * 1. O servidor backend Node.js cuida da integração com ActiveCampaign
 * 2. A tag 'catalogo-fast-homes-solicitado' é aplicada automaticamente
 * 3. Fallback via proc.php disponível em caso de erro
 */

const ACTIVE_CAMPAIGN_CONFIG = {
    // URL do servidor backend Node.js
    BACKEND_URL: 'https://fasthomesac.fastsistemasconstrutivos.com.br',
    
    // URL base do Active Campaign (para fallback)
    BASE_URL: 'https://fastdrywall80017.activehosted.com',
    
    // API Key - para uso no servidor backend
    API_KEY: '26bced605b889cf36e760aefc67231ae3256429c1622218b0830a3a224b6e464dc4c0f4e',

    // Campos de formulário que serão enviados para ActiveCampaign
    // Estes são os IDs dos campos personalizados no AC
    CUSTOM_FIELDS: {
        UTM_SOURCE: 6,         // Campo UTM Source
        UTM_MEDIUM: 7,         // Campo UTM Medium  
        UTM_CAMPAIGN: 8,       // Campo UTM Campaign
        UTM_CONTENT: 10,       // Campo UTM Content
        UTM_TERM: 9,           // Campo UTM Term
        PAGE_REFERRER: 11      // Campo Page Referrer (se existir)
    },

    // Configurações do formulário ActiveCampaign (para fallback)
    FORM_CONFIG: {
        LIST_ID: 1,           // ID da lista no AC
        FORM_ID: 1,           // ID do formulário no AC  
        ACTION: 'sub',        // Ação: subscribe
        VERSION: 2            // Versão da API de formulários
    },

    // Tag que será aplicada pelo servidor backend
    TAG_NAME: 'catalogo-fast-homes-solicitado',
    TAG_ID: null // Será descoberto dinamicamente pelo servidor backend
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
