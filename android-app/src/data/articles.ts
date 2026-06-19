export type ArticleBlock = {
  type: "heading" | "paragraph";
  text: string;
};

export type Article = {
  id: number;
  title: string;
  category: string;
  key: string;
  excerpt: string;
  sources: string[];
  content: ArticleBlock[];
};

export const articles: Article[] = [
  {
    id: 1,
    title: "History and Heritage of the Pilania Zamindars",
    category: "History",
    key: "pilania-zamindars",
    excerpt:
      "A historical and architectural study of Bahanpur Haveli and Unchagaon Fort, documenting the heritage of the Pilania zamindars of Bulandshahr and the contrasting trajectories of rural heritage preservation.",
    sources: [
      "International Journal of History (2026)",
      "Harsh Choudhary - The History and Heritage of the Pilania Zamindars: A Study of Bahanpur Haveli and Unchagaon Fort",
      "DOI: 10.22271/27069109.2026.v8.i5a.750"
    ],
    content: [
      {
        type: "heading",
        text: "Introduction"
      },
      {
        type: "paragraph",
        text:
          "Harsh Choudhary's research paper, \"The History and Heritage of the Pilania Zamindars: A Study of Bahanpur Haveli and Unchagaon Fort,\" brings attention to a regional lineage whose architectural remains and family history illuminate an important but often overlooked part of western Uttar Pradesh's past."
      },
      {
        type: "paragraph",
        text:
          "The value of this research lies in its attention to local history as a serious field of inquiry. Regional families, village estates, and rural buildings are frequently absent from national historical writing, even though they shaped landholding patterns, social relations, architectural patronage, and political culture at the district level."
      },
      {
        type: "heading",
        text: "Historical Background of Pilania Zamindars"
      },
      {
        type: "paragraph",
        text:
          "The Pilania zamindars are presented as an important Jat zamindar lineage associated with the Dalal Jats of western Uttar Pradesh. Their historical significance lies not merely in landholding but in their place within the wider social and territorial history of Jatwara."
      },
      {
        type: "paragraph",
        text:
          "The study situates the Pilania lineage within approximately three centuries of regional continuity, demonstrating how family memory, inheritance, migration, and estate formation intersected with broader histories of Jat social organization."
      },
      {
        type: "heading",
        text: "Bahanpur Haveli"
      },
      {
        type: "paragraph",
        text:
          "Bahanpur Haveli stands as a significant architectural and historical site associated with the Pilania zamindars. Its fabric reflects older construction practices and Indo-Persian architectural influence through enclosed planning, formal entrances, thick masonry, internal courtyards, and decorative elements."
      },
      {
        type: "paragraph",
        text:
          "The use of Lakhori brick is particularly important because it connects the haveli to a wider architectural vocabulary of Mughal and late medieval construction traditions in North India."
      },
      {
        type: "heading",
        text: "Unchagaon Fort"
      },
      {
        type: "paragraph",
        text:
          "Unchagaon Fort provides a contrasting example of heritage survival and adaptation. Its historical linkage to the Pilania zamindars shows how inheritance, estate transfer, and family branches shaped the destiny of major rural properties."
      },
      {
        type: "heading",
        text: "Comparative Historical Analysis"
      },
      {
        type: "paragraph",
        text:
          "Bahanpur Haveli represents the vulnerability of rural elite architecture when maintenance declines and institutional attention is absent. Unchagaon Fort, by contrast, represents the possibility of survival through adaptive reuse, restoration, and heritage-oriented management."
      },
      {
        type: "heading",
        text: "Research Methodology"
      },
      {
        type: "paragraph",
        text:
          "The study relies on fieldwork, interviews, oral history, architectural observation, genealogical reconstruction, and documentation. This mixed method is necessary because rural heritage often lacks a single complete archive."
      },
      {
        type: "heading",
        text: "Conclusion"
      },
      {
        type: "paragraph",
        text:
          "The history and heritage of the Pilania zamindars reveal how Jat zamindari, Dalal clan history, regional authority, family memory, and architecture intersect in the rural landscape of Bulandshahr and the wider historical region of Jatwara."
      }
    ]
  },
  {
    id: 2,
    title: "The Royal Legacy of Kuchesar",
    category: "History",
    key: "kuchesar",
    excerpt:
      "A study of the Dalal family and Kuchesar Fort, examining Jat zamindari history, estate architecture, inheritance, and rural heritage preservation in Bulandshahr.",
    sources: [
      "Choudhary, Harsh. The Royal Legacy of Kuchesar: A Study of the Dalal Family and Kuchesar Fort. Journal of Asiatic Society for Social Science Research, Vol. 7, No. 2 (2025), pp. 366-372.",
      "DOI: 10.46700/asssr/2025/v7/i2/184",
      "Journal of Asiatic Society for Social Science Research (JASSSR)",
      "Field interviews and architectural documentation referenced in the study",
      "Kuchesar Fort historical records and family genealogy sources"
    ],
    content: [
      {
        type: "heading",
        text: "Introduction"
      },
      {
        type: "paragraph",
        text:
          "Harsh Choudhary's research paper, \"The Royal Legacy of Kuchesar: A Study of the Dalal Family and Kuchesar Fort,\" examines one of the most significant Jat zamindari lineages of western Uttar Pradesh through the history, architecture, and legacy of Kuchesar Fort in Bulandshahr district."
      },
      {
        type: "heading",
        text: "Dalal Jats, Jatwara, and Kuchesar"
      },
      {
        type: "paragraph",
        text:
          "The study situates Kuchesar within the wider historical geography of Jatwara, a socio-political region shaped by Jat settlement, clan authority, agrarian expansion, and localized systems of governance."
      },
      {
        type: "heading",
        text: "Historical Development of Kuchesar Estate"
      },
      {
        type: "paragraph",
        text:
          "Kuchesar Fort was originally constructed in 1734 and later expanded during different phases, including major developments in 1835 and 1935. The estate evolved alongside changing political circumstances from Mughal influence to colonial governance and modern heritage preservation."
      },
      {
        type: "heading",
        text: "Architecture of Kuchesar Fort"
      },
      {
        type: "paragraph",
        text:
          "Architecturally, Kuchesar Fort presents an important example of layered historical development. Indo-Persian and later colonial influences coexist within the estate, reflecting different periods of expansion and adaptation."
      },
      {
        type: "heading",
        text: "Mud Fort and Rao Raj Vilas"
      },
      {
        type: "paragraph",
        text:
          "The present division of Kuchesar Fort into the Mud Fort and Rao Raj Vilas reflects broader questions concerning inheritance, property management, heritage preservation, and institutional continuity."
      },
      {
        type: "heading",
        text: "Research Methodology"
      },
      {
        type: "paragraph",
        text:
          "The study relies on field visits, architectural observation, personal interviews with members of the Dalal family, oral historical reconstruction, and secondary historical literature."
      },
      {
        type: "heading",
        text: "Conclusion"
      },
      {
        type: "paragraph",
        text:
          "The royal legacy of Kuchesar reveals how Jat zamindari, Dalal clan history, architecture, and regional political authority intersect across nearly 250 years of continuity."
      }
    ]
  }
];
