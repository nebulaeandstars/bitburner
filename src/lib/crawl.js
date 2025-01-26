export async function crawl(ns, root, fn, args, depth = 0, visited_servers = [],) {
  let out = await fn(ns, root, args, depth);
  visited_servers.push(root);

  let servers = ns.scan(root);
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];

    if (!visited_servers.includes(server)) {
      let result = await crawl(ns, server, fn, args, depth + 1, visited_servers);
      out += `${result}`;
    }
  }

  return out;
}
