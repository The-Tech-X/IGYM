import Link from 'next/link'

import TrainerForm from '@/components/admin/TrainerForm'
import { createTrainer } from '@/app/admin/actions/trainers'

export default function NewTrainerPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/admin/trainers"
        className="text-sm text-zinc-500 hover:text-zinc-700 mb-6 inline-block"
      >
        ← Back to Trainers
      </Link>
      <h1
        className="text-2xl font-light text-zinc-800 mb-6"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        New Trainer
      </h1>
      <TrainerForm action={createTrainer} />
    </div>
  )
}
