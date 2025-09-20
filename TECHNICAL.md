# Technical Reference

Comprehensive technical documentation for the Google Docs Chatbot Add-on.

## Table of Contents
- [Quick Start](#quick-start)
- [File Structure](#file-structure)
- [Setup Instructions](#setup-instructions)
- [API Configuration](#api-configuration)
- [Core Functions](#core-functions)
- [Development Guide](#development-guide)
- [Deployment Checklist](#deployment-checklist)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites
- Google account
- OpenAI API key
- Basic JavaScript knowledge

### Minimum Viable Product
1. **Sidebar with chat interface** - Basic input/output
2. **Send message to AI** - OpenAI GPT-4 integration
3. **Display response** - Show AI response in sidebar
4. **Insert response to document** - Single button to insert at cursor

## File Structure

```
docs_add_on/
├── Code.gs              # Server-side Google Apps Script functions
├── sidebar.html         # Chat interface UI
├── appsscript.json      # Project manifest and permissions
├── CLAUDE.md           # Minimal context for Claude Code
├── TECHNICAL.md        # This file - complete technical reference
├── ROADMAP.md          # Sprint planning and future features
└── Docs/               # Additional documentation
    ├── google_docs_addon_guide.md
    └── simple_chatbot_approach.md
```

## Setup Instructions

### 1. Create New Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Rename project to "Simple Docs Chatbot"

### 2. Add Project Files

1. **Replace Code.gs content** with the content from `Code.gs`
2. **Add HTML file**:
   - Click the "+" next to "Files"
   - Choose "HTML"
   - Name it `sidebar`
   - Replace content with `sidebar.html`
3. **Update manifest**:
   - Click the gear icon (Project Settings)
   - Check "Show appsscript.json manifest file"
   - Replace content with `appsscript.json`

### 3. Configure API Key

```javascript
// Run this function ONCE to store your OpenAI API key
function setApiKey() {
  PropertiesService.getScriptProperties().setProperty('API_KEY', 'sk-your-actual-key-here');
}

// Verify key is stored
function checkApiKey() {
  const key = PropertiesService.getScriptProperties().getProperty('API_KEY');
  console.log('API key configured:', key ? 'Yes' : 'No');
}
```

### 4. Test the Add-on

1. Save the project (Ctrl+S)
2. Run `onOpen()` function manually
3. Open a Google Doc
4. Look for "Simple Chatbot" menu
5. Open sidebar and test

## API Configuration

### OpenAI Integration (Implemented)

The `sendToAI()` function uses OpenAI's GPT-4 API:

```javascript
function sendToAI(message) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');

  if (!apiKey) {
    throw new Error('API key not configured. Please contact the administrator.');
  }

  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant for Google Docs.'
      },
      {
        role: 'user',
        content: message
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  };

  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseData = JSON.parse(response.getContentText());

    if (responseData.error) {
      throw new Error(responseData.error.message || 'API request failed');
    }

    return responseData.choices[0].message.content.trim();
  } catch (error) {
    throw new Error('Failed to get AI response: ' + error.toString());
  }
}
```

## Core Functions

### Server-side (Code.gs)

#### Menu & Lifecycle
- `onOpen()` - Creates add-on menu when document opens
- `onInstall()` - Handles add-on installation, calls onOpen()
- `showSidebar()` - Opens the chat sidebar UI

#### AI Integration
- `sendToAI(message)` - Sends message to OpenAI GPT-4, returns response
- `setApiKey()` - Stores API key securely (run once by developer)
- `checkApiKey()` - Verifies API key is configured

#### Document Manipulation
- `insertText(text)` - Inserts text at cursor position
- `getSelectedText()` - Retrieves currently selected text

### Client-side (sidebar.html)

#### UI Components
- Chat display area with message history
- Input field with Enter key support
- Send button for message submission
- Insert button to add AI response to document

#### JavaScript Functions
```javascript
// Send message to AI
function sendMessage() {
  const input = document.getElementById('input');
  const message = input.value.trim();

  if (!message) return;

  addToChat('You: ' + message);
  input.value = '';
  setLoading(true);

  google.script.run
    .withSuccessHandler(handleResponse)
    .withFailureHandler(handleError)
    .sendToAI(message);
}

// Insert AI response into document
function insertToDoc() {
  if (lastResponse) {
    google.script.run
      .withSuccessHandler(() => showMessage('Inserted!'))
      .withFailureHandler(handleError)
      .insertText(lastResponse);
  }
}
```

## Development Guide

### Client-Server Communication Pattern

Use `google.script.run` for all server calls:

```javascript
google.script.run
  .withSuccessHandler(callback)
  .withFailureHandler(errorHandler)
  .serverSideFunction(parameters);
```

### Error Handling Best Practices

Server-side:
```javascript
function serverFunction() {
  try {
    // Your logic here
    return result;
  } catch (error) {
    console.error('Error in serverFunction:', error);
    throw new Error('User-friendly error message');
  }
}
```

Client-side:
```javascript
function handleError(error) {
  console.error('Error:', error);
  setLoading(false);
  showMessage('Error: ' + error.message, 'error');
}
```

### Adding New Features

1. **New Server Function**: Add to Code.gs
2. **New UI Element**: Modify sidebar.html
3. **New API Endpoint**: Update sendToAI() function
4. **New Permission**: Update appsscript.json

## Deployment Checklist

### Pre-Deployment ✅

#### OpenAI Setup
- [ ] Create OpenAI account
- [ ] Generate API key
- [ ] Store key using `setApiKey()`
- [ ] Verify with `checkApiKey()`

#### Code Deployment
- [ ] Copy all files to Apps Script editor
- [ ] Enable appsscript.json manifest
- [ ] Save all files
- [ ] Remove API key from code after storing

#### Initial Testing
- [ ] Run `onOpen()` manually
- [ ] Test in Google Doc
- [ ] Verify chat functionality
- [ ] Test text insertion
- [ ] Check error handling

### Production Deployment

#### Security Audit
- [ ] No hardcoded API keys
- [ ] PropertiesService configured
- [ ] @OnlyCurrentDoc annotation present
- [ ] Minimal OAuth scopes

#### Performance Testing
- [ ] Long conversations
- [ ] Rapid message sending
- [ ] Loading states
- [ ] Error recovery

#### Final Steps
- [ ] Create deployment in Apps Script
- [ ] Note deployment ID
- [ ] Share with test users
- [ ] Monitor execution logs

### Post-Deployment

#### Monitoring
- [ ] Check Apps Script logs
- [ ] Monitor OpenAI usage
- [ ] Track user feedback
- [ ] Plan improvements

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Menu doesn't appear | Run `onOpen()` manually in Apps Script editor |
| Sidebar won't open | Check browser console for errors |
| Can't insert text | Ensure cursor is placed in document |
| API errors | Verify API key with `checkApiKey()` |
| Permission errors | Re-authorize the script |

### Debugging Tips

1. **View Logs**: Apps Script Editor > View > Logs
2. **Console Output**: Use `console.log()` for debugging
3. **Execution Transcript**: View > Executions for detailed logs
4. **Test Functions**: Run individual functions in editor

### API Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Invalid API key | Check key configuration |
| 429 | Rate limit exceeded | Implement retry logic |
| 500 | Server error | Retry after delay |
| 503 | Service unavailable | Check API status |

## Security Considerations

### Permissions
- Uses `@OnlyCurrentDoc` annotation - limits to current document only
- OAuth scope: `https://www.googleapis.com/auth/documents.currentonly`
- No access to other documents or Google services

### API Key Management
- Stored using PropertiesService (encrypted)
- Project-scoped, not visible to users
- Never committed to version control
- Set once by developer, forgotten

### Best Practices
1. Never log sensitive data
2. Validate all user inputs
3. Use try-catch for all API calls
4. Provide generic error messages to users
5. Keep detailed logs server-side only

## Testing Guide

### Manual Testing Process
1. **Setup Test**: Create test Google Doc
2. **Menu Test**: Verify menu appears
3. **Sidebar Test**: Open and close sidebar
4. **Chat Test**: Send various messages
5. **Insert Test**: Insert responses at different positions
6. **Error Test**: Test with invalid inputs

### Test Scenarios
- Empty message
- Very long message
- Special characters
- Rapid sending
- No cursor position
- API key missing
- Network timeout

## Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Docs API Reference](https://developers.google.com/docs/api)
- [PropertiesService Documentation](https://developers.google.com/apps-script/reference/properties)