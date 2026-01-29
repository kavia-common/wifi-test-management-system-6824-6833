import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [activeSuiteId, setActiveSuiteId] = useState("suite-001");
  const [filter, setFilter] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const suites = useMemo(
    () => [
      { id: "suite-001", name: "Sanity - WiFi Basic", tags: ["smoke"], tests: 4, owner: "QA Team" },
      { id: "suite-002", name: "Performance - Throughput", tags: ["iperf"], tests: 3, owner: "WiFi Lab" },
      { id: "suite-003", name: "Stability - Long Run", tags: ["soak"], tests: 6, owner: "SQA" },
    ],
    []
  );

  const [runs, setRuns] = useState(() => [
    { id: "RUN-2401", suiteId: "suite-001", suite: "Sanity - WiFi Basic", status: "PASS", when: "Today 10:12", duration: "06m 22s" },
    { id: "RUN-2400", suiteId: "suite-002", suite: "Performance - Throughput", status: "FAIL", when: "Yesterday 18:40", duration: "12m 05s" },
    { id: "RUN-2399", suiteId: "suite-003", suite: "Stability - Long Run", status: "PASS", when: "Jan 27 22:11", duration: "58m 10s" },
    { id: "RUN-2398", suiteId: "suite-001", suite: "Sanity - WiFi Basic", status: "PASS", when: "Jan 27 09:03", duration: "05m 49s" },
  ]);

  const activeSuite = suites.find((s) => s.id === activeSuiteId) || suites[0];

  const filteredRuns = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return runs
      .filter((r) => r.suiteId === activeSuiteId)
      .filter((r) => (q ? (r.id + " " + r.status + " " + r.when).toLowerCase().includes(q) : true))
      .slice(0, 10);
  }, [runs, activeSuiteId, filter]);

  const stats = useMemo(() => {
    const suiteRuns = runs.filter((r) => r.suiteId === activeSuiteId);
    const pass = suiteRuns.filter((r) => r.status === "PASS").length;
    const fail = suiteRuns.filter((r) => r.status === "FAIL").length;
    return { total: suiteRuns.length, pass, fail };
  }, [runs, activeSuiteId]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const onRun = async () => {
    if (running) return;
    setRunning(true);

    const runId = `RUN-${Math.floor(Math.random() * 9000 + 1000)}`;
    const startRow = {
      id: runId,
      suiteId: activeSuite.id,
      suite: activeSuite.name,
      status: "RUNNING",
      when: "Just now",
      duration: "—",
    };

    setRuns((prev) => [startRow, ...prev]);

    // 模擬執行時間與結果（Demo 用）
    await new Promise((r) => setTimeout(r, 1100));
    const ok = Math.random() > 0.25;

    setRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: ok ? "PASS" : "FAIL",
              duration: ok ? "06m 10s" : "06m 34s",
            }
          : r
      )
    );

    setRunning(false);
  };

  const onRefresh = () => {
    // Demo：刷新不打 API，只做視覺回饋（你之後要接 /api/runs 就改這裡）
    setFilter((v) => v); // no-op
  };

  return (
    <div className="kavia-root">
      {/* Top bar */}
      <div className="kavia-topbar">
        <div className="kavia-brand">
          <div className="kavia-brand-dot" />
          <div>
            <div className="kavia-brand-title">WiFi Test Management</div>
            <div className="kavia-brand-sub">KAVIA Demo UI (Frontend Only)</div>
          </div>
        </div>

        <div className="kavia-topbar-actions">
          <button className="btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button className={`btn btn-primary ${running ? "btn-disabled" : ""}`} onClick={onRun} disabled={running}>
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Shell */}
      <div className="kavia-shell">
        {/* Sidebar */}
        <div className="kavia-sidebar">
          <div className="kavia-panel">
            <div className="kavia-panel-title">Test Suites</div>
            <div className="kavia-suite-list">
              {suites.map((s) => (
                <button
                  key={s.id}
                  className={`kavia-suite-item ${s.id === activeSuiteId ? "active" : ""}`}
                  onClick={() => setActiveSuiteId(s.id)}
                >
                  <div className="kavia-suite-name">{s.name}</div>
                  <div className="kavia-suite-meta">
                    <span className="pill">{s.tests} tests</span>
                    {s.tags.map((t) => (
                      <span key={t} className="pill pill-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="kavia-panel">
            <div className="kavia-panel-title">Selected Suite</div>
            <div className="kavia-kv">
              <div className="kavia-k">Suite</div>
              <div className="kavia-v">{activeSuite.name}</div>

              <div className="kavia-k">Owner</div>
              <div className="kavia-v">{activeSuite.owner}</div>

              <div className="kavia-k">Tags</div>
              <div className="kavia-v">{activeSuite.tags.join(", ")}</div>

              <div className="kavia-k">Tests</div>
              <div className="kavia-v">{activeSuite.tests}</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="kavia-main">
          <div className="kavia-grid">
            {/* Runs table */}
            <div className="kavia-card">
              <div className="kavia-card-head">
                <div>
                  <div className="kavia-card-title">Recent Runs</div>
                  <div className="kavia-card-sub">Latest executions for the selected suite</div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    className="kavia-input"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter (RUN-xxxx / PASS / FAIL / date...)"
                  />
                  <button className="btn" onClick={onRefresh}>
                    Refresh
                  </button>
                </div>
              </div>

              <div className="kavia-table">
                <div className="kavia-row kavia-row-head">
                  <div>Run ID</div>
                  <div>When</div>
                  <div>Status</div>
                </div>

                {filteredRuns.length === 0 ? (
                  <div className="kavia-empty">No runs found.</div>
                ) : (
                  filteredRuns.map((r) => (
                    <div className="kavia-row" key={r.id}>
                      <div className="mono">{r.id}</div>
                      <div className="muted">
                        {r.when} <span className="mono" style={{ opacity: 0.8 }}>{r.duration}</span>
                      </div>
                      <div>
                        <span
                          className={`status ${
                            r.status === "PASS" ? "pass" : r.status === "FAIL" ? "fail" : "running"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Run status / stats */}
            <div className="kavia-card">
              <div className="kavia-card-head">
                <div>
                  <div className="kavia-card-title">Run Monitor</div>
                  <div className="kavia-card-sub">Live status and quick stats</div>
                </div>
              </div>

              <div className="kavia-runbox">
                <div className="kavia-run-status">
                  <div className="kavia-dot" data-state={running ? "running" : "idle"} />
                  <div>
                    <div className="kavia-run-title">{running ? "Running..." : "Idle"}</div>
                    <div className="kavia-run-sub">{running ? "Executing selected suite" : "Ready to run tests"}</div>
                  </div>
                </div>

                <div className="kavia-stats">
                  <div className="kavia-stat">
                    <div className="kavia-stat-label">Total runs (suite)</div>
                    <div className="kavia-stat-value">{stats.total}</div>
                  </div>
                  <div className="kavia-stat">
                    <div className="kavia-stat-label">PASS</div>
                    <div className="kavia-stat-value">
                      <span className="badge badge-p0">{stats.pass}</span>
                    </div>
                  </div>
                  <div className="kavia-stat">
                    <div className="kavia-stat-label">FAIL</div>
                    <div className="kavia-stat-value">
                      <span className="badge badge-p1">{stats.fail}</span>
                    </div>
                  </div>
                </div>

                <div className="kavia-tip">
                  Demo mode: 按 <b>Run</b> 會隨機產生 PASS/FAIL。
                  <br />
                  之後你要接後端 API（/api/suites, /api/runs），我會把資料源改成 fetch。
                </div>
              </div>
            </div>

            {/* Footer / notes */}
            <div className="kavia-card kavia-span2">
              <div className="kavia-card-head">
                <div>
                  <div className="kavia-card-title">Next Step</div>
                  <div className="kavia-card-sub">如果你要我直接接你後端，我就把 A 升級成 C</div>
                </div>
              </div>

              <div className="kavia-kv">
                <div className="kavia-k">Frontend</div>
                <div className="kavia-v">React (CRA) + KAVIA theme</div>

                <div className="kavia-k">Backend</div>
                <div className="kavia-v">Not connected (mock data)</div>

                <div className="kavia-k">API Base</div>
                <div className="kavia-v">
                  <span className="mono">/api</span> (未啟用)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* shell */}
    </div>
  );
}
