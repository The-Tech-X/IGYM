import { getGymInfo, updateGymInfo } from '@/app/admin/actions/gym-info'

export default async function KnowledgePage() {
  const content = await getGymInfo()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-light text-zinc-800 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Knowledge Base
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Plain-text knowledge the AI concierge draws from. The AI reads this verbatim on every conversation.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <form action={updateGymInfo}>
          <textarea
            name="content"
            rows={24}
            defaultValue={content}
            placeholder={`## LOCATION & HOURS
Road No. 36, Jubilee Hills, Hyderabad
Monday–Saturday: 5:30 AM – 10:00 PM

## MEMBERSHIP PRICING
Platinum: ₹XX,000/month — ...

## FOUNDER
...

## MISSION
...

## POLICIES
...`}
            className="w-full font-mono text-sm text-zinc-800 border border-zinc-200 rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] resize-y leading-relaxed"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#C9A84C] text-zinc-950 text-sm rounded tracking-wide hover:bg-[#b8933d] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
