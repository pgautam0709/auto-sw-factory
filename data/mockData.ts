import type {
  Requirements,
  DevelopmentArtifacts,
  ValidationResult,
  QualityMetrics,
  ReleasePackage,
  FleetIntelligence,
} from '@/types';

export function getMockRequirements(featureName: string): Requirements {
  const f = featureName;
  return {
    systemRequirements: [
      { id: 'SYS-001', description: `The ${f} system shall continuously monitor sensor data at a minimum sampling rate of 10 Hz.`, category: 'Functional', priority: 'High' },
      { id: 'SYS-002', description: `The ${f} system shall generate an alert within 500 ms of detecting an out-of-range condition.`, category: 'Performance', priority: 'High' },
      { id: 'SYS-003', description: `The ${f} system shall comply with ISO 26262 ASIL-B functional safety requirements.`, category: 'Safety', priority: 'High' },
      { id: 'SYS-004', description: `The ${f} system shall provide a human-machine interface alert via instrument cluster and audio notification.`, category: 'Interface', priority: 'Medium' },
      { id: 'SYS-005', description: `The ${f} system shall remain operational across the full vehicle operating temperature range of -40°C to +85°C.`, category: 'Performance', priority: 'Medium' },
      { id: 'SYS-006', description: `The ${f} system shall support over-the-air recalibration of threshold parameters without requiring a vehicle recall.`, category: 'Functional', priority: 'Low' },
    ],
    userStories: [
      { id: 'US-001', role: 'vehicle driver', action: `receive a clear visual and audible alert when the ${f} condition is detected`, benefit: 'I can take immediate corrective action to maintain vehicle safety', priority: 'High' },
      { id: 'US-002', role: 'fleet manager', action: `view ${f} event logs across the entire managed fleet via the telematics portal`, benefit: 'I can proactively schedule maintenance and reduce unplanned downtime', priority: 'High' },
      { id: 'US-003', role: 'service technician', action: `access ${f} diagnostic codes and sensor history via OBD-II interface`, benefit: 'I can diagnose root causes quickly and reduce repair time', priority: 'Medium' },
      { id: 'US-004', role: 'OEM software engineer', action: `remotely update ${f} detection thresholds via OTA campaign`, benefit: 'I can improve system accuracy without requiring a physical service visit', priority: 'Medium' },
    ],
    acceptanceCriteria: [
      `GIVEN a valid sensor reading is available, WHEN the ${f} condition is detected, THEN the HMI alert shall appear within 500 ms with ≥ 99.5% reliability.`,
      `GIVEN the vehicle is operating at any temperature between -40°C and +85°C, WHEN the system is active, THEN detection accuracy shall remain above 98%.`,
      `GIVEN an active alert condition, WHEN the driver acknowledges the alert, THEN the system shall log the acknowledgement with timestamp to the vehicle event recorder.`,
      `GIVEN a fleet management portal request, WHEN queried for ${f} events, THEN the response shall include all events within the past 90 days.`,
      `GIVEN an OTA calibration update is deployed, WHEN the vehicle receives and applies the update, THEN the system shall restart with new parameters within 30 seconds without any loss of data.`,
    ],
  };
}

