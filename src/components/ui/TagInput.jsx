import { useState } from 'react'
import { X } from 'lucide-react'

export default function TagInput({ label, required, value, onChange, placeholder }) {
  const [input, setInput] = useState('')

  function addTag() {
    const v = input.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setInput('')
  }

  function removeTag(tag) {
    onChange(value.filter((v) => v !== tag))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1.5 flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-300">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-blue-400 hover:text-blue-700"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[8rem] flex-1 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  )
}
