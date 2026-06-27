import { getLeads } from '@/app/admin/actions/leads'

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1
          className="text-2xl font-light text-zinc-800 tracking-wide"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Leads
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {leads.length} {leads.length === 1 ? 'enquiry' : 'enquiries'} captured
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="border border-dashed border-zinc-300 rounded-lg p-12 text-center text-zinc-500">
          No leads yet. Leads appear here when the AI concierge captures a name and phone number.
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs text-zinc-400 uppercase tracking-widest">
                <th className="px-5 py-3 font-normal">Name</th>
                <th className="px-5 py-3 font-normal">Phone</th>
                <th className="px-5 py-3 font-normal">Enquiry</th>
                <th className="px-5 py-3 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-5 py-3 text-zinc-800">{lead.name}</td>
                  <td className="px-5 py-3 text-zinc-700">{lead.phone}</td>
                  <td className="px-5 py-3 text-zinc-500">
                    {lead.enquiry
                      ? lead.enquiry.length > 80
                        ? lead.enquiry.slice(0, 80) + '…'
                        : lead.enquiry
                      : '—'}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
