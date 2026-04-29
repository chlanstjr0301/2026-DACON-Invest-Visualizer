# Web Research Notes
# Project: Skillfolio — Skills.md-Grounded AI Financial Dashboard Service
# Date: 2026-04-30
# Analyst: Market Research Agent (bounded search, 12-source limit)

---

## Claude Code Custom Subagents — Official Docs
- URL: https://code.claude.com/docs/en/sub-agents
- Publisher: Anthropic (code.claude.com)
- Key claim: Subagents are isolated Claude instances with their own context window, custom system prompt, specific tool access, and independent permissions; each subagent runs a focused subtask and returns only a summary to the parent, preserving context and enforcing tool constraints.
- Relevance: Directly supports Skillfolio's AI orchestration design — specialized subagents (column-mapper, data-sufficiency-checker, analysis-runner, report-generator) can each operate with scoped skills and tools, improving reproducibility and auditability.

---

## Claude Code Agent SDK — Subagents Reference
- URL: https://code.claude.com/docs/en/agent-sdk/subagents
- Publisher: Anthropic (code.claude.com)
- Key claim: Subagents are defined via `AgentDefinition` with a `description`, `prompt`, `tools`, `skills`, `permissionMode`, and optional `mcpServers`; the `skills` field explicitly allows scoping which Skills.md rules a subagent can access; subagents cannot spawn their own subagents (no nesting).
- Relevance: The `skills` field in `AgentDefinition` is the direct technical mechanism that grounds each subagent to specific Skills.md rules — this is the core differentiator of Skillfolio versus generic AI tools.

---

## Claude Code Subagents — Official Blog Post
- URL: https://claude.com/blog/subagents-in-claude-code
- Publisher: Anthropic (claude.com)
- Key claim: Subagents improve reliability through parallel execution, isolation (fresh context per subagent), and unbiased verification — each subagent concentrates on a specific scope without contextual noise from the main conversation.
- Relevance: Supports the planning argument that Skillfolio's multi-subagent architecture improves reliability of financial analysis, not just convenience — each analysis stage is isolated and independently verifiable.

---

## Model Context Protocol (MCP) — Official Introduction
- URL: https://modelcontextprotocol.io/docs/getting-started/intro
- Publisher: Anthropic / modelcontextprotocol.io
- Key claim: MCP is an open-source standard for connecting AI applications to external systems — described as "a USB-C port for AI applications" — enabling Claude to connect to data sources (local files, databases), tools (search engines), and workflows (specialized prompts).
- Relevance: Skillfolio's CSV/XLSX ingestion pipeline and future data connectors can use MCP as the standardized interface between the AI orchestration layer and data sources, making the architecture extensible without rebuilding integrations.

---

## Power BI Copilot — Microsoft Learn (Integration Overview)
- URL: https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-integration
- Publisher: Microsoft (learn.microsoft.com)
- Key claim: Power BI Copilot generates reports and dashboards from natural language prompts but explicitly cannot replace domain experts — outputs are nondeterministic, require careful grounding data preparation (naming conventions, field descriptions, linguistic modeling), and the official documentation warns that "generated reports by Copilot can't replace the models and reports created by Power BI developers or analysts."
- Relevance: Power BI Copilot is a direct benchmark competitor for AI dashboard generation; its acknowledged limitations — nondeterministic outputs, no domain-specific financial rules, requires premium Fabric capacity — are exactly the gap Skillfolio fills with Skills.md-grounded, reproducible analysis.

---

## Julius AI — Official Product Page
- URL: https://julius.ai/
- Publisher: Julius AI
- Key claim: Julius AI converts uploaded spreadsheets and databases into charts and insights via natural language questions, supports up to 32GB datasets, and connects to databases (Postgres, Snowflake, BigQuery) — but is explicitly a general-purpose data analysis tool with no financial domain rules or reproducibility guarantees.
- Relevance: Julius AI is the closest generic AI data analysis competitor to Skillfolio; it demonstrates market demand for AI-assisted CSV analysis but lacks financial domain rules, data sufficiency checking, and grounded analysis reproducibility.

---

## Julius AI — Finance Use Case Page
- URL: https://julius.ai/home/ai-finance
- Publisher: Julius AI
- Key claim: Julius AI for finance supports portfolio optimization, correlation analysis, cash flow analysis, and technical indicator analysis via plain-language questions on uploaded data — but relies on the user to know what questions to ask, with no automatic data sufficiency checking or financial analysis routing.
- Relevance: Confirms that generic AI tools can perform financial calculations when prompted, but do not proactively validate data, route analysis, or enforce financial domain rules — the structural gap Skillfolio addresses.

---

## Koyfin — Portfolio Tools Feature Page
- URL: https://www.koyfin.com/features/portfolio-tools/
- Publisher: Koyfin
- Key claim: Koyfin enables portfolio monitoring, performance tracking, and customizable analytics dashboards for stocks, ETFs, and mutual funds, with premium features including grouped accounts, summary statistics, and client-ready reports — but requires users to input holdings into Koyfin's own data system, not arbitrary CSV uploads.
- Relevance: Koyfin is a strong financial analytics benchmark but assumes a fixed schema (tickers, standard asset types) and live market data connection; it cannot ingest user-uploaded CSVs with inconsistent column names or non-standard data formats.

---

## Sharesight — US Features Page
- URL: https://www.sharesight.com/us/features/
- Publisher: Sharesight
- Key claim: Sharesight tracks 700,000+ global stocks, ETFs, crypto, and funds across 60+ markets via automated broker integrations with 200+ brokers, providing performance, dividend, and tax reporting — but operates through a broker-connection model with no documented support for arbitrary CSV uploads or custom data schemas.
- Relevance: Sharesight is a mature portfolio tracker with strong automation but is tied to broker connections and standardized asset types; it cannot handle inconsistent, user-owned CSV data that Skillfolio is designed to process.

---

## Portfolio Visualizer — Official Site
- URL: https://www.portfoliovisualizer.com/
- Publisher: Portfolio Visualizer
- Key claim: Portfolio Visualizer provides backtesting, Monte Carlo simulation, factor regression, risk attribution, and portfolio optimization for mutual funds, ETFs, and stocks — analyses require users to specify tickers/symbols from Portfolio Visualizer's own database; does not support arbitrary CSV uploads of proprietary portfolio data.
- Relevance: Demonstrates high-quality quantitative financial analysis that Skillfolio should match in analytical depth — but Skillfolio adds the flexible ingestion layer and AI-assisted column mapping that Portfolio Visualizer lacks.

---

## Portfolio Visualizer — Analysis Tools Page
- URL: https://www.portfoliovisualizer.com/analysis
- Publisher: Portfolio Visualizer
- Key claim: Analysis suite includes portfolio backtesting, Monte Carlo simulation, factor analysis (Fama-French, Carhart), portfolio optimization (Mean Variance, CVaR, Risk Parity, Kelly Criterion, Sortino, Omega, Maximum Drawdown), risk attribution, and holdings-based style analysis.
- Relevance: Provides a concrete reference for the analytical depth expected in a professional financial analytics tool; confirms that Skillfolio's MVP scope (performance, drawdown, risk, allocation, concentration) is a reasonable subset of market expectations.

---

## DACON Competition Page
- URL: https://dacon.io/en/competitions
- Publisher: DACON
- Key claim: The specific "월간 해커톤: 투자 데이터를 시각화하라" competition page was not returned in one search; DACON's general competition platform was confirmed active.
- Relevance: Competition context is derived from source/contest_brief.md which already contains the full competition rules. No additional citation needed from the DACON site itself.
