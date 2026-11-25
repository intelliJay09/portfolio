// Builds the data behind the portrait made of emails.
//
// 1. atlas.webp: the 14 real emails from Gwen Addo's customer journey, each cut into three
//    square crops (top, middle, bottom), 42 tiles in a 7 x 6 grid of 128px cells.
// 2. cells.json: Jacqueline's head and shoulders, taken from the cut-out portrait so only
//    her silhouette is sampled (no background cells), in exactly 1,695 cells, one for every
//    automated email her system sent for that client. Each cell keeps its brightness.
// 3. bust.webp: the photograph of that crop. poster.png: the same grid, transparent outside her, shown pixelated before WebGL starts.
// 4. plate-grid.webp: the 1,695 emails laid out 53 x 32, for layer 02 of the drawing.
//
// Run from the project root: node scripts/directions/build-mosaic.mjs
// Needs ImageMagick 7 (`magick`) on the PATH.

import { execFileSync } from 'node:child_process'
import { readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const EMAIL_DIR = 'public/images/case-studies/gwen-addo'
const CUTOUT = 'public/directions/people/seated-cutout.webp'
// Head and shoulders, measured on the 1500 x 2449 cut-out
const CROP = { w: 960, h: 960, x: 332, y: 0 }
const OUT_DIR = 'public/directions/mosaic'
const TILE = 128
const ATLAS_COLS = 7
const TARGET = 1695 // emails sent, verified in the Cohort 3 value digest
const PLATE = { cols: 53, rows: 32, tile: 22, gap: 3, ground: '#1b1a17' }

const magick = (...args) => execFileSync('magick', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const work = mkdtempSync(join(tmpdir(), 'mosaic-'))

// --- atlas ---------------------------------------------------------------
const emails = readdirSync(EMAIL_DIR).filter((f) => f.startsWith('email-') && f.endsWith('.webp')).sort()
if (emails.length !== 14) throw new Error(`Expected 14 Gwen Addo emails, found ${emails.length}`)
const tiles = []
for (const file of emails) {
  const src = join(EMAIL_DIR, file)
  const [w, h] = magick('identify', '-format', '%w %h', src).trim().split(' ').map(Number)
  const side = Math.min(w, h)
  ;[0, Math.round((h - side) / 2), h - side].forEach((y) => {
    const out = join(work, `tile-${tiles.length}.png`)
    magick(src, '-crop', `${side}x${side}+0+${y}`, '+repage', '-resize', `${TILE}x${TILE}!`, out)
    tiles.push(out)
  })
}
// Rows joined side by side, then stacked (montage needs a font on some installs)
const atlasRows = Math.ceil(tiles.length / ATLAS_COLS)
const rowFiles = []
for (let r = 0; r < atlasRows; r++) {
  const out = join(work, `row-${r}.png`)
  magick(...tiles.slice(r * ATLAS_COLS, (r + 1) * ATLAS_COLS), '+append', out)
  rowFiles.push(out)
}
magick(...rowFiles, '-background', '#0c0c0b', '-append', '-quality', '82', join(OUT_DIR, 'atlas.webp'))

// --- her silhouette, sampled -----------------------------------------------
const bust = join(work, 'bust.png')
magick(CUTOUT, '-crop', `${CROP.w}x${CROP.h}+${CROP.x}+${CROP.y}`, '+repage', bust)
// The real photograph of the same crop: shown on first paint, and the texture the tiles
// sample so the hand-over from photo to emails is pixel for pixel
magick(bust, '-quality', '86', join(OUT_DIR, 'bust.webp'))

// Per-cell mean of one channel image, row by row, 0 to 1
const sample = (img, n) => {
  const txt = magick(img, '-colorspace', 'Gray', '-resize', `${n}x${n}!`, '-depth', '16', 'txt:-')
  const v = new Array(n * n)
  for (const line of txt.split('\n')) {
    const m = line.match(/^(\d+),(\d+):\s*\((\d+(?:\.\d+)?)/)
    if (m) v[Number(m[2]) * n + Number(m[1])] = Number(m[3]) / 65535
  }
  return v
}
const alphaImg = join(work, 'alpha.png')
const premulImg = join(work, 'premul.png')
magick(bust, '-alpha', 'extract', alphaImg)
magick(bust, '-background', 'black', '-flatten', '-colorspace', 'Gray', premulImg)

// The smallest grid whose silhouette holds at least 1,695 cells, then the faintest edge
// cells are dropped until exactly 1,695 remain
let grid = 0
let coverage = []
let lit = []
for (let n = 40; n <= 90; n++) {
  const cov = sample(alphaImg, n)
  if (cov.filter((c) => c >= 0.5).length >= TARGET) {
    grid = n
    coverage = cov
    lit = sample(premulImg, n)
    break
  }
}
if (!grid) throw new Error('No grid size reached 1,695 cells inside the silhouette')
const inside = coverage.map((c, i) => [c, i]).filter(([c]) => c >= 0.5).sort((a, b) => b[0] - a[0]).slice(0, TARGET)
const keep = new Set(inside.map(([, i]) => i))

let seed = 1695
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const cells = []
for (let i = 0; i < grid * grid; i++) {
  if (!keep.has(i)) continue
  const lum = Math.min(1, lit[i] / Math.max(coverage[i], 0.001))
  cells.push([i % grid, Math.floor(i / grid), Math.round(lum * 1000) / 1000, Math.floor(rand() * tiles.length)])
}
if (cells.length !== TARGET) throw new Error(`Expected ${TARGET} cells, got ${cells.length}`)

// Poster: the same grid, her cells in grey, transparent around her
const posterTxt = ['# ImageMagick pixel enumeration: ' + grid + ',' + grid + ',255,graya']
const lumAt = new Map(cells.map(([x, y, l]) => [y * grid + x, l]))
for (let y = 0; y < grid; y++) {
  for (let x = 0; x < grid; x++) {
    const l = lumAt.get(y * grid + x)
    const g = l === undefined ? 0 : Math.round(255 * (0.16 + 0.84 * l) * 0.9)
    posterTxt.push(`${x},${y}: (${g},${l === undefined ? 0 : 255})`)
  }
}
const posterIn = join(work, 'poster.txt')
writeFileSync(posterIn, posterTxt.join('\n'))
magick(posterIn, join(OUT_DIR, 'poster.png'))

// --- layer 02: the 1,695 emails as a grid --------------------------------
const small = tiles.map((t, i) => {
  const out = join(work, `small-${i}.png`)
  magick(t, '-resize', `${PLATE.tile}x${PLATE.tile}!`, '-bordercolor', PLATE.ground, '-border', String(Math.round(PLATE.gap / 2)), out)
  return out
})
const blank = join(work, 'blank.png')
const cellSize = PLATE.tile + 2 * Math.round(PLATE.gap / 2)
magick('-size', `${cellSize}x${cellSize}`, `xc:${PLATE.ground}`, blank)
const plateRows = []
for (let r = 0; r < PLATE.rows; r++) {
  const row = []
  for (let c = 0; c < PLATE.cols; c++) {
    const i = r * PLATE.cols + c
    row.push(i < cells.length ? small[cells[i][3]] : blank)
  }
  const out = join(work, `prow-${r}.png`)
  magick(...row, '+append', out)
  plateRows.push(out)
}
magick(...plateRows, '-append', '-quality', '80', join(OUT_DIR, 'plate-grid.webp'))

writeFileSync(
  join(OUT_DIR, 'cells.json'),
  JSON.stringify({ cols: grid, rows: grid, atlasCols: ATLAS_COLS, atlasRows, tiles: tiles.length, cells }),
)
rmSync(work, { recursive: true, force: true })
console.log(`atlas: ${tiles.length} tiles, grid: ${grid} x ${grid}, cells: ${cells.length}, plate: ${PLATE.cols} x ${PLATE.rows}`)
