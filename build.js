// Builds the game from src/ into one self-contained page.
//   node build.js            -> index.html (works offline: library and fonts are embedded)
//   node build.js --online F -> F, a copy without the document wrapper that loads the library and fonts from CDNs
const fs = require('fs'), path = require('path');
const read = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');
const jsDir = path.join(__dirname, 'src/js');
const game = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js')).sort().map((f) => read('src/js/' + f)).join('');
const online = process.argv.indexOf('--online');
const head = '<title>Rummelinsel 3D</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n';
const style = '<style>\n' + read('src/style.css') + '</style>\n';
const script = '<script>\n(function () {\n' + game + '})();\n</script>\n';
if (online > -1) {
  const out = head + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bungee&family=Nunito:wght@700;800;900&display=swap">\n' + style +
    read('src/body.html').replace('<div id="app">', '<div id="app" lang="de">') +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n' + script;
  fs.writeFileSync(process.argv[online + 1], out);
} else {
  const out = '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + style +
    '<!-- Fonts Bungee and Nunito (SIL Open Font License 1.1), embedded so the page needs no network. -->\n<style>\n' + read('vendor/fonts.css') + '</style>\n</head>\n<body>\n' +
    read('src/body.html') +
    '<!-- three.js r128 (MIT licence), embedded so the page needs no network. The game code follows in the next script block. -->\n<script>\n' + read('vendor/three.min.js') + '</script>\n' +
    script + '</body>\n</html>\n';
  fs.writeFileSync(path.join(__dirname, 'index.html'), out);
}
