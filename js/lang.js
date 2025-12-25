// Language Manager for NeuroWeb Studio
class LanguageManager {
    constructor() {
        this.currentLang = 'it';
        this.translations = {};
        this.langSwitcher = null;
        this.init();
    }

    async init() {
        // Detect browser language or get from localStorage
        const savedLang = localStorage.getItem('neurowebLang');
        const browserLang = navigator.language.split('-')[0];
        
        if (savedLang && ['it', 'en', 'de'].includes(savedLang)) {
            this.currentLang = savedLang;
        } else if (['it', 'en', 'de'].includes(browserLang)) {
            this.currentLang = browserLang;
        }
        
        await this.loadTranslations();
        this.createLanguageSwitcher();
        this.applyTranslations();
        this.updateActiveLanguage();
    }

    async loadTranslations() {
        try {
            const response = await fetch(`/lang/${this.currentLang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to Italian
            this.currentLang = 'it';
            const fallbackResponse = await fetch(`/lang/it.json`);
            this.translations = await fallbackResponse.json();
        }
    }

    createLanguageSwitcher() {
        // Check if switcher already exists
        if (document.querySelector('.lang-switcher')) return;

        // Create language switcher
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'it' ? 'active' : ''}" data-lang="it">
                <span class="flag">🇮🇹</span> IT
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                <span class="flag">🇬🇧</span> EN
            </button>
            <button class="lang-btn ${this.currentLang === 'de' ? 'active' : ''}" data-lang="de">
                <span class="flag">🇩🇪</span> DE
            </button>
        `;

        // Add to header
        const header = document.querySelector('header .container .navbar');
        if (header) {
            header.appendChild(switcher);
        }

        // Add event listeners
        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });

        this.langSwitcher = switcher;
    }

    async switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        localStorage.setItem('neurowebLang', lang);
        
        await this.loadTranslations();
        this.applyTranslations();
        this.updateActiveLanguage();
        
        // Update page URLs for multilingual navigation
        this.updatePageUrls();
        
