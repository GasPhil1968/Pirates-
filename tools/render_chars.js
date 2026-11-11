// Schnelles Prüfblatt ohne Browser: lädt Palette, MALA-Rig, Detail-Zeichner, Köpfe und Figuren in einer VM
// und schreibt ein PNG. Aufruf: node tools/render_chars.js out.png [scale] [ids,kommagetrennt] [modus]
//   modus 'heads': nur Kopfstempel (S n/b/o, F n/b/o, B) · sonst: Posen (Seite, vorn, hinten, Gehen 0/2/4/6, Sprechen, Fahne, Winken)
const fs = require('fs'), vm = require('vm'), zlib = require('zlib'), path = require('path');
const root = path.join(__dirname, '..', 'game', 'js');
const ctx = { console, Math, JSON, Object, Array, Uint8Array, Float32Array, Int32Array, setTimeout };
ctx.window = ctx; ctx.document = { createElement: () => ({ getContext: () => null }) }; ctx.MA = {};
vm.createContext(ctx);
['lib/mala_core.js', 'lib/mala_art.js', 'lib/mala_rig.js', 'art/rig_detail.js', 'art/heads.js', 'art/anims.js', 'art/cast.js'].forEach((f) => { const p = path.join(root, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); });
const M = ctx.M, P = M.P;
const out = process.argv[2] || 'chars.png', scale = +(process.argv[3] || 6);
const ids = (process.argv[4] || 'm,jasna,nedim,dragan,kidA,kidB,kidC,kidD,lehrer,branko,mara,dedo,jovan,kleber,helfer,tiko').split(',');
const mode = process.argv[5] || 'poses';
function anim(ch, n){ const c = M.CHARS[ch]; return (c.anims && c.anims[n]) || M.ANIMS[n]; }
let buf;
if (mode === 'heads'){
  const cw = 18, rh = 20, cols = 7; buf = new M.Buf(cols*cw, ids.length*rh, P.s3);
  ids.forEach((id, r) => { const ch = M.CHARS[id]; const list = [['S', 'n'], ['S', 'b'], ['S', 'o'], ['F', 'n'], ['F', 'b'], ['F', 'o'], ['B', 'n']];
    list.forEach((q, i) => { const set = ch.heads[q[0]] || ch.heads.S; const rows = set[q[1]] || set.n; const st = M.stamp(rows, ch.legend); buf.rect(i*cw, r*rh, cw-1, rh-1, (r+i) % 2 ? P.s4 : P.s3); buf.blit(st, i*cw+2, r*rh+2); }); });
} else {
  const cw = 34, rh = 58; buf = new M.Buf(10*cw, ids.length*rh, P.s3);
  ids.forEach((id, r) => { const y = r*rh+52;
    const poses = [anim(id, 'idleS')[0][0], anim(id, 'idleF')[0][0], anim(id, 'idleB')[0][0], anim(id, 'walkS')[0], anim(id, 'walkS')[2], anim(id, 'walkS')[4], anim(id, 'walkS')[6], anim(id, 'talkS')[0][0], anim(id, 'flagF')[0][0], anim(id, 'waveF')[2][0]];
    poses.forEach((p, i) => { buf.rect(i*cw, r*rh, cw-1, rh-1, (r+i) % 2 ? P.s4 : P.s3); M.drawPose(buf, i*cw+17, y, p, 'R', id, {}); }); });
}
// PNG schreiben
const W = buf.w*scale, H = buf.h*scale, raw = Buffer.alloc((W*3+1)*H);
for (let y = 0; y < H; y++){ raw[y*(W*3+1)] = 0; for (let x = 0; x < W; x++){ const c = buf.d[Math.floor(y/scale)*buf.w+Math.floor(x/scale)], q = M.RGB[c] || [255, 0, 255], o = y*(W*3+1)+1+x*3; raw[o] = q[0]; raw[o+1] = q[1]; raw[o+2] = q[2]; } }
const crcT = []; for (let n = 0; n < 256; n++){ let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
function crc(b){ let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(t, d){ const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); }
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('geschrieben', out, W+'×'+H);
