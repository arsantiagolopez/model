# Tennis Model

## Data collection workflow

1. Scrape tomorrow's schedule from base URL. Return all matches.
2. Parse matches to get tournaments, matches, and players.
3. Create initial entities for tournaments, matches, and players.
4. Scrape current tournament's history. Update database.
5. Scrape detailed match preview, including ML, spread and over/under odds. Update database.
6. Scrape detailed player profiles, including their past 10 games with stats, surface history, current tournament history. Update database.
