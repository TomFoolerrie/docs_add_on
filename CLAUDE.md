# CLAUDE.md

This file provides minimal context for Claude Code when working with this Google Docs add-on repository.

## Project Overview

A Google Docs add-on that provides an AI chatbot interface in a sidebar. Users can chat with AI (OpenAI GPT-4) and insert responses directly into their documents. Built with Google Apps Script.

## Core Architecture

- **Code.gs**: Server-side functions (menu, AI communication, document manipulation)
- **sidebar.html**: Client-side chat UI with embedded CSS/JavaScript
- **appsscript.json**: Manifest defining permissions and runtime configuration

## Documentation Index

- **Technical Reference**: See `TECHNICAL.md` for implementation details, API setup, deployment steps
- **Project Roadmap**: See `ROADMAP.md` for completed sprints and future planning

## Critical Reminders

### Security
- Use `@OnlyCurrentDoc` annotation to limit permissions
- Store API keys using PropertiesService (never hardcode)
- Minimal OAuth scopes only

### Development Patterns
- Client-server communication via `google.script.run`
- Error handling with user-friendly messages
- Test in Apps Script editor before deployment

### Current Status
- ✅ v1.0 Complete: OpenAI GPT-4 integration with secure key storage
- Production-ready with comprehensive error handling