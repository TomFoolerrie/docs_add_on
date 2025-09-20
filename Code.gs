/**
 * @OnlyCurrentDoc
 * Simple Google Docs Chatbot Add-on
 */

/**
 * Creates a menu entry in the Google Docs UI when document opens
 */
function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Chatbot', 'showSidebar')
    .addToUi();
}

/**
 * Runs when the add-on is installed
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar with chat interface
 */
function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Simple Chatbot');
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Set OpenAI API key (run once by developer)
 * This should be run manually in the Apps Script editor
 * Replace 'your-api-key-here' with your actual OpenAI API key
 */
function setApiKey() {
  // TODO: Replace with your actual OpenAI API key
  const apiKey = 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    throw new Error('Please replace with your actual OpenAI API key');
  }

  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', apiKey);
  console.log('API key has been stored securely');
}

/**
 * Check if API key is configured
 * @return {boolean} Whether API key exists
 */
function checkApiKey() {
  const key = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  console.log('API key configured:', key ? 'Yes' : 'No');
  return !!key;
}

/**
 * Clear API key (for maintenance)
 */
function clearApiKey() {
  PropertiesService.getScriptProperties().deleteProperty('OPENAI_API_KEY');
  console.log('API key has been removed');
}

/**
 * Send message to OpenAI API
 * @param {string} message - User's message
 * @return {string} AI response
 */
function sendToAI(message) {
  try {
    // Retrieve API key from secure storage
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');

    if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please ask your administrator to set it up.');
    }

    // OpenAI API endpoint
    const url = 'https://api.openai.com/v1/chat/completions';

    // Request payload
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant integrated into Google Docs. Provide clear, concise responses.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    // API request options
    const options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    // Make API request
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode !== 200) {
      console.error('OpenAI API error:', responseText);

      // Parse error for user-friendly message
      let errorMessage = 'Failed to get AI response.';
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        // Use generic error if parsing fails
      }

      throw new Error(errorMessage);
    }

    // Parse successful response
    const data = JSON.parse(responseText);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response format from OpenAI');
    }

  } catch (error) {
    console.error('Error in sendToAI:', error.toString());

    // Provide user-friendly error messages
    if (error.toString().includes('Invalid API key')) {
      throw new Error('Invalid OpenAI API key. Please contact your administrator.');
    } else if (error.toString().includes('quota')) {
      throw new Error('OpenAI API quota exceeded. Please try again later.');
    } else if (error.toString().includes('UrlFetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw error;
    }
  }
}

/**
 * Insert text at cursor position in document
 * @param {string} text - Text to insert
 */
function insertText(text) {
  const cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    cursor.insertText(text);
  } else {
    throw new Error('Please place cursor in document');
  }
}

/**
 * Get selected text from document
 * @return {string} Selected text
 */
function getSelectedText() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  const text = [];

  if (selection) {
    const elements = selection.getSelectedElements();

    for (let i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        const element = elements[i].getElement().asText();
        const startIndex = elements[i].getStartOffset();
        const endIndex = elements[i].getEndOffsetInclusive();
        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        const element = elements[i].getElement();
        if (element.editAsText) {
          const elementText = element.asText().getText();
          if (elementText) {
            text.push(elementText);
          }
        }
      }
    }
  }

  if (!text.length) throw new Error('Please select some text.');
  return text.join('\n');
}