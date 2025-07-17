import { useNavigate } from "react-router-dom";
import { Server } from "lucide-react";

const endpointTypes = [
  { id: "google", label: "google.com", icon: <Server className="w-8 h-8 text-primary" /> },
  { id: "snapchat", label: "snapchat.com", icon: <Server className="w-8 h-8 text-primary" /> },
  { id: "camera", label: "Camera", icon: <Server className="w-8 h-8 text-primary" /> },
  { id: "iot", label: "IoT Devices", icon: <Server className="w-8 h-8 text-primary" /> },
  // ...add more as needed
];

export default function EndpointTypeList() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Select Endpoint Type</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {endpointTypes.map((type) => (
          <button
            key={type.id}
            className="p-6 bg-card border border-border rounded-lg shadow flex flex-col items-start hover:bg-primary/10 transition-colors cursor-pointer text-left"
            onClick={() => navigate(`/endpoints/${type.id}/servers`)}
          >
            <div className="mb-3 p-2 bg-primary/10 rounded-lg flex items-center justify-center">
              {type.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">{type.label}</h2>
              {/* Optionally add a description here */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 