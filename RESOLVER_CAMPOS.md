# Guia: Como Descobrir os IDs Corretos dos Campos

## Problema do CORS Resolvido

O erro de CORS que você viu é normal quando testamos a API diretamente do navegador. Criei uma nova abordagem que funciona!

## Passo a Passo

### 1. Configuração Inicial
Já coloquei uma configuração inicial baseada nos seus campos:

```javascript
CUSTOM_FIELDS: {
    UTM_SOURCE: 6,         // UTM Source -> %UTM_SOURCE%
    UTM_CAMPAIGN: 8,       // UTM Campaign -> %UTM_CAMPAING%
    UTM_MEDIUM: 7,         // UTM Medium -> %UTM_MEDIUM%
    UTM_CONTENT: 10,       // UTM Content -> %UTM_CONTENT%
    UTM_TERM: 9,           // UTM Term -> %UTM_TERM%
    REFERRER: 1,           // Origem -> %ORIGEM%
    DEVICE_INFO: 2         // Título -> %TITULO%
}
```

### 2. Teste Básico
Primeiro, teste se o formulário funciona:

1. Abra o site no navegador
2. Preencha o formulário com dados reais
3. Envie o formulário
4. Verifique no Active Campaign se o contato foi criado

### 3. Descobrir IDs Reais (Recomendado)
Para descobrir os IDs exatos, use o novo script:

```javascript
discoverFieldsViaBackend()
```

Este script:
- ✅ Testa IDs de 1 a 20
- ✅ Cria contatos de teste
- ✅ Verifica quais campos funcionam
- ✅ Remove os contatos de teste automaticamente
- ✅ Mostra os IDs válidos

### 4. Configuração Alternativa Simples
Se quiser apenas ver sugestões baseadas nos seus campos:

```javascript
configureKnownFields()
```

## Mapeamento dos Seus Campos

Com base nos campos que você tem no Active Campaign:

| Campo no AC | Variável | Provável ID | Uso no Sistema |
|-------------|----------|-------------|----------------|
| UTM Source | %UTM_SOURCE% | 6 | Fonte do tráfego |
| UTM Medium | %UTM_MEDIUM% | 7 | Canal/meio |
| UTM Campaign | %UTM_CAMPAING% | 8 | Campanha |
| UTM Term | %UTM_TERM% | 9 | Termo/palavra-chave |
| UTM Content | %UTM_CONTENT% | 10 | Conteúdo específico |
| Origem | %ORIGEM% | 1 | Página de referência |
| Título | %TITULO% | 2 | Informações do dispositivo |

## Testando os IDs

### Método 1: Teste Manual
1. Preencha o formulário
2. Vá no Active Campaign
3. Veja se os campos UTM foram preenchidos
4. Se não funcionou, ajuste os IDs no config.js

### Método 2: Script Automático
```javascript
discoverFieldsViaBackend()
```

### Método 3: Logs do Console
Após enviar o formulário, veja os logs no console:
- `✅ Contact created/updated:` - Contato criado
- `✅ Tag added successfully:` - Tag aplicada
- `❌ Error adding tag:` - Erro na tag ou campos

## Ajuste Fino

Se alguns campos não funcionarem:

1. Mude os IDs no config.js
2. Teste novamente
3. Verifique os logs do console

### Exemplo de Ajuste
```javascript
// Se UTM_SOURCE não funcionar com ID 6, tente outros:
UTM_SOURCE: 5,    // ou 7, 8, etc.
```

## Dica Pro

Os IDs mais comuns são de 1 a 15. Se você tem 10 campos personalizados, provavelmente os IDs estão nesse intervalo.

## Próximos Passos

1. ✅ Teste com a configuração atual
2. ✅ Execute `discoverFieldsViaBackend()` se necessário
3. ✅ Ajuste os IDs no config.js
4. ✅ Teste novamente
5. ✅ Remova os scripts de desenvolvimento em produção
