# Project Sprints

## Sprint 1: Secure API Key Implementation

### Task: Implement Secure API Key Storage Using PropertiesService

**Context:**
Currently the `sendToAI()` function in `Code.gs` returns mock responses. Need to implement secure API key storage and real AI API integration.

**Requirements:**
1. Store API key securely using Google Apps Script's PropertiesService
2. API key should be set once by developer, never visible to end users
3. Key should be encrypted and stored in Google's cloud storage tied to the project
4. Update `sendToAI()` function to use stored API key for real API calls

**Current State:**
- `Code.gs` has placeholder function: `return "AI Response: " + message;`
- No API key management implemented
- Mock responses only

**Implementation Steps:**

1. **Add API Key Management Functions to Code.gs:**
   ```javascript
   function setApiKey() {
     // Developer runs this ONCE to store API key securely
     PropertiesService.getScriptProperties().setProperty('API_KEY', 'sk-your-actual-key-here');
   }

   function checkApiKey() {
     // Helper function to verify key is stored
     const key = PropertiesService.getScriptProperties().getProperty('API_KEY');
     console.log('API key configured:', key ? 'Yes' : 'No');
   }
   ```

2. **Update sendToAI() Function:**
   ```javascript
   function sendToAI(message) {
     const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
     if (!apiKey) {
       throw new Error('API key not configured. Contact administrator.');
     }

     // Implement actual API call (OpenAI recommended)
     // Return real AI response
   }
   ```

3. **Choose AI Provider and Implement API Call:**
   - OpenAI GPT API (recommended)
   - Claude API
   - Google PaLM API
   - Or other provider

4. **Developer Setup Process:**
   - Add functions to Code.gs
   - Run `setApiKey()` once in Apps Script editor
   - Test with `checkApiKey()` to verify storage
   - Test real API responses

**Acceptance Criteria:**
- [ ] API key stored securely using PropertiesService
- [ ] Key not visible in source code
- [ ] `sendToAI()` makes real API calls
- [ ] Error handling for missing/invalid keys
- [ ] Developer can set key once and forget it
- [ ] End users never see or manage API keys

**Security Notes:**
- PropertiesService encrypts stored values
- Keys are project-scoped and persistent
- No hardcoded keys in visible source files
- Users only interact with chat interface

**Files to Modify:**
- `Code.gs` - Add key management and real API integration

**Testing:**
1. Set API key using `setApiKey()`
2. Verify storage with `checkApiKey()`
3. Test real AI responses in Google Docs sidebar
4. Verify error handling when key is missing

---

## Future Sprints

### Sprint 2: Enhanced Features
- Document context awareness
- Conversation history
- Settings panel

### Sprint 3: Publishing
- Google Workspace Marketplace submission
- Documentation and screenshots
- Privacy policy and terms