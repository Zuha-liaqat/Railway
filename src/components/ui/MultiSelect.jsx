import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function MultiSelect({
  label,
  required,
  options,
  value,
  onChange,
  placeholder,
  allowCustom = false,
}) {
  const [open, setOpen] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(opt) {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else onChange([...value, opt])
  }

  function addCustom(e) {
    e.preventDefault()
    const v = customInput.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setCustomInput('')
  }

  return (
    <div ref={ref} className="relative">
      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1.5 flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 px-3.5 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
      >
        <span className="flex flex-wrap gap-1.5 min-h-5">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            value.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
              >
                {v}
              </span>
            ))
          )}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {allowCustom && (
            <div className="flex items-center gap-1.5 border-b border-gray-100 p-1.5">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustom(e)
                }}
                placeholder="Add custom..."
                className="flex-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addCustom}
                className="rounded-md bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
              >
                Add
              </button>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto p-1.5">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
