# Cork Jar

The photography portfolio of **Tyler Law**, working under the alias **Cork Jar (CJ)**. Editorial, landscape, and portrait work, with booking, prints, color-grade LUTs, and a gear page.

Static site: plain HTML + Tailwind (CDN) + Google Fonts. No build step. Deploys anywhere.

## Pages

| Page          | What it does                                                        |
| ------------- | ------------------------------------------------------------------- |
| `index.html`  | Home: hero, featured edit, services, CTA                            |
| `work.html`   | Portfolio with category filtering and a full-screen lightbox        |
| `book.html`   | Booking enquiry form (emails you) + a Calendly slot ready to enable |
| `prints.html` | Prints "by request", easy to switch to a real Gumroad shop          |
| `luts.html`   | Color-grade LUTs preview with before/after sliders + waitlist       |
| `gear.html`   | The real kit: Sony a6300, Canon Rebel T7, Nikon 1 underwater        |
| `about.html`  | Bio, the story behind the name, and contact                         |

## Edit everything from one place

Open `assets/js/main.js`. The `window.CJ` object at the very top holds your name, email, and the optional Calendly + Gumroad links:

```js
window.CJ = {
  name: "Cork Jar",
  photographer: "Tyler Law",
  email: "tylerclaw007@gmail.com",
  calendly: "", // add your Calendly URL -> the Book page shows a live calendar
  gumroad: "", // add your Gumroad URL -> Prints/LUTs buttons become real "Buy" links
  instagram: "", // optional
};
```

- **Leave `calendly` blank** and the Book page shows the inquiry form only.
- **Leave `gumroad` blank** and every "buy" button becomes an email enquiry to you.

## Add your photos

1. Drop image files into `assets/photos/<category>/`
   (`featured`, `street-editorial`, `landscape-travel`, `portrait-lifestyle`, `prints`, `luts`, `gear`).
2. Open `assets/js/gallery-data.js` and replace each placeholder `src` with your path, e.g.
   `src: "assets/photos/street-editorial/lisbon-01.jpg"`.
3. Gear and About portrait photos are marked with `REPLACE:` comments directly in
   `gear.html` and `about.html`.

Placeholders currently use Lorem Picsum (real photos, stable) so the site looks finished today.

## The booking form (one-time step)

The form posts to [FormSubmit](https://formsubmit.co). The **first** real submission triggers a confirmation email to `tylerclaw007@gmail.com`. Click the link in it once, and the form is live forever after.

## Run locally

```bash
cd photographer-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages). Framework preset: None. Build command: empty. Output directory: `/`.

After picking a domain, update the placeholder `https://corkjar.studio` URLs in each page's `<link rel="canonical">`, plus `robots.txt` and `sitemap.xml`.

---

Built with D1 Vibe Coding
