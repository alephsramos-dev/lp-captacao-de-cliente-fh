/**
 * ActiveCampaign Tag Manager
 * Gerencia a criação e aplicação de tags no ActiveCampaign
 */

class ActiveCampaignTagManager {
    constructor(config) {
        this.config = config;
        this.tagCache = new Map();
    }

    /**
     * Busca ou cria uma tag no ActiveCampaign
     */
    async findOrCreateTag(tagName, description = '') {
        try {
            // Primeiro tenta encontrar a tag existente
            const existingTag = await this.findTagByName(tagName);
            if (existingTag) {
                console.log(`✅ Tag "${tagName}" encontrada com ID: ${existingTag.id}`);
                this.tagCache.set(tagName, existingTag.id);
                return existingTag.id;
            }

            // Se não encontrar, cria uma nova tag
            console.log(`🔄 Criando nova tag: "${tagName}"`);
            const newTag = await this.createTag(tagName, description);
            this.tagCache.set(tagName, newTag.id);
            console.log(`✅ Tag "${tagName}" criada com ID: ${newTag.id}`);
            return newTag.id;

        } catch (error) {
            console.error('❌ Erro ao buscar/criar tag:', error);
            throw error;
        }
    }

    /**
     * Busca uma tag pelo nome
     */
    async findTagByName(tagName) {
        if (!this.config.API_KEY) {
            throw new Error('API_KEY não configurada');
        }

        try {
            const response = await fetch(`${this.config.BASE_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`, {
                method: 'GET',
                headers: {
                    'Api-Token': this.config.API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar tag: ${response.status}`);
            }

            const data = await response.json();
            
            // Busca exata pelo nome da tag
            const exactMatch = data.tags?.find(tag => 
                tag.tag.toLowerCase() === tagName.toLowerCase()
            );

            return exactMatch || null;

        } catch (error) {
            console.error('Erro ao buscar tag:', error);
            return null;
        }
    }

    /**
     * Cria uma nova tag
     */
    async createTag(tagName, description = '') {
        if (!this.config.API_KEY) {
            throw new Error('API_KEY não configurada');
        }

        const tagData = {
            tag: {
                tag: tagName,
                tagType: 'contact',
                description: description || `Tag criada automaticamente para ${tagName}`
            }
        };

        const response = await fetch(`${this.config.BASE_URL}/api/3/tags`, {
            method: 'POST',
            headers: {
                'Api-Token': this.config.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tagData)
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar tag: ${response.status}`);
        }

        const result = await response.json();
        return result.tag;
    }

    /**
     * Adiciona uma tag a um contato
     */
    async addTagToContact(contactId, tagId) {
        if (!this.config.API_KEY) {
            throw new Error('API_KEY não configurada');
        }

        const contactTagData = {
            contactTag: {
                contact: contactId.toString(),
                tag: tagId.toString()
            }
        };

        const response = await fetch(`${this.config.BASE_URL}/api/3/contactTags`, {
            method: 'POST',
            headers: {
                'Api-Token': this.config.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactTagData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao adicionar tag ao contato: ${response.status} - ${errorText}`);
        }

        return await response.json();
    }

    /**
     * Busca ou cria um contato no ActiveCampaign
     */
    async findOrCreateContact(contactData) {
        if (!this.config.API_KEY) {
            throw new Error('API_KEY não configurada');
        }

        try {
            // Primeiro tenta encontrar o contato pelo email
            const existingContact = await this.findContactByEmail(contactData.email);
            if (existingContact) {
                console.log(`✅ Contato encontrado: ${contactData.email} (ID: ${existingContact.id})`);
                return existingContact;
            }

            // Se não encontrar, cria um novo contato
            console.log(`🔄 Criando novo contato: ${contactData.email}`);
            const newContact = await this.createContact(contactData);
            console.log(`✅ Contato criado: ${contactData.email} (ID: ${newContact.id})`);
            return newContact;

        } catch (error) {
            console.error('❌ Erro ao buscar/criar contato:', error);
            throw error;
        }
    }

    /**
     * Busca um contato pelo email
     */
    async findContactByEmail(email) {
        const response = await fetch(`${this.config.BASE_URL}/api/3/contacts?search=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Api-Token': this.config.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar contato: ${response.status}`);
        }

        const data = await response.json();
        const exactMatch = data.contacts?.find(contact => 
            contact.email.toLowerCase() === email.toLowerCase()
        );

        return exactMatch || null;
    }

    /**
     * Cria um novo contato
     */
    async createContact(contactData) {
        const contact = {
            contact: {
                email: contactData.email,
                firstName: contactData.firstName || '',
                lastName: contactData.lastName || '',
                phone: contactData.phone || '',
                fieldValues: contactData.fieldValues || []
            }
        };

        const response = await fetch(`${this.config.BASE_URL}/api/3/contacts`, {
            method: 'POST',
            headers: {
                'Api-Token': this.config.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar contato: ${response.status}`);
        }

        const result = await response.json();
        return result.contact;
    }

    /**
     * Processo completo: cria/encontra contato e aplica tag
     */
    async processContactWithTag(contactData, tagName, tagDescription = '') {
        try {
            console.log(`🎯 Iniciando processo: contato ${contactData.email} + tag "${tagName}"`);

            // 1. Buscar ou criar o contato
            const contact = await this.findOrCreateContact(contactData);

            // 2. Buscar ou criar a tag
            const tagId = await this.findOrCreateTag(tagName, tagDescription);

            // 3. Aplicar a tag ao contato
            await this.addTagToContact(contact.id, tagId);

            console.log(`✅ Processo concluído: tag "${tagName}" aplicada ao contato ${contactData.email}`);

            return {
                success: true,
                contact: contact,
                tagId: tagId,
                message: `Tag "${tagName}" aplicada com sucesso`
            };

        } catch (error) {
            console.error('❌ Erro no processo completo:', error);
            return {
                success: false,
                error: error.message,
                message: `Falha ao aplicar tag "${tagName}"`
            };
        }
    }
}

// Exportar para uso global
window.ActiveCampaignTagManager = ActiveCampaignTagManager;
