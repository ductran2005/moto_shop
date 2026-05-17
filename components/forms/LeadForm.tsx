interface LeadFormProps {
  campaignName: string;
}

export function LeadForm({ campaignName }: LeadFormProps) {
  return (
    <form className="grid gap-4" aria-label={campaignName}>
      <input
        type="text"
        name="name"
        placeholder="Ho va ten"
        className="rounded-md border border-zinc-300 px-4 py-3"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="rounded-md border border-zinc-300 px-4 py-3"
      />
      <button type="submit" className="rounded-md bg-zinc-900 px-4 py-3 font-semibold text-white">
        Gui thong tin
      </button>
    </form>
  );
}

export default LeadForm;
