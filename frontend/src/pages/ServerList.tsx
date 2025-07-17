import { useParams, useNavigate } from "react-router-dom";

const mockServers = [
  { id: "server-1", name: "Server 1" },
  { id: "server-2", name: "Server 2" },
  { id: "server-3", name: "Server 3" },
  // ...add more as needed
];

export default function ServerList() {
  const { type } = useParams();
  const navigate = useNavigate();
  // You can fetch servers based on type here
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Servers for {type}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockServers.map((server) => (
          <button
            key={server.id}
            className="p-6 bg-card border rounded-lg shadow hover:bg-primary/10"
            onClick={() => navigate(`/endpoints/${type}/servers/${server.id}`)}
          >
            {server.name}
          </button>
        ))}
      </div>
    </div>
  );
} 