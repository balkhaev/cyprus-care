"use client"

import { useState } from "react"
import {
  Bug,
  ChevronRight,
  MapPin,
  Package,
  Hand,
  RotateCcw,
} from "lucide-react"
import {
  getCurrentUser,
  setCurrentUser,
  mockUsers,
  type User,
} from "@/lib/mock-data/user-roles"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUserState] = useState<User>(getCurrentUser())
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Only show when enabled via env
  const isVisible = process.env.NEXT_PUBLIC_SHOW_DEBUG_PANEL === "true"

  if (!isVisible) return null

  const handleUserChange = (userId: string) => {
    setCurrentUser(userId)
    setCurrentUserState(mockUsers[userId])
    // Reload the page to update all components
    window.location.reload()
  }

  const handleResetConfirm = () => {
    handleUserChange("user-org-1")
    setShowResetDialog(false)
  }

  const getRoleInfo = (role: User["role"]) => {
    switch (role) {
      case "organizer":
        return {
          color: "bg-purple-500 dark:bg-purple-600",
          icon: <MapPin className="h-4 w-4" />,
          label: "Organizer",
          description: "Manages venues & responses",
        }
      case "beneficiary":
        return {
          color: "bg-green-500 dark:bg-green-600",
          icon: <Package className="h-4 w-4" />,
          label: "Beneficiary",
          description: "Can commit to distributions",
        }
      case "volunteer":
        return {
          color: "bg-blue-500 dark:bg-blue-600",
          icon: <Hand className="h-4 w-4" />,
          label: "Volunteer",
          description: "Can respond to needs",
        }
    }
  }

  const currentRoleInfo = getRoleInfo(currentUser.role)

  return (
    <div className="fixed bottom-4 right-4 z-9999 font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-2xl hover:scale-105 transition-transform border-2 border-zinc-700 dark:border-zinc-300"
          title="Open Debug Menu"
        >
          <Bug className="h-5 w-5" />
          <span className="font-semibold text-sm">Debug</span>
        </button>
      )}

      {/* Debug Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border-2 border-zinc-200 dark:border-zinc-700 w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              <h3 className="font-bold text-sm">Debug Menu</h3>
              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded">
                DEV
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 dark:hover:bg-zinc-900/20 rounded transition-colors"
              title="Close"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Current User Info */}
          <div className={`${currentRoleInfo.color} text-white p-4`}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {currentRoleInfo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">
                  Current User
                </p>
                <p className="font-bold text-base truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs opacity-90 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-bold">
                    {currentRoleInfo.label}
                  </span>
                  <span className="text-xs opacity-90">
                    {currentRoleInfo.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Switch User
              </p>
              <AlertDialog
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
              >
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                    title="Reset to default user"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset user?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be switched to the default user (John Smith -
                      Organizer). The page will be reloaded.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetConfirm}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="space-y-1 max-h-[400px] overflow-y-auto p-1">
              {Object.values(mockUsers).map((user) => {
                const roleInfo = getRoleInfo(user.role)
                const isActive = user.id === currentUser.id

                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserChange(user.id)}
                    disabled={isActive}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 ring-2 ring-zinc-900 dark:ring-zinc-100 cursor-default"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 ${roleInfo.color} text-white rounded-lg shrink-0`}
                      >
                        {roleInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {user.name}
                          </p>
                          {isActive && (
                            <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mb-1">
                          {user.email}
                        </p>
                        <span className="inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-3 bg-zinc-50 dark:bg-zinc-800">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
              Page will reload after switching user
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
