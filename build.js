// Builds the game from src/ into one self-contained page.
//   node build.js            -> index.html (works offline: library and fonts are embedded) and dev.html (developer mode)
//   node build.js --online F -> F, a copy without the document wrapper that loads the library and fonts from CDNs
const fs = require('fs'), path = require('path');
const read = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');
const jsDir = path.join(__dirname, 'src/js');
const game = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js')).sort().map((f) => read('src/js/' + f)).join('');
const online = process.argv.indexOf('--online');
const arg = (name) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : null; };
// Recordings (music, crowd, voices): audio/manifest.json lists the processed clips and their sources. They are embedded as
// base64, so the page still needs no network. --audio <dir> uses another folder, --out <dir> writes the pages somewhere else.
const audioDir = path.resolve(__dirname, arg('--audio') || 'audio'), outDir = arg('--out') ? path.resolve(arg('--out')) : __dirname;
let audio = '';
if (fs.existsSync(path.join(audioDir, 'manifest.json'))) {
  const man = JSON.parse(fs.readFileSync(path.join(audioDir, 'manifest.json'), 'utf8')), clips = {};
  for (const c of man.clips) clips[c.id] = { role: c.role, gain: c.gain || 1, loop: c.loop || 0, data: fs.readFileSync(path.join(audioDir, c.file)).toString('base64') };
  const credits = man.sources.map((s) => ({ t: s.title, a: s.author, l: s.licence, u: s.url, n: s.use }));
  // AUDIO-QUELLEN.md is written from the same list, so the file and the list in the game cannot drift apart
  if (!arg('--audio')) {
    const used = (key) => man.clips.filter((c) => c.src === key).map((c) => c.file).join(', ');
    const md = ['# Musik und Geräusche: Quellen und Lizenzen', '', man.intro || '', ''].concat(man.sources.map((s) => [
      '## ' + s.title, '',
      '- Urheber: ' + s.author,
      '- Lizenz: ' + s.licence + (s.licenceUrl ? ' (' + s.licenceUrl + ')' : ''),
      s.composition ? '- Komposition: ' + s.composition : null,
      '- Originalseite: ' + s.url,
      '- Originaldatei: ' + s.file + (s.sha256 ? ' (SHA-256 ' + s.sha256 + ')' : ''),
      '- Lizenz auf der Originalseite geprüft am: ' + s.checked,
      '- Im Spiel: ' + s.use,
      '- Bearbeitung: ' + s.changes,
      '- Dateien im Spiel: ' + used(s.key), s.note ? '- Hinweis: ' + s.note : null, ''].filter((l) => l !== null).join('\n'))).concat(man.outro ? [man.outro, ''] : []).join('\n');
    fs.writeFileSync(path.join(__dirname, 'AUDIO-QUELLEN.md'), md);
  }
  audio = '<!-- Recordings for music, crowd and voices. Sources and licences: AUDIO-QUELLEN.md and the list in the park office. -->\n<script>window.RUMMEL_AUDIO = ' +
    JSON.stringify({ clips, credits }).replace(/</g, '\\u003c') + ';</script>\n';
}
// Every published version gets its own build mark, made from its date and the content of the whole game. When the game
// sees a mark it has not seen before, it deletes all saved parks of earlier versions, so every new version starts afresh.
const crypto = require('crypto');
// The animated logo of the title screen: assets/logo.gif is embedded exactly as it is (the original file, byte for byte),
// so the game stays one single file. Its size is read from the file, so the page keeps the logo's proportions.
let logoTag = '', logoHash = '';
if (fs.existsSync(path.join(__dirname, 'assets/logo.gif'))) {
  const buf = fs.readFileSync(path.join(__dirname, 'assets/logo.gif'));
  logoHash = crypto.createHash('sha256').update(buf).digest('hex');
  logoTag = '<img id="tt-logo" class="tt-logo" alt="Rummelinsel" width="' + buf.readUInt16LE(6) + '" height="' + buf.readUInt16LE(8) + '" draggable="false" src="data:image/gif;base64,' + buf.toString('base64') + '">';
}
const body = read('src/body.html').replace('<!--LOGO-->', () => logoTag);
// The mark holds the day, the time of the build and a hash of the content: a file that is issued again with the same
// content (after taking a change back, for instance) still counts as a new version and starts afresh.
const now = new Date().toISOString(), stamp = now.slice(0, 10), clock = now.slice(11, 16).replace(':', '');
const buildId = 'v' + stamp + '-' + clock + '-' + crypto.createHash('sha256').update(game + read('src/style.css') + read('src/body.html') + audio + logoHash).digest('hex').slice(0, 8);
const buildTag = '<script>window.RUMMEL_BUILD = ' + JSON.stringify(buildId) + ';</script>\n';
const head = '<title>Rummelinsel 3D</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n';
const style = '<style>\n' + read('src/style.css') + '</style>\n';
const script = '<script>\n(function () {\n' + game + '})();\n</script>\n';
if (online > -1) {
  const out = head + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bungee&family=Nunito:wght@700;800;900&display=swap">\n' + style +
    body.replace('<div id="app">', '<div id="app" lang="de">') +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n' + audio + buildTag + script;
  fs.writeFileSync(process.argv[online + 1], out);
} else {
  const out = '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + style +
    '<!-- Fonts Bungee and Nunito (SIL Open Font License 1.1), embedded so the page needs no network. -->\n<style>\n' + read('vendor/fonts.css') + '</style>\n</head>\n<body>\n' +
    body +
    '<!-- three.js r128 (MIT licence), embedded so the page needs no network. The game code follows in the last script block. -->\n<script>\n' + read('vendor/three.min.js') + '</script>\n' +
    audio + buildTag + script + '</body>\n</html>\n';
  fs.writeFileSync(path.join(outDir, 'index.html'), out);
  // dev.html: the same game with the developer panel switched on and its own save game
  console.log('build ' + buildId);
  fs.writeFileSync(path.join(outDir, 'dev.html'), out.replace('<title>Rummelinsel 3D</title>', '<title>Rummelinsel 3D Dev</title>').replace(script, () => '<script>window.RUMMEL_DEV = true;</script>\n' + script));
}
