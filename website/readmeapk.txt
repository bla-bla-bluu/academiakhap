ACADEMIA KHAP ANDROID APP HANDOFF SPEC
=====================================

Purpose
-------
Build an Android app version of the Academia Khap website. The app should feel like a serious research, history, culture, and rural heritage publication platform. It should not feel like a generic education template or a social-media app.

Current web project:
- Site name: Academia Khap
- Live URL: https://academiakhap.vercel.app
- Framework used on web: React + Vite + Tailwind CSS
- Clean website project folder: /Users/dr/Desktop/khap/website
- Android target: native Android app or cross-platform app matching this design


Brand Identity
--------------
Brand name:
Academia Khap

Tone:
- scholarly
- formal
- research-oriented
- heritage-focused
- readable for educated public

Primary theme:
Warm parchment / archival research aesthetic with deep brown accents.

Avoid:
- bright neon colors
- social-media style layouts
- generic education template visuals
- excessive gradients
- overly playful icons


Core Color Palette
------------------
Use these exact colors where possible.

Page background:
#f4efe4
Use for main app background.

Section background:
#efe4cf
Use for alternate bands, navigation background, research side/list background.

Card background:
#faf6ef
Use for most cards, panels, article containers, member cards, contact panels.

Featured card background:
#f8f2e7
Use for featured research cards.

Light inset background:
#f8f4ed
Use for QR/payment placeholder or soft inset areas.

Primary text:
#3b2415
Use for main headings and primary copy.

Body text:
#4a3728
Use for paragraphs and descriptive text.

Secondary body text:
#4b3526
Use for hero description text.

Muted brown / label:
#8b6a43
Use for section labels, category labels, subtle metadata.

Primary accent / button brown:
#5b3419
Use for active buttons, CTA panels, active article cards, badges.

Dark accent:
#3b2415
Use for hover/pressed state on primary buttons.

Border brown:
#b38b59
Use with opacity around 20%-40% for borders.

Light border:
#d8c2a0
Use for internal separators.

Input border:
#c8a97d

Cream text on dark brown:
#f5ede0

Muted cream label on dark brown:
#e7d6be

Active card category on dark:
#f3dfc0

White:
#ffffff

Black:
#000000
Use rarely, only for bold small horizontal label text on homepage if needed.


Typography
----------
Web uses Tailwind `font-serif`, meaning a serif system font stack.

Recommended Android font direction:
- Use a readable serif font for content and headings if available.
- Good options: Noto Serif, Merriweather, Libre Baskerville, Georgia-like serif.
- If using Jetpack Compose, use a custom FontFamily such as Noto Serif.

Text style guide:
- App title: bold, 20-24sp
- Main screen title: bold, 32-42sp on mobile depending on screen
- Section heading: bold, 28-34sp
- Card title: bold, 22-28sp
- Article title: bold, 30-38sp
- Paragraph text: 16-18sp
- Article paragraph line height: generous, around 1.6x
- Category labels: 12-14sp uppercase, wide letter spacing
- Buttons: 14-16sp, semibold

Use generous spacing and readable line heights. This app is reading-heavy.


Assets
------
Use these website assets as Android app assets:

1. Logo:
public/logo_clean.png
Purpose: app logo, navbar logo, launcher source if suitable.

2. Header image:
public/header.png
Purpose: top homepage banner image.

3. Optional donation image:
public/upi_qr.png
This is referenced in the website but may not exist. If unavailable, show a placeholder panel or remove donation QR from the app build.

Android asset names:
- logo_clean.png
- header.png
- upi_qr.png if available


Navigation / Screens
--------------------
The app should have these main screens:

1. Home
2. Research
3. About
4. Work With Us
5. Contact

Recommended Android navigation:
- Bottom navigation bar for mobile:
  Home, Research, About, Work, Contact
- Or a top app bar with a menu drawer.

Preferred:
Bottom navigation because the website pages are simple and mobile-first.

Top app bar:
- Background: #efe4cf
- Border/bottom divider: #8b6a43 at 20% opacity
- Logo: logo_clean.png, 40dp square
- Title: Academia Khap, bold serif, #3b2415

Active nav item:
- Background or icon/text color: #5b3419
- Text/icon: #ffffff if using pill background

Inactive nav item:
- Text/icon: #5b3419
- Border style if using pills: #5b3419


Reusable UI Components
----------------------
1. Pill button
- Border radius: full pill
- Horizontal padding: 20-24dp
- Vertical padding: 10-14dp
- Border: #5b3419
- Text: #5b3419
- Active/pressed background: #5b3419
- Active/pressed text: #ffffff

