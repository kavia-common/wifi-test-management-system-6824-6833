const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "/api"; // 之後可改成真正 backend

export async function fetchSuites() {
  // TODO: 改成 fetch(`${API_BASE}/suites`)
  return [
    { id: "suite-001", name: "Sanity - WiFi Basic", tags: ["smoke"], tests: 4 },
    { id: "suite-002", name: "Performance - Throughput", tags: ["perf"], tests: 3 },
  ];
}

export async function startRun(suiteId) {
  // TODO: 改成 POST `${API_BASE}/runs`
  return { runId: `RUN-${Math.floor(Math.random() * 9000 + 1000)}`, suiteId, status: "RUNNING" };
}

export async function fetchRuns() {
  // TODO: 改成 GET `${API_BASE}/runs?limit=20`
  return [
    { id: "RUN-2401", suite: "Sanity - WiFi Basic", status: "PASS", when: "Today 10:12" },
    { id: "RUN-2400", suite: "Performance - Throughput", status: "FAIL", when: "Yesterday 19:40" },
  ];
}