import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, Wrench, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
}

export const IntegrationsTab = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and insights directly in your Slack workspace",
      icon: <MessageSquare className="w-6 h-6" />,
      connected: true,
      lastSync: "2 minutes ago",
    },
    {
      id: "jira",
      name: "Jira",
      description: "Import project data and track progress automatically",
      icon: <Wrench className="w-6 h-6" />,
      connected: false,
    },
    {
      id: "calendar",
      name: "Google Calendar",
      description: "Sync your meetings and schedule for better insights",
      icon: <Calendar className="w-6 h-6" />,
      connected: true,
      lastSync: "1 hour ago",
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );

    const integration = integrations.find(i => i.id === id);
    toast({
      title: `${integration?.name} ${integration?.connected ? 'Disconnected' : 'Connected'}`,
      description: `Successfully ${integration?.connected ? 'disconnected from' : 'connected to'} ${integration?.name}.`,
    });
  };

  const handleConfigure = (name: string) => {
    toast({
      title: "Configure Integration",
      description: `${name} configuration panel would open here.`,
    });
  };

  return (
    <div className="space-y-6 min-h-[400px]">
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            Manage your third-party integrations to enhance Noma's capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-secondary rounded-lg">
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{integration.name}</h3>
                    <Badge variant={integration.connected ? "default" : "secondary"}>
                      {integration.connected ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Disconnected
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                  {integration.connected && integration.lastSync && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last sync: {integration.lastSync}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {integration.connected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigure(integration.name)}
                  >
                    Configure
                  </Button>
                )}
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};