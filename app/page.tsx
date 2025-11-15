import Link from "next/link";
import { Heart, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const roles = [
    {
      role: "volunteer",
      title: "Volunteer",
      description: "Offer your time and skills to help those in need",
      icon: Heart,
      bgColor: "bg-primary",
      borderColor: "border-primary/20",
      iconBg: "bg-primary/10",
      textColor: "text-primary",
      buttonVariant: "default" as const,
    },
    {
      role: "organizer",
      title: "Organizer",
      description: "Coordinate relief efforts and manage resources",
      icon: Building,
      bgColor: "bg-secondary",
      borderColor: "border-secondary/20",
      iconBg: "bg-secondary/10",
      textColor: "text-secondary",
      buttonVariant: "secondary" as const,
    },
    {
      role: "beneficiary",
      title: "Get Help",
      description: "Connect with volunteers and access support services",
      icon: Users,
      bgColor: "bg-accent",
      borderColor: "border-accent/20",
      iconBg: "bg-accent/10",
      textColor: "text-accent",
      buttonVariant: "default" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <main className="w-full max-w-6xl">
          {/* Title Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Building className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              ENOCYPRUS
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              A platform to coordinate relief efforts during crises. Whether you need support,
              want to volunteer, or organize aid, we connect people quickly and efficiently.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.role} 
                  className={`group hover:shadow-lg transition-all duration-200 ${item.borderColor} border-2`}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-6 w-6 ${item.textColor}`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${item.textColor}`}>
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <Button 
                      asChild 
                      className={`w-full ${item.bgColor} hover:opacity-90`}
                      size="default"
                    >
                      <Link href={`/signup?role=${item.role}`}>
                        Get Started
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sign In Section */}
          <div className="text-center">
            <p className="text-muted-foreground mb-3">
              Already have an account?
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">
                Sign in
              </Link>
            </Button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ENOCYPRUS. Helping communities in times of need.</p>
        </div>
      </footer>
    </div>
  );
}
