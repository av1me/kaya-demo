import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageCircle, CreditCard, Calendar, AlertTriangle } from "lucide-react";

interface NotificationSettings {
  email: {
    podcastUpdates: boolean;
    billingAlerts: boolean;
    weeklySummary: boolean;
    urgentAlerts: boolean;
  };
  sms: {
    podcastUpdates: boolean;
    billingAlerts: boolean;
  };
}

export const NotificationsTab = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      podcastUpdates: true,
      billingAlerts: true,
      weeklySummary: true,
      urgentAlerts: true,
    },
    sms: {
      podcastUpdates: false,
      billingAlerts: true,
    },
  });

  const updateEmailSetting = (key: keyof NotificationSettings['email']) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key],
      },
    }));
  };

  const updateSmsSetting = (key: keyof NotificationSettings['sms']) => {
    setSettings(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        [key]: !prev.sms[key],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Notifications</span>
          </CardTitle>
          <CardDescription>
            Choose what updates you'd like to receive via email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Podcast Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new podcast episodes are available
              </p>
            </div>
            <Switch
              checked={settings.email.podcastUpdates}
              onCheckedChange={() => updateEmailSetting('podcastUpdates')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Billing Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Payment confirmations and billing notifications
              </p>
            </div>
            <Switch
              checked={settings.email.billingAlerts}
              onCheckedChange={() => updateEmailSetting('billingAlerts')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">
                Weekly overview of your progress and insights
              </p>
            </div>
            <Switch
              checked={settings.email.weeklySummary}
              onCheckedChange={() => updateEmailSetting('weeklySummary')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Urgent Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Critical system notifications and security alerts
              </p>
            </div>
            <Switch
              checked={settings.email.urgentAlerts}
              onCheckedChange={() => updateEmailSetting('urgentAlerts')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>SMS Notifications</span>
          </CardTitle>
          <CardDescription>
            Receive important alerts via text message.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Podcast Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new podcast episodes are available
              </p>
            </div>
            <Switch
              checked={settings.sms.podcastUpdates}
              onCheckedChange={() => updateSmsSetting('podcastUpdates')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Billing Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Payment failures and subscription issues
              </p>
            </div>
            <Switch
              checked={settings.sms.billingAlerts}
              onCheckedChange={() => updateSmsSetting('billingAlerts')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};