export function getMockDevelopment(featureName: string): DevelopmentArtifacts {
  const serviceName = featureName.replace(/\s+/g, '') + 'Service';
  return {
    serviceDesign: {
      name: serviceName,
      responsibility: `Monitors vehicle sensors, evaluates threshold conditions, triggers driver alerts, and publishes telemetry events for the ${featureName} feature.`,
      components: [`${serviceName}Monitor`, `${serviceName}AlertController`, `${serviceName}TelemetryPublisher`, `${serviceName}OTAConfigHandler`],
      dependencies: ['SensorHAL', 'VehicleBusAdapter', 'HMIOrchestrator', 'TelematicsGateway', 'OTAUpdateManager'],
      pattern: 'Event-Driven',
    },
    apiContract: [
      { method: 'GET', path: `/api/v1/${featureName.toLowerCase().replace(/\s+/g, '-')}/status`, description: 'Returns current sensor reading and alert state', responseType: 'SensorStatusResponse' },
      { method: 'GET', path: `/api/v1/${featureName.toLowerCase().replace(/\s+/g, '-')}/events`, description: 'Returns paginated event history with timestamps', responseType: 'EventHistoryResponse[]' },
      { method: 'POST', path: `/api/v1/${featureName.toLowerCase().replace(/\s+/g, '-')}/config`, description: 'Updates detection thresholds via OTA calibration payload', responseType: 'ConfigUpdateAckResponse' },
      { method: 'POST', path: `/api/v1/${featureName.toLowerCase().replace(/\s+/g, '-')}/acknowledge`, description: 'Acknowledges active driver alert and logs acknowledgement', responseType: 'AcknowledgementResponse' },
    ],
    unitTests: [
      { id: 'UT-001', name: 'Nominal condition detection', scenario: `Sensor value crosses threshold boundary for ${featureName}`, expected: 'Alert generated within 500ms', status: 'passing' },
      { id: 'UT-002', name: 'Alert suppression during calibration', scenario: 'OTA config update in progress, sensor reading received', expected: 'Alert deferred until calibration completes', status: 'passing' },
      { id: 'UT-003', name: 'Low-temperature sensor validation', scenario: 'Sensor reading at -40°C operating limit', expected: 'Reading accepted; accuracy within 2% tolerance', status: 'passing' },
      { id: 'UT-004', name: 'Driver acknowledgement logging', scenario: 'Driver acknowledges active alert via HMI button press', expected: 'Event logged with ISO 8601 timestamp', status: 'passing' },
      { id: 'UT-005', name: 'Telemetry publish on alert', scenario: 'Alert triggered, telematics gateway available', expected: 'Alert event published within 1000ms', status: 'passing' },
      { id: 'UT-006', name: 'Graceful degradation on sensor failure', scenario: 'Sensor HAL returns error code', expected: 'Fault alert raised; system enters safe state', status: 'pending' },
    ],
  };
}

export function getMockValidation(featureName: string): ValidationResult {
  const passed = 952;
  const failed = 48;
  return {
    totalVehicles: 1000,
    passed,
    failed,
    passRate: 95.2,
    failureDistribution: [
      { category: 'Timing Violations', count: 21, color: '#EF4444' },
      { category: 'Sensor Noise', count: 14, color: '#F59E0B' },
      { category: 'Edge-Case Thresholds', count: 9, color: '#8B5CF6' },
      { category: 'Interface Timeout', count: 4, color: '#06B6D4' },
    ],
    rootCauses: [
      { id: 'RC-001', cause: 'Alert latency exceeded 500ms under high CAN bus load conditions', affectedVehicles: 21, severity: 'Major', recommendation: 'Increase message priority for alert CAN frame; implement preemptive scheduling.' },
      { id: 'RC-002', cause: `Sensor noise during rapid temperature change caused false-positive ${featureName} detection`, affectedVehicles: 14, severity: 'Major', recommendation: 'Apply Kalman filter with 3-sample moving average before threshold evaluation.' },
      { id: 'RC-003', cause: 'Threshold boundary conditions not validated for vehicles in extreme cold climates', affectedVehicles: 9, severity: 'Minor', recommendation: 'Add temperature-compensated threshold lookup table for sub-zero operating conditions.' },
      { id: 'RC-004', cause: 'HMI interface response timeout when instrument cluster CPU load exceeded 85%', affectedVehicles: 4, severity: 'Minor', recommendation: 'Offload non-critical HMI rendering to secondary core; reserve priority channel for safety alerts.' },
    ],
    aiInsights: `Virtual validation of the ${featureName} feature across 1,000 simulated vehicles achieved a 95.2% pass rate, exceeding the OEM target of 93%. The primary failure mode—CAN bus timing violations under peak load—is a known integration risk that can be resolved through message prioritization. Sensor noise filtering and temperature compensation will eliminate the remaining failure modes. Recommend proceeding to quality gate with these three targeted fixes prior to production release.`,
  };
}

