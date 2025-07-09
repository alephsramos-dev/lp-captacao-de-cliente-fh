# 🚀 Backend ActiveCampaign com Tags - Instruções

## Como usar o Backend Node.js

### 1. Instalação Local (Desenvolvimento)

```bash
# Instalar dependências
npm install

# Rodar o backend
npm start

# Ou para desenvolvimento (com auto-reload)
npm run dev
```

O backend estará disponível em: `http://localhost:3001`

### 2. Deploy no Turbo Cloud (Produção)

1. **Envie os arquivos para o Turbo Cloud:**
   - `backend-activecampaign-tag.js`
   - `package.json`

2. **Configure as variáveis de ambiente:**
   ```
   PORT=3001
   ```

3. **URL do backend será:**
   ```
   https://seu-dominio.turbo.com/api/activecampaign-with-tag
   ```

### 3. Configurar Frontend

No arquivo `src/script.js`, atualize a URL do backend:

```javascript
const backendUrls = [
    'http://localhost:3001/api/activecampaign-with-tag', // Local
    'https://SEU-DOMINIO.turbo.com/api/activecampaign-with-tag', // Produção
];
```

## Como Funciona

### 🔄 Fluxo de Integração

1. **Frontend tenta backend Node.js** (preferencial)
   - ✅ Cria contato no ActiveCampaign
   - ✅ Busca ou cria tag automaticamente
   - ✅ Aplica tag ao contato
   - ✅ Sem problemas de CORS

2. **Se backend não disponível** (fallback)
   - 🔄 Usa método proc.php original
   - ⚠️ Tag pode não ser aplicada (limitações CORS)

### ✅ Vantagens do Backend

- **100% confiável** - Sem CORS
- **Tag garantida** - Criação e aplicação automática
- **Logs detalhados** - Debug completo
- **Escalável** - Pode ser usado por múltiplos sites

## Endpoints Disponíveis

### POST /api/activecampaign-with-tag
Recebe lead e aplica tag automaticamente.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "email@exemplo.com", 
  "phone": "(11) 99999-9999",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "campanha-teste",
  "utm_term": "termo",
  "utm_content": "conteudo",
  "page_referrer": "https://exemplo.com"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "contact": {
    "id": 123,
    "email": "email@exemplo.com",
    "name": "Nome Completo"
  },
  "tag": {
    "id": 456,
    "name": "catalogo-fast-homes-solicitado", 
    "applied": true
  },
  "message": "Lead criado e tag aplicada com sucesso!"
}
```

### GET /api/test
Testa se o backend está funcionando.

## Configuração de Produção

### No Turbo Cloud:

1. **Criar novo projeto Node.js**
2. **Fazer upload dos arquivos:**
   - `backend-activecampaign-tag.js`
   - `package.json`
3. **Configurar start script:** `node backend-activecampaign-tag.js`
4. **Anotar a URL gerada**
5. **Atualizar frontend com a URL**

### Teste de Funcionamento:

```bash
# Testar se backend está online
curl https://seu-dominio.turbo.com/api/test

# Testar envio de lead
curl -X POST https://seu-dominio.turbo.com/api/activecampaign-with-tag \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","phone":"11999999999"}'
```

## Logs do Backend

O backend mostra logs detalhados:

```
🔄 Recebido lead do frontend: { name: 'Teste', email: 'teste@exemplo.com', phone: '11999999999' }
📝 Criando contato no ActiveCampaign...
✅ Contato criado/atualizado: teste@exemplo.com (ID: 123)
✅ Tag encontrada: catalogo-fast-homes-solicitado (ID: 456)
✅ Tag aplicada ao contato 123
🎉 Processo concluído: { success: true, ... }
```

## Troubleshooting

### Backend não responde
- Verificar se está rodando: `npm start`
- Verificar porta: padrão é 3001
- Verificar logs no console

### Tag não é aplicada
- Verificar API Key no backend
- Verificar logs: contato foi criado?
- Verificar se tag existe no ActiveCampaign

### CORS ainda acontece
- Backend resolve CORS automaticamente
- Se persistir, verificar se frontend está chamando backend
- Verificar URL do backend no frontend

---

## 🎯 Resultado Final

Com o backend configurado:
- ✅ **100% confiável** - Sem CORS
- ✅ **Tag sempre aplicada** - Automático
- ✅ **Logs detalhados** - Debug fácil
- ✅ **Escalável** - Pode usar em outros projetos
