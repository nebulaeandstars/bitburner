/** @param {NS} ns */
export function serverlist(ns, root = "home", visited_servers = []) {
  visited_servers.push(root);

  let servers = ns.scan(root);
  for (let i = 0; i < servers.length; i++) {
    if (!visited_servers.includes(servers[i])) {
      visited_servers = serverlist(ns, servers[i], visited_servers);
    }
  }

  return visited_servers;
}

export function server_is_player_owned(server_name) {
  return server_name == "home" || server_name.startsWith("server");
}

export function server_is_potential_target(server_name) {
  return !server_is_player_owned(server_name);
}

/** @param {NS} ns */
export function server_info(ns, server_name) {
  return {
    "name": server_name,
    "money": ns.getServerMoneyAvailable(server_name),
    "maxMoney": ns.getServerMaxMoney(server_name),
    "securityLevel": ns.getServerSecurityLevel(server_name),
    "minSecurityLevel": ns.getServerMinSecurityLevel(server_name),
  };
}

/** @param {NS} ns */
export function detailed_server_info(ns, server_name, player) {
  return {
    "name": server_name,
    "money": ns.getServerMoneyAvailable(server_name),
    "maxMoney": ns.getServerMaxMoney(server_name),
    "securityLevel": ns.getServerSecurityLevel(server_name),
    "minSecurityLevel": ns.getServerMinSecurityLevel(server_name),
    "hackChance": ns.formulas.hacking.hackChance(server_name, player),
  };
}
