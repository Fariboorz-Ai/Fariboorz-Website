"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BsCheck, BsStar, BsRocket, BsShield, BsAward } from "react-icons/bs";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface PricingPlan {
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
  gradient: string;
}

interface PricingSectionProps {
  className?: string;
}

export default function PricingSection({ className = "" }: PricingSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: {
        monthly: "29",
        yearly: "19"
      },
      description: "Perfect for individual traders getting started",
      features: [
        "Up to 10 trading pairs",
        "Basic AI signals",
        "Email notifications",
        "Community support",
        "Basic analytics",
        "Mobile app access"
      ],
      icon: BsRocket,
      gradient: "from-red-500 to-red-600"
    },
    {
      name: "Professional",
      price: {
        monthly: "99",
        yearly: "79"
      },
      description: "Advanced features for serious traders",
      features: [
        "Unlimited trading pairs",
        "Advanced AI algorithms",
        "Real-time notifications",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Custom strategies",
        "Portfolio management"
      ],
      popular: true,
      icon: BsShield,
      gradient: "from-red-600 to-red-700"
    },
    {
      name: "Enterprise",
      price: {
        monthly: "299",
        yearly: "249"
      },
      description: "Complete solution for institutions",
      features: [
        "Everything in Professional",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
        "Multi-user access",
        "24/7 phone support",
        "SLA guarantees"
      ],
      icon: BsAward,
      gradient: "from-red-700 to-red-800"
    }
  ];

  return (
    <section ref={ref} id="pricing" className={`py-24 relative ${className}`}>
    
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-red-500/5 to-red-700/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(220,38,38,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start with our free trial and scale as you grow. No hidden fees, cancel anytime.
          </p>

        
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isYearly ? 'bg-red-600' : 'bg-gray-700'
              }`}
            >
              <motion.div
                layout
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isYearly ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
              <span className="ml-2 px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <BsStar className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <Card className={`relative h-full bg-card/50 backdrop-blur-xl border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-red-600/50 shadow-lg shadow-red-500/20' 
                  : 'border-border/50 hover:border-red-600/30'
              }`}>
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">
                        /{isYearly ? 'month' : 'month'}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Billed annually (${parseInt(plan.price.yearly) * 12})
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.2 + featureIndex * 0.05, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                          <BsCheck className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white shadow-lg hover:shadow-red-500/25'
                        : 'bg-card/50 border border-border hover:border-red-600/50 hover:bg-red-600/5 text-foreground'
                    }`}
                  >
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-red-600/10 via-red-500/10 to-red-700/10 border border-red-600/20 rounded-2xl p-8 backdrop-blur-xl max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Need a custom solution?
            </h3>
            <p className="text-muted-foreground mb-6">
              Contact our sales team for enterprise pricing and custom integrations.
            </p>
            <Button variant="outline" className="border-2 border-red-600/30 hover:border-red-600/50 hover:bg-red-600/5">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 