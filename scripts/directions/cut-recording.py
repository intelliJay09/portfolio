"""cut-recording.py <webm> <name> [start-end ...]
Turns a raw browser take into a site recording for public/directions/rec.

How a take is made (Playwright, a 1440x900 context with recordVideo): visit every page in the route
once so its images are cached, then perform the take. Each shot starts and ends with a full-screen
#f0f overlay held for 1.2s. Scroll inside the page with an eased requestAnimationFrame loop, never
with mouse wheel events (a heavy page slows those down). Only move forward: never scroll back up.
Stop the shot before a click that changes page and start the next once the new page has loaded.

Finds the magenta markers a take was framed with (each shot sits between two markers), cuts the
shots out, joins them with straight cuts, and encodes the result like the site's other recordings:
1440x900 H.264, 30fps, no audio, faststart. Writes a poster and a contact sheet to review."""
import subprocess, sys, os
src, name = sys.argv[1], sys.argv[2]
# Optional: shots given by hand as start-end pairs (seconds), when a marker was dropped
manual = [tuple(map(float, a.split('-'))) for a in sys.argv[3:]]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'directions', 'rec'); out = os.path.normpath(out)
FPS, W, H = 20, 16, 10
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
n = len(raw) // (W * H * 3)
def magenta(i):
    px = raw[i * W * H * 3:(i + 1) * W * H * 3]
    hits = sum(1 for k in range(0, len(px), 3) if px[k] > 200 and px[k + 1] < 60 and px[k + 2] > 200)
    return hits > W * H * 0.9
runs, cur = [], None
for i in range(n):
    if magenta(i):
        cur = [i, i] if cur is None else [cur[0], i]
    elif cur is not None:
        runs.append(cur); cur = None
if cur: runs.append(cur)
if manual:
    shots = manual
else:
    if len(runs) % 2: sys.exit(f'odd number of markers: {runs}')
    shots = [((runs[k][1] + 1) / FPS + 0.05, runs[k + 1][0] / FPS - 0.05) for k in range(0, len(runs), 2)]
print('shots:', [(round(a, 2), round(b, 2), round(b - a, 2)) for a, b in shots])
parts = []
for j, (a, b) in enumerate(shots):
    parts.append(f'[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,fps=30,scale=1440:900:flags=lanczos,format=yuv420p[v{j}]')
graph = ';'.join(parts) + ';' + ''.join(f'[v{j}]' for j in range(len(shots))) + f'concat=n={len(shots)}:v=1:a=0[o]'
mp4 = os.path.join(out, f'{name}.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', graph, '-map', '[o]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '31', '-profile:v', 'high', '-movflags', '+faststart', mp4], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '0.5', '-i', mp4, '-frames:v', '1', '-q:v', '3', os.path.join(out, f'{name}-poster.jpg')], check=True)
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], capture_output=True, text=True).stdout)
print(f'{name}.mp4  {d:.1f}s  {os.path.getsize(mp4) // 1024} KB')
