async function loadScripts(prefix, infixes, suffix) {
  const scripts = {};
  const promises = [];
  // TODO: error handling for failed loads
  for (let infix of infixes)
    promises.push(
      fetch(prefix + infix + suffix)
        .then((r) => r.text())
        .then((scriptText) => (scripts[infix] = scriptText))
    );
  await Promise.all(promises);
  return scripts;
}

async function loadGeometry(url) {
  return await fetch(url).then((r) => r.json());
}
