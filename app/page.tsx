import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bgsoft text-slate-900 flex flex-col items-center justify-center px-4 py-12 md:py-16">
      <main className="w-full max-w-5xl flex flex-col items-center gap-12 md:gap-16">
        {/* Title Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary">
            ENOCYPRUS
          </h1>
          <div className="w-24 h-1 bg-primary/70 rounded-full"></div>
          <p className="max-w-2xl text-base md:text-lg text-slate-700 mt-4 leading-relaxed">
            A safe space to coordinate help during crises in Cyprus. Whether you need support, want to volunteer, or organize relief efforts, ENOCYPRUS connects people quickly and simply.
          </p>
        </div>

        {/* Three Big Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl">
          <Link
            href="/signup?role=volunteer"
            className="flex flex-col items-center justify-center py-8 md:py-12 px-6 bg-primary text-white rounded-2xl shadow-xl hover:bg-primary/80 transition-all transform hover:scale-105"
          >
            <span className="text-xl md:text-2xl font-bold text-center">
              I want to volunteer
            </span>
          </Link>

          <Link
            href="/signup?role=organizer"
            className="flex flex-col items-center justify-center py-8 md:py-12 px-6 bg-secondary text-white rounded-2xl shadow-xl hover:bg-secondary/80 transition-all transform hover:scale-105"
          >
            <span className="text-xl md:text-2xl font-bold text-center">
              I want to organize
            </span>
          </Link>

          <Link
            href="/signup?role=beneficiary"
            className="flex flex-col items-center justify-center py-8 md:py-12 px-6 bg-accent text-white rounded-2xl shadow-xl hover:bg-accent/80 transition-all transform hover:scale-105"
          >
            <span className="text-xl md:text-2xl font-bold text-center">
              I need some help
            </span>
          </Link>
        </div>

        {/* Sign In Link */}
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 text-base md:text-lg font-semibold text-slate-700 border-2 border-secondary/40 rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
