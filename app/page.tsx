import Image from "next/image";
import Link from "next/link";
import { MapPin, LogIn, Building2, User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-20 px-8 sm:px-16">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={24}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            Добро пожаловать в Care
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Платформа для координации гуманитарной помощи, управления пунктами сбора и картами убежищ.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base font-medium w-full max-w-2xl">
          <Link
            href="/login"
            className="flex h-14 items-center justify-center gap-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-6 text-white dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:shadow-lg"
          >
            <LogIn className="h-5 w-5" />
            Войти в систему
          </Link>
          <Link
            href="/organizer"
            className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 px-6 text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <User className="h-5 w-5" />
            Профиль организатора
          </Link>
          <Link
            href="/venues"
            className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 px-6 text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Building2 className="h-5 w-5" />
            Площадки
          </Link>
          <Link
            href="/map"
            className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 px-6 text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <MapPin className="h-5 w-5" />
            Карта
          </Link>
        </div>
      </main>
    </div>
  );
}
