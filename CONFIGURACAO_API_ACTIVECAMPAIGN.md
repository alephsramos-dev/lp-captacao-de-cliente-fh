/**
 * Exemplo de configuração para ActiveCampaign com API Key
 * 
 * INSTRUÇÕES PARA CONFIGURAR A INTEGRAÇÃO COM TAGS:
 * 
 * 1. Obtenha sua API Key do ActiveCampaign:
 *    - Acesse sua conta ActiveCampaign
 *    - Vá em Settings > Developer
 *    - Copie a API Key
 * 
 * 2. Configure a API Key no arquivo src/config.js:
 *    - Substitua API_KEY: null por API_KEY: 'sua-api-key-aqui'
 * 
 * 3. A tag 'catalogo-fast-homes-solicitado' será criada automaticamente
 *    se não existir, ou usada se já existir.
 * 
 * EXEMPLO DE CONFIGURAÇÃO:
 */

const ACTIVE_CAMPAIGN_CONFIG_EXAMPLE = {
    // URL base do Active Campaign
    BASE_URL: 'https://fastdrywall80017.activehosted.com',
    
    // API Key - SUBSTITUA por sua API key real
    API_KEY: 'sua-api-key-aqui-exemplo-abc123def456',

    // Campos de formulário que serão enviados para ActiveCampaign
    CUSTOM_FIELDS: {
        UTM_SOURCE: 6,
        UTM_MEDIUM: 7,
        UTM_CAMPAIGN: 8,
        UTM_CONTENT: 10,
        UTM_TERM: 9,
        PAGE_REFERRER: 11
    },

    // Configurações do formulário ActiveCampaign
    FORM_CONFIG: {
        LIST_ID: 1,
        FORM_ID: 1,
        ACTION: 'sub',
        VERSION: 2
    },

    // Tag que será aplicada automaticamente
    TAG_NAME: 'catalogo-fast-homes-solicitado',
    TAG_ID: null // Será descoberto ou criado automaticamente
};

/*
FLUXO DE FUNCIONAMENTO:

1. Usuário preenche o formulário
2. Sistema tenta integração direta com ActiveCampaign:
   a. Busca ou cria o contato
   b. Busca ou cria a tag 'catalogo-fast-homes-solicitado'
   c. Aplica a tag ao contato
3. Se falhar (CORS), usa fallback via Pipe.run

VANTAGENS DA INTEGRAÇÃO DIRETA:
- Tag aplicada instantaneamente
- Maior controle sobre o processo
- Logs detalhados
- Criação automática de tags

FALLBACK (se CORS bloquear):
- Dados incluídos no Pipe.run
- Integração via webhook ou automação
- Funciona mesmo sem configurar API Key
*/
