import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Cpu, Activity } from "lucide-react";

interface ServerCardProps {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  cpuUsage: number;
  memoryUsage: number;
  onClick: () => void;
}

export const ServerCard = ({ 
  id, 
  name, 
  location, 
  status, 
  cpuUsage, 
  memoryUsage, 
  onClick 
}: ServerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(status)} capitalize`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">CPU Usage</span>
            </div>
            <span className="text-sm font-medium text-foreground">{cpuUsage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Memory Usage</span>
            </div>
            <span className="text-sm font-medium text-foreground">{memoryUsage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-chart-2 rounded-full h-2 transition-all duration-300"
              style={{ width: `${memoryUsage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};