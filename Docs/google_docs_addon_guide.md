# Google Docs Add-on Development Guide

## Overview

Google Docs add-ons are built using **Google Apps Script**, a cloud-based JavaScript platform that integrates with Google Workspace applications. Add-ons extend Google Docs functionality by allowing you to read, edit, format text, create custom interfaces, and integrate with other Google services.

**Source**: [Extending Google Docs with add-ons](https://developers.google.com/workspace/add-ons/editors/docs)

## Core Capabilities

### What You Can Build
- Read, edit, visualize, and format text in Google Docs
- Create and modify tables, images, drawings, and equations
- Build custom menus, dialogs, and sidebars using HTML and CSS
- Use triggers to run functions when specific events occur
- Integrate with other Google Workspace applications
- Connect to third-party systems and APIs

**Source**: [Google Workspace Add-ons Documentation](https://developers.google.com/workspace/add-ons/editors/docs)

## Getting Started

### Prerequisites
- Google Account
- Web browser
- Basic JavaScript knowledge

### Setup Process
1. Create a Google Docs document at [docs.new](https://docs.new)
2. Click **Extensions > Apps Script**
3. Rename your project (click "Untitled project")
4. Start coding your add-on

**Source**: [Translate text quickstart](https://developers.google.com/apps-script/add-ons/editors/docs/quickstart/translate)

## Project Structure

### Basic File Organization
```
Your Add-on Project/
├── Code.gs (or rename to main functionality)
├── sidebar.html (optional - for custom UI)
└── manifest.json (auto-generated)
```

### Essential Functions

#### 1. onOpen() - Required for Menu Creation
```javascript
/**
 * Creates a menu entry in the Google Docs UI when document opens
 */
function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Start My Add-on', 'showSidebar')
    .addToUi();
}
```

#### 2. onInstall() - Installation Handler
```javascript
/**
 * Runs when the add-on is installed
 */
function onInstall(e) {
  onOpen(e);
}
```

#### 3. showSidebar() - Custom UI Display
```javascript
/**
 * Opens a sidebar with custom interface
 */
function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('My Add-on');
  DocumentApp.getUi().showSidebar(ui);
}
```

**Source**: [Extending Google Docs](https://developers.google.com/apps-script/guides/docs)

## Working with Document Content

### Document Structure
Google Docs have tree-like structures similar to HTML/JSON that define element placement. Key classes include:
- `Document` - The entire document
- `Body` - Main content container
- `Paragraph` - Text paragraphs
- `Table` - Tables and their cells
- `Text` - Text runs with formatting

### Getting Document Elements
```javascript
// Get active document
const doc = DocumentApp.getActiveDocument();

// Get document body
const body = doc.getBody();

// Get active tab (for newer documents)
const tab = doc.getActiveTab().asDocumentTab();
const tabBody = tab.getBody();
```

### Working with Selected Text
```javascript
/**
 * Gets the text the user has selected
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
  return text;
}
```

### Text Replacement
```javascript
/**
 * Replace text in document using regex
 */
function replaceText() {
  const body = DocumentApp.getActiveDocument().getBody();
  
  // Simple replacement
  body.replaceText('old text', 'new text');
  
  // Regex replacement
  body.replaceText('\\{name\\}', 'John Doe');
}
```

**Source**: [Extending Google Docs Guide](https://developers.google.com/apps-script/guides/docs)

## Custom User Interface

### HTML Sidebar Template
```html
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">
  <style>
    .sidebar {
      font-family: 'Roboto', sans-serif;
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    select, input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .button {
      background-color: #4285f4;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
    }
    
    .button:hover {
      background-color: #3367d6;
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <h3>My Add-on</h3>
    
    <div class="form-group">
      <label for="input-field">Input:</label>
      <input type="text" id="input-field" placeholder="Enter text...">
    </div>
    
    <div class="form-group">
      <label for="options">Options:</label>
      <select id="options">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    </div>
    
    <button class="button" onclick="processText()">Process</button>
    <button class="button" onclick="insertResult()">Insert</button>
    
    <div id="result" style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; display: none;">
      <strong>Result:</strong>
      <p id="result-text"></p>
    </div>
  </div>

  <script>
    function processText() {
      const input = document.getElementById('input-field').value;
      const option = document.getElementById('options').value;
      
      // Call server-side function
      google.script.run
        .withSuccessHandler(showResult)
        .withFailureHandler(showError)
        .serverSideFunction(input, option);
    }
    
    function showResult(result) {
      document.getElementById('result-text').textContent = result;
      document.getElementById('result').style.display = 'block';
    }
    
    function showError(error) {
      alert('Error: ' + error.message);
    }
    
    function insertResult() {
      const resultText = document.getElementById('result-text').textContent;
      if (resultText) {
        google.script.run.insertText(resultText);
      }
    }
  </script>
</body>
</html>
```

### Client-Server Communication
```javascript
// Server-side function (in .gs file)
function serverSideFunction(input, option) {
  // Process the input
  const result = "Processed: " + input + " with " + option;
  return result;
}

function insertText(text) {
  const cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    cursor.insertText(text);
  } else {
    throw new Error('Please place cursor in document');
  }
}
```

**Source**: [HTML Service Guide](https://developers.google.com/apps-script/guides/html)

## Triggers and Events

### Simple Triggers
```javascript
// onOpen - Document opened
function onOpen(e) {
  // Runs when document opens
}

// onInstall - Add-on installed
function onInstall(e) {
  // Runs when add-on is first installed
}
```

### Installable Triggers
```javascript
function createTimeTrigger() {
  ScriptApp.newTrigger('myFunction')
    .timeBased()
    .everyMinutes(30)
    .create();
}
```

**Source**: [Add-on Triggers](https://developers.google.com/workspace/add-ons/concepts/editor-triggers)

## User Preferences and Storage

### Storing User Preferences
```javascript
function savePreferences(originLang, destLang) {
  PropertiesService.getUserProperties()
    .setProperty('originLang', originLang)
    .setProperty('destLang', destLang);
}

function getPreferences() {
  const userProperties = PropertiesService.getUserProperties();
  return {
    originLang: userProperties.getProperty('originLang'),
    destLang: userProperties.getProperty('destLang')
  };
}
```

## Authorization and Permissions

### Limiting Scope
```javascript
/**
 * @OnlyCurrentDoc
 * 
 * This comment directs Apps Script to limit the scope of file
 * access for this add-on to only the current document.
 */
```

### Authorization Modes
- `AuthMode.NONE` - No authorization required
- `AuthMode.LIMITED` - Limited authorization
- `AuthMode.FULL` - Full authorization required

**Source**: [Authorization Guide](https://developers.google.com/apps-script/guides/services/authorization)

## Testing and Debugging

### Local Testing
1. Save your project (Ctrl+S)
2. Select function to test
3. Click **Run** button
4. Check execution logs
5. Test in actual Google Doc

### Error Handling
```javascript
function safeFunction() {
  try {
    // Your code here
    const result = riskyOperation();
    return result;
  } catch (error) {
    console.error('Error occurred:', error);
    throw new Error('User-friendly error message');
  }
}
```

## Publishing Your Add-on

### Development Workflow
1. **Test**: Test thoroughly in development environment
2. **Version**: Create versioned deployments
3. **Manifest**: Configure add-on manifest settings
4. **Submit**: Submit to Google Workspace Marketplace

### Marketplace Requirements
- Clear description and screenshots
- Privacy policy
- Terms of service
- OAuth consent screen configuration

**Source**: [Publishing Add-ons](https://developers.google.com/workspace/marketplace/how-to-publish)

## Best Practices

### Performance
- Use batch operations when possible
- Minimize API calls
- Cache frequently used data
- Use efficient DOM manipulation

### User Experience
- Provide clear feedback
- Handle errors gracefully
- Follow Google's design guidelines
- Test across different document sizes

### Security
- Validate all user inputs
- Use `@OnlyCurrentDoc` when appropriate
- Follow principle of least privilege
- Sanitize HTML content

## Common APIs and Services

### Built-in Google Services
```javascript
// Document service
DocumentApp.getActiveDocument()

// Language service (translation)
LanguageApp.translate(text, source, target)

// Properties service (storage)
PropertiesService.getUserProperties()

// HTML service (UI)
HtmlService.createHtmlOutputFromFile('filename')

// Utilities
Utilities.formatDate(date, timezone, format)
```

### External API Integration
```javascript
function callExternalAPI() {
  const response = UrlFetchApp.fetch('https://api.example.com/data', {
    'method': 'GET',
    'headers': {
      'Authorization': 'Bearer ' + getAPIKey()
    }
  });
  
  const data = JSON.parse(response.getContentText());
  return data;
}
```

## Example: Complete Mini Add-on

### Code.gs
```javascript
/**
 * @OnlyCurrentDoc
 */

function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Word Count', 'showWordCount')
    .addItem('Text Formatter', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Text Formatter');
  DocumentApp.getUi().showSidebar(ui);
}

function showWordCount() {
  const doc = DocumentApp.getActiveDocument();
  const text = doc.getBody().getText();
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  
  DocumentApp.getUi().alert(`Word count: ${wordCount}`);
}

function formatSelectedText(format) {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) {
    throw new Error('Please select some text first.');
  }
  
  const elements = selection.getSelectedElements();
  
  for (const element of elements) {
    if (element.getElement().editAsText) {
      const text = element.getElement().asText();
      
      switch(format) {
        case 'uppercase':
          if (element.isPartial()) {
            const start = element.getStartOffset();
            const end = element.getEndOffsetInclusive();
            const selectedText = text.getText().substring(start, end + 1);
            text.deleteText(start, end);
            text.insertText(start, selectedText.toUpperCase());
          } else {
            text.setText(text.getText().toUpperCase());
          }
          break;
        case 'lowercase':
          // Similar implementation
          break;
        case 'bold':
          if (element.isPartial()) {
            text.setBold(element.getStartOffset(), element.getEndOffsetInclusive(), true);
          } else {
            text.setBold(true);
          }
          break;
      }
    }
  }
  
  return 'Text formatted successfully!';
}
```

## Resources and References

### Official Documentation
- [Google Apps Script Overview](https://developers.google.com/apps-script/overview)
- [Extending Google Docs](https://developers.google.com/apps-script/guides/docs)
- [Google Workspace Add-ons](https://developers.google.com/workspace/add-ons/editors/docs)
- [Add-on Quickstart (Translation)](https://developers.google.com/apps-script/add-ons/editors/docs/quickstart/translate)
- [Apps Script Reference](https://developers.google.com/apps-script/reference)

### Additional Resources
- [Google Workspace Marketplace](https://workspace.google.com/marketplace)
- [Apps Script Community](https://developers.google.com/apps-script/support)
- [HTML Service Guide](https://developers.google.com/apps-script/guides/html)

### Tutorials and Examples
- [Hello World Tutorial](http://www.cs.ucr.edu/~vahid/usefulstuff/gdoc_addon/)
- [Apps Script Samples](https://developers.google.com/apps-script/samples)

---

*This guide provides a comprehensive foundation for building Google Docs add-ons. Start with the basic structure and gradually add more complex features as needed.*