2. Primary button
- Background: #5b3419
- Text: #ffffff
- Border radius: 16-24dp
- Pressed background: #3b2415

3. White button on dark section
- Background: #ffffff
- Text: #5b3419
- Border radius: full pill or 16-24dp

4. Card
- Background: #faf6ef or #f8f2e7
- Border: #b38b59 at 25%-30% opacity
- Border radius: 24-32dp
- Padding: 24-32dp
- Shadow: subtle only

5. Dark feature panel
- Background: #5b3419
- Text: #ffffff
- Paragraph text: #f5ede0
- Label text: #e7d6be
- Border radius: 32-40dp
- Padding: 32-48dp

6. Article card
- Normal background: #faf6ef
- Normal border: #b38b59 at 20% opacity
- Active background: #5b3419
- Active text: #ffffff
- Active category text: #f3dfc0
- Border radius: 16-24dp
- Padding: 20dp

7. Search input
- Background: #ffffff
- Border: #b38b59 at 30% opacity
- Border radius: 16-20dp
- Placeholder: Search articles...
- Icon color: #8b6a43
- Text color: #3b2415


Home Screen
-----------
Use the homepage as the first screen. Do not make a marketing splash screen before the actual content.

Layout:
1. Top image banner
   - Full width
   - Use header.png
   - Height can be 180-260dp depending on screen
   - Content scale: crop or fill width

2. Hero text section
   Background: #f4efe4
   Label:
   "Research • History • Culture"
   Label color: #8b6a43
   Uppercase/wide tracking

   Paragraph:
   "A collective platform focused on evidence-based research, cultural continuity, social understanding, historical discourse, and intellectual engagement across communities."

3. Horizontal topic row or wrapping chips:
   - Research Papers
   - Historical Analysis
   - Social Dialogue
   - Digital Awareness
   - Community Documentation
   - Books & Articles

4. Featured Research Topics section
   Background: #efe4cf
   Heading: "Featured Research Topics"
   CTA: "View All Posts" navigates to Research

   Cards:
   A. History and Heritage of the Pilania Zamindars
      Category: History
      Excerpt:
      "A historical and architectural study of Bahanpur Haveli and Unchagaon Fort, documenting the heritage of the Pilania zamindars of Bulandshahr and the contrasting trajectories of rural heritage preservation."
      Action: Read Article -> open Research detail for pilania-zamindars

   B. The Royal Legacy of Kuchesar
      Category: History
      Excerpt:
      "A study of the Dalal family and Kuchesar Fort, examining Jat zamindari history, estate architecture, inheritance, and rural heritage preservation in Bulandshahr."
      Action: Read Article -> open Research detail for kuchesar

5. Community & Team section
   Label: "Community & Team"
   Left card:
      Button-like heading: "Our Members" -> navigate About
      Text:
      "Academia Khap is built through collaboration between researchers, scholars, legal experts, educators, historians, and socially aware contributors dedicated to knowledge-based engagement."
      Member chips/cards:
      - Research Scholars
      - Doctorate Holders
      - Legal Professionals
      - Historians & Writers
      - Community Representatives
      - Social Researchers

   Right dark panel:
      Heading button: "Work With Us" -> navigate Work
      Text:
      "We welcome collaborations in research, digital publishing, historical documentation, translation, design, and social awareness projects."
      Contributors:
      - Writers & Editors
      - Researchers & Historians
      - Social Analysts
      - Designers & Media Contributors
      - Students & Scholars
      - Legal Professionals
      - Policy & Strategic Analysts

6. Support Our Work section
   Background: #efe4cf
   Heading: "Donations & Contributions"
   Paragraphs:
   "Contributions help support independent research, publication of articles and books, archival work, digital awareness campaigns, educational initiatives, and preservation of historical and cultural knowledge."
   "Academia Khap functions through collaborative participation and community support. Every contribution directly supports research-oriented, educational, and awareness-driven activities."

   What Your Contribution Supports:
   - Research & Publications
   - Historical Documentation
   - Digital Awareness Campaigns
   - Books, Articles & Archives
   - Community Education Initiatives

   Donation panel:
   - UPI / QR Payment
   - If upi_qr.png is available, show it.
   - Bank fields can be placeholders unless real details are provided:
     Account Name: Academia Khap
     Bank Name: [Your Bank Name]
     Account Number: XXXXXXXXXXXX
     IFSC Code: XXXXXXXX
     UPI ID: yourupi@bank

