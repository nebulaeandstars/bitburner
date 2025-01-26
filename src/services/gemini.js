import { crawl } from "../lib/crawl.js";

const HACK_SCRIPT = "/bin/autohack.js";

/** @param {NS} ns */
export async function main(ns) {
  let targets = ns.args;
  let servers = ns.getPurchasedServers();
  servers.push("home");

  await crawl(ns, "home", start_script, targets);
}

async function start_script(ns, server, targets) {
  ns.scriptKill(HACK_SCRIPT, server);
  await ns.scp([HACK_SCRIPT], server);

  let num_targets = targets.length
  let ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  let ram_cost = ns.getScriptRam(HACK_SCRIPT)
  while (ram_cost > ram / num_targets) {
    num_targets -= 1;
  }
  let ram_per_target = ram / num_targets;
  let threads_per_script = Math.max(Math.floor(ram_per_target / ram_cost), 1);

  for (let i = 0; i < num_targets; i++) {
    let target = targets[i];
    let money = ns.getServerMoneyAvailable(target);
    let ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);

    if ((money > 0) && (ram > ram_cost * threads_per_script)) {
      ns.exec(HACK_SCRIPT, server, threads_per_script, target);
    }
  }
}

export function autocomplete(data, args) {
  return [...data.servers]
}
