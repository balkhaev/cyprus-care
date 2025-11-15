import Link from "next/link";
import { MapPin, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bgsoft text-slate-900 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-8 sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-slate-900">
            Welcome to Care
          </h1>
          <p className="max-w-md text-sm md:text-base leading-8 text-slate-600">
            Modern application with authentication system and interactive maps.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium w-full sm:flex-row sm:w-auto">
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 text-white transition-all hover:bg-primary/80 hover:shadow-lg sm:w-auto"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
          <Link
            href="/map"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-primary/30 px-8 text-slate-900 transition-all hover:border-primary hover:bg-white sm:w-auto"
          >
            <MapPin className="h-5 w-5" />
            Open Map
          </Link>
        </div>
      </main>
    </div>
  );
}