7. Join section
   Dark panel background: #5b3419
   Heading: "Join Academia Khap"
   Text:
   "Connect with us for research collaborations, social projects, publications, historical discussions, awareness campaigns, and community-oriented initiatives."
   Buttons:
   - Youtube -> https://www.youtube.com/@academiakhap
   - Instagram -> https://www.instagram.com/khap.academia
   - LinkedIn -> https://www.linkedin.com/in/khap-academia/
   - Contact Us -> Contact screen


Research Screen
---------------
Important: The website uses a right-panel article system. For Android, adapt this into a master-detail reading system.

Mobile recommendation:
- Research screen first shows article list/search.
- Tapping an article opens Article Detail screen.
- On tablets, use two-pane layout: article list left, selected article detail right.

Research list screen:
- Background: #f4efe4
- Top section/list panel background: #efe4cf
- Title: "Research Archive"
- Search input placeholder: "Search articles..."
- Filter articles by title.

Articles registry:
1.
id: 1
title: "History and Heritage of the Pilania Zamindars"
category: "History"
key: "pilania-zamindars"

2.
id: 2
title: "The Royal Legacy of Kuchesar"
category: "History"
key: "kuchesar"

Empty/default detail text:
Heading: "Research & Evidence Archive"
Paragraph:
"Explore detailed articles supported with historical references, archival material, community records, source citations, images, academic arguments, and documented evidence."

Prompt card:
Heading: "Select an Article"
Text:
"Choose an article from the research list to begin reading."

Article detail layout:
- Category label uppercase, #8b6a43
- Article title large, bold, #3b2415
- Body paragraphs #4a3728 with generous line height
- Treat body entries that are short section headings as headings. Examples:
  Introduction
  Why This Research Matters
  Historical Background of Pilania Zamindars
  Bahanpur Haveli
  Unchagaon Fort
  Comparative Historical Analysis
  Research Methodology
  Importance for Rural Heritage Research
  Conclusion
- Sources card at bottom:
  Background: #faf6ef
  Border: #b38b59 at 20% opacity
  Heading: "Evidence & Sources"
  Bullet list


Article Content Summary
-----------------------
Full article text exists in:
- src/content/articles/PilaniaZamindars.ts
- src/content/articles/Kuchesar.ts

Use those files as the source of truth for full article bodies.

Pilania article:
Title:
"History and Heritage of the Pilania Zamindars"
Category:
"History"
Key:
"pilania-zamindars"
Sources:
- International Journal of History (2026)
- Harsh Choudhary — The History and Heritage of the Pilania Zamindars: A Study of Bahanpur Haveli and Unchagaon Fort
- DOI: 10.22271/27069109.2026.v8.i5a.750

Kuchesar article:
Title:
"The Royal Legacy of Kuchesar"
Category:
"History"
Key:
"kuchesar"
Sources:
- Choudhary, Harsh. The Royal Legacy of Kuchesar: A Study of the Dalal Family and Kuchesar Fort. Journal of Asiatic Society for Social Science Research, Vol. 7, No. 2 (2025), pp. 366-372.
- DOI: 10.46700/asssr/2025/v7/i2/184
- Journal of Asiatic Society for Social Science Research (JASSSR)
- Field interviews and architectural documentation referenced in the study
- Kuchesar Fort historical records and family genealogy sources


About Screen
------------
Screen title:
"Directors & Core Team"

Top label:
"Leadership & Team"

Use same background and card system.

Core team cards:
1. Mr. Dhillon
Role: Strategic Research Director
Description:
"Leads research initiatives, analytical studies, publications, and historical documentation."
Qualifications:
- B.Voc, MSc CS, MTech Defence Tech, PhD Artificial Intelligence
- Community Leadership, Academic Writing & Fact Analysis

2. Mr. Kaliraman
Role: Community & Operations Director
Description:
"Oversees operations, outreach, organizational management, and community coordination."
Qualifications:
- BA, MA Archaeology
- Public Outreach, Evidence Analysis, Community Gathering

3. Mr. Vashist
Role: Policy & Communications Director
Description:
"Handles institutional communication, public messaging, outreach strategy, and policy coordination."
Qualifications:
- BTech, MTech Defence Technology, PhD Artificial Intelligence
- Policy Communication, Public Relations & Community Coordination, Historical Document Analysis

Also include supporting/advisory/member sections from src/pages/About.tsx if full parity is needed.


Work With Us Screen
-------------------
Top label:
"Collaborate With Academia Khap"

