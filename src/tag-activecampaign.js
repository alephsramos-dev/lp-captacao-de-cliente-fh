/**
 * Lógica de TAG ActiveCampaign - Baseada no formulário oficial
 * 
 * Esta função adiciona a lógica necessária para aplicar a tag
 * "catalogo-fast-homes-solicitado" automaticamente quando o formulário for enviado.
 */

// Função para preencher campos UTM automaticamente
function preencherCamposUTMAutomaticamente() {
    console.log('🎯 Preenchendo campos UTM para ActiveCampaign...');

    // Capturar UTMs da URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
        utm_source: urlParams.get('utm_source') || 'organico',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || ''
    };

    // Mapear para os campos do formulário
    const fieldMapping = {
        utm_source: 'field[6]',
        utm_medium: 'field[7]',
        utm_campaign: 'field[8]',
        utm_term: 'field[9]',
        utm_content: 'field[10]'
    };

    // Preencher cada campo
    Object.entries(utmData).forEach(([key, value]) => {
        const fieldName = fieldMapping[key];
        if (fieldName && value) {
            const field = document.querySelector(`input[name="${fieldName}"]`);
            if (field) {
                field.value = value;
                console.log(`✅ ${key}: ${value}`);
            }
        }
    });
}

// Funções do ActiveCampaign (copiadas do formulário oficial)
window._show_thank_you = function (id, message, trackcmp_url, email) {
    console.log('🎉 ActiveCampaign: Tag aplicada com sucesso!');
    console.log('📧 Email:', email);
    console.log('🎯 Tag "catalogo-fast-homes-solicitado" foi aplicada automaticamente');

    // Mostrar modal de sucesso personalizado
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    const vgoAlias = typeof visitorGlobalObjectAlias === 'undefined' ? 'vgo' : visitorGlobalObjectAlias;
    var visitorObject = window[vgoAlias];
    if (email && typeof visitorObject !== 'undefined') {
        visitorObject('setEmail', email);
        visitorObject('update');
    } else if (typeof (trackcmp_url) != 'undefined' && trackcmp_url) {
        _load_script(trackcmp_url);
    }
};

window._show_error = function (id, message, html) {
    console.error('❌ ActiveCampaign Error:', message);

    var form = document.getElementById('contactForm'),
        err = document.createElement('div'),
        button = form.querySelector('button[type="submit"]'),
        old_error = form.querySelector('._form_error');

    if (old_error) old_error.parentNode.removeChild(old_error);

    err.innerHTML = message;
    err.className = '_error-inner _form_error _no_arrow';
    err.style.cssText = 'background: #ffdddd; padding: 10px; margin: 10px 0; border-radius: 4px; color: #ca0000;';

    var wrapper = document.createElement('div');
    wrapper.className = '_form-inner _show_be_error';
    wrapper.appendChild(err);
    button.parentNode.insertBefore(wrapper, button);

    var submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.classList.remove('loading');

    if (html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        err.appendChild(div);
    }
};

window._load_script = function (url, callback, isSubmit) {
    var head = document.querySelector('head'),
        script = document.createElement('script'),
        r = false;

    script.charset = 'utf-8';
    script.src = url;

    if (callback) {
        script.onload = script.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };
    }

    script.onerror = function () {
        if (isSubmit) {
            _show_error("1", "Erro no envio. Tente novamente.");
            var submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    head.appendChild(script);
};

// Função para serializar formulário (copiada do oficial)
function form_serialize(form) {
    if (!form || form.nodeName !== "FORM") return "";
    var q = [];

    for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name === "") continue;

        switch (form.elements[i].nodeName) {
            case "INPUT":
                switch (form.elements[i].type) {
                    case "text":
                    case "email":
                    case "tel":
                    case "hidden":
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                    case "checkbox":
                    case "radio":
                        if (form.elements[i].checked) {
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        }
                        break;
                }
                break;
            case "TEXTAREA":
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case "SELECT":
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
        }
    }
    return q.join("&");
}

// Interceptar o envio do formulário existente
function adicionarLogicaTag() {
    console.log('🎯 Lógica de TAG ActiveCampaign carregada');

    const form = document.getElementById('contactForm');
    if (!form) return;

    // Preencher UTMs imediatamente
    preencherCamposUTMAutomaticamente();

    // Interceptar o submit do formulário
    form.addEventListener('submit', function (e) {
        console.log('📤 Formulário sendo enviado para ActiveCampaign...');
        console.log('🎯 Tags que serão aplicadas: p[1], p[2], p[3]');

        // Garantir que os campos estão preenchidos
        preencherCamposUTMAutomaticamente();

        // O formulário será enviado automaticamente para o ActiveCampaign
        // As tags serão aplicadas automaticamente pelo sistema do AC

        // Enviar usando a mesma lógica do formulário oficial
        setTimeout(() => {
            var serialized = form_serialize(form).replace(/%0A/g, '\\n');
            var url = 'https://fastdrywall80017.activehosted.com/proc.php?' + serialized + '&jsonp=true';

            console.log('📡 Enviando para ActiveCampaign:', url);
            _load_script(url, null, true);
        }, 100);
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    // Aguardar um pouco para garantir que tudo está carregado
    setTimeout(adicionarLogicaTag, 1000);
});

// Função de debug para verificar se está funcionando
window.debugTagActiveCampaign = function () {
    console.log('🔍 DEBUG - TAG ACTIVECAMPAIGN');
    console.log('================================');

    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('❌ Formulário não encontrado!');
        return;
    }

    console.log('📋 Método:', form.method);
    console.log('📋 Action:', form.action);

    // Verificar tags
    console.log('\n🎯 TAGS:');
    for (let i = 1; i <= 5; i++) {
        const tag = form.querySelector(`input[name="p[${i}]"]`);
        if (tag) {
            console.log(`✅ p[${i}] = ${tag.value}`);
        }
    }

    // Verificar campos UTM
    console.log('\n📋 CAMPOS UTM:');
    const utmFields = ['field[6]', 'field[7]', 'field[8]', 'field[9]', 'field[10]'];
    const utmNames = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmFields.forEach((field, index) => {
        const input = form.querySelector(`input[name="${field}"]`);
        if (input) {
            console.log(`✅ ${utmNames[index]}: "${input.value}"`);
        }
    });

    console.log('\n✅ Formulário configurado para aplicar tag automaticamente!');
};
