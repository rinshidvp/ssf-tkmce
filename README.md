# SSF TKMCE Website

Open-source website foundation for **SSF TKMCE** (TKM College of Engineering, Karicode, Kollam).
Built as one unified site with English as the primary language and Malayalam & Arabic woven naturally into Darse reflections, campus culture, and the Knowledge Corner archive.

**Live Preview:** https://ssf-tkmce.vercel.app  
**Repository:** https://github.com/rinshidvp/ssf-tkmce

## Pages
- `/` — Home (hero, three living traditions, core pillars, Darse spotlight, programmes, Knowledge Corner, memories)
- `/about` — Campus identity, core pillars, and stewardship wings
- `/activities` — Programmes, Sahityotsav, Freshers’ Welcome, Ramadan Iftar, and student care
- `/darse` — Weekly Darse schedule with classical Arabic text reflections, English overviews, and Malayalam takeaways
- `/memories` — Filterable photo journal archive
- `/knowledge` & `/knowledge/[slug]` — Unified English, Malayalam, and Arabic readings
- `/join` — Campus connect and contribution form

## Run Locally
1. Ensure **Node.js 20.9+** is installed.
2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/rinshidvp/ssf-tkmce.git
   cd ssf-tkmce
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000`.

## Contributing
Friends and campus contributors can jump in right away:
- Edit starter content, Darse notes, activities, and Knowledge Corner articles in `src/data/site-content.ts`.
- Add approved campus photos in `public/` and wire them into the Memories archive (`src/components/memories-gallery.tsx`).
- Replace the circular brand mark or customize `public/brand/` with the official SSF logo.
- Connect Supabase using `.env.example` and `supabase/migrations/001_initial_schema.sql` when ready for dynamic publishing.

## License
Released under the [MIT License](LICENSE).
