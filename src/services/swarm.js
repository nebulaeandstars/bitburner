import {crawl} from "/lib/crawl.js";
import {access} from "/lib/access.js";

let out;

let server_count;
let worker_count;
let process_count;
let thread_count;

let script;
let ram_required;
let targets;

function init(ns) {
  ns.disableLog("ALL");

  out = [];

  worker_count = 0;
  server_count = 0;
  process_count = 0;
  thread_count = 0;

  script = ns.args[0];
  if (script[0] != "/") {
    script = `/${script}`
  }

  targets = ns.args.slice(1);
  ram_required = ns.getScriptRam(script, "home");
}

/** @param {NS} ns **/
export async function main(ns) {
  init(ns);

  await crawl(ns, "home", start_attack);

  out.push("----------------------------------");
  out.push(`script: ${script}`);
  out.push(`ram required: ${ram_required}`);
  out.push(`targets: ${targets.length}`);
  out.push("----------------------------------");
  out.push(`visited ${server_count} servers; found ${worker_count} viable workers;`);
  out.push(`created ${process_count} processes, using ${thread_count} total threads.`);
  out.push("----------------------------------");

  ns.tprint(`\n${out.join("\n")}`);
}

async function start_attack(ns, hostname) {
  if (access(ns, hostname)) {
    await start_script(ns, hostname);
  }
  else {
    out.push(`couldn't gain access to ${hostname}`);
  }
}

async function start_script(ns, hostname) {
    server_count++;
    ns.scriptKill(script, hostname)

    let max_ram = ns.getServerMaxRam(hostname);
    let used_ram = ns.getServerUsedRam(hostname);
    let free_ram = max_ram - used_ram;
    let num_threads = parseInt(free_ram / ram_required / targets.length);

    if (num_threads > 0) {
      worker_count++;
      await ns.scp(script, "home", hostname);

      for (let i = 0; i < targets.length; i++) {
        let pid = ns.exec(script, hostname, num_threads, targets[i]);

        if (pid != 0) {
          process_count++;
          thread_count += num_threads;
        }
      }
    }
}

export function autocomplete(data, args) {
  if (args.length == 1) {
    return [...data.scripts];
  }
  else if (args.length >= 2) {
    return [...data.servers]
  }
}
