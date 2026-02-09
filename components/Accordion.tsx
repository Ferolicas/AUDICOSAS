"use client"
import { useState } from 'react'

interface AccordionItem {
  question: string
  answer: React.ReactNode
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className={`rounded-xl border transition-all duration-300 ${
              isOpen
                ? 'border-blue-200 bg-white shadow-lg'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
            >
              <span className={`font-semibold pr-4 transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
              <div>
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
