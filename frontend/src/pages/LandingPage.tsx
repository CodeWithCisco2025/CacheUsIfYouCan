import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 inline-block">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-primary">New</span>
              <span className="text-sm text-muted-foreground">Network Monitoring Integration</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Achieve 2x network
            <br />
            excellence with
            <br />
            our platform
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Designing networks that can adapt to disruptions and ensure business continuity with minimal downtime. 
            Monitor, analyze, and optimize your infrastructure with real-time insights.
          </p>

          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 text-lg"
            onClick={() => navigate('/servers')}
          >
            Get Started
          </Button>

          <div className="mt-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-primary rounded-full border-2 border-background"></div>
                <div className="w-10 h-10 bg-chart-2 rounded-full border-2 border-background"></div>
                <div className="w-10 h-10 bg-chart-3 rounded-full border-2 border-background"></div>
              </div>
              <span className="text-muted-foreground">
                Used by 12,900+ network professionals
              </span>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-md"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Monitor your network infrastructure with real-time analytics and instant alerts.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-chart-2/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-chart-2 rounded-md"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Predictive Analytics</h3>
              <p className="text-muted-foreground">
                Prevent issues before they occur with AI-powered predictive insights.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-chart-3 rounded-md"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Business Continuity</h3>
              <p className="text-muted-foreground">
                Ensure minimal downtime with adaptive network resilience strategies.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};