let visited_servers = [];

/** @param {NS} ns **/
export async function main(ns) {
  let target = ns.args[0];
  let path = find_path(ns, target, "home", 0);

  ns.tprint(`\n------------------------------\n${path}\n------------------------------\n`);

  visited_servers = [];
}

function find_path(ns, target, root, depth) {
  visited_servers.push(root);

  let indent = " ".repeat(depth);
  let display_self = `${indent}${root}`;

  if (target == root) {
    return display_self;
  }

  let servers = ns.scan(root);
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];

    if (!visited_servers.includes(server)) {
      let result = find_path(ns, target, server, depth + 1);

      if (result != null) {
        return `${display_self}\n${result}`;
      }
    }
  }

  return null;
}

export function autocomplete(data) {
    return [...data.servers]
}
