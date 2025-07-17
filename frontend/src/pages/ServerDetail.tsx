import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Server, MapPin, Clock } from "lucide-react";
import { MetricChart } from "@/components/MetricChart";

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POINTS = 30; // Keep last 30 points

function formatBytesMB(mb: number) {
  if (mb === 0) return "0 MB";
  if (mb > 1024) return (mb / 1024).toFixed(2) + " GB";
  return mb + " MB";
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function getStatus(cpu: number, mem: number) {
  if (cpu > 90 || mem > 90) return { label: "Warning", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  if (cpu > 98 || mem > 98) return { label: "Critical", color: "bg-red-100 text-red-800 border-red-200" };
  return { label: "Online", color: "bg-green-100 text-green-800 border-green-200" };
}

// Fallback static data for initial render or if API fails
const fallbackData = {
  timestamp: new Date().toISOString(),
  cpu: {
    currentLoad: 16.36,
    userLoad: 7.8,
    systemLoad: 7.99,
    irqLoad: 0.5,
  },
  cpuCores: [18.14, 17.46, 20.92, 16.9, 17.51, 15.58, 15.07, 15.19, 14.7, 14.52, 14.72, 15.57],
  memory: {
    totalMB: 7877,
    usedMB: 7019,
    freeMB: 858,
    usagePercent: 89.11,
  },
  uptimeSeconds: 267487.265,
  systemMetrics: {
    disk: [
      {
        device: "\\.\PHYSICALDRIVE0",
        type: "SSD",
        name: "NVMe PM991a NVMe Samsung 512GB",
        health: "Ok",
        sizeGB: 512.11,
      },
    ],
    processes: {
      total: 364,
      running: 0,
      blocked: 0,
      topProcesses: [
        {
          pid: 0,
          name: "System Idle Process",
          cpu: 91.44,
          memory: 0.0001,
        },
        {
          pid: 5092,
          name: "MsMpEng.exe",
          cpu: 1.88,
          memory: 2.23,
        },
      ],
    },
  },
  functionalMetrics: {
    networkInterfaces: [
      {
        iface: "Wi-Fi",
        ip4: "10.233.177.144",
        mac: "78:af:08:7e:9e:f6",
        speedMbps: 516.5,
      },
    ],
    trafficAnalysis: [
      {
        iface: "Wi-Fi",
        rxBytes: 446554060,
        txBytes: 48075905,
        rxSec: null,
        txSec: null,
        throughputMbps: 0,
        isSpike: false,
        isDrop: true,
      },
    ],
    latencyMs: 10,
  },
};

// Mock anomaly data
const anomalyData = [
  {
    id: 1,
    type: "Bad Request",
    description: "Multiple 400 errors from IP 192.168.1.10",
    timestamp: "2024-06-10 12:15:23",
    severity: "High",
  },
  {
    id: 2,
    type: "Good Request",
    description: "Normal traffic pattern detected",
    timestamp: "2024-06-10 12:14:10",
    severity: "Low",
  },
  {
    id: 3,
    type: "Other",
    description: "Unusual spike in POST requests",
    timestamp: "2024-06-10 12:13:05",
    severity: "Medium",
  },
  {
    id: 4,
    type: "Bad Request",
    description: "Frequent 404 errors from IP 10.0.0.5",
    timestamp: "2024-06-10 12:12:01",
    severity: "Medium",
  },
  {
    id: 5,
    type: "Other",
    description: "Sudden drop in GET requests",
    timestamp: "2024-06-10 12:11:00",
    severity: "Low",
  },
  {
    id: 6,
    type: "Unauthorized",
    description: "Multiple failed login attempts detected",
    timestamp: "2024-06-10 12:10:02",
    severity: "High",
  },
  {
    id: 7,
    type: "Bad Request",
    description: "Malformed request headers received",
    timestamp: "2024-06-10 12:09:20",
    severity: "Medium",
  },
  {
    id: 8,
    type: "Other",
    description: "Unexpected increase in DELETE requests",
    timestamp: "2024-06-10 12:08:45",
    severity: "Low",
  },
  {
    id: 9,
    type: "Timeout",
    description: "Request timeout from 192.168.1.12",
    timestamp: "2024-06-10 12:07:31",
    severity: "Medium",
  },
  {
    id: 10,
    type: "Bad Request",
    description: "Invalid payload structure",
    timestamp: "2024-06-10 12:06:50",
    severity: "Low",
  },
  {
    id: 11,
    type: "Unauthorized",
    description: "Token validation failure",
    timestamp: "2024-06-10 12:06:01",
    severity: "High",
  },
  {
    id: 12,
    type: "Other",
    description: "High frequency of PUT requests",
    timestamp: "2024-06-10 12:05:14",
    severity: "Medium",
  },
  {
    id: 13,
    type: "Bad Request",
    description: "User-agent mismatch",
    timestamp: "2024-06-10 12:04:32",
    severity: "Low",
  },
  {
    id: 14,
    type: "Timeout",
    description: "Upstream server timeout",
    timestamp: "2024-06-10 12:03:44",
    severity: "Medium",
  },
  {
    id: 15,
    type: "Unauthorized",
    description: "Access token expired",
    timestamp: "2024-06-10 12:02:59",
    severity: "Medium",
  },
  {
    id: 16,
    type: "Bad Request",
    description: "Frequent 400 status codes from bot traffic",
    timestamp: "2024-06-10 12:02:12",
    severity: "High",
  },
  {
    id: 17,
    type: "Other",
    description: "Surge in OPTIONS requests",
    timestamp: "2024-06-10 12:01:30",
    severity: "Low",
  },
  {
    id: 18,
    type: "Timeout",
    description: "Client took too long to respond",
    timestamp: "2024-06-10 12:00:54",
    severity: "Medium",
  },
  {
    id: 19,
    type: "Bad Request",
    description: "Invalid query parameter in search",
    timestamp: "2024-06-10 12:00:03",
    severity: "Low",
  },
  {
    id: 20,
    type: "Unauthorized",
    description: "Blocked IP attempting unauthorized access",
    timestamp: "2024-06-10 11:59:21",
    severity: "High",
  },
  {
    id: 21,
    type: "Other",
    description: "Sudden drop in HEAD requests",
    timestamp: "2024-06-10 11:58:45",
    severity: "Low",
  },
  {
    id: 22,
    type: "Timeout",
    description: "Connection timed out after 30 seconds",
    timestamp: "2024-06-10 11:57:58",
    severity: "Medium",
  },
  {
    id: 23,
    type: "Bad Request",
    description: "Cross-origin request blocked",
    timestamp: "2024-06-10 11:57:12",
    severity: "Medium",
  },
  {
    id: 24,
    type: "Unauthorized",
    description: "JWT signature mismatch",
    timestamp: "2024-06-10 11:56:33",
    severity: "High",
  },
  {
    id: 25,
    type: "Other",
    description: "Suspiciously fast repeated requests from single user",
    timestamp: "2024-06-10 11:55:47",
    severity: "High",
  }  
  // ...more rows as needed
];

// Aggregate anomalies by minute
const anomalyTimeSeries = (() => {
  const counts: Record<string, number> = {};
  anomalyData.forEach(a => {
    // Group by minute
    const t = a.timestamp.slice(0, 16); // e.g., "2024-06-10 12:15"
    counts[t] = (counts[t] || 0) + 1;
  });
  // Convert to array and sort by time
  return Object.entries(counts)
    .map(([time, count]) => ({
      time: time.slice(11), // show only "HH:MM"
      value: Number(count)
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
})();

const genaiRemediationData = {
  response: `🩺 *System Health Summary*  
- *Service-A latency* is high: 2100ms (threshold exceeded).  
- *CPU usage* is at 85%, nearing saturation.  
- *Memory pressure*: HIGH on node-4.  
- Recent logs confirm latency spike and memory overuse.

⚙ *Automated Remediation Actions (Already Performed)*  
- ✅ Traffic *rerouted* from service-A to service-B.  
- ✅ *Scaled* service-A: 3 new instances deployed.  

📘 *Documentation Insight*  
According to release note v2.3.1, Service-A has a known memory leak under high load.  
Suggested fix: Apply patch v2.3.2 and monitor garbage collection metrics.

🚀 *Recommended Next Actions*  
1. Monitor service-B for increased load and latency over next 5 min.  
2. Apply patch v2.3.2 to service-A (based on doc insight).  
3. Add autoscaling memory thresholds for node-4.  
4. Create fallback routing rule to service-C if service-B degrades.  

📈 *Optimization Tip*  
Consider enabling adaptive routing weights in the service mesh (e.g., Istio) to avoid future rerouting delays.

📝 Generated by: GenAI Remediation Assistant – v1.0`
};

export const ServerDetail = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(fallbackData);
  const now = new Date();
  const time1 = new Date(now.getTime() - 4000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const time2 = new Date(now.getTime() - 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const time3 = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const initialCpuHistory = [
    { time: time1, value: 20 },
    { time: time2, value: 30 },
    { time: time3, value: 25 }
  ];
  const initialMemoryHistory = [
    { time: time1, value: 80 },
    { time: time2, value: 85 },
    { time: time3, value: 82 }
  ];
  const initialLatencyHistory = [
    { time: time1, value: 10 },
    { time: time2, value: 15 },
    { time: time3, value: 12 }
  ];
  const initialProcessCountHistory = [
    { time: time1, value: 350 },
    { time: time2, value: 360 },
    { time: time3, value: 355 }
  ];
  const [cpuHistory, setCpuHistory] = useState(initialCpuHistory);
  const [memoryHistory, setMemoryHistory] = useState(initialMemoryHistory);
  const [latencyHistory, setLatencyHistory] = useState(initialLatencyHistory);
  const [processCountHistory, setProcessCountHistory] = useState(initialProcessCountHistory);

  const [badRequestRows, setBadRequestRows] = useState([]);
  // Spinner state for GenAI Remediation
  const [showGenAILoading, setShowGenAILoading] = useState(true);
  // Spinner state for CSV upload
  const [showCSVLoading, setShowCSVLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGenAILoading(false), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setShowCSVLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSV(text);
      setTimeout(() => {
        setBadRequestRows(rows);
        setShowCSVLoading(false);
      }, 3500); // 3.5 seconds
    };
    reader.readAsText(file);
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",");
    return lines.slice(1).map(line => {
      const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i] ? values[i].replace(/^"|"$/g, "") : "";
      });
      return obj;
    });
  }

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("http://52.66.30.60:3010/healthcheck");
        if (!res.ok) throw new Error("API error");
        const apiData = await res.json();
        if (isMounted) setData(apiData);
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (isMounted) {
          setCpuHistory(prev => {
            const updated = [...prev, { time, value: apiData.cpu.currentLoad }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
          setMemoryHistory(prev => {
            const updated = [...prev, { time, value: apiData.memory.usagePercent }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
          setLatencyHistory(prev => {
            const updated = [...prev, { time, value: apiData.functionalMetrics.latencyMs }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
          setProcessCountHistory(prev => {
            const updated = [...prev, { time, value: apiData.systemMetrics.processes.total }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
        }
      } catch (e) {
        // fallback to static data
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (isMounted) {
          setCpuHistory(prev => {
            const updated = [...prev, { time, value: fallbackData.cpu.currentLoad }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
          setMemoryHistory(prev => {
            const updated = [...prev, { time, value: fallbackData.memory.usagePercent }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
          setLatencyHistory(prev => {
            const updated = [...prev, { time, value: fallbackData.functionalMetrics.latencyMs }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
          setProcessCountHistory(prev => {
            const updated = [...prev, { time, value: fallbackData.systemMetrics.processes.total }];
            return updated.length > MAX_POINTS ? updated.slice(-MAX_POINTS) : updated;
          });
        }
      }
    };
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const cpuUsage = data.cpu.currentLoad;
  const memUsage = data.memory.usagePercent;
  const status = getStatus(cpuUsage, memUsage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/servers")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Servers
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Server Dashboard</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{data.systemMetrics.disk[0]?.name || "-"}</span>
                  </div>
                  <Badge className={`${status.color} capitalize`}>{status.label}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Uptime: {formatUptime(data.uptimeSeconds)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-card border border-border rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">CPU Usage</h2>
            <div className="w-full flex-1 flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
              <div style={{ width: "90%", minWidth: 400, maxWidth: 600, margin: "0 auto" }}>
                <MetricChart
                  title="CPU Usage"
                  data={cpuHistory}
                  color="hsl(var(--chart-1))"
                  unit="%"
                />
              </div>
            </div>
            <div className="text-muted-foreground mt-4">Cores: {data.cpuCores.length} | User: {data.cpu.userLoad}% | System: {data.cpu.systemLoad}%</div>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Memory Usage</h2>
            <div className="w-full flex-1 flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
              <div style={{ width: "90%", minWidth: 400, maxWidth: 600, margin: "0 auto" }}>
                <MetricChart
                  title="Memory Usage"
                  data={memoryHistory}
                  color="hsl(var(--chart-3))"
                  unit="%"
                />
              </div>
            </div>
            <div className="text-muted-foreground mt-4">{formatBytesMB(data.memory.usedMB)} / {formatBytesMB(data.memory.totalMB)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-card border border-border rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">System Information</h3>
            <ul className="text-muted-foreground space-y-1">
              <li><b>Disk:</b> {data.systemMetrics.disk[0]?.name} ({data.systemMetrics.disk[0]?.type}, {data.systemMetrics.disk[0]?.sizeGB} GB, Health: {data.systemMetrics.disk[0]?.health})</li>
              <li><b>Processes:</b> {data.systemMetrics.processes.total}</li>
              <li><b>Top Process:</b> {data.systemMetrics.processes.topProcesses[0]?.name} (CPU: {data.systemMetrics.processes.topProcesses[0]?.cpu}%, Mem: {data.systemMetrics.processes.topProcesses[0]?.memory} MB)</li>
              <li><b>Network:</b> {data.functionalMetrics.networkInterfaces[0]?.iface} ({data.functionalMetrics.networkInterfaces[0]?.ip4}, {data.functionalMetrics.networkInterfaces[0]?.speedMbps} Mbps)</li>
              <li><b>Latency:</b> {data.functionalMetrics.latencyMs} ms</li>
            </ul>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Top Processes</h3>
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">PID</th>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">CPU %</th>
                  <th className="px-2 py-1 text-left">Mem MB</th>
                </tr>
              </thead>
              <tbody>
                {data.systemMetrics.processes.topProcesses.map((proc) => (
                  <tr key={proc.pid}>
                    <td className="px-2 py-1">{proc.pid}</td>
                    <td className="px-2 py-1">{proc.name}</td>
                    <td className="px-2 py-1">{proc.cpu.toFixed(2)}</td>
                    <td className="px-2 py-1">{proc.memory.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-card border border-border rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Latency</h2>
            <div className="w-full flex-1 flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
              <div style={{ width: "90%", minWidth: 400, maxWidth: 600, margin: "0 auto" }}>
                <MetricChart
                  title="Latency"
                  data={latencyHistory}
                  color="hsl(var(--chart-4))"
                  unit="ms"
                />
              </div>
            </div>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Process Count</h2>
            <div className="w-full flex-1 flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
              <div style={{ width: "90%", minWidth: 400, maxWidth: 600, margin: "0 auto" }}>
                <MetricChart
                  title="Process Count"
                  data={processCountHistory}
                  color="hsl(var(--chart-2))"
                  unit=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* Anomaly Detection Table Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Unexpected traffic behaviour & anomaly detection</h2>
          <p className="text-muted-foreground mb-4">
            Recent anomalies detected in server traffic. Scroll to view more.
          </p>
          <div className="bg-white border border-border rounded-lg shadow-sm max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Severity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {anomalyData.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 font-mono text-gray-600">{row.id}</td>
                    <td>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          row.type === "Bad Request"
                            ? "bg-red-100 text-red-700"
                            : row.type === "Good Request"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{row.description}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{row.timestamp}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          row.severity === "High"
                            ? "bg-red-200 text-red-800"
                            : row.severity === "Medium"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Check Bad Request Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Check Bad Request (For Demonstration Purposes)</h2>
          <p className="text-muted-foreground mb-4">
            Upload a CSV file to analyze requests. The table will display the parsed data.
          </p>
          <input
            type="file"
            accept=".csv"
            id="bad-request-csv-upload"
            style={{ display: "none" }}
            onChange={handleCSVUpload}
          />
          <Button
            onClick={() => document.getElementById("bad-request-csv-upload").click()}
            className="mb-4"
          >
            Upload CSV
          </Button>
          {showCSVLoading ? (
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-muted-foreground">Processing</span>
                <span className="animate-bounce text-2xl">.</span>
                <span className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Analyzing uploaded CSV...</div>
            </div>
          ) : badRequestRows.length > 0 && (
            <div className="bg-white border border-border rounded-lg shadow-sm max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Method</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Path</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Body</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Single Q</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Double Q</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Dashes</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Braces</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Spaces</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Badwords</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Predicted Label</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {badRequestRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-mono text-gray-600">{row.method}</td>
                      <td className="px-4 py-2">{row.path}</td>
                      <td className="px-4 py-2">{row.body}</td>
                      <td className="px-4 py-2">{row.single_q}</td>
                      <td className="px-4 py-2">{row.double_q}</td>
                      <td className="px-4 py-2">{row.dashes}</td>
                      <td className="px-4 py-2">{row.braces}</td>
                      <td className="px-4 py-2">{row.spaces}</td>
                      <td className="px-4 py-2">{row.badwords}</td>
                      <td className="px-4 py-2">{row.Predicted_Label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Advanced GenAI Remediation Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Advanced GenAI Remediation</h2>
          {showGenAILoading ? (
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-muted-foreground">Processing</span>
                <span className="animate-bounce text-2xl">.</span>
                <span className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">GenAI is analyzing and remediating your system...</div>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
              {renderGenAIResponse(genaiRemediationData.response)}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

function renderGenAIResponse(response) {
  // Split the response into sections by emoji headers
  const sections = response.split(/(?=🩺|⚙|📘|🚀|📈|📝)/g);
  const iconTitleMap = {
    '🩺': 'System Health Summary',
    '⚙': 'Automated Remediation Actions',
    '📘': 'Documentation Insight',
    '🚀': 'Recommended Next Actions',
    '📈': 'Optimization Tip',
    '📝': 'Generated by',
  };
  return (
    <table className="min-w-full">
      <tbody>
        {sections.map((section, idx) => {
          const match = section.match(/^(🩺|⚙|📘|🚀|📈|📝) ?\*?([^\*\n]*)\*?\s*([\s\S]*)/);
          if (!match) return null;
          const [, icon, , content] = match;
          let formattedContent = content.trim();
          // Format lists and bolds
          if (icon === '🚀') {
            // Numbered list
            formattedContent = (
              <ol className="list-decimal ml-4">
                {formattedContent.split(/\n\d+\. /).filter(Boolean).map((item, i) => <li key={i}>{item.trim()}</li>)}
              </ol>
            );
          } else if (icon === '⚙' || icon === '🩺') {
            // Bullet list
            formattedContent = (
              <ul className="list-disc ml-4">
                {formattedContent.split(/\n- /).filter(Boolean).map((item, i) => <li key={i}>{item.replace(/\*/g, '').trim()}</li>)}
              </ul>
            );
          } else if (icon === '📝') {
            formattedContent = <span>{formattedContent.replace('Generated by: ', '')}</span>;
          } else {
            formattedContent = <span>{formattedContent.replace(/\*/g, '').split(/\n/).map((line, i) => <span key={i}>{line}<br/></span>)}</span>;
          }
          return (
            <tr key={icon}>
              <td className="align-top pr-4 font-semibold text-lg" style={{ width: '220px' }}>{icon} {iconTitleMap[icon]}</td>
              <td className="py-2">{formattedContent}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}