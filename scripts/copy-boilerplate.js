const { mkdir, copyFile, readFile, writeFile } = require('fs').promises;
const { version } = require('../package.json');

const dirs = ['sherfire', 'ng-sherfire'];

dirs.forEach(async dir => {
    const from = `src/${dir}`;
    const to = `dist/${dir}`;

    await mkdir(to, { recursive: true });
    await Promise.all([
        copyFile(`LICENSE`, `${to}/LICENSE`),
        copyFile(`${from}/README.md`, `${to}/README.md`),
        readFile(`${from}/package.json`, { encoding: 'utf8' })
            .then(f => f
                .replace('"private": true', '"private": false')
                .replace(/0\.0\.0-PLACEHOLDER/g, version),
            )
            .then(f => writeFile(`${to}/package.json`, f)),
    ]);
});
