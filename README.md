<div align="center">
    <img src="https://i.ibb.co/1rZDsn6/centered.png" width="90%"/>
    <a href="https://themodel.vercel.app" style="color: #303030;"><h1>The Model</h1></a>
    <h4>Tennis model to display, analize and predict upcoming ATP, WTA and ITF matches. Stats like surface records, form, home court advantage, ELOs and others are calculated.</h4>
</div>

<div align="center">
    <img src="https://img.shields.io/github/last-commit/arsantiagolopez/model?label=updated"/>
    <a href="https://github.com/arsantiagolopez/model/blob/main/LICENSE"><img src="https://img.shields.io/github/license/arsantiagolopez/model?color=303030" /></a>
    <img src="https://img.shields.io/github/languages/top/arsantiagolopez/model" />
</div>

<div align="center">
	<a href="https://alexandersantiago.com/"><img src="https://alexandersantiago.com/alex.png" width="24" style="margin-left: -1em;" /></a>
	<a href="https://instagram.com/asantilopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/instagram_online_social_media_photo-1024.png" width="25" /></a>
	<a href="https://twitter.com/arsantiagolopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/twitter_online_social_media-512.png" width="25" /></a>
	<a href="mailto:arsantiagolopez@gmail.com"><img src="https://cdn4.iconfinder.com/data/icons/black-white-social-media/32/mail_email_envelope_send_message-1024.png" width="25" /></a>
</div>

<div align="center">
  <a href="#preview">Preview</a> •
  <a href="#features">Features</a> •
  <a href="#tech">Tech Stack</a> •
  <a href="#scraping">Scraping</a> •
  <a href="#inspiration">Inspiration</a> •
  <a href="#objectives">Learning</a> •
  <a href="#license">License</a> •
  <a href="#contact">Contact</a>
</div>

<h2 id="preview">⚡ Preview</h2>

<details open>
  <summary>Mobile</summary>
</details>

<details>
  <summary>Desktop</summary>
</details>

<h2 id="features">🎯 Features</h2>

- Get a schedule of all of tomorrow's tennis matches.
- The schedule includes matches from every tournament, head to head history, home and away odds.
- Every match includes the players' ranking, surface history, start time, and corresponding odds - moneyline, spreads and totals - in both american and decimal formats.
- Click on any odds at any time and toggle between american and decimal odds.
- Players form is calculated and visualized, with exact match details and match outcome difficulty graphs.
- Section of players playing in their home tournaments.
- Section of players holding a current game streak.
- Section of in-form players. Multiple parameters taken into account, including opponent's strength, tour level, recent losses.
- Section of player rust. Table shows the players with the longest time away from the courts.
- Section of surface dominance. In tennis, players specialize on specific surfaces. Table shows the highest differential in records between both players, highlighting the most successful players against the least succesful.
- ATP/WTA full player ranking tables.

<h2 id="tech">‎‍💻 Tech Stack</h2>

### Client

<table>
  <tr>
      <th>Tech</th>
      <th>What for</th>
  </tr>
    <tr>
      <td><a href="https://www.typescriptlang.org/">TypeScript</a></td>
      <td>Make coding fun again.</td>
  </tr>
  <tr>
      <td><a href="https://reactjs.org/">React</a></td>
      <td>To build a component based user interface.</td>
  </tr>
  <tr>
      <td><a href="https://nextjs.org/">Next.js</a></td>
      <td>Server side rendering (SSR) of React components.</td>
  </tr>
    <tr>
      <td><a href="https://pptr.dev/">Puppeteer</a></td>
      <td>Scrapes & parses data from other websites.</td>
  </tr>
  <tr>
      <td><a href="https://github.com/thomasdondorf/puppeteer-cluster">Puppeteer Cluster</a></td>
      <td>Run mutliple instances of puppeteer in parallel.</td>
  </tr>
  <tr>
    <td><a href="https://recharts.org/en-US/">Recharts</td>
    <td>Data visualization.</td>
  </tr>
    <tr>
    <td><a href="https://tailwindcss.com/">Tailwind CSS</td>
    <td>Fast & powerful way to build a beautiful UI.</td>
  </tr>
    <tr>
      <td><a href="https://headlessui.dev/">Headless UI</a></td>
      <td>UI components for Tailwind CSS.</td>
    </tr>
    <tr>
      <td><a href="https://react-hook-form.com/">React Hook Form</a></td>
      <td>Form state management and validation.</td>
  </tr>
  <tr>
      <td><a href="https://swr.vercel.app/">SWR</a></td>
      <td>Cache & data fetching.</td>
  </tr>
  <tr>
      <td><a href="https://axios-http.com/docs/intro">Axios</a></td>
      <td>HTTP promise based data fetching requests.</td>
  </tr>
  <tr>
      <td><a href="https://momentjs.com/">Moment.js</a></td>
      <td>Parse & display dates.</td>
  </tr>
