'use client'

import { Plus, Trash2 } from 'lucide-react'

interface Slot {
  day: string
  hours: string
}

interface AvailabilityEditorProps {
  slots: Slot[]
  onChange: (slots: Slot[]) => void
}

export default function AvailabilityEditor({
  slots,
  onChange,
}: AvailabilityEditorProps) {
  function updateSlot(index: number, patch: Partial<Slot>) {
    onChange(slots.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)))
  }

  function removeSlot(index: number) {
    onChange(slots.filter((_, i) => i !== index))
  }

  function addSlot() {
    onChange([...slots, { day: '', hours: '' }])
  }

  return (
    <div>
      <p className="text-sm text-zinc-600 mb-1">Availability</p>

      <div className="space-y-2">
        {slots.map((slot, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={slot.day}
              onChange={(e) => updateSlot(i, { day: e.target.value })}
              placeholder="Mon, Wed, Fri"
              className="border border-zinc-300 rounded px-3 py-2 text-sm flex-1"
            />
            <input
              value={slot.hours}
              onChange={(e) => updateSlot(i, { hours: e.target.value })}
              placeholder="6:00 AM – 11:00 AM"
              className="border border-zinc-300 rounded px-3 py-2 text-sm flex-1"
            />
            <button
              type="button"
              onClick={() => removeSlot(i)}
              className="text-zinc-400 hover:text-red-500"
              aria-label="Remove slot"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSlot}
        className="mt-2 flex items-center gap-1 text-sm text-[#C9A84C]"
      >
        <Plus size={16} />
        Add slot
      </button>
    </div>
  )
}
