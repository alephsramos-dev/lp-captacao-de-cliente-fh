# Configuração do Active Campaign

## Passos para Configurar

### 1. Obter a API Key do Active Campaign

1. Faça login na sua conta do Active Campaign
2. Vá para **Settings** → **Developer**
3. Copie sua **API Key**
4. Anote a **Base URL** da sua conta (exemplo: `https://minhaempresa.api-us1.com`)

### 2. Configurar o arquivo config.js

Abra o arquivo `src/config.js` e substitua:

```javascript
const ACTIVE_CAMPAIGN_CONFIG = {
    // Substitua pela URL da sua conta do Active Campaign
    BASE_URL: 'https://SUACONTAACTIVECAMPAIGN.api-us1.com',
    
    // Substitua pela sua API Key do Active Campaign
    API_KEY: 'SUA_API_KEY_AQUI',
    
    // Tag que será aplicada aos contatos
    TAG_NAME: 'catalogo-solicitado',
    
    // ... resto da configuração
};
```

### 3. Criar a Tag no Active Campaign

1. Acesse **Contacts** → **Tags** no Active Campaign
2. Clique em **Add Tag**
3. Crie uma tag com o nome: `catalogo-solicitado`
4. Salve a tag

### 4. Configurar Campos Personalizados (Opcional)

Se você quiser capturar informações de UTM e device info:

1. Vá para **Settings** → **Fields**
2. Crie os campos personalizados desejados:
   - UTM Source
   - UTM Campaign
   - UTM Medium
   - UTM Content
   - UTM Term
   - Referrer
   - Device Info
3. Anote o ID de cada campo
4. Atualize o arquivo `config.js` com os IDs:

```javascript
CUSTOM_FIELDS: {
    UTM_SOURCE: 1,      // ID do campo personalizado para UTM Source
    UTM_CAMPAIGN: 2,    // ID do campo personalizado para UTM Campaign
    UTM_MEDIUM: 3,      // ID do campo personalizado para UTM Medium
    // ... e assim por diante
}
```

### 5. Testar a Integração

1. Abra o site no navegador
2. Preencha o formulário com dados de teste
3. Envie o formulário
4. Verifique no Active Campaign se:
   - O contato foi criado
   - A tag "catalogo-solicitado" foi aplicada
   - Os campos personalizados foram preenchidos (se configurados)

### 6. Monitorar Erros

Abra o console do navegador (F12) para ver logs de:
- Sucesso na criação do contato
- Sucesso na aplicação da tag
- Possíveis erros de integração

## Estrutura dos Dados Enviados

O sistema enviará os seguintes dados para o Active Campaign:

```json
{
    "contact": {
        "email": "email@exemplo.com",
        "firstName": "João",
        "lastName": "Silva",
        "phone": "11999999999",
        "fieldValues": [
            {
                "field": "ID_CAMPO_UTM_SOURCE",
                "value": "google"
            }
        ]
    }
}
```

## Problemas Comuns

### Erro 401 - Unauthorized
- Verifique se a API Key está correta
- Certifique-se de que a Base URL está correta

### Erro 422 - Unprocessable Entity
- Geralmente indica que o contato já existe
- O sistema tentará buscar o contato existente automaticamente

### Tag não aplicada
- Verifique se a tag existe no Active Campaign
- Confirme se o nome da tag está correto no config.js

## Logs de Debug

O sistema registra logs detalhados no console:
- `Contact created/updated:` - Contato criado ou atualizado
- `Contact found:` - Contato existente encontrado
- `Tag added successfully:` - Tag aplicada com sucesso
- `Active Campaign error:` - Erro na integração

## Fallback

O sistema mantém o envio para o Pipe.run como backup. Mesmo se o Active Campaign falhar, os dados ainda serão enviados para o sistema original.
