# 🌿 BioIntel AI

## AI-Powered Biodiversity & Environmental Intelligence

BioIntel AI is an AI-based environmental intelligence platform that analyzes multiple ecological variables, identifies biodiversity risks, retrieves scientific evidence, and provides actionable recommendations.

The system is designed to demonstrate multi-variable environmental reasoning, Retrieval-Augmented Generation (RAG), conversational memory, evidence-backed recommendations, and environmental monitoring.

---

## 🎯 Problem

Environmental conditions are interconnected. Changes in temperature, pH, dissolved oxygen, nutrients, vegetation cover, and pollution can interact and affect biodiversity and ecosystem health.

Traditional analysis may examine these variables separately, making it difficult to understand their combined ecological impact.

---

## 💡 Solution

BioIntel AI combines structured environmental data with a curated scientific knowledge base to provide:

- Environmental risk assessment
- Biodiversity risk identification
- Multi-variable interaction analysis
- Evidence-backed recommendations
- Environmental monitoring plans
- Scientific evidence and source links
- Follow-up questions using previous analysis

---

# 🚀 Key Features

### 1. Environmental Data Input

Users can provide:

- Ecosystem type
- Temperature
- pH
- Dissolved oxygen
- Nitrogen
- Phosphorus
- Vegetation cover
- Pollution level

### 2. Multi-Variable Reasoning

The system analyzes relationships between multiple environmental variables.

Examples:

- High temperature + low dissolved oxygen
- High nitrogen + high phosphorus
- High pollution + low dissolved oxygen
- Low vegetation cover + high pollution

### 3. Risk Assessment

The system produces:

- Overall ecological risk level
- Environmental assessment
- Key biodiversity risks
- Variable interactions

### 4. Recommendations

The system provides:

- Recommended environmental actions
- Reasons for recommendations
- Environmental metrics to monitor
- Expected monitoring time horizon

### 5. Scientific Evidence / RAG

BioIntel AI retrieves relevant evidence from a curated scientific knowledge base.

The knowledge base contains information from authoritative environmental sources including:

- U.S. Environmental Protection Agency (EPA)
- U.S. Geological Survey (USGS)

Each knowledge document contains:

- Title
- Source
- Scientific information
- Original source URL

### 6. Conversational Memory

Users can ask follow-up questions about a previous environmental analysis.

The current MVP stores conversation messages in server memory and retains the latest messages for the active conversation.

### 7. Monitoring Plan

The system identifies environmental parameters that should be monitored over time.

---

# 🏗️ System Architecture

```text
User
  ↓
React + Vite Frontend
  ↓
Node.js / Express Backend
  ↓
Environmental Data Processing
  ↓
Knowledge Retrieval / RAG
  ↓
Scientific Evidence
  ↓
Environmental Reasoning
  ↓
Risk Assessment
  ↓
Recommendations
  ↓
Monitoring Plan
  ↓
Conversational Follow-up