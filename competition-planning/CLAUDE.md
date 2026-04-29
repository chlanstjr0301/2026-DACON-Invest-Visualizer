# CLAUDE.md

## Project Goal

This project is not for implementing software.

The goal is to create a competition-winning software development planning document for a financial data analysis dashboard service.

The final output should be a Korean software development planning document that includes:
- project overview
- problem definition
- target users
- benchmark insights
- product concept
- use cases
- user flow chart
- screen specification
- feature specification
- Skills.md design
- AI orchestration design
- evaluation strategy
- MVP scope
- final roadmap

## Product Thesis

Financial professionals frequently receive investment data in inconsistent CSV/Excel formats.

Generic BI tools are flexible but lack financial domain rules.
Financial analytics services are strong but assume fixed input schemas.
Generic AI data analysis tools are convenient but weak in reproducibility and validation.

Our proposed service fills this gap by combining:
1. flexible financial data ingestion
2. AI-assisted column mapping
3. goal clarification
4. data sufficiency checks
5. Skills.md-grounded financial analysis rules
6. automatic dashboard generation
7. analyst-style report generation
8. validation and audit logs

## Proposed Product

Working name: Skillfolio

One-line definition:
Skillfolio is a Skills.md-grounded AI financial dashboard service that converts user-uploaded investment CSV/XLSX files into reproducible portfolio analysis dashboards and analyst reports.

## MVP Scope

The MVP focuses on portfolio-level investment data.

Supported input:
- CSV
- XLSX

Supported data types:
- portfolio holdings
- daily returns
- daily asset prices
- simple transaction history

Core analyses:
- performance analysis
- drawdown analysis
- risk analysis
- allocation analysis
- concentration analysis
- benchmark comparison only when benchmark data exists

Out of scope:
- real-time market data
- automatic trading
- tax calculation
- tick data
- minute bar microstructure analysis
- full enterprise BI
- full factor research platform
- broker integration

## Writing Style

All final documents must be written in Korean.

Tone:
- senior product strategist
- quant research analyst
- software planning reviewer

Avoid:
- vague startup buzzwords
- overclaiming
- saying "AI analyzes everything"
- implementation-heavy code discussion
- excessive friendliness
- hype without evaluation logic

Prefer:
- tables
- clear definitions
- assumptions
- constraints
- diagrams
- structured sections
- competition relevance
- feasibility
- validation logic

## Core Planning Principle

This is a planning document for a competition.

The proposal must be judged by:
1. clarity of problem definition
2. relevance to the competition theme
3. quality of Skills.md design
4. usefulness of the dashboard
5. practicality of the MVP
6. differentiation from existing services
7. explicit handling of data insufficiency
8. AI orchestration that improves reliability, not decorative complexity

## Important Product Logic

The user has two things:
1. data
2. analysis goal

The system must determine:
1. what the data means
2. whether the data is sufficient for the goal
3. which analysis is possible
4. which dashboard layout is appropriate
5. which insights are supported by the data
6. which claims should not be made

## Required Final Narrative

The final document should emphasize:

"We are not proposing a generic dashboard or a generic chatbot.
We are proposing a Skills.md-grounded financial analysis system that converts inconsistent investment data into reproducible dashboards and analyst reports."

## Document Rules

When creating planning documents:
- Do not write implementation code.
- Do not expand the MVP unless justified.
- Every feature must map to user pain or competition criteria.
- Every AI feature must explain why it improves reliability or usability.
- Every dashboard element must map to a financial question.
- Every analysis must specify required data.
- If data is insufficient, specify partial analysis or user clarification behavior.