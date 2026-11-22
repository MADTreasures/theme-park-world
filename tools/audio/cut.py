# cut a passage out of a recording and make a game clip of it: mono, cleaned, faded, levelled, MP3
# usage: cut.py <src> <start> <end> <out.mp3> [--rms dB] [--peak dB] [--fi ms] [--fo ms] [--hp Hz] [--lp Hz] [--kbps n] [--sr n] [--lufs dB]
import sys, subprocess, wave, os, numpy as np
a = sys.argv[1:]; src, t0, t1, out = a[0], float(a[1]), float(a[2]), a[3]
def opt(name, default): return float(a[a.index(name) + 1]) if name in a else default
SR = int(opt('--sr', 44100)); fi, fo = opt('--fi', 12) / 1000, opt('--fo', 60) / 1000
flt = ['highpass=f=%d' % opt('--hp', 80)]
if '--lp' in a: flt.append('lowpass=f=%d' % opt('--lp', 12000))
cmd = ['ffmpeg', '-v', 'error', '-ss', '%.3f' % t0, '-t', '%.3f' % (t1 - t0), '-i', src, '-ac', '1', '-ar', str(SR), '-af', ','.join(flt), '-f', 'f32le', '-']
x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).copy()
n = len(x); nf, no = min(int(fi * SR), n // 2), min(int(fo * SR), n // 2)
if nf: x[:nf] *= np.sin(np.linspace(0, np.pi / 2, nf)) ** 2
if no: x[-no:] *= np.cos(np.linspace(0, np.pi / 2, no)) ** 2
db = lambda v: 20 * np.log10(max(v, 1e-9))
# level: the loud part counts (frames within 20 dB of the loudest), so pauses inside a clip do not make it louder
H = int(SR * 0.05); fr = x[:len(x) // H * H].reshape(-1, H); e = np.sqrt((fr ** 2).mean(axis=1)) if len(fr) else np.array([np.sqrt((x ** 2).mean())])
act = e[e > e.max() * 0.1]; rms = np.sqrt((act ** 2).mean()); peak = np.abs(x).max()
if '--lufs' in a:
    r = subprocess.run(['ffmpeg', '-v', 'info', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.tobytes(), capture_output=True)
    I = [l for l in r.stderr.decode().splitlines() if l.strip().startswith('I:')]; lufs = float(I[-1].split()[1]); gain = opt('--lufs', -19) - lufs
else: gain = opt('--rms', -20) - db(rms)
gain = min(gain, opt('--peak', -1.5) - db(peak))
x *= 10 ** (gain / 20)
tmp = out + '.wav'; w = wave.open(tmp, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '%dk' % opt('--kbps', 56), '-ar', str(SR), '-ac', '1', '-map_metadata', '-1', '-write_xing', '1', out], check=True); os.remove(tmp)
print('%s  %.2f s  gain %+.1f dB  -> rms(active) %.1f dB  peak %.1f dB  %d bytes' % (os.path.basename(out), n / SR, gain, db(rms) + gain, db(peak) + gain, os.path.getsize(out)))
