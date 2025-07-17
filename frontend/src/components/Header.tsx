import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-sm"></div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Cisco Analytics</h1>
          </div>
          
          {/* <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Integration
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Blogs
            </a>
          </nav> */}

          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={() => navigate('/endpoints')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Check
          </Button>
        </div>
      </div>
    </header>
  );
};