import { StoreReset } from "@/components/form/StoreReset";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ submissionId?: string }>;
}

export default async function SuccessPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { submissionId } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <StoreReset />
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <svg
              className="h-8 w-8 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-50">All done!</h1>
          <p className="text-sm text-zinc-400">
            Your information has been submitted successfully.
          </p>
        </div>

        {submissionId && (
          <a
            href={`/api/submissions/${submissionId}/pdf`}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors duration-150"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download PDF
          </a>
        )}

        <p className="text-xs text-zinc-700">Powered by FormFlow</p>
      </div>
    </div>
  );
}