export function getMockQuality(passRate: number): QualityMetrics {
  const base = Math.round(passRate);
  return {
    traceabilityScore: Math.min(100, base + 2),
    testCoverageScore: Math.min(100, base - 1),
    cybersecurityScore: Math.min(100, base - 3),
    complianceScore: Math.min(100, base + 1),
    overallScore: Math.min(100, base),
    recommendations: [
      'Strengthen traceability links between SYS-003 safety requirements and corresponding unit test cases to achieve full ASPICE Level 2 compliance.',
      'Add integration tests for the sensor HAL boundary conditions to increase overall test coverage from 94% to 98%.',
      'Conduct a TARA (Threat Analysis and Risk Assessment) review per UN ECE R155 to close the open cybersecurity assessment items.',
      'Schedule an independent functional safety assessment for ASIL-B compliance verification before SOP (Start of Production).',
    ],
  };
}

export function getMockRelease(featureName: string): ReleasePackage {
  const pkgNum = Math.floor(Math.random() * 9000) + 1000;
  return {
    packageId: `PKG-2025-${pkgNum}`,
    version: '2.4.1',
    summary: `Production-ready OTA release for the ${featureName} feature. This package includes validated firmware, calibration parameters, and HMI assets targeting 847,250 vehicles across all affected model lines.`,
    targetVehicles: 847250,
    deploymentPlan: [
      { phase: 'Phase 1', label: 'Pilot Fleet', vehicles: 1000, percentage: 5, duration: '2 weeks', criteria: '≥ 97% success rate and zero critical defects before advancing', status: 'complete' },
      { phase: 'Phase 2', label: 'Early Adopters', vehicles: 50000, percentage: 25, duration: '4 weeks', criteria: '≥ 96.5% success rate and field telemetry within expected range', status: 'active' },
      { phase: 'Phase 3', label: 'Production Fleet', vehicles: 796250, percentage: 70, duration: '8 weeks', criteria: 'Full fleet rollout with automated rollback trigger at < 95%', status: 'pending' },
    ],
    changeLog: [
      `feat: Implement ${featureName} with ISO 26262 ASIL-B compliant detection algorithm`,
      'fix: Resolve CAN bus timing violation under peak load (RC-001 from virtual validation)',
      'perf: Apply Kalman filter for sensor noise reduction; temperature-compensated threshold table',
    ],
  };
}

export function getMockFleet(featureName: string): FleetIntelligence {
  return {
    successRate: 97.3,
    totalDeployed: 51000,
    failureClusters: [
      { id: 'FC-001', region: 'Northeast US', model: 'Model XE-7 (2023)', issueType: 'Intermittent timing delay in sub-zero temperatures', affectedVehicles: 23, severity: 'Warning' },
      { id: 'FC-002', region: 'Southeast Asia', model: 'Model CX-4 (2024)', issueType: 'HMI alert not displayed on dual-screen configurations', affectedVehicles: 8, severity: 'Critical' },
      { id: 'FC-003', region: 'Central Europe', model: 'Model GX-9 (2022)', issueType: 'Telemetry publish delay > 1000ms on congested network', affectedVehicles: 41, severity: 'Info' },
    ],
    trends: [
      { day: 'Day 1', successRate: 95.1, activeVehicles: 1000 },
      { day: 'Day 2', successRate: 95.8, activeVehicles: 1000 },
      { day: 'Day 3', successRate: 96.4, activeVehicles: 12000 },
      { day: 'Day 4', successRate: 96.9, activeVehicles: 25000 },
      { day: 'Day 5', successRate: 97.1, activeVehicles: 38000 },
      { day: 'Day 6', successRate: 97.2, activeVehicles: 47000 },
      { day: 'Day 7', successRate: 97.3, activeVehicles: 51000 },
    ],
    aiRecommendations: [
      `Deploy targeted OTA patch for Model XE-7 vehicles in Northeast US to address sub-zero timing delay. Estimated 23-vehicle remediation within 48 hours.`,
      `Escalate Model CX-4 dual-screen HMI issue (FC-002) to Critical path. Suspend ${featureName} OTA rollout for dual-screen variants pending hotfix validation.`,
      `Monitor FC-003 telemetry delay cluster over next 72 hours. If growth rate exceeds 10% per day, trigger automated rollback for congested-network vehicle segment.`,
    ],
  };
}
