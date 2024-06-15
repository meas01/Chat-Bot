// script.js

document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbot = document.querySelector('.chatbot');
    const closeBtn = document.querySelector('.chatbot .close-btn');
    const sendBtn = document.getElementById('send-btn');
    const chatbox = document.querySelector('.chatbox');
    const textarea = document.querySelector('.chat-input textarea');
    
    // Toggle chatbot visibility
    chatbotToggler.addEventListener('click', () => {
      chatbot.classList.toggle('hidden');
      chatbotToggler.querySelector('.material-symbols-rounded').classList.toggle('hidden');
      chatbotToggler.querySelector('.material-symbols-outlined').classList.toggle('hidden');
    });
    
    // Close chatbot
    closeBtn.addEventListener('click', () => {
      chatbot.classList.add('hidden');
      chatbotToggler.querySelector('.material-symbols-rounded').classList.remove('hidden');
      chatbotToggler.querySelector('.material-symbols-outlined').classList.add('hidden');
    });
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  
    function sendMessage() {
      const message = textarea.value.trim();
      if (message) {
        appendMessage('outgoing', message);
        textarea.value = '';
        fetchBotResponse(message);
      }
    }
  
    function appendMessage(type, message) {
      const messageElement = document.createElement('li');
      messageElement.classList.add('chat', type, 'flex', 'items-start', 'space-x-2');
      
      const icon = document.createElement('span');
      icon.classList.add('material-symbols-outlined', type === 'incoming' ? 'text-blue-500' : 'text-gray-500');
      icon.textContent = type === 'incoming' ? 'smart_toy' : 'person';
      
      const messageText = document.createElement('p');
      messageText.classList.add('bg-gray-100', 'p-2', 'rounded-lg');
      messageText.textContent = message;
      
      messageElement.appendChild(icon);
      messageElement.appendChild(messageText);
      chatbox.appendChild(messageElement);
      chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    }
  
    async function fetchBotResponse(userMessage) {
      try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
          },
          body: JSON.stringify({
            prompt: `User: ${userMessage}\nBot:`,
            max_tokens: 150,
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['\n', 'User:']
          })
        });
        const data = await response.json();
        const botMessage = data.choices[0].text.trim();
        appendMessage('incoming', botMessage);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        appendMessage('incoming', 'Sorry, something went wrong. Please try again later.');
      }
    }
  });
  