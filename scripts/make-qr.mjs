// Regenerates the QR on the closing slide: `npm run qr`
// Shipped as a static SVG so the deck has no runtime QR dependency, and so the
// code is identical every build. NOTE: this is a *real* QR — unlike
// components/QrMock.vue, which is a deliberately fake one for the payment-page
// mock and encodes nothing.
import { writeFile } from 'node:fs/promises'
import QRCode from 'qrcode'

const target = 'https://github.com/kiocos/atomic-swaps-explainer'

const svg = await QRCode.toString(target, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 1,
  color: { dark: '#09141f', light: '#ffffff' },
})

await writeFile(new URL('../public/slides-qr.svg', import.meta.url), svg)
console.log(`wrote public/slides-qr.svg -> ${target}`)
