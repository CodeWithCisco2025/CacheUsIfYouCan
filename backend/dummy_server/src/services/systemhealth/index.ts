import si from 'systeminformation';

export const getSystemHealth = async () => {
  const [
    cpuLoad,
    memory,
    time,
    disk,
    processes,
    networkStats,
    networkInterfaces,
    latency
  ] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.time(),
    si.diskLayout(),
    si.processes(),
    si.networkStats(),
    si.networkInterfaces(),
    si.inetLatency().catch(() => -1)
  ]);

  const totalMB = +(memory.total / 1024 / 1024).toFixed(0);
  const usedMB = +(memory.used / 1024 / 1024).toFixed(0);
  const freeMB = +(memory.free / 1024 / 1024).toFixed(0);
  const usagePercent = +((usedMB / totalMB) * 100).toFixed(2);

  const trafficAnalysis = networkStats.map(stat => {
    const throughputMbps = +(((stat.rx_sec + stat.tx_sec) * 8) / 1e6).toFixed(2); // in Mbps
    const isSpike = stat.rx_sec > 5e6 || stat.tx_sec > 5e6; // > 5MB/s
    const isDrop = stat.rx_sec < 5e4 && stat.tx_sec < 5e4; // < 50KB/s
    return {
      iface: stat.iface,
      rxBytes: stat.rx_bytes,
      txBytes: stat.tx_bytes,
      rxSec: stat.rx_sec,
      txSec: stat.tx_sec,
      throughputMbps,
      isSpike,
      isDrop
    };
  });

  return {
    timestamp: new Date().toISOString(),
    cpu: {
      currentLoad: +cpuLoad.currentLoad.toFixed(2),
      userLoad: +cpuLoad.currentLoadUser.toFixed(2),
      systemLoad: +cpuLoad.currentLoadSystem.toFixed(2),
      irqLoad: +cpuLoad.currentLoadIrq.toFixed(2)
    },
    cpuCores: cpuLoad.cpus.map(core => +core.load.toFixed(2)),
    memory: {
      totalMB,
      usedMB,
      freeMB,
      usagePercent
    },
    uptimeSeconds: time.uptime,

    systemMetrics: {
      disk: disk.map(d => ({
        device: d.device,
        type: d.type,
        name: d.name,
        health: d.smartStatus || 'unknown',
        sizeGB: +(d.size / 1e9).toFixed(2)
      })),
      processes: {
        total: processes.all,
        running: processes.running,
        blocked: processes.blocked,
        topProcesses: processes.list
          .sort((a, b) => b.cpu - a.cpu)
          .slice(0, 5)
          .map(p => ({
            pid: p.pid,
            name: p.name,
            cpu: p.cpu,
            memory: p.mem
          }))
      }
    },

    functionalMetrics: {
      networkInterfaces: networkInterfaces.map(intf => ({
        iface: intf.iface,
        ip4: intf.ip4,
        mac: intf.mac,
        speedMbps: intf.speed
      })),
      trafficAnalysis,
      latencyMs: latency
    }
  };
};
