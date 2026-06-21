import Link from 'next/link'
import { getTrainers, deleteTrainer } from '@/app/admin/actions/trainers'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function TrainersPage() {
  const trainers = await getTrainers()

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-2xl font-light text-zinc-800"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Trainers
          </h1>
          <p className="text-sm text-zinc-500">
            {trainers.length} trainer{trainers.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/trainers/new"
          className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded tracking-wide hover:bg-[#b8933d] transition-colors"
        >
          New Trainer
        </Link>
      </div>

      {trainers.length === 0 ? (
        <div className="border border-dashed border-zinc-300 rounded-lg p-12 text-center text-zinc-500">
          <p>No trainers yet.</p>
          <p>Add your first trainer to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="flex items-center gap-4 bg-white border border-zinc-200 rounded-lg p-4"
            >
              {trainer.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={trainer.image_url}
                  alt={trainer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
                  {trainer.name.charAt(0)}
                </div>
              )}

              <div className="flex-1">
                <p className="text-zinc-800 font-medium">{trainer.name}</p>
                <p className="text-sm text-zinc-500">{trainer.role}</p>
              </div>

              {trainer.is_active ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-zinc-100 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
                  Hidden
                </span>
              )}

              <Link
                href={`/admin/trainers/${trainer.id}/edit`}
                className="text-sm text-[#C9A84C] hover:underline"
              >
                Edit
              </Link>

              <DeleteButton
                action={async () => {
                  'use server'
                  return await deleteTrainer(trainer.id)
                }}
                confirmMessage={`Delete ${trainer.name}? This cannot be undone.`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
