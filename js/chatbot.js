// Chatbot functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const closeChatbot = document.getElementById('close-chatbot');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');
const quickReplies = document.querySelectorAll('.quick-reply');

// Chatbot responses
const chatbotResponses = {
    'prezzi': 'Offriamo diversi pacchetti:<br>• Sito Web: €1.499 - €4.999<br>• E-commerce: €2.999 - €8.999<br>• Landing Page: €899 - €2.499<br>• SEO: €499 - €1.999/mese<br>• App Mobile: €4.999 - €19.999<br><br>Vuoi maggiori dettagli su un servizio specifico?',
    'tempi': 'I tempi di consegna variano:<br>• Siti Web: 2-4 settimane<br>• E-commerce: 4-6 settimane<br>• Landing Page: 1-2 settimane<br>• SEO: Risultati in 3-6 mesi<br>• App Mobile: 6-12 settimane<br><br>Forniamo sempre una timeline dettagliata!',
    'contatti': 'Puoi contattarci:<br>📞 Telefono: +39 333 123 4567<br>📧 Email: info@neurowebstudio.it<br>📍 Indirizzo: Via del Corso 123, Roma<br>💬 WhatsApp: Clicca il pulsante verde<br><br>Rispondiamo entro 24 ore!',
    'ciao': 'Ciao! Sono l'assistente virtuale di NeuroWeb Studio. Come posso aiutarti oggi?',
    'salve': 'Salve! Sono qui per rispondere alle tue domande su servizi, prezzi e tempi di consegna.',
    'buongiorno': 'Buongiorno! Benvenuto in NeuroWeb Studio. Come posso assisterti?',
    'servizi': 'Offriamo:<br>• Sviluppo Siti Web<br>• E-commerce<br>• Landing Page<br>• SEO Avanzato<br>• App Mobile<br>• Digital Marketing<br><br>Quale ti interessa?',
    'grazie': 'Di nulla! Se hai altre domande, sono qui per aiutarti. Buona giornata!',
    'default': 'Mi dispiace, non ho capito. Puoi chiedermi informazioni su:<br>• Prezzi dei servizi<br>• Tempi di consegna<br>• Contatti<br>• Servizi offerti<br><br>Oppure usa i pulsanti qui sotto!'
};

// Toggle chatbot visibility
if (chatbotToggle && chatbotContainer) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
    });
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            chatbotContainer.classList.remove('open');
        });
    }
}

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
    
    const messageText = document.createElement('p');
    messageText.innerHTML = text;
    
    messageDiv.appendChild(messageText);
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Process user input
function processUserInput(input) {
    const normalizedInput = input.toLowerCase().trim();
    
    let response = chatbotResponses.default;
    
    // Check for keywords
    if (normalizedInput.includes('prezzi') || normalizedInput.includes('costo') || normalizedInput.includes('quanto costa')) {
        response = chatbotResponses.prezzi;
    } else if (normalizedInput.includes('tempi') || normalizedInput.includes('consegna') || normalizedInput.includes('quando')) {
        response = chatbotResponses.tempi;
    } else if (normalizedInput.includes('contatti') || normalizedInput.includes('telefono') || normalizedInput.includes('email') || normalizedInput.includes('indirizzo')) {
        response = chatbotResponses.contatti;
    } else if (normalizedInput.includes('ciao') || normalizedInput.includes('buongiorno') || normalizedInput.includes('salve') || normalizedInput.includes('hey')) {
        response = chatbotResponses.ciao;
    } else if (normalizedInput.includes('servizi') || normalizedInput.includes('offerta') || normalizedInput.includes('cosa fate')) {
        response = chatbotResponses.servizi;
    } else if (normalizedInput.includes('grazie') || normalizedInput.includes('grazie mille')) {
        response = chatbotResponses.grazie;
    }
    
    // Small delay to simulate typing
    setTimeout(() => {
        addMessage(response);
    }, 500);
}

// Send message
if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            processUserInput(message);
        }
    });
    
    chatbotInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            chatbotSend.click();
        }
    });
}

// Quick replies
quickReplies.forEach(reply => {
    reply.addEventListener('click', () => {
        const response = reply.getAttribute('data-reply');
        addMessage(response, true);
        processUserInput(response);
    });
});

// Auto-open chatbot after 30 seconds
setTimeout(() => {
    if (chatbotContainer && !chatbotContainer.classList.contains('open')) {
        // Only open if user hasn't interacted yet
        const hasInteracted = localStorage.getItem('chatbotInteracted');
        if (!hasInteracted) {
            chatbotContainer.classList.add('open');
        }
    }
}, 30000);

// Track chatbot interaction
document.addEventListener('click', (e) => {
    if (e.target.closest('#chatbot-container') || e.target.closest('#chatbot-toggle')) {
        localStorage.setItem('chatbotInteracted', 'true');
    }
});