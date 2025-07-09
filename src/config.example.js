/**
 * Exemplo de Configuração do Active Campaign
 * 
 * Este é um exemplo de como o arquivo config.js deve ficar após a configuração
 * COPIE este conteúdo para o arquivo config.js e substitua pelos seus dados reais
 */

const ACTIVE_CAMPAIGN_CONFIG = {
    // Exemplo: 'https://minhaempresa.api-us1.com'
    BASE_URL: 'https://fasthomes.api-us1.com',

    // Exemplo: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
    API_KEY: 'sua-api-key-de-40-caracteres-aqui',

    // Tag que será aplicada aos contatos
    TAG_NAME: 'catalogo-solicitado',

    // IDs dos campos personalizados (opcional)
    // Deixe null se não quiser usar
    CUSTOM_FIELDS: {
        UTM_SOURCE: 1,      // ID do campo personalizado para UTM Source
        UTM_CAMPAIGN: 2,    // ID do campo personalizado para UTM Campaign
        UTM_MEDIUM: 3,      // ID do campo personalizado para UTM Medium
        UTM_CONTENT: 4,     // ID do campo personalizado para UTM Content
        UTM_TERM: 5,        // ID do campo personalizado para UTM Term
        REFERRER: 6,        // ID do campo personalizado para Referrer
        DEVICE_INFO: 7      // ID do campo personalizado para Device Info
    }
};

// Exportar para uso no script principal
window.ACTIVE_CAMPAIGN_CONFIG = ACTIVE_CAMPAIGN_CONFIG;
