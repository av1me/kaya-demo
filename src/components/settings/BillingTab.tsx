import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Check, Crown, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BillingTab = () => {
  const { toast } = useToast();
  const [currentPlan] = useState("premium");
  
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9",
      period: "month",
      icon: <Shield className="w-5 h-5" />,
      features: ["5 podcast summaries/month", "Basic insights", "Email support"],
      current: currentPlan === "basic",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$29",
      period: "month",
      icon: <Crown className="w-5 h-5" />,
      features: ["Unlimited podcast summaries", "Advanced insights", "Priority support", "API access"],
      current: currentPlan === "premium",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "month",
      icon: <Zap className="w-5 h-5" />,
      features: ["Everything in Premium", "Custom integrations", "Dedicated support", "SLA guarantee"],
      current: currentPlan === "enterprise",
    },
  ];

  const billingHistory = [
    { date: "Dec 1, 2024", amount: "$29.00", status: "Paid", invoice: "INV-001" },
    { date: "Nov 1, 2024", amount: "$29.00", status: "Paid", invoice: "INV-002" },
    { date: "Oct 1, 2024", amount: "$29.00", status: "Paid", invoice: "INV-003" },
  ];

  const handlePlanChange = (planName: string) => {
    toast({
      title: "Plan Change",
      description: `Upgrade to ${planName} plan would be processed here.`,
    });
  };

  const handleDownloadInvoice = (invoice: string) => {
    toast({
      title: "Download Invoice",
      description: `Downloading invoice ${invoice}...`,
    });
  };

  const handleManagePayment = () => {
    toast({
      title: "Payment Methods",
      description: "Payment method management would open here.",
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancel Subscription",
      description: "Subscription cancellation process would start here.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You're currently on the Premium plan. Next billing date: January 1, 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">Premium Plan</h3>
                <p className="text-sm text-muted-foreground">$29/month</p>
              </div>
            </div>
            <Badge>Current Plan</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-4 border rounded-lg ${
                  plan.current ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-4" variant="default">
                    Popular
                  </Badge>
                )}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                    onClick={() => handlePlanChange(plan.name)}
                  >
                    {plan.current ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment information and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleManagePayment}>
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Download your invoices and view payment history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.date}</p>
                    <p className="text-sm text-muted-foreground">{item.invoice}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium">{item.amount}</p>
                      <Badge variant="secondary">{item.status}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(item.invoice)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < billingHistory.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your subscription and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};