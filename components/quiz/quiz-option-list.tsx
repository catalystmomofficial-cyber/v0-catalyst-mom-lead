"use client"

export interface QuizOptionListProps {
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string) => void
  name: string
}

// Hover-grow list with corner-bracket reveal, adapted from a pasted
// CategoryList component. Selection doubles as the "active" state so the
// grow/bracket/check effect works on touch, not just mouse hover.
export function QuizOptionList({ options, value, onChange, name }: QuizOptionListProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label={name}>
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`group relative w-full text-left overflow-hidden rounded-xl border-2 px-5 sm:px-6 flex items-center transition-all duration-300 ease-out cursor-pointer ${
              selected ? "h-24 sm:h-28" : "h-16 sm:h-20 hover:h-24 sm:hover:h-28 active:h-24 sm:active:h-28"
            }`}
            style={{
              borderColor: selected ? "#A15C2F" : "#E8D5C4",
              backgroundColor: selected ? "rgba(161,92,47,0.06)" : "#FFFFFF",
              boxShadow: selected ? "0 10px 25px -8px rgba(161,92,47,0.35)" : "none",
            }}
          >
            {/* Corner brackets — reveal on hover/selection */}
            <span
              className={`absolute top-2.5 left-2.5 w-5 h-5 transition-opacity duration-300 ${
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 w-3.5 h-0.5 rounded-full" style={{ background: "#A15C2F" }} />
              <span className="absolute top-0 left-0 w-0.5 h-3.5 rounded-full" style={{ background: "#A15C2F" }} />
            </span>
            <span
              className={`absolute bottom-2.5 right-2.5 w-5 h-5 transition-opacity duration-300 ${
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-hidden="true"
            >
              <span className="absolute bottom-0 right-0 w-3.5 h-0.5 rounded-full" style={{ background: "#A15C2F" }} />
              <span className="absolute bottom-0 right-0 w-0.5 h-3.5 rounded-full" style={{ background: "#A15C2F" }} />
            </span>

            <span className="flex-1 min-w-0">
              <span
                className="block font-semibold text-base sm:text-lg transition-colors duration-300"
                style={{ color: selected ? "#A15C2F" : "#3A2412" }}
              >
                {option.label}
              </span>
            </span>

            {/* Check icon reveal on selection */}
            <span
              className={`ml-3 shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                selected ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-40"
              }`}
              style={{ backgroundColor: "#A15C2F" }}
              aria-hidden="true"
            >
              <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </button>
        )
      })}
    </div>
  )
}
