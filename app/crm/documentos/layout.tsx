import '../crm.css'

export default function DocumentosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="crm-root min-h-screen bg-[#0F172A] text-slate-100 print:bg-white print:text-black">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          @page { margin: 2cm; }
        }
      `}</style>
      {children}
    </div>
  )
}
