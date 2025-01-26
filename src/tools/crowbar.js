import {crawl} from "/lib/crawl.js";
import {access} from "/lib/access.js";

let accessed;
let servers;

/** @param {NS} ns */
export async function main(ns) {
  accessed = 0;
  servers = 0;

  await crawl(ns, "home", gain_access)

  ns.tprint(`accessed ${accessed} of ${servers} servers`);
}

function gain_access(ns, hostname) {
  accessed += access(ns, hostname);
  servers++;
}
