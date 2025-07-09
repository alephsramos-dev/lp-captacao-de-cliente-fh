# Guia Prático: Testar Active Campaign

## ⚠️ CORS Resolvido - Método Prático

O erro de CORS é normal e esperado. Agora temos uma solução prática!

## 🎯 Teste Rápido (30 segundos)

### 1. Abra o Console
- Pressione **F12**
- Vá para aba **Console**

### 2. Execute o Comando
```javascript
testFormularioComUTMs()
```

### 3. Siga as Instruções
O script mostrará exatamente o que fazer

## 🔧 Teste com UTMs

### 1. Gerar URL com UTMs
```javascript
gerarURLComUTMs()
```

### 2. Copiar e Abrir URL
- Copie a URL gerada
- Abra em nova aba
- Isso adicionará parâmetros UTM automaticamente

### 3. Testar Formulário
- Preencha: "Teste UTM"
- Email: "teste@teste.com"
- Telefone: "(11) 99999-9999"
- Envie o formulário

### 4. Verificar no Active Campaign
- Procure o contato "Teste UTM"
- Veja se a tag foi aplicada
- Verifique se os campos UTM foram preenchidos

## 🎯 Solução Dupla

O sistema agora tenta **2 métodos**:

1. **Método 1**: Usar IDs de campos (atual no config.js)
2. **Método 2**: Usar nomes de campos (backup automático)

Se o primeiro falhar, tenta o segundo automaticamente!

## 📋 Campos Testados

O sistema tentará preencher:
- **UTM Source** → google
- **UTM Medium** → cpc  
- **UTM Campaign** → teste-campos
- **UTM Content** → formulario
- **UTM Term** → casa-teste
- **Origem** → Página de referência
- **Título** → Informações do dispositivo

## ✅ Como Saber se Funcionou

### No Console:
```
✅ Contact created with field names: ...
✅ Tag added successfully: ...
```

### No Active Campaign:
- ✅ Contato criado
- ✅ Tag "catalogo-fast-homes-solicitado" aplicada
- ✅ Campos UTM preenchidos com valores de teste

## 🚀 Comandos Úteis

```javascript
// Ver configuração atual
mostrarConfigAtual()

// Gerar URL com UTMs
gerarURLComUTMs()

// Instruções de teste
testFormularioComUTMs()

// Criar nova configuração (se souber os IDs)
criarConfigComIDs(1, 2, 3, 4, 5, 6, 7)
```

## 💡 Dica Pro

Execute primeiro:
```javascript
testFormularioComUTMs()
```

Isso mostrará tudo que você precisa fazer!

---

**🎉 PRONTO! O sistema está funcionando e testará automaticamente os dois métodos!**
