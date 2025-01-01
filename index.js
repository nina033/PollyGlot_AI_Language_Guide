const generateTranslationBtn = document.querySelector('#translate-btn');

generateTranslationBtn.addEventListener('click', handleTranslateClick);

const loadingArea = document.querySelector('.loading-panel');
const actionPanel = document.querySelector('.action-panel');
const contentInput = document.querySelector('#content-input');
const outputPanel = document.querySelector('.output-panel');

function handleTranslateClick(event) {
    event.preventDefault(); // Prevent default form submission behavior
    
    // Step 1: Capture the text input from the textarea
    const inputText = contentInput.value.trim();
    
    // Step 2: Capture the selected language
    const selectedLanguage = document.querySelector('input[name="language"]:checked');

    if (!inputText) {
        alert('Please enter some text to translate.');
        return;
    }

    if (!selectedLanguage) {
        alert('Please select a language.');
        return;
    }

    // Step 3: Transition to the loading area
    actionPanel.style.display = 'none'; // Hide the input panel
    loadingArea.style.display = 'flex'; // Show the loading panel
    
    // Step 4: Call the function to send text and selected language to the API
    callOpenAITranslationAPI(inputText, selectedLanguage.value);
}

async function callOpenAITranslationAPI(text, language) {
    const messages = [
        {
            role: 'system',
            content: 'You are a Global language translator that gives optimal translations in modern language that are not more than 50 words.'
        },
        {
            role: 'user',
            content: `Translate the following text: "${text}" to ${language} without putting response in quotation marks`
        }
    ]


    try {
        
        const url= 'https://open-ai-worker.ninafaithukoha80.workers.dev'

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'translation', // Indicate this is a translation request
                messages: messages
            })
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(`Worker Error: ${data.error}`)
        }

        // Update UI with translated text
        renderTranslation(data.content,text)

    } catch (err) {
        console.error('Error during API call:', err);
        loadingArea.innerText = 'Unable to access AI. Please refresh and try again.';
        //handleError();
    }
}

function renderTranslation(output,text){
    loadingArea.style.display = 'none'; // Hide loading panel
    outputPanel.style.display = 'flex'; // Show output panel
    document.querySelector('#translationdisplay-window').textContent = output;
    document.querySelector('#contentdisplay-window').textContent = text;
}

const startOverBtn = document.querySelector('#startOver-btn');

startOverBtn.addEventListener('click', handleStartOver);

function handleStartOver() {
    // Step 1: Hide the output panel
    outputPanel.style.display = 'none';

    // Step 2: Clear the textarea input
    contentInput.value = ''; // Clears the text but keeps placeholder

    // Step 3: Show the action panel
    actionPanel.style.display = 'flex';

    // Step 4: Clear the selected radio button
    const selectedLanguage = document.querySelector('input[name="language"]:checked');
    if (selectedLanguage) {
        selectedLanguage.checked = false; // Uncheck the selected radio button
    }
}

// Get references to buttons and sections
const translateBtn = document.getElementById('translate');
const chatBtn = document.getElementById('chatMode');
const translateSection = document.getElementById('translate-section');
const chatSection = document.getElementById('chat-section');
const loadingSection = document.getElementById('loading-section');
const outputSection = document.getElementById('output-section');

// Function to switch to Chat Mode
function switchToChatMode() {
    translateSection.style.display = 'none';   // Hide Translate section
    loadingSection.style.display = 'none';     // Hide Loading section
    outputSection.style.display = 'none';      // Hide Output section
    chatSection.style.display = 'block';       // Show Chat section
}

// Function to switch to Translate Mode
function switchToTranslateMode() {
    chatSection.style.display = 'none';        // Hide Chat section
    loadingSection.style.display = 'none';     // Hide Loading section
    outputSection.style.display = 'none';      // Hide Output section
    translateSection.style.display = 'block';  // Show Translate section
}

// Add event listener for the 'Chat Mode' button
chatBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default button action
    switchToChatMode();
});

// Add event listener for the 'Translate' button
translateBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default button action
    switchToTranslateMode();
});

// new addition 

document.addEventListener('DOMContentLoaded', () => {
    const translateButton = document.getElementById('translate');
    const chatModeButton = document.getElementById('chatMode');
    const translateBox = document.querySelector('.translate-box');
    const chatBox = document.querySelector('.chat-box');

    translateButton.addEventListener('click', () => {
        translateButton.classList.add('active');
        chatModeButton.classList.remove('active');
        translateBox.style.display = 'flex';
        chatBox.style.display = 'none';
    });

    chatModeButton.addEventListener('click', () => {
        chatModeButton.classList.add('active');
        translateButton.classList.remove('active');
        chatBox.style.display = 'flex';
        translateBox.style.display = 'none';
        oneTimeGreet()
        
    });
});

let hasGreeted = false; // Flag to track if the greeting has been added

function oneTimeGreet() {
    if (hasGreeted) return; // Exit the function if the greeting has already been added

    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    const newAiSpeechBubble = document.createElement('div');
    newAiSpeechBubble.classList.add('speech', 'speech-ai');
    newAiSpeechBubble.textContent = "Hi there! How can I help you with your language goals?";
    chatbotConversation.appendChild(newAiSpeechBubble);
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    messages.push({
        role: 'assistant',
        content: 'Hi there! How can I help you with your language goals?'
    });

    hasGreeted = true; // Set the flag to true after the greeting has been added
}

// handle the automatic form submission
const sendAIqueryButton = document.querySelector('#submit-btn');

sendAIqueryButton.addEventListener('click', handleAIButtonClick);

function handleAIButtonClick(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const userInput = document.getElementById('user-input');
    const question = userInput.value.trim(); // Trim to avoid spaces-only input
    
    if (!question) {
        alert('Please type in some text.');
        return; // Stop further execution
    }
    
    progressConversation(question);

}
// to display the chat messages 
async function progressConversation(question) {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    userInput.value = ''
    console.log('User input:', question)

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

    // add AI message
    const result= await aiAgent(question)
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    chatbotConversation.appendChild(newAiSpeechBubble)
    newAiSpeechBubble.textContent = result
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}

const messages = [
    {
        role: 'system',
        content: 'You are a concise, engaging, and enthusiastic language learning guide. Support learners by identifying their challenges, language goals, and skill levels. Offer practical tips or assistance, keeping responses under 30 words. Reflect on prior context naturally to provide relevant, motivating, and helpful answers without explicitly referencing chat history.'
    }
];

async function aiAgent(question){ //my work tomorrow starts here 

    messages.push({
        role: 'user',
        content: question
      });

    try {
        
        const url= 'https://open-ai-worker.ninafaithukoha80.workers.dev'

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'chat', // Indicate this is a translation request
                messages: messages
            })
        })
        const data = await response.json()
        messages.push({
            role: 'assistant',
            content: data.content
        });
        console.log(messages)
        if (!response.ok) {
            throw new Error(`Worker Error: ${data.error}`)
        }

        
        return data.content

    } catch (err) {
        console.error('Error during API call:', err);
    }
}

