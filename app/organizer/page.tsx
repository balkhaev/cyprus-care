"use client"

import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Plus,
  Settings,
  LogOut,
  Building2,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  backgroundClasses,
  textClasses,
  headerClasses,
  getIconContainerClasses,
  borderClasses,
  interactiveClasses,
} from "@/lib/theme-utils"

export default function OrganizerPage() {
  // Temporary organizer data
  const organizer = {
    id: "org-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+357 99 123 456",
    organization: "Cyprus Relief Foundation",
    role: "Organizer",
    joinedDate: "January 15, 2024",
    venuesCount: 3,
    avatar: null,
  }

  const stats = [
    {
      label: "Active Venues",
      value: "3",
      icon: <Building2 className="h-5 w-5" />,
      variant: "primary" as const,
    },
    {
      label: "Total Events",
      value: "12",
      icon: <Calendar className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      label: "Volunteers",
      value: "45",
      icon: <User className="h-5 w-5" />,
      variant: "accent" as const,
    },
  ]

  return (
    <div className={`min-h-screen ${backgroundClasses.page}`}>
      {/* Header */}
      <header className={`${headerClasses.container}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl ${textClasses.heading}`}>
              Organizer Profile
            </h1>
            <div className="flex items-center gap-3">
              <Link
                href="/organizer/settings"
                className={`p-2 rounded-lg ${interactiveClasses.hoverPrimary}`}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                className={`p-2 rounded-lg ${interactiveClasses.hoverPrimary}`}
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile card */}
          <Card>
            {/* Banner */}
            <div
              className={`h-32 ${backgroundClasses.gradientPrimarySecondary}`}
            ></div>

            {/* Information */}
            <CardContent className="px-6 pb-6">
              <div className="flex items-start gap-6 -mt-16 mb-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-primary border-4 border-card flex items-center justify-center shadow-lg">
                  <User className="h-16 w-16 text-primary-foreground" />
                </div>

                {/* Main info */}
                <div className="flex-1 pt-16">
                  <h2 className={`text-2xl ${textClasses.heading} mb-1`}>
                    {organizer.name}
                  </h2>
                  <p className={textClasses.secondary}>
                    {organizer.role} • {organizer.organization}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm mt-3">
                    <div
                      className={`flex items-center gap-2 ${textClasses.secondary}`}
                    >
                      <Mail className="h-4 w-4" />
                      <span>{organizer.email}</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${textClasses.secondary}`}
                    >
                      <Phone className="h-4 w-4" />
                      <span>{organizer.phone}</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${textClasses.secondary}`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Joined {organizer.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Add venue button */}
                <div className="pt-16">
                  <Button asChild size="sm">
                    <Link
                      href="/venues/new"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Venue
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className={
                        getIconContainerClasses(stat.variant, "md") +
                        " mx-auto mb-2"
                      }
                    >
                      {stat.icon}
                    </div>
                    <div className={`text-2xl ${textClasses.heading} mb-1`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${textClasses.secondary}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <h3 className={`text-lg ${textClasses.heading}`}>
                Quick Actions
              </h3>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/venues"
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 ${borderClasses.default} ${borderClasses.hoverPrimary} hover:bg-primary/5 transition-all`}
                >
                  <div className={getIconContainerClasses("primary", "md")}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textClasses.heading} mb-1`}>
                      Manage Venues
                    </h4>
                    <p className={`text-sm ${textClasses.secondary}`}>
                      View and edit venues
                    </p>
                  </div>
                </Link>

                <Link
                  href="/venues/new"
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 ${borderClasses.default} ${borderClasses.hoverPrimary} hover:bg-primary/5 transition-all`}
                >
                  <div className={getIconContainerClasses("primary", "md")}>
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textClasses.heading} mb-1`}>
                      Create Venue
                    </h4>
                    <p className={`text-sm ${textClasses.secondary}`}>
                      Add new collection point or shelter
                    </p>
                  </div>
                </Link>

                <Link
                  href="/map"
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 ${borderClasses.default} ${borderClasses.hoverSecondary} hover:bg-secondary/5 transition-all`}
                >
                  <div className={getIconContainerClasses("secondary", "md")}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textClasses.heading} mb-1`}>
                      Venue Map
                    </h4>
                    <p className={`text-sm ${textClasses.secondary}`}>
                      View all venues on map
                    </p>
                  </div>
                </Link>

                <Link
                  href="/organizer/settings"
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 ${borderClasses.default} ${borderClasses.hoverSecondary} hover:bg-secondary/5 transition-all`}
                >
                  <div className={getIconContainerClasses("secondary", "md")}>
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textClasses.heading} mb-1`}>
                      Profile Settings
                    </h4>
                    <p className={`text-sm ${textClasses.secondary}`}>
                      Change profile information
                    </p>
                  </div>
                </Link>

                <Link
                  href="/organizer/custom-functions"
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 ${borderClasses.default} ${borderClasses.hoverAccent} hover:bg-accent/5 transition-all`}
                >
                  <div className={getIconContainerClasses("accent", "md")}>
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textClasses.heading} mb-1`}>
                      Custom Functions
                    </h4>
                    <p className={`text-sm ${textClasses.secondary}`}>
                      Manage custom function types
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