Main heading:
"Researchers, Scholars, Historians & Community Contributors"

Intro text:
"Academia Khap works through collaborative research, historical documentation, policy discussion, digital awareness, cultural preservation, and intellectual engagement across communities."

Work Domains:
1. Historical Research
"Ancient inscriptions, regional history, tribal continuity, linguistic evolution, social systems, migration patterns, and archival analysis."

2. Social Analysis
"Research on social structure, cultural continuity, rural systems, traditions, demographics, and community-oriented discourse."

3. Technology & AI
"Artificial intelligence, digital infrastructure, media systems, cyber awareness, data analysis, and defence-oriented technologies."

4. Legal & Policy Studies
"Policy interpretation, constitutional research, governance systems, legal awareness, and social legislation."

5. Media & Communication
"Content creation, public communication, design systems, documentaries, podcasts, and awareness campaigns."

6. Community Documentation
"Oral histories, village-level documentation, cultural records, genealogies, local narratives, and preservation work."

Contributor background list:
- Research Scholars
- PhD Candidates & Doctorate Holders
- Historians & Archaeology Researchers
- AI & Technology Experts
- Defence & Strategic Analysts
- Legal Professionals
- Media & Communication Specialists
- Writers & Documentation Experts
- Social Researchers & Policy Analysts

Final CTA dark section:
Heading:
"Join Academia Khap"
Button:
"Contact Us" -> Contact screen


Contact Screen
--------------
Top label:
"Contact Academia Khap"

Main heading:
"Get In Touch"

Intro text:
"For collaborations, research discussions, institutional partnerships, legal consultation, historical documentation, publications, media engagement, or community initiatives, contact the Academia Khap team."

Contact Information card:
- General Email: academiakhap@gmail.com
- Research & Publications: research@academiakhap.org
- Collaborations: partnerships@academiakhap.org
- Social Media:
  Instagram: @academiakhap
  LinkedIn: Academia Khap
- Operational Region:
  India • Community Research Network

Contact form:
Fields:
- Full Name
- Email Address
- Subject
- Write your message...
Button:
"Submit Message"

Note:
The website form is currently static. For Android, either:
- open email intent to academiakhap@gmail.com, or
- connect to backend/form service if available.


Spacing And Layout Rules
------------------------
Use a calm publication layout.

Screen padding:
- 16dp on small phones
- 24dp on larger phones
- 32dp on tablets

Section vertical padding:
- 48dp mobile
- 72-96dp tablet

Card padding:
- 24dp mobile
- 32dp tablet

Card radius:
- Main cards: 24-32dp
- Dark panels: 32-40dp
- Inputs/buttons: 16-24dp
- Pills: full rounded

Grid behavior:
- Phones: single column
- Large phones/tablets: two columns for cards if space allows
- Research tablets: left list 320-350dp, right article detail fills rest


Android Implementation Suggestions
----------------------------------
If using Jetpack Compose:
- Use Material 3
- Define a custom color scheme matching the palette above
- Use Scaffold with TopAppBar and NavigationBar
- Use LazyColumn for page content
- Use LazyVerticalGrid for cards on tablets if needed
- Use WindowSizeClass for master-detail Research layout
- Store article data in Kotlin data classes:

data class Article(
    val id: Int,
    val title: String,
    val category: String,
    val key: String,
    val body: List<String>,
    val sources: List<String>
)

Use these article keys:
- pilania-zamindars
- kuchesar

If using React Native:
- Use React Navigation
- Use ScrollView / FlatList
- Use StyleSheet constants for colors
- Use local images from assets
- Use the same article object structure as the web project


SEO / App Store Metadata
------------------------
App name:
Academia Khap

Short description:
Research, history, culture, rural heritage, and community documentation.

Long description:
Academia Khap is a research-oriented platform focused on evidence-based historical study, cultural continuity, social understanding, rural heritage preservation, and intellectual engagement across communities.

Keywords:
Academia Khap, Khap research, Jat history, rural heritage, zamindari history, Bulandshahr history, cultural documentation, Indian history

Theme color:
#5b3419


Important Behavior
------------------
- Do not create standalone web-like article pages in the Android app.
- Keep article browsing as a research archive/list plus article detail.
- Preserve the scholarly reading experience.
- Use exact colors from this file.
- Keep the homepage as the first usable screen.
- Ensure text is readable and does not overlap on small screens.
- External social links should open in browser or installed app.
- The app should work offline for article reading if article content is bundled locally.
