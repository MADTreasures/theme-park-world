# Builds the game's sound set from the downloaded recordings: cuts every clip, levels it, and writes audio/manifest.json
# (the list of clips for the build, and for every source: author, licence, original page, checksum, what was changed).
# node build.js then embeds the clips and writes AUDIO-QUELLEN.md from the manifest.
#
#   python3 tools/audio/build_set.py <work dir> audio
#
# <work dir>/raw/<name>/ must hold exactly one downloaded file per source (the names are in set_sources.py; the address of
# each original is there too). The recordings themselves are not kept in the repository, only the finished clips are.
# Needs ffmpeg and numpy. To add a recording: one source(...) entry with its licence in set_sources.py, clip(...) lines in set_clips.py.
import sys, os, json, subprocess, hashlib, glob
W, O = sys.argv[1], sys.argv[2]; only = sys.argv[4] if len(sys.argv) > 4 and sys.argv[3] == 'only' else None
T = os.path.dirname(os.path.abspath(__file__))
CHECKED = '22. November 2026'
PD_PDSOUNDS = 'Gemeinfrei: vom Urheber über pdsounds.org ohne Bedingungen freigegeben («released into the public domain by its author»)'
CC0 = 'CC0 1.0 (Verzicht auf alle Rechte, Public Domain Dedication)'
CC0_URL = 'https://creativecommons.org/publicdomain/zero/1.0/deed.de'
def wm(name): return 'https://commons.wikimedia.org/wiki/File:' + name
# ---- sources: one entry per original file -------------------------------------------------------------------------
SRC = {}
def source(key, raw, **kw): SRC[key] = dict(kw, key=key, raw=raw)
exec(open(os.path.join(T, 'set_sources.py'), encoding='utf8').read())
# ---- clips ----------------------------------------------------------------------------------------------------------
CLIPS = []   # (id, source key, role, kind, start, end-or-period, options, gain in the game)
def clip(id, src, role, t0, t1, opts='', gain=1.0): CLIPS.append((id, src, role, 'cut', t0, t1, opts, gain, None))
def loop(id, src, role, t0, period, opts='', gain=1.0): CLIPS.append((id, src, role, 'loop', t0, period, opts, gain, None))
def layer(id, src, role, t0, t1, voices, opts='', gain=1.0, second=None):   # second: (source key, start, end) of another person in the group
    CLIPS.append((id, src, role, 'layer', t0, t1, opts + ' --voices ' + ','.join(':'.join('%g' % x for x in v) for v in voices), gain, second))
exec(open(os.path.join(T, 'set_clips.py'), encoding='utf8').read())
def rawfile(key):
    g = glob.glob(os.path.join(W, 'raw', SRC[key]['raw'], '*')); return g[0] if len(g) == 1 else None
os.makedirs(O, exist_ok=True); man = {'intro': INTRO, 'outro': OUTRO, 'sources': [], 'clips': []}; used = {}
for id, src, role, kind, a, b, opts, gain, second in CLIPS:
    out = os.path.join(O, id + '.mp3')
    if not rawfile(src) or (second and not rawfile(second[0])): print('MISSING source file for', id, '(' + src + ')'); continue
    if not only or id.startswith(only):
        tool = {'cut': 'cut.py', 'loop': 'loop.py', 'layer': 'layer.py'}[kind]
        extra = ['--src2', rawfile(second[0]), str(second[1]), str(second[2])] if second else []
        r = subprocess.run([sys.executable, '-I', os.path.join(T, tool), rawfile(src), str(a), str(b), out] + opts.split() + extra, capture_output=True, text=True)
        print(r.stdout.strip() or r.stderr.strip()[-300:])
    man['clips'].append({'id': id, 'file': id + '.mp3', 'role': role, 'src': src, 'gain': gain, 'loop': b if kind == 'loop' else 0})
    used.setdefault(src, []).append((kind, a, b))
    if second: used.setdefault(second[0], []).append((kind, second[1], second[2]))
fmt = lambda t: ('%d:%04.1f' % (int(t // 60), t % 60)).replace('.', ',')
for key, s in SRC.items():
    if key not in used: continue
    f = rawfile(key); sha = hashlib.sha256(open(f, 'rb').read()).hexdigest()
    cuts = ', '.join(fmt(a) + '–' + fmt(b) if k == 'cut' else fmt(a) + '–' + fmt(b) + ' (in mehreren Tonhöhen übereinandergelegt, damit es nach einer Gruppe klingt)' if k == 'layer' else fmt(a) + '–' + fmt(a + b) + ' (als nahtlose Schleife überblendet)' for k, a, b in used[key])
    man['sources'].append({'key': key, 'title': s['title'], 'author': s['author'], 'licence': s['licence'], 'licenceUrl': s.get('licenceUrl', ''), 'composition': s.get('composition', ''),
        'url': s['url'], 'file': s['file'] + ' – verwendet wurde die von Wikimedia Commons bereitgestellte MP3-Fassung dieser Datei', 'sha256': sha, 'checked': CHECKED, 'use': s['use'],
        'changes': ('Ausschnitt' if len(used[key]) == 1 else 'Ausschnitte') + ' ' + cuts + '; in Mono umgewandelt, tiefes Rumpeln herausgefiltert, ein- und ausgeblendet, Lautstärke angeglichen, als MP3 gespeichert.', 'note': s.get('note', '')})
json.dump(man, open(os.path.join(O, 'manifest.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
tot = sum(os.path.getsize(os.path.join(O, c['file'])) for c in man['clips'] if os.path.exists(os.path.join(O, c['file'])))
print('%d clips from %d sources, %.0f kB' % (len(man['clips']), len(man['sources']), tot / 1000))
