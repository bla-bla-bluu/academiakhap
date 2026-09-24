import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function EditableName({ currentName }: { currentName: string }) {
  const { updateFullName } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setBusy(true);
    const { error: saveError } = await updateFullName(value);
    setBusy(false);
    if (saveError) setError(saveError);
    else setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => {
          setValue(currentName);
          setEditing(true);
        }}
        className="text-[#5b3419] text-sm underline underline-offset-4"
      >
        Edit Name
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      <input
        className="rounded-xl border border-[#c8a97d] bg-white px-3 py-1.5 text-sm outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleSave} disabled={busy} className="text-[#5b3419] font-semibold text-sm underline underline-offset-4 disabled:opacity-60">
        {busy ? "Saving..." : "Save"}
      </button>
      <button onClick={() => setEditing(false)} className="text-[#8b6a43] text-sm underline underline-offset-4">
        Cancel
      </button>
      {error && <span className="text-[#8c2f23] text-sm">{error}</span>}
    </div>
  );
}