</table>

### Server

<table>
    <tr>
        <th>Tech</th>
        <th>What for</th>
    </tr>
    <tr>
      <td><a href="https://www.typescriptlang.org/">TypeScript</a></td>
      <td>Make coding fun again.</td>
  </tr>
    <tr>
        <td><a href="https://nodejs.org/">Node.js</a></td>
        <td>JavaScript runtime environment.</td>
    </tr>
    <tr>
        <td><a href="https://nextjs.org/">Next.js API</a></td>
        <td>API endpoints as Node.js serverless functions.</td>
    </tr>
    </tr>
        <tr>
        <td><a href="https://www.mongodb.com/">MongoDB</a></td>
        <td>NoSQL document based database.</td>
    </tr>
    <tr>
        <td><a href="https://www.mongoose.com/">Mongoose</a></td>
        <td>Interact with the database.</td>
    </tr>
    <tr>
        <td><a href="https://next-auth.js.org/">NextAuth.js</a></td>
        <td>Local and social authentication solution.</td>
    </tr>
     <tr>
      <td><a href="https://axios-http.com/docs/intro">Axios</a></td>
      <td>Fetch data with promise based HTTP requests.</td>
  </tr>
    <tr>
        <td>REST API</td>
        <td>HTTP API architecture.</td>
    </tr>
</table>

### DevOps

<table>
    <tr>
        <th>Tech</th>
        <th>What for</th>
    </tr>
    <tr>
        <td><a href="https://vercel.com/">Vercel</a></td>
        <td>Host the client.</td>
    </tr>
    <tr>
        <td><a href="https://docs.polygon.technology/docs/develop/network-details/network/">MongoDB Atlas</a></td>
        <td>Host the database.</td>
    </tr>
</table>

<h2 id="scraping">📜 Scraping Workflow</h2>

1. Scrape tomorrow's schedule from base URL. Return all matches.
2. Parse matches to get tournaments, matches, and players.
3. Create initial entities for tournaments, matches, and players.
4. Scrape current tournament's history. Update database.
5. Scrape detailed match preview, including ML, spread and over/under odds. Update database.
6. Scrape detailed player profiles, including their past 10 games with stats, surface history, current tournament history. Update database.

<h2 id="inspiration">💡 Inspiration</h2>

<h2 id="objectives">🚀 Learning Objectives</h2>

- Scrape larger amounts of data.
- Best practices for scaleable scraping projects.
- Efficiently manipulate large sets of data.

<h2 id="license">📜 License</h2>

[![License](https://img.shields.io/github/license/arsantiagolopez/model?color=303030)](./LICENSE)

<h2 id="contact">☕ Contact me</h2>

<div align="left">
	<a href="https://alexandersantiago.com/"><img src="https://alexandersantiago.com/alex.png" width="40" /></a>
	<a href="https://instagram.com/asantilopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/instagram_online_social_media_photo-1024.png" width="40" /></a>
	<a href="https://twitter.com/arsantiagolopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/twitter_online_social_media-512.png" width="40" /></a>
	<a href="mailto:arsantiagolopez@gmail.com"><img src="https://cdn4.iconfinder.com/data/icons/black-white-social-media/32/mail_email_envelope_send_message-1024.png" width="40" /></a>
</div>
