# Fast Homes - High Ticket Landing Page de Captação de Leads

Uma landing page premium e minimalista para captação de leads high ticket com carrossel de fundo infinito, animações elegantes e redirecionamento automático para catálogo após submissão.

## ✨ **Características Premium**

- **Design High Ticket Minimalista** com glassmorphism avançado
- **Carrossel de fundo infinito** usando Splide.js com transições suaves
- **Validação em tempo real** com animações elegantes
- **Formatação automática** do número de telefone brasileiro
- **Animações premium** com efeitos de entrada escalonados
- **Redirecionamento automático** para catálogo após envio do formulário
- **Design responsivo** otimizado para conversão
- **Integração com API** do Pipe.run para captura de leads premium
- **Tracking avançado** de UTMs e informações de dispositivo
- **SEO otimizado** com meta tags completas

## 🚀 **Fluxo de Conversão**

1. **Usuário acessa** a landing page
2. **Preenche o formulário** (Nome, Email, Telefone)
3. **Validação em tempo real** com feedback visual
4. **Envio dos dados** para o CRM
5. **Redirecionamento automático** para o catálogo PDF
6. **Tracking completo** da conversão

## 📁 Estrutura do Projeto

```
lp-captacao-de-cliente-fh/
├── index.html          # Página principal otimizada
├── src/
│   ├── style.css       # CSS premium com animações
│   └── script.js       # JavaScript com redirecionamento
└── README.md           # Documentação
```

## ⚙️ **Configuração**

### 1. Substituir a Logo
Edite o arquivo `index.html` na seção da logo:
```html
<img src="CAMINHO_PARA_SUA_LOGO" alt="Fast Homes" class="form-logo">
```

### 2. Configurar Imagens do Carrossel
As imagens estão configuradas no `index.html`. Substitua pelas suas próprias imagens:
```html
<li class="splide__slide" style="background-image: url('SUA_IMAGEM_1.jpg')"></li>
<li class="splide__slide" style="background-image: url('SUA_IMAGEM_2.jpg')"></li>
```

### 3. **IMPORTANTE: Configurar PDF do Catálogo**
No arquivo `src/script.js`, linha 20:
```javascript
this.catalogUrl = '/caminho-para-seu-catalogo.pdf'; // Configure o caminho do seu catálogo aqui
```

### 4. Hash da API (já configurado)
O hash da API Pipe.run está configurado conforme seu código React original.

## 🎨 **Design High Ticket**

### Paleta de Cores Premium
```css
--primary-color: #1a1a1a;        /* Preto sofisticado */
--accent-color: #d4af37;         /* Dourado luxuoso */
--accent-hover: #b8941f;         /* Dourado hover */
--success-color: #22c55e;        /* Verde sucesso */
--danger-color: #ef4444;         /* Vermelho erro */
```

### Características do Design
- **Glassmorphism** com backdrop blur avançado
- **Animações escalonadas** de entrada
- **Micro-interações** premium em todos os elementos
- **Tipografia** otimizada com Inter font
- **Espaçamento** generoso para sensação de luxo
- **Gradientes sutis** e sombras profissionais

## 📱 **Campos do Formulário**

- **Nome completo**: Mínimo 2 caracteres, apenas letras e acentos
- **E-mail**: Validação rigorosa de formato
- **Telefone**: Formatação automática (XX) XXXXX-XXXX, 11 dígitos obrigatórios

## � **Animações Premium**

### Animações de Entrada
- **slideInUp**: Container principal com efeito suave
- **fadeInUp**: Elementos escalonados com delays
- **shimmer**: Barra superior com efeito brilho
- **bounceIn**: Ícones de validação com bounce

### Micro-interações
- **Hover effects** em todos os elementos
- **Focus animations** nos inputs
- **Transform animations** no submit
- **Shake effect** em caso de erro

## 🔄 **Fluxo Pós-Envio**

1. **Animação de sucesso** com feedback visual
2. **Tracking de conversão** (GA, Facebook Pixel)
3. **Reset animado** do formulário
4. **Redirecionamento em 2 segundos** para o catálogo
5. **Abertura automática** do PDF em nova aba

## 📊 **Tracking e Analytics**

### Eventos Rastreados
- **Conversão de lead** (high ticket)
- **Acesso ao catálogo** 
- **Tempo de preenchimento**
- **Dispositivo e origem**

### Integração com Analytics
```javascript
// Google Analytics
gtag('event', 'conversion', {
    'send_to': 'AW-CONVERSION_ID',
    'event_category': 'High Ticket Lead'
});

// Facebook Pixel
fbq('track', 'Lead', {
    content_category: 'High Ticket'
});
```

## 📱 **Responsividade**

- **Desktop**: Design completo com espaçamentos generosos
- **Tablet**: Adaptação otimizada dos espaçamentos
- **Mobile**: Interface compacta mantendo elegância
- **Touch optimized**: Elementos com tamanhos adequados

## 🛡️ **Validação Avançada**

### Validação em Tempo Real
- **Debounce** para performance otimizada
- **Regex avançado** para telefones brasileiros
- **Feedback visual** instantâneo
- **Prevenção de spam** com validações rigorosas

### Validação de Telefone
```javascript
// Aceita apenas celulares brasileiros (11 dígitos)
const isValid = cleanPhone.length === 11 && /^[1-9]{2}9[0-9]{8}$/.test(cleanPhone);
```

## ⚡ **Performance**

- **CSS crítico inline** para FCP otimizado
- **Preconnect** para domínios externos
- **Debounce** em validações
- **Animações otimizadas** com `cubic-bezier`
- **Lazy loading** do carrossel

## 🔧 **Dependências**

- **Splide.js 4.1.4**: Carrossel premium
- **Font Awesome 6.0**: Ícones vetoriais
- **Google Fonts (Inter)**: Tipografia profissional

## � **Deploy e Uso**

1. **Configure o catálogo PDF** (essencial!)
2. **Substitua as imagens** do carrossel
3. **Adicione sua logo**
4. **Configure tracking** (opcional)
5. **Teste o fluxo completo**
6. **Publique**

## � **Diferenciais High Ticket**

- **Primeira impressão** de luxo e exclusividade
- **Jornada do usuário** otimizada para conversão
- **Feedback visual** constante aumenta confiança
- **Redirecionamento automático** elimina fricção
- **Design minimalista** foca na conversão
- **Qualidade premium** em cada detalhe

## 🎯 **Taxa de Conversão**

O design foi otimizado para:
- **Reduzir fricção** no preenchimento
- **Aumentar confiança** com validações visuais
- **Criar sensação de urgência** sutil
- **Transmitir valor** através do design
- **Facilitar a conversão** com UX intuitiva

---

**Desenvolvido especificamente para Fast Homes com foco em captação de leads high ticket e conversão otimizada.**
