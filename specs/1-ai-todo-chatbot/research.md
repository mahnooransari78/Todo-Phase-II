# Research Document: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Date**: 2026-01-16
**Author**: Claude

## Overview

This research document addresses the technical decisions and unknowns required to implement the AI-powered Todo Chatbot feature. It covers the integration of Cohere AI with OpenAI Agents SDK, MCP server implementation, and other technical considerations.

## Decision: MCP Server Implementation
**Rationale**: The specification requires using the Official MCP SDK to implement the AI chatbot functionality. MCP (Model Context Protocol) servers provide a standardized way to expose tools to AI agents.

**Alternatives considered**:
1. Direct API calls to tools - Would require custom integration and wouldn't leverage standardized tool protocols
2. LangChain tools - Would add additional dependency not specified in requirements
3. Custom tool framework - Would require significant development and maintenance overhead

**Chosen approach**: Implement MCP server using the Official MCP SDK as specified, which will expose the required todo tools (add_task, list_tasks, complete_task, delete_task, update_task) to the AI agent.

## Decision: Cohere Integration with OpenAI Agents SDK
**Rationale**: The specification indicates using Cohere as the LLM provider with OpenAI Agents SDK for AI logic. This requires configuring the OpenAI Agents SDK to use Cohere's language model.

**Alternatives considered**:
1. Direct Cohere API calls - Would bypass the OpenAI Agents SDK requirement
2. OpenAI models instead of Cohere - Would violate the specification requirement
3. Custom agent framework - Would not follow the specified technology stack

**Chosen approach**: Configure the OpenAI Agents SDK to work with Cohere's API, potentially using Cohere's compatibility layer or a custom wrapper to make Cohere models work with OpenAI Agents SDK.

## Decision: Frontend Integration Approach
**Rationale**: The floating chatbot needs to be available across all existing pages without disrupting current functionality.

**Alternatives considered**:
1. Separate chat page - Would not meet the requirement of working across all existing pages
2. Modal overlay - May interfere with existing modals or overlays
3. Dedicated sidebar - Would require layout changes to existing pages

**Chosen approach**: Implement as a floating component that can be conditionally rendered in the main layout, with proper z-index management to avoid interfering with existing UI elements.

## Decision: Database Migration Strategy
**Rationale**: Need to add new tables for conversations and messages without affecting existing functionality.

**Alternatives considered**:
1. Single combined table - Would make querying more complex
2. JSON storage in existing tables - Would violate the requirement to not modify existing schema
3. Separate database - Would add complexity and synchronization issues

**Chosen approach**: Create new SQLModel entities for conversations and messages that integrate with the existing Neon PostgreSQL database using the same connection pool.

## Decision: Authentication Flow for Chat Endpoint
**Rationale**: The chat endpoint needs to verify user identity while maintaining consistency with existing authentication patterns.

**Alternatives considered**:
1. Session cookies - Would require additional setup different from existing JWT approach
2. Separate auth mechanism - Would create inconsistency with existing patterns
3. No additional auth (rely on user_id in URL) - Would be insecure

**Chosen approach**: Use the existing Better Auth JWT verification pattern, ensuring the user_id in the URL matches the user in the JWT token, maintaining consistency with existing security practices.

## Decision: State Management for Conversations
**Rationale**: Need to maintain conversation context across multiple interactions while keeping the backend stateless.

**Alternatives considered**:
1. Client-side storage only - Would lose context on page refresh
2. Server-side session storage - Would violate the stateless requirement
3. Hybrid approach - Would add complexity

**Chosen approach**: Store conversation context in the database and pass conversation_id with each request, maintaining backend statelessness while preserving context.

## Decision: Error Handling Strategy
**Rationale**: Need to handle various failure modes gracefully while providing good UX.

**Alternatives considered**:
1. Generic error messages - Would not provide helpful feedback
2. Detailed technical errors - Could expose system details to users
3. Silent failure - Would confuse users

**Chosen approach**: Implement tiered error handling with user-friendly messages for common issues, detailed logging for debugging, and graceful fallbacks for AI/model failures.