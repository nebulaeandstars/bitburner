/** @param {NS} ns **/
export function access(ns, hostname) {
  if (ns.hasRootAccess(hostname)) {
    return true;
  }

  try {
    ns.brutessh(hostname);
    ns.ftpcrack(hostname);
    ns.relaysmtp(hostname);
    ns.httpworm(hostname);
    ns.sqlinject(hostname);
    ns.nuke(hostname);
  } catch { }

  try {
    ns.nuke(hostname);
  } catch { }

  return ns.hasRootAccess(hostname)
}

export function can_access(ns, hostname) {
  let porthacks_required = ns.getServerNumPortsRequired(hostname);
  let root_access = ns.hasRootAccess(hostname);

  let can_hack = porthacks_installed(ns) >= porthacks_required;

  return root_access || can_hack;
}

export function porthacks_installed(ns) {
  let sum = 0;
  sum += ns.fileExists("BruteSSH.exe");
  sum += ns.fileExists("FTPCrack.exe");
  sum += ns.fileExists("relaySMTP.exe");
  sum += ns.fileExists("HTTPWorm.exe");
  sum += ns.fileExists("SQLInject.exe");
  return sum;
}

export async function main(ns) {
  access(ns, ns.args[0]);
}

export function autocomplete(data, args) {
  if (args.length == 1) {
    return [...data.servers]
  }
}
