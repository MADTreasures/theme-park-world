# make a seamless loop of crowd noise: the end is cross-faded into what came just before the start, so the loop point is inaudible.
# The file holds one period plus 0.6 s of the next one; the game loops from 0.2 s to 0.2 s + period, safely inside it whatever the MP3 decoder pads.
# usage: loop.py <src> <start> <period> <out.mp3> [--xf s] [--rms dB] [--peak dB] [--hp Hz] [--lp Hz] [--kbps n]
import sys, subprocess, wave, os, numpy as np
a = sys.argv[1:]; src, t0, L, out = a[0], float(a[1]), float(a[2]), a[3]
def opt(name, default): return float(a[a.index(name) + 1]) if name in a else default
SR = 44100; X = opt('--xf', 1.5)
assert t0 >= X, 'the start must leave room for the cross-fade'
flt = ['highpass=f=%d' % opt('--hp', 100)]
if '--lp' in a: flt.append('lowpass=f=%d' % opt('--lp', 9000))
cmd = ['ffmpeg', '-v', 'error', '-ss', '%.3f' % (t0 - X), '-t', '%.3f' % (L + X), '-i', src, '-ac', '1', '-ar', str(SR), '-af', ','.join(flt), '-f', 'f32le', '-']
x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).copy()
nx, nl = int(X * SR), int(L * SR); pre, seg = x[:nx], x[nx:nx + nl].copy(); assert len(seg) == nl, 'source too short'
th = np.linspace(0, np.pi / 2, nx); seg[-nx:] = seg[-nx:] * np.cos(th) + pre * np.sin(th)   # equal power: the two passages are unrelated noise
db = lambda v: 20 * np.log10(max(v, 1e-9))
gain = min(opt('--rms', -24) - db(np.sqrt((seg ** 2).mean())), opt('--peak', -3) - db(np.abs(seg).max())); seg *= 10 ** (gain / 20)
y = np.concatenate([seg, seg[:int(0.6 * SR)]])
tmp = out + '.wav'; w = wave.open(tmp, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '%dk' % opt('--kbps', 48), '-ar', str(SR), '-ac', '1', '-map_metadata', '-1', out], check=True); os.remove(tmp)
# how even is the loop? level of every second, so a loud passage that would stick out on every round is visible
sec = [db(np.sqrt((seg[i:i + SR] ** 2).mean())) for i in range(0, nl - SR + 1, SR)]
print('%s  period %.2f s  gain %+.1f dB  rms %.1f dB  peak %.1f dB  per-second level %.1f..%.1f dB  %d bytes' % (os.path.basename(out), L, gain, db(np.sqrt((seg ** 2).mean())), db(np.abs(seg).max()), min(sec), max(sec), os.path.getsize(out)))
