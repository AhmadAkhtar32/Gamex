export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-slate-700">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
        <div
          className="
            w-full
            rounded-3xl
            border
            border-brand/12
            bg-[#f7f9fc]
            p-8
            shadow-[0_24px_70px_-40px_rgba(23,49,96,0.35)]
          "
        >
          <span
            className="
              inline-flex
              rounded-full
              border
              border-brand/20
              bg-brand/[0.07]
              px-4
              py-1.5
              text-xs
              font-bold
              uppercase
              tracking-[0.22em]
              text-brand
            "
          >
            Secure Access
          </span>

          <h1
            className="
              mt-5
              font-display
              text-3xl
              font-extrabold
              uppercase
              tracking-tight
              text-brand-deep
            "
          >
            Gamex Admin Login
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Admin login will be implemented here.
          </p>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-5
            "
          >
            <p className="text-sm font-medium text-slate-500">
              Authentication is not active yet. This page is only styled to
              match the new Gamex white and blue design.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}