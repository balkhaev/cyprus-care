/**
 * Demo page showcasing the Mediterranean Relief UI theme
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Heart, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-orange-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="default">
              Mediterranean Relief UI
            </Badge>
            <h1 className="mb-6 text-primary">
              Cyprus Care Theme
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Design system for crisis relief coordination.
              Warm, trustworthy, accessible for all ages.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">
                <Heart className="mr-2 h-5 w-5" />
                I Want to Help
              </Button>
              <Button size="lg" variant="secondary">
                <MapPin className="mr-2 h-5 w-5" />
                View Map
              </Button>
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                About Platform
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Color Palette Section */}
          <section>
            <h2 className="mb-6">Color Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-primary rounded-xl mb-4"></div>
                  <CardTitle>Deep Orange</CardTitle>
                  <CardDescription>
                    Fire, urgency, Cypriot sunsets
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-secondary rounded-xl mb-4"></div>
                  <CardTitle>Safe Blue</CardTitle>
                  <CardDescription>
                    Trust, calm, water
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-accent rounded-xl mb-4"></div>
                  <CardTitle>Olive Green</CardTitle>
                  <CardDescription>
                    Hope, nature, recovery
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-destructive rounded-xl mb-4"></div>
                  <CardTitle>Fire Red</CardTitle>
                  <CardDescription>
                    Errors, urgent alerts
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Buttons Section */}
          <section>
            <h2 className="mb-6">Buttons</h2>
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>
                  Large, easy to tap, with clear visual feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Forms Section */}
          <section>
            <h2 className="mb-6">Forms</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Registration</CardTitle>
                  <CardDescription>
                    Large inputs, clear labels, convenient for elderly users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+357" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    Register
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges & Alerts</CardTitle>
                  <CardDescription>
                    Statuses and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="accent">Success</Badge>
                    <Badge variant="destructive">Urgent</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  
                  <Alert variant="warning">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Fire hazard declared in the region
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="success">
                    <Heart className="h-5 w-5" />
                    <AlertTitle>Thank You!</AlertTitle>
                    <AlertDescription>
                      Your participation request has been accepted
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Info Cards Section */}
          <section>
            <h2 className="mb-6">Information Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>250+ Volunteers</CardTitle>
                  <CardDescription>
                    Ready to help at any time
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>15 Collection Points</CardTitle>
                  <CardDescription>
                    Throughout Cyprus
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>1000+ Helped</CardTitle>
                  <CardDescription>
                    People received support
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h2 className="mb-6">Typography</h2>
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h1 className="text-primary">Heading 1 - Inter Font</h1>
                  <p className="text-muted-foreground">
                    Used for main headings
                  </p>
                </div>
                <div>
                  <h2>Heading 2 - Clean and Readable</h2>
                  <p className="text-muted-foreground">
                    For section headings
                  </p>
                </div>
                <div>
                  <h3>Heading 3 - Convenient for All Ages</h3>
                  <p className="text-muted-foreground">
                    For subheadings
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    Paragraph text. The Inter font provides excellent readability on all devices.
                    Large font size and increased line spacing make the text accessible
                    for elderly users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Design Philosophy */}
          <section>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle>Design Philosophy</CardTitle>
                <CardDescription>
                  Mediterranean Relief UI - more than just a theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-primary mb-2">🔥 Urgency</h3>
                    <p className="text-muted-foreground">
                      Orange symbolizes fire and the need to act
                    </p>
                  </div>
                  <div>
                    <h3 className="text-secondary mb-2">💙 Trust</h3>
                    <p className="text-muted-foreground">
                      Blue brings calm and confidence in critical situations
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent mb-2">🌿 Hope</h3>
                    <p className="text-muted-foreground">
                      Green symbolizes nature, recovery and the future
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Navigation */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Project Navigation</CardTitle>
                <CardDescription>
                  See the theme in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Home Page
                    </Button>
                  </Link>
                  <Link href="/map">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <MapPin className="mr-2 h-5 w-5" />
                      Relief Map
                    </Button>
                  </Link>
                  <Link href="/venues">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <MapPin className="mr-2 h-5 w-5" />
                      Collection Points
                    </Button>
                  </Link>
                  <Link href="/organizer">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Users className="mr-2 h-5 w-5" />
                      Organizer
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
