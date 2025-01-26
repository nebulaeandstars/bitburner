let visited_servers = [];

/** @param {NS} ns **/
export function path(ns, target) {
  let path = find_path(ns, target, "home", 0);

  visited_servers = [];
  return path;
}

function find_path(ns, target, root, depth) {
  visited_servers.push(root);

  if (target == root) {
    return [root];
  }

  let servers = ns.scan(root);
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];

    if (!visited_servers.includes(server)) {
      let result = find_path(ns, target, server, depth + 1);

      if (result != null) {
        return [root].concat(result);
      }
    }
  }

  return null;
}

export function autocomplete(data) {
    return [...data.servers]
}
