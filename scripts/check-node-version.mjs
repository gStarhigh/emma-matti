const [major, minor] = process.versions.node.split('.').map(Number);

const isSupported =
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 13) ||
  major > 22;

if (!isSupported) {
  console.error(
    `This project requires Node.js ^20.19.0 or >=22.13.0. Current version: ${process.version}.\n` +
      'Install a supported Node.js version, then run npm install and npm run dev again.'
  );
  process.exit(1);
}