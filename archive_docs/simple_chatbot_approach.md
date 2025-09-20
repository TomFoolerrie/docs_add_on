# Simple Google Docs Chatbot Add-on Approach

## Goal
Create the absolute simplest working chatbot add-on for Google Docs with minimal features and complexity.

## Minimum Viable Product (MVP)

### Core Features (Keep It Simple)
1. **Sidebar with chat interface** - Basic input/output
2. **Send message to AI** - One API call per message
3. **Display response** - Show AI response in sidebar
4. **Insert response to document** - Single button to insert at cursor

### What We're NOT Including (v1)
- ❌ Conversation history/memory
- ❌ Document context awareness
- ❌ Selected text processing
- ❌ Multiple AI providers
- ❌ Settings/configuration
- ❌ Complex formatting
- ❌ Error retry logic

## Technical Implementation

### File Structure (2 files only)
```
Simple Chatbot/
├── Code.gs          # All server-side logic
└── sidebar.html     # Simple chat UI
```

### Code.gs - Core Functions
```javascript
/**
 * @OnlyCurrentDoc
 */

// 1. Menu creation
function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Chatbot', 'showSidebar')
    .addToUi();
}

// 2. Show sidebar
function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('sidebar');
  DocumentApp.getUi().showSidebar(ui);
}

// 3. Send to AI (mock for now)
function sendToAI(message) {
  // For now, just echo back with prefix
  return "AI Response: " + message;
}

// 4. Insert text at cursor
function insertText(text) {
  const cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    cursor.insertText(text);
  }
}
```

### sidebar.html - Minimal UI
```html
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body { font-family: Arial; padding: 20px; }
    #chat { border: 1px solid #ccc; height: 200px; padding: 10px; margin-bottom: 10px; overflow-y: scroll; }
    #input { width: 100%; padding: 8px; margin-bottom: 10px; }
    button { padding: 8px 16px; margin-right: 5px; }
  </style>
</head>
<body>
  <h3>Simple Chatbot</h3>
  <div id="chat"></div>
  <input type="text" id="input" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendMessage()">
  <button onclick="sendMessage()">Send</button>
  <button onclick="insertLastResponse()">Insert Response</button>

  <script>
    let lastResponse = '';

    function sendMessage() {
      const input = document.getElementById('input');
      const message = input.value.trim();
      if (!message) return;

      // Add user message to chat
      addToChat('You: ' + message);
      input.value = '';

      // Call server function
      google.script.run
        .withSuccessHandler(function(response) {
          lastResponse = response;
          addToChat(response);
        })
        .sendToAI(message);
    }

    function addToChat(text) {
      const chat = document.getElementById('chat');
      chat.innerHTML += '<div>' + text + '</div>';
      chat.scrollTop = chat.scrollHeight;
    }

    function insertLastResponse() {
      if (lastResponse) {
        google.script.run.insertText(lastResponse);
      }
    }
  </script>
</body>
</html>
```

## Development Steps

### Phase 1: Basic Structure (Start Here)
1. Create new Google Apps Script project
2. Add the 2 files above
3. Choose one AI provider (OpenAI recommended)
4. Add API key storage
5. Test with AI responses

### Phase 3: Polish (Optional)
1. Better error handling
2. Loading indicators
3. Basic styling improvements

## Implementation Priority

### Must Have (Day 1)
- ✅ Sidebar opens
- ✅ Can type and send messages
- ✅ Mock responses appear
- ✅ Can insert response to document

### Should Have (Day 2)
- ✅ Real AI API integration
- ✅ Basic error handling

### Nice to Have (Later)
- 🔄 Better UI styling
- 🔄 Loading states
- 🔄 Conversation persistence

## Why This Approach?

### Benefits
- **Fast to build** - Can be working in 1-2 hours
- **Easy to understand** - Minimal code complexity
- **Easy to extend** - Simple foundation to build on
- **Focused** - Does one thing well

### Limitations We Accept
- No conversation memory between messages
- No document awareness
- Basic UI only
- Single AI provider
- Minimal error handling

## Next Steps
1. Create basic structure 
2. Test in Google Docs
3. Iterate and improve

This approach gets us to a working chatbot as quickly as possible while maintaining the ability to enhance it later.