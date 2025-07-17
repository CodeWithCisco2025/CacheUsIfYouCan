import { Header } from "@/components/Header";
import { ServerCard } from "@/components/ServerCard";
import { useNavigate } from "react-router-dom";

// Mock data for servers
const servers = [
  {
    id: "server-001",
    name: "Web Server 01",
    location: "US East - Virginia",
    status: "online" as const,
    cpuUsage: 45,
    memoryUsage: 67
  },
  {
    id: "server-002",
    name: "Database Server",
    location: "US West - California",
    status: "online" as const,
    cpuUsage: 78,
    memoryUsage: 52
  },
  {
    id: "server-003",
    name: "API Gateway",
    location: "EU West - Ireland",
    status: "warning" as const,
    cpuUsage: 89,
    memoryUsage: 91
  },
  {
    id: "server-004",
    name: "Load Balancer",
    location: "Asia Pacific - Tokyo",
    status: "online" as const,
    cpuUsage: 23,
    memoryUsage: 34
  },
  {
    id: "server-005",
    name: "Backup Server",
    location: "US Central - Texas",
    status: "offline" as const,
    cpuUsage: 0,
    memoryUsage: 0
  },
  {
    id: "server-006",
    name: "CDN Edge Server",
    location: "EU Central - Frankfurt",
    status: "online" as const,
    cpuUsage: 56,
    memoryUsage: 43
  }
];

export const ServersPage = () => {
  const navigate = useNavigate();

  const handleServerClick = (serverId: string) => {
    navigate(`/server/${serverId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Resilient Networking
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Designing networks that can adapt to disruptions and ensure business continuity with minimal downtime.
              </p>
            </div>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-primary">New</span>
              <span className="text-sm text-muted-foreground">Network Monitoring Integration</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Server Infrastructure</h2>
          <p className="text-muted-foreground mb-6">
            Monitor your server fleet and ensure optimal performance across all locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              id={server.id}
              name={server.name}
              location={server.location}
              status={server.status}
              cpuUsage={server.cpuUsage}
              memoryUsage={server.memoryUsage}
              onClick={() => handleServerClick(server.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full border-2 border-background"></div>
              <div className="w-8 h-8 bg-chart-2 rounded-full border-2 border-background"></div>
              <div className="w-8 h-8 bg-chart-3 rounded-full border-2 border-background"></div>
            </div>
            <span className="text-sm text-muted-foreground">
              Used by 12,900+ network professionals
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};