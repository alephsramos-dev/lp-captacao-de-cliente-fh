# Instruções para Servidor Backend Node.js ActiveCampaign

## ✅ CONFIGURAÇÃO ATUALIZADA

O servidor está configurado em **Node.js** no domínio:
**https://fasthomesac.fastsistemasconstrutivos.com.br**

## � CONFIGURAÇÃO ATUAL

# Instruções para Servidor Backend Node.js ActiveCampaign

## ✅ CONFIGURAÇÃO ATUALIZADA

O servidor Node.js está configurado no domínio:
**https://fasthomesac.fastsistemasconstrutivos.com.br/api/activecampaign-with-tag**

## 🔧 CONFIGURAÇÃO ATUAL

### JavaScript atualizado para:
- **URL:** `https://fasthomesac.fastsistemasconstrutivos.com.br/api/activecampaign-with-tag`
- **Método:** POST
- **Content-Type:** application/json

### Dados enviados (formato correto para seu backend):
```json
{
  "name": "Nome Completo",
  "email": "email@usuario.com",
  "phone": "11999999999",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "campanha", 
  "utm_content": "conteudo",
  "utm_term": "termo",
  "page_referrer": "referencia da pagina"
}
```

## 🎯 RESPOSTA ESPERADA DO SEU BACKEND

### Sucesso (200):
```json
{
  "success": true,
  "contact": {
    "id": "12345",
    "email": "email@usuario.com",
    "name": "Nome Completo"
  },
  "tag": {
    "id": "67",
    "name": "catalogo-fast-homes-solicitado",
    "applied": true
  },
  "message": "Lead criado e tag \"catalogo-fast-homes-solicitado\" aplicada com sucesso!"
}
```

### Erro (5xx):
```json
{
  "success": false,
  "error": "Descrição do erro",
  "message": "Erro interno do servidor"
}
```

## 🔍 COMO TESTAR

### 1. Teste direto do endpoint:
```bash
curl -X POST https://fasthomesac.fastsistemasconstrutivos.com.br/api/activecampaign-with-tag \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Usuario",
    "email": "teste@exemplo.com",
    "phone": "11999999999",
    "utm_source": "teste"
  }'
```

### 2. Teste do endpoint de status:
```bash
curl https://fasthomesac.fastsistemasconstrutivos.com.br/api/test
```

## ✅ LOGS DE SUCESSO ESPERADOS

Quando funcionar corretamente:
```
🔄 Enviando para ActiveCampaign via servidor Node.js...
📤 Enviando dados para servidor Node.js: {dados...}
✅ ActiveCampaign: Lead criado e tag "catalogo-fast-homes-solicitado" aplicada com sucesso!
👤 Email: email@usuario.com - Tag aplicada: SIM
🆔 ID do contato: 12345
🏷️ ID da tag: 67 (catalogo-fast-homes-solicitado)
```

## 🔧 SEU BACKEND NODE.JS

### Verificar se está rodando:
```bash
# Se estiver local
node backend-activecampaign-tag.js

# Verificar porta (padrão 3001)
curl http://localhost:3001/api/test
```

### Endpoints disponíveis:
- **POST** `/api/activecampaign-with-tag` - Criar contato com tag
- **GET** `/api/test` - Testar se está funcionando

## 🔄 SISTEMA DE FALLBACK

Se o servidor Node.js falhar:
1. O erro será logado no console
2. Automaticamente tentará o método proc.php como backup
3. O lead não será perdido

## � REQUISITOS DO SERVIDOR NODE.JS

Seu servidor Node.js deve:
- ✅ Aceitar requisições POST
- ✅ Processar JSON no body da requisição  
- ✅ Integrar com ActiveCampaign API
- ✅ Aplicar a tag 'catalogo-fast-homes-solicitado'
- ✅ Retornar resposta JSON com status success/error

## 🚀 PRONTO PARA USAR

O código JavaScript já está configurado para usar seu servidor Node.js.
Basta testar o formulário e verificar os logs no console!

---

**Configurado para:** Servidor Node.js  
**URL:** https://fasthomesac.fastsistemasconstrutivos.com.br  
**Tag:** catalogo-fast-homes-solicitado  
**Data:** Julho 2025
