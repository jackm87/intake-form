import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-20 md:py-28 px-6 bg-sky-500/10 border-y border-sky-500/20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-50">
          Ready to automate your intake?
        </h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          Set up your first form in under a minute. No credit card required.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-md transition-colors duration-150"
        >
          Create your free form
        </Link>
      </div>
    </section>
  );
}
