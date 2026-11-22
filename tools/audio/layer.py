# several riders from one voice: the same passage is laid over itself at different pitches, with small delays, as a group would scream
# usage: layer.py <src> <start> <end> <out.mp3> --voices "rate:delay:gain_dB[:person],..." [--src2 <file> <start> <end>] [--rms dB] [--peak dB] [--fi ms] [--fo ms] [--hp Hz] [--kbps n]
import sys, subprocess, wave, os, numpy as np
a = sys.argv[1:]; src, t0, t1, out = a[0], float(a[1]), float(a[2]), a[3]
def opt(name, default): return float(a[a.index(name) + 1]) if name in a else default
SR = 44100
def read(path, b0, b1):
    z = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', '%.3f' % b0, '-t', '%.3f' % (b1 - b0), '-i', path, '-ac', '1', '-ar', str(SR), '-af', 'highpass=f=%d' % opt('--hp', 120), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, dtype=np.float32).astype(np.float64)
    return z / max(np.sqrt((z ** 2).mean()), 1e-9) * 0.1   # every voice starts equally loud
X = [read(src, t0, t1)]
if '--src2' in a: i = a.index('--src2'); X.append(read(a[i + 1], float(a[i + 2]), float(a[i + 3])))   # a second person
voices = [tuple(float(v) for v in p.split(':')) for p in a[a.index('--voices') + 1].split(',')]   # rate:delay:gain[:which person]
voices = [(v[0], v[1], v[2], int(v[3]) if len(v) > 3 else 0) for v in voices]
n = int(max(len(X[k]) / r + d * SR for r, d, g, k in voices)) + 1; y = np.zeros(n)
for r, d, g, k in voices:
    x = X[k]; m = int(len(x) / r); v = np.interp(np.arange(m) * r, np.arange(len(x)), x) * 10 ** (g / 20)   # played faster or slower: higher or lower, like another person
    f = min(int(0.012 * SR), m // 2); v[:f] *= np.linspace(0, 1, f); v[-f:] *= np.linspace(1, 0, f)
    i = int(d * SR); y[i:i + m] += v
fi, fo = int(opt('--fi', 12) / 1000 * SR), int(opt('--fo', 150) / 1000 * SR)
y[:fi] *= np.sin(np.linspace(0, np.pi / 2, fi)) ** 2; y[-fo:] *= np.cos(np.linspace(0, np.pi / 2, fo)) ** 2
db = lambda v: 20 * np.log10(max(v, 1e-9))
H = int(SR * 0.05); fr = y[:len(y) // H * H].reshape(-1, H); e = np.sqrt((fr ** 2).mean(axis=1)); act = e[e > e.max() * 0.1]; rms = np.sqrt((act ** 2).mean()); peak = np.abs(y).max()
gain = min(opt('--rms', -20) - db(rms), opt('--peak', -1.5) - db(peak)); y *= 10 ** (gain / 20)
tmp = out + '.wav'; w = wave.open(tmp, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '%dk' % opt('--kbps', 56), '-ar', str(SR), '-ac', '1', '-map_metadata', '-1', out], check=True); os.remove(tmp)
print('%s  %.2f s  %d voices  gain %+.1f dB  -> rms(active) %.1f dB  peak %.1f dB  %d bytes' % (os.path.basename(out), n / SR, len(voices), gain, db(rms) + gain, db(peak) + gain, os.path.getsize(out)))
