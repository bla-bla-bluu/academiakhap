// Photographs of the physical sites these articles document. The three below are the
// research team's own fieldwork photos (credited to the paper's author, Harsh Choudhary)
// rather than Commons material, so unlike an externally licensed photo there is no licence
// line to render -- just a plain photographer credit under the caption.
type Photo = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
};

const PHOTOS: Record<string, Photo> = {
  "kuchesar-fort": {
    src: "/images/heritage/kuchesar-fort-gate.jpg",
    alt: "Entrance gate of Kuchesar Fort, Bulandshahr",
    caption: "The entrance to Kuchesar Fort, Bulandshahr district, Uttar Pradesh: the seat of the Dalal Jāṭ zamindars discussed in this article.",
    credit: "Harsh Choudhary",
  },
  "unchagaon-fort": {
    src: "/images/heritage/unchagaon-fort-gate.jpg",
    alt: "Fortified gate of Fort Unchagaon, Bulandshahr",
    caption: "The fortified gate of Fort Unchagaon, Bulandshahr district, associated with the Pilania zamindars discussed in this article.",
    credit: "Harsh Choudhary",
  },
  "bahanpur-haveli": {
    src: "/images/heritage/bahanpur-haveli.jpg",
    alt: "Bahanpur Haveli, Bulandshahr",
    caption: "Bahanpur Haveli, Bulandshahr district, the second site examined in this article alongside Fort Unchagaon.",
    credit: "Harsh Choudhary",
  },
};

export default function ArticleImage({ id }: { id: string }) {
  const photo = PHOTOS[id];
  if (!photo) return null;

  return (
    <figure className="my-10 not-prose">
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="w-full h-auto rounded-[1.5rem] border border-[#b38b59]/25 shadow-sm"
      />
      <figcaption className="mt-3 text-sm leading-6 text-[#6b5746]">
        {photo.caption}{" "}
        <span className="text-[#8b6a43]">Photo: {photo.credit}.</span>
      </figcaption>
    </figure>
  );
}