        // Show language change notification
        this.showLanguageNotification();
    }

    updateActiveLanguage() {
        if (!this.langSwitcher) return;
        
        this.langSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    applyTranslations() {
        // Update meta tags
        this.updateMetaTags();
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const keys = element.getAttribute('data-i18n').split('.');
            let value = this.translations;
            
            for (const key of keys) {
                if (value && value[key]) {
                    value = value[key];
                } else {
                    value = '';
                    break;
                }
            }
            
            if (value) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = value;
                } else {
                    element.innerHTML = value;
                }
            }
        });
        
        // Update specific elements without data-i18n
        this.updateSpecificElements();
        
        // Update chatbot responses
        this.updateChatbotTranslations();
    }

    updateMetaTags() {
        // Update title
        if (this.translations.meta && this.translations.meta.title) {
            document.title = this.translations.meta.title;
        }
        
        // Update description meta tag
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        if (this.translations.meta && this.translations.meta.description) {
            metaDescription.content = this.translations.meta.description;
        }
        
        // Update keywords meta tag
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        if (this.translations.meta && this.translations.meta.keywords) {
            metaKeywords.content = this.translations.meta.keywords;
        }
    }

    updateSpecificElements() {
        // Update navigation
        const navElements = {
            'nav-home': 'nav.home',
            'nav-about': 'nav.about',
            'nav-services': 'nav.services',
            'nav-portfolio': 'nav.portfolio',
            'nav-contact': 'nav.contact',
            'nav-allServices': 'nav.allServices',
            'nav-backHome': 'nav.backHome'
        };
        
        Object.keys(navElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const keys = navElements[id].split('.');
                let value = this.translations;
                keys.forEach(key => value = value[key]);
                if (value) element.textContent = value;
            }
        });
    }

    updateChatbotTranslations() {
        if (window.chatbotResponses && this.translations.chatbot) {
            window.chatbotResponses = this.translations.chatbot.responses;
            
            // Update quick replies
            const quickReplies = document.querySelectorAll('.quick-reply');
            if (quickReplies.length > 0 && this.translations.chatbot.quickReplies) {
                quickReplies.forEach((reply, index) => {
                    if (this.translations.chatbot.quickReplies[index]) {
                        reply.textContent = this.translations.chatbot.quickReplies[index];
                        reply.setAttribute('data-reply', this.translations.chatbot.quickReplies[index]);
                    }
                });
            }
            
            // Update chatbot title
            const chatbotTitle = document.querySelector('#chatbot-header h3');
            if (chatbotTitle && this.translations.chatbot.title) {
                chatbotTitle.textContent = this.translations.chatbot.title;
            }
            
            // Update chatbot placeholder
            const chatbotInput = document.querySelector('#chatbot-input-field');
            if (chatbotInput && this.translations.chatbot.placeholder) {
                chatbotInput.placeholder = this.translations.chatbot.placeholder;
            }
        }
    }

    updatePageUrls() {
        // Update language in current URL
        const currentPath = window.location.pathname;
        const newPath = this.getTranslatedPagePath(currentPath);
        
        if (newPath !== currentPath) {
            // Update URL without reloading (for single page navigation)
            window.history.pushState({}, '', newPath);
        }
        
        // Update language switcher links
        this.updateLanguageLinks();
    }

    getTranslatedPagePath(currentPath) {
        const basePath = currentPath.replace(/(\/index)?\.html$/, '');
        const langSuffix = this.currentLang === 'it' ? '' : `-${this.currentLang}`;
        
        // Special handling for index pages
        if (basePath === '' || basePath === '/' || basePath.endsWith('index')) {
            return this.currentLang === 'it' ? '/index.html' : `/${this.currentLang}.html`;
        }
        
        // For service pages
        if (basePath.includes('servizi')) {
            return this.currentLang === 'it' ? '/servizi.html' : `/servizi-${this.currentLang}.html`;
        }
        
        return currentPath;
    }

    updateLanguageLinks() {
        // Update all language-specific links
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip external links
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Update internal links based on current language
            if (href.endsWith('.html')) {
                const newHref = this.getTranslatedLink(href);
                link.setAttribute('href', newHref);
            }
        });
    }

    getTranslatedLink(originalHref) {
        if (this.currentLang === 'it') {
            // Convert to Italian
            return originalHref
                .replace(/-en\.html$/, '.html')
                .replace(/-de\.html$/, '.html')
                .replace(/\/en\.html$/, '/index.html')
                .replace(/\/de\.html$/, '/index.html');
        } else {
            // Convert to selected language
            const langSuffix = `-${this.currentLang}.html`;
            
            if (originalHref.includes('servizi')) {
                return originalHref.replace(/servizi\.html$/, `servizi${langSuffix}`);
            } else if (originalHref.includes('index.html')) {
                return originalHref.replace(/index\.html$/, `${this.currentLang}.html`);
            } else if (originalHref.endsWith('.html') && !originalHref.includes('-en') && !originalHref.includes('-de')) {
                return originalHref.replace(/\.html$/, langSuffix);
            }
        }
        
        return originalHref;
    }

    showLanguageNotification() {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.innerHTML = `
            <p>Language changed to ${this.getLanguageName(this.currentLang)}</p>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Add CSS animations
        this.addNotificationStyles();
    }

    getLanguageName(lang) {
        const names = {
            'it': 'Italiano',
            'en': 'English',
            'de': 'Deutsch'
        };
        return names[lang] || lang;
    }

    addNotificationStyles() {
        if (!document.querySelector('#language-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'language-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Helper method to translate text programmatically
    t(key) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return '';
            }
        }
        
        return value;
    }
}

// Initialize language manager
let languageManager;

document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
    
    // Add CSS for language switcher
    const style = document.createElement('style');
    style.textContent = `
        .lang-switcher {
            display: flex;
            gap: 5px;
            margin-left: 20px;
        }
        
        .lang-btn {
            padding: 5px 10px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: var(--transition);
        }
        
        .lang-btn:hover {
            background: #e2e8f0;
        }
        
        .lang-btn.active {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-color: var(--primary-color);
        }
        
        .lang-btn .flag {
            font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
            .lang-switcher {
                margin-left: 0;
                margin-top: 10px;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other scripts
window.languageManager = languageManager;