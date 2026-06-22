import { useState, type FormEvent } from "react";
import { useAuth, type Gender } from "../../contexts/AuthContext";

const inputClass = "w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-3 outline-none";
const buttonClass =
  "w-full py-3 rounded-2xl bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60";

export default function CompleteProfileForm() {
  const { profile, completeProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [gotr, setGotr] = useState("");
  const [age, setAge] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [eduQualification, setEduQualification] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const numericAge = parseInt(age, 10);
    if (
      !fullName.trim() ||
      !gotr.trim() ||
      !numericAge ||
      numericAge <= 0 ||
      !village.trim() ||
      !district.trim() ||
      !state.trim() ||
      !eduQualification.trim() ||
      !gender
    ) {
      setError("Please fill in every field.");
      return;
    }
    setSubmitting(true);
    const { error: saveError } = await completeProfile({
      fullName: fullName.trim(),
      gotr: gotr.trim(),
      age: numericAge,
      village: village.trim(),
      district: district.trim(),
      state: state.trim(),
      eduQualification: eduQualification.trim(),
      gender,
    });
    setSubmitting(false);
    if (saveError) setError(saveError);
  };

  return (
    <div className="max-w-md mx-auto border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef]">
      <h2 className="text-2xl font-bold mb-3">Complete Your Profile</h2>
      <p className="text-[#4a3728] mb-6">
        Before you can join the community, please share a few details about yourself.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className={inputClass} placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input className={inputClass} placeholder="Gotr" value={gotr} onChange={(e) => setGotr(e.target.value)} />
        <input className={inputClass} placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        <input className={inputClass} placeholder="Village" value={village} onChange={(e) => setVillage(e.target.value)} />
        <input className={inputClass} placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
        <input className={inputClass} placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <input
          className={inputClass}
          placeholder="Education Qualification"
          value={eduQualification}
          onChange={(e) => setEduQualification(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={
              gender === "male"
                ? "flex-1 py-3 rounded-2xl bg-[#5b3419] text-white font-semibold"
                : "flex-1 py-3 rounded-2xl border border-[#5b3419] text-[#5b3419] font-semibold"
            }
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={
              gender === "female"
                ? "flex-1 py-3 rounded-2xl bg-[#5b3419] text-white font-semibold"
                : "flex-1 py-3 rounded-2xl border border-[#5b3419] text-[#5b3419] font-semibold"
            }
          >
            Female
          </button>
        </div>
        {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? "Saving..." : "Submit & Join Community"}
        </button>
      </form>
    </div>
  );
}
