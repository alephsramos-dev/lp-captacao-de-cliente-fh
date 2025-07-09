# Como Descobrir os IDs dos Campos Personalizados

## Passo a Passo

### 1. Abra o Site no Navegador
Abra o arquivo `index.html` no seu navegador

### 2. Abra o Console do Navegador
Pressione **F12** e vá para a aba **Console**

### 3. Execute o Script de Descoberta
No console, digite e pressione Enter:

```javascript
discoverCustomFields()
```

### 4. Analise os Resultados
O script irá mostrar:
- ✅ Todos os campos personalizados existentes
- 🎯 Sugestões de campos para UTM
- 📋 IDs dos campos encontrados

### 5. Copie os IDs
Copie os IDs dos campos que você quer usar e cole no arquivo `config.js`

## Exemplo de Saída

```
📋 Campos do tipo "text":
  ID: 1 | Nome: UTM Source | Tipo: text
  ID: 2 | Nome: UTM Campaign | Tipo: text
  ID: 3 | Nome: Company | Tipo: text
```

## Se Não Houver Campos UTM

Se não existirem campos para UTM, você pode criar automaticamente:

```javascript
createUTMFields()
```

Este comando criará automaticamente os campos:
- UTM Source
- UTM Campaign  
- UTM Medium
- UTM Content
- UTM Term
- Referrer
- Device Info

## Atualizando o config.js

Após descobrir os IDs, edite o arquivo `src/config.js`:

```javascript
CUSTOM_FIELDS: {
    UTM_SOURCE: 1,      // ID do campo UTM Source
    UTM_CAMPAIGN: 2,    // ID do campo UTM Campaign
    UTM_MEDIUM: 3,      // ID do campo UTM Medium
    // ... outros campos
}
```

## Dicas Importantes

- ✅ Deixe `null` para campos que não existem
- ✅ Use apenas IDs numéricos dos campos
- ✅ Teste após configurar usando `testActiveCampaignConfig()`
- ❌ Remova o script `discover-fields.js` em produção

## Exemplo Completo

```javascript
CUSTOM_FIELDS: {
    UTM_SOURCE: 1,      // ✅ Campo existe
    UTM_CAMPAIGN: 2,    // ✅ Campo existe
    UTM_MEDIUM: null,   // ❌ Campo não existe
    UTM_CONTENT: null,  // ❌ Campo não existe
    UTM_TERM: null,     // ❌ Campo não existe
    REFERRER: 5,        // ✅ Campo existe
    DEVICE_INFO: 6      // ✅ Campo existe
}
```

## Próximos Passos

1. ✅ Descobrir IDs dos campos
2. ✅ Atualizar config.js
3. ✅ Testar configuração
4. ✅ Testar formulário
5. ✅ Remover scripts de desenvolvimento
