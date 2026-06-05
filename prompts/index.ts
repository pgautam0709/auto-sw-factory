export const REQUIREMENTS_PROMPT = (feature: string) => `
You are a senior automotive software requirements engineer at a Tier 1 OEM.
Generate professional engineering requirements for the following vehicle feature: "${feature}".

Return ONLY valid JSON matching this exact structure:
{
  "systemRequirements": [
    { "id": "SYS-001", "description": "...", "category": "Functional|Safety|Performance|Interface", "priority": "High|Medium|Low" }
  ],
  "userStories": [
    { "id": "US-001", "role": "...", "action": "...", "benefit": "...", "priority": "High|Medium|Low" }
  ],
  "acceptanceCriteria": ["string", "string"]
}

Rules:
- Generate exactly 6 system requirements, 4 user stories, and 5 acceptance criteria
- Use automotive-grade language (ISO 26262, AUTOSAR style)
- Be specific and measurable
- Reference real automotive standards where appropriate
`;

export const DEVELOPMENT_PROMPT = (feature: string) => `
You are a senior automotive software architect at a Tier 1 OEM.
Generate development artifacts for the vehicle feature: "${feature}".

Return ONLY valid JSON matching this exact structure:
{
  "serviceDesign": {
    "name": "...",
    "responsibility": "...",
    "components": ["string"],
    "dependencies": ["string"],
    "pattern": "..."
  },
  "apiContract": [
    { "method": "GET|POST|PUT|DELETE|PATCH", "path": "/api/v1/...", "description": "...", "responseType": "..." }
  ],
  "unitTests": [
    { "id": "UT-001", "name": "...", "scenario": "...", "expected": "...", "status": "passing|failing|pending" }
  ]
}

Rules:
- Generate 1 service design, 4 API endpoints, and 6 unit tests
- Use AUTOSAR-aligned naming conventions
- Pattern should be one of: Event-Driven, Request-Response, Observer, Publish-Subscribe
- Make tests reflect automotive-grade validation scenarios
`;

export const QUALITY_PROMPT = (feature: string, passRate: number) => `
You are a Chief Quality Officer at an automotive OEM reviewing the ${feature} feature.
The virtual validation achieved a ${passRate}% pass rate across 1,000 simulated vehicles.

Return ONLY valid JSON matching this exact structure:
{
  "traceabilityScore": 0-100,
  "testCoverageScore": 0-100,
  "cybersecurityScore": 0-100,
  "complianceScore": 0-100,
  "overallScore": 0-100,
  "recommendations": ["string", "string", "string", "string"]
}

Rules:
- Scores should reflect the pass rate (${passRate}% pass rate = roughly 88-96 range scores)
- Generate exactly 4 actionable recommendations
- Be specific to automotive standards (ISO 26262, UN ECE R155, ASPICE)
- Overall score should be weighted average of the four scores
`;

export const RELEASE_PROMPT = (feature: string, qualityScore: number) => `
You are a Release Manager at an automotive OEM preparing the OTA deployment for "${feature}".
Quality score: ${qualityScore}/100.

Return ONLY valid JSON matching this exact structure:
{
  "packageId": "PKG-2025-XXXX",
  "version": "X.Y.Z",
  "summary": "...",
  "targetVehicles": 847250,
  "deploymentPlan": [
    { "phase": "Phase 1", "label": "Pilot Fleet", "vehicles": 1000, "percentage": 5, "duration": "2 weeks", "criteria": "...", "status": "complete" },
    { "phase": "Phase 2", "label": "Early Adopters", "vehicles": 50000, "percentage": 25, "duration": "4 weeks", "criteria": "...", "status": "active" },
    { "phase": "Phase 3", "label": "Production Fleet", "vehicles": 796250, "percentage": 70, "duration": "8 weeks", "criteria": "...", "status": "pending" }
  ],
  "changeLog": ["string", "string", "string"]
}

Rules:
- packageId format: PKG-2025-XXXX where XXXX is random 4-digit number
- version should follow semantic versioning
- summary should be 1-2 sentences describing the release
- 3 deployment phases with realistic vehicle counts
- 3 changelog entries
`;

export const FLEET_PROMPT = (feature: string) => `
You are a Fleet Intelligence AI system monitoring the OTA rollout of "${feature}" across a vehicle fleet.

Return ONLY valid JSON matching this exact structure:
{
  "successRate": 97.3,
  "totalDeployed": 51000,
  "failureClusters": [
    { "id": "FC-001", "region": "...", "model": "...", "issueType": "...", "affectedVehicles": 0, "severity": "Critical|Warning|Info" }
  ],
  "trends": [
    { "day": "Day 1", "successRate": 95.0, "activeVehicles": 1000 }
  ],
  "aiRecommendations": ["string", "string", "string"]
}

Rules:
- Generate 3 failure clusters with different severity levels
- Generate 7 trend data points (Day 1 through Day 7) showing improving success rate
- Success rate should be between 96-98%
- Total deployed matches Phase 1 + Phase 2 from release
- 3 specific AI-generated recommendations for fleet health
`;
