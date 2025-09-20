# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Docs add-on that provides a chatbot interface in a sidebar, allowing users to chat with AI and insert responses directly into their documents. The project is built using Google Apps Script and consists of three core files.

## Architecture

### Core Components

- **Code.gs**: Server-side Google Apps Script functions that handle document manipulation, AI communication, and add-on lifecycle
- **sidebar.html**: Client-side HTML interface with embedded CSS and JavaScript for the chat UI
- **appsscript.json**: Project manifest defining permissions, OAuth scopes, and runtime configuration

### Key Functions (Code.gs)

- `onOpen()` - Creates add-on menu when document opens
- `onInstall()` - Handles add-on installation
- `showSidebar()` - Opens the chat sidebar
- `sendToAI(message)` - Processes AI requests with OpenAI GPT-4 API integration
- `insertText(text)` - Inserts text at cursor position in document
- `getSelectedText()` - Retrieves selected text from document

### Client-Server Communication

The sidebar.html uses `google.script.run` to communicate with server-side functions:
```javascript
google.script.run
  .withSuccessHandler(callback)
  .withFailureHandler(errorHandler)
  .serverSideFunction(parameters);
```

## Development Commands

This is a Google Apps Script project that runs entirely in the cloud. There are no local build commands. Development is done through:

1. **Apps Script Editor**: https://script.google.com
2. **Testing**: Run functions directly in the Apps Script editor
3. **Deployment**: Use the Apps Script editor's deployment features

### Testing Process

1. Open Apps Script editor (script.google.com)
2. Save project (Ctrl+S)
3. Run `onOpen()` function manually
4. Test in actual Google Docs document
5. Check execution logs for debugging

## Current Implementation Status (v1.0)

### ✅ Working Features
- Menu creation and sidebar display
- Chat interface with message history
- Text insertion at cursor position
- Selected text retrieval
- OpenAI GPT-4 API integration
- Secure API key storage using PropertiesService
- Comprehensive error handling for API failures
- Loading states and user feedback

### 🚀 Ready for Production
- All Sprint 1 features completed
- Secure key management implemented
- Production-ready error handling

## Security Considerations

- Uses `@OnlyCurrentDoc` annotation to limit permissions to current document only
- Minimal OAuth scopes (`https://www.googleapis.com/auth/documents.currentonly`)
- API keys should be stored using PropertiesService (encrypted, project-scoped)
- Never hardcode sensitive data in source files

## File Structure and Patterns

### Adding New Server Functions
New server-side functions should be added to Code.gs following this pattern:
```javascript
/**
 * Function description
 * @param {type} param - Parameter description
 * @return {type} Return description
 */
function functionName(param) {
  // Implementation
}
```

### Adding New UI Features
UI modifications should be made in sidebar.html within the appropriate sections:
- CSS styles in `<style>` section
- HTML structure in `<body>` section
- JavaScript logic in `<script>` section

### Error Handling Pattern
```javascript
// Server-side (Code.gs)
function serverFunction() {
  try {
    // Logic here
    return result;
  } catch (error) {
    throw new Error('User-friendly message');
  }
}

// Client-side (sidebar.html)
google.script.run
  .withFailureHandler(function(error) {
    // Handle error in UI
  })
  .serverFunction();
```

## Configuration Management

### API Key Storage (Implemented)
```javascript
// Set API key (run once by developer)
function setApiKey() {
  PropertiesService.getScriptProperties().setProperty('API_KEY', 'your-key-here');
}

// Retrieve API key securely
function getApiKey() {
  return PropertiesService.getScriptProperties().getProperty('API_KEY');
}
```

## Documentation Resources

- Primary documentation in `Docs/google_docs_addon_guide.md` - comprehensive development guide
- Sprint planning in `sprints.md` - Sprint 1 completed, v1.0 ready
- Google Apps Script documentation: https://developers.google.com/apps-script