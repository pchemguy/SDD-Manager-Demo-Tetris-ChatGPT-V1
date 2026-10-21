"""Package only public runtime files, with a reproducible archive and checksum."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parents[1]
out = root / 'artifacts'
out.mkdir(exist_ok=True)
version = json.loads((root / 'package.json').read_text())['version']
files = {p.relative_to(root / 'dist').as_posix(): p.read_bytes()
         for p in (root / 'dist').rglob('*') if p.is_file()}
assert 'index.html' in files, 'Run npm run build first'
files['LICENSE'] = (root / 'LICENSE').read_bytes()
files['VERSION.json'] = (json.dumps({'name': 'browser-tetris', 'version': version}) + '\n').encode()
files['SERVING.md'] = b'# Run Tetris\n\nExtract this archive. In its directory run `python3 -m http.server 8080` (Windows: `py -m http.server 8080`). Open http://localhost:8080 in Chromium or Firefox. Use an HTTP static host; opening index.html through file:// is unsupported. No npm installation is needed to play.\n'
archive = out / 'tetris.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for name, data in sorted(files.items()):
        info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        z.writestr(info, data)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert sorted(z.namelist()) == sorted(files)
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
(out / 'tetris.zip.sha256').write_text(f'{digest}  tetris.zip\n')
print(f'Packaged {len(files)} files for {version}: {digest}')
