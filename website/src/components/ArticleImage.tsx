// Photographs used under Creative Commons licences from Wikimedia Commons, of the actual
// physical sites these articles document -- not stock imagery, not synthetic. Each entry
// carries the attribution CC BY-SA 4.0 requires (photographer, licence, source, and any
// modification made), rendered under the image rather than left to a hover tooltip nobody
// reads, and self-hosted in public/images/ rather than hotlinked to Commons' own servers.
type Photo = {
  src: string;
  alt: string;
  caption: string;
  photographer: string;
  photographerUrl: string;
  licenseLabel: string;
  licenseUrl: string;
  sourceUrl: string;
  modified?: string;
};

const PHOTOS: Record<string, Photo> = {
  "kuchesar-fort": {
    src: "/images/heritage/kuchesar-fort.jpg",
    alt: "Kuchesar Fort, Bulandshahr",
    caption: "Kuchesar Fort, Bulandshahr district, Uttar Pradesh: the seat of the Dalal Jāṭ zamindars discussed in this article.",
    photographer: "Mvrck007",
    photographerUrl: "https://commons.wikimedia.org/wiki/User:Mvrck007",
    licenseLabel: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kuchesar_Mud_Fort.jpg",
  },
  "unchagaon-fort": {
    src: "/images/heritage/unchagaon-fort-courtyard.jpg",
    alt: "Courtyard of Fort Unchagaon, Bulandshahr",
    caption: "The courtyard of Fort Unchagaon, Bulandshahr district, associated with the Pilania zamindars discussed in this article.",
    photographer: "Whispyhistory",
    photographerUrl: "https://commons.wikimedia.org/wiki/User:Whispyhistory",
    licenseLabel: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Fort_Unchagaon,_courtyard.jpg",
    modified: "resized for web",
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
        <span className="text-[#8b6a43]">
          Photo:{" "}
          <a
            href={photo.photographerUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-[#5b3419]"
          >
            {photo.photographer}
          </a>
          {photo.modified ? `, ${photo.modified}` : ""}, licensed{" "}
          <a
            href={photo.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-[#5b3419]"
          >
            {photo.licenseLabel}
          </a>
          , via{" "}
          <a
            href={photo.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-[#5b3419]"
          >
            Wikimedia Commons
          </a>
          .
        </span>
      </figcaption>
    </figure>
  );
}
