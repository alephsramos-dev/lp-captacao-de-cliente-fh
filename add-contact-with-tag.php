<?php
/**
 * Active Campaign Contact Creator with Tag
 * Arquivo: add-contact-with-tag.php
 * 
 * Este arquivo deve ser colocado no servidor: fasthomesac.fastsistemasconstrutivos.com.br
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Faça upload deste arquivo para o diretório raiz do domínio
 * 2. Configure as credenciais do ActiveCampaign abaixo
 * 3. Teste o endpoint fazendo uma requisição POST
 */

// Configurações do ActiveCampaign
define('AC_API_URL', 'https://fastdrywall80017.api-us1.com');
define('AC_API_KEY', '26bced605b889cf36e760aefc67231ae3256429c1622218b0830a3a224b6e464dc4c0f4e');

// Permitir CORS para o domínio da landing page
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Apenas aceitar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

// Ler dados JSON do corpo da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados JSON inválidos']);
    exit;
}

// Validar dados obrigatórios
if (empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email é obrigatório']);
    exit;
}

// Log para debug (remover em produção)
error_log('ActiveCampaign API Request: ' . print_r($data, true));

try {
    // 1. CRIAR/ATUALIZAR CONTATO
    $contactData = [
        'contact' => [
            'email' => $data['email'],
            'firstName' => $data['firstName'] ?? '',
            'lastName' => $data['lastName'] ?? '',
            'phone' => $data['phone'] ?? ''
        ]
    ];

    $contactResponse = makeApiRequest('POST', '/api/3/contacts', $contactData);
    
    if (!$contactResponse || !isset($contactResponse['contact'])) {
        throw new Exception('Falha ao criar contato no ActiveCampaign');
    }

    $contactId = $contactResponse['contact']['id'];
    
    // 2. BUSCAR ID DA TAG
    $tagName = $data['tag'] ?? 'catalogo-fast-homes-solicitado';
    $tagId = findOrCreateTag($tagName);
    
    if (!$tagId) {
        throw new Exception('Falha ao localizar/criar tag: ' . $tagName);
    }

    // 3. APLICAR TAG AO CONTATO
    $tagContactData = [
        'contactTag' => [
            'contact' => $contactId,
            'tag' => $tagId
        ]
    ];

    $tagResponse = makeApiRequest('POST', '/api/3/contactTags', $tagContactData);

    // 4. ADICIONAR CAMPOS PERSONALIZADOS (UTMs)
    $customFields = [
        'utm_source' => 6,
        'utm_medium' => 7,
        'utm_campaign' => 8,
        'utm_content' => 10,
        'utm_term' => 9
    ];

    foreach ($customFields as $utmKey => $fieldId) {
        if (!empty($data[$utmKey])) {
            $fieldData = [
                'fieldValue' => [
                    'contact' => $contactId,
                    'field' => $fieldId,
                    'value' => $data[$utmKey]
                ]
            ];
            
            makeApiRequest('POST', '/api/3/fieldValues', $fieldData);
        }
    }

    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Contato criado/atualizado com sucesso',
        'contact_id' => $contactId,
        'tag_applied' => $tagName,
        'tag_id' => $tagId
    ]);

} catch (Exception $e) {
    error_log('ActiveCampaign API Error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

/**
 * Fazer requisição para a API do ActiveCampaign
 */
function makeApiRequest($method, $endpoint, $data = null) {
    $url = AC_API_URL . $endpoint;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Token: ' . AC_API_KEY,
        'Content-Type: application/json'
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 400) {
        error_log("API Request failed: HTTP $httpCode - $response");
        return null;
    }
    
    return json_decode($response, true);
}

/**
 * Buscar ou criar uma tag
 */
function findOrCreateTag($tagName) {
    // Buscar tag existente
    $response = makeApiRequest('GET', '/api/3/tags?filters[tag]=' . urlencode($tagName));
    
    if ($response && isset($response['tags']) && count($response['tags']) > 0) {
        return $response['tags'][0]['id'];
    }
    
    // Criar nova tag
    $tagData = [
        'tag' => [
            'tag' => $tagName,
            'tagType' => 'contact',
            'description' => 'Tag criada automaticamente para ' . $tagName
        ]
    ];
    
    $response = makeApiRequest('POST', '/api/3/tags', $tagData);
    
    if ($response && isset($response['tag']['id'])) {
        return $response['tag']['id'];
    }
    
    return null;
}

?>
