# Sigma wall clock plugin

A live clock (hours, minutes, seconds) for Sigma workbooks, in the ESBuild font.

## Font

Copy your font to `src/fonts/ESBuild.woff2`. If you only have a `.ttf` or `.otf` file,
either convert it to woff2 or change the `src` line in `src/clock.css` (for example
`url("./fonts/ESBuild.ttf") format("truetype")`).

## Develop

    npm install
    npm run dev        # http://localhost:3000

In Sigma, go to Administration → Plugins → Add, and set the development URL to
`http://localhost:3000`. Then in a workbook, use Add element → UI → Plugin.

## Deploy

    npm run build      # outputs dist/

Host `dist/` on any HTTPS static host (GitHub Pages, S3/CloudFront, Netlify), and set that URL
as the plugin's production URL in Sigma.

## Editor panel options

- `timeZone`: an IANA time zone, for example `America/New_York` (default `America/Los_Angeles`)
- `textColor`: any CSS color (default `#222222`)
- `use24Hour`: toggle for 24-hour time
