/// Scrapes all servers to retrieve a specific file

let visited_servers;

/** @param {NS} ns **/
export async function main(ns) {
  visited_servers = [];

  let target = ns.args[0];
  let rename = target;

  if (ns.args[1] != null) {
    rename = ns.args[1];
  }

  await get_file(ns, target, rename, "home");
}

async function get_file(ns, filename, rename, hostname) {
  visited_servers.push(hostname);

  let files = ns.ls(hostname);
  if (files.includes(filename)) {
    await ns.scp(filename, hostname, "home");
    ns.tprint(`copied ${filename} from ${hostname}`);
    ns.exit(0);
  }

  let servers = ns.scan(hostname);
  for (let i = 0; i < servers.length; i++) {
    if (!visited_servers.includes(servers[i])) {
      await get_file(ns, filename, rename, servers[i])
    }
  }
}
