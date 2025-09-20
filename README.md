# Simple Google Docs Chatbot Add-on

A minimal Google Docs add-on that provides a chatbot interface in a sidebar, allowing users to chat with AI and insert responses directly into their documents.

## Features

- **Simple Chat Interface**: Clean sidebar with message history
- **AI Integration**: Send messages to AI (currently mock responses)
- **Document Integration**: Insert AI responses at cursor position
- **Selected Text Support**: Process selected text from documents
- **Minimal Setup**: Just 3 files to get started

## File Structure

```
docs_add_on/
├── Code.gs              # Server-side Google Apps Script functions
├── sidebar.html         # Chat interface UI
├── appsscript.json      # Project manifest and permissions
├── README.md           # This file
└── Docs/               # Documentation
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

### 3. Test the Add-on

1. **Save** the project (Ctrl+S)
2. **Authorize** when prompted
3. **Test in Google Docs**:
   - Open a Google Doc
   - Go to Extensions > Apps Script
   - Select your project
   - Run the `onOpen` function
   - Refresh the Google Doc
   - Look for the "Simple Chatbot" menu

## Current Implementation

### Core Functions (Code.gs)

- `onOpen()` - Creates add-on menu when document opens
- `onInstall()` - Handles add-on installation
- `showSidebar()` - Opens the chat sidebar
- `sendToAI(message)` - Processes messages (currently returns mock responses)
- `insertText(text)` - Inserts text at cursor position
- `getSelectedText()` - Gets selected text from document

### Chat Interface (sidebar.html)

- Clean, responsive design
- Message history with user/AI distinction
- Loading states and error handling
- Keyboard shortcuts (Enter to send)
- Insert button to add responses to document

## Next Steps

### Phase 2: AI Integration

1. **Choose AI Provider** (OpenAI, Claude, etc.)
2. **Add API Configuration**:
   ```javascript
   function sendToAI(message) {
     const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
     // Add actual API call here
   }
   ```
3. **Store API Key**:
   ```javascript
   function setApiKey(key) {
     PropertiesService.getScriptProperties().setProperty('API_KEY', key);
   }
   ```

### Phase 3: Enhanced Features

- Document context awareness
- Conversation history
- Settings panel
- Multiple AI providers
- Custom prompts
- Better error handling

## Customization

### Styling

Modify the `<style>` section in `sidebar.html` to customize:
- Colors and themes
- Layout and spacing
- Button styles
- Message appearance

### Functionality

Extend `Code.gs` to add:
- New menu items
- Additional processing functions
- Document manipulation features
- External API integrations

## Security Notes

- The `@OnlyCurrentDoc` comment limits permissions to current document only
- Uses minimal OAuth scopes for security
- Store sensitive data (API keys) using PropertiesService

## Troubleshooting

### Common Issues

1. **Menu doesn't appear**: Run `onOpen()` function manually in Apps Script editor
2. **Sidebar won't open**: Check console for JavaScript errors
3. **Can't insert text**: Ensure cursor is placed in document
4. **Permission errors**: Re-authorize the script

### Development Tips

1. **Use Apps Script debugger**: Set breakpoints and step through code
2. **Check execution log**: View > Logs to see console output
3. **Test incrementally**: Start with basic functions, add complexity gradually

## License

This project is open source and available under the MIT License.