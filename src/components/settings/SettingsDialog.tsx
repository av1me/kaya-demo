import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ProfileTab } from "./ProfileTab";
import { IntegrationsTab } from "./IntegrationsTab";
import { NotificationsTab } from "./NotificationsTab";
import { BillingTab } from "./BillingTab";
export const SettingsDialog = () => {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">Integrations</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">Notifications</TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">Billing</TabsTrigger>
          </TabsList>
          <div className="mt-6 h-[500px] overflow-y-auto">
            <TabsContent value="profile" className="mt-0">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="integrations" className="mt-0">
              <IntegrationsTab />
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <BillingTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>;
};