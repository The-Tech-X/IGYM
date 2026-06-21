import Link from 'next/link'
import { notFound } from 'next/navigation'

import TrainerForm from '@/components/admin/TrainerForm'
import TransformationSection from '@/components/admin/TransformationSection'
import { getTrainer, updateTrainer } from '@/app/admin/actions/trainers'
import { getTransformations } from '@/app/admin/actions/transformations'

export default async function EditTrainerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [trainer, transformations] = await Promise.all([
    getTrainer(id),
    getTransformations(id),
  ])

  if (!trainer) notFound()

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
        {trainer.name}
      </h1>
      <TrainerForm trainer={trainer} action={updateTrainer.bind(null, id)} />

      <hr className="my-10 border-zinc-200" />

      <TransformationSection trainerId={id} transformations={transformations} />
    </div>
  )
}
