export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-slate-700">
      <div className="mx-auto max-w-5xl">
        <div
          className="
            rounded-3xl
            border
            border-brand/12
            bg-[#f7f9fc]
            p-8
            shadow-[0_24px_70px_-40px_rgba(23,49,96,0.35)]
            md:p-10
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
            Admin Area
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
              md:text-4xl
            "
          >
            Gamex Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Admin dashboard will be implemented here.
          </p>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-6
            "
          >
            <p className="text-sm font-medium text-slate-500">
              This area is currently a placeholder for future product,
              blog, contact-message, and administration tools.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}