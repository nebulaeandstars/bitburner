import { crawl } from "/lib/crawl.js";

/** @param {NS} ns **/
export async function main(ns) {
  if (ns.args[0] != undefined) {
    var root = ns.args[0];
  } else {
    var root = "home";
  }

  ns.tprint(await crawl(ns, root, get_server_info));
}

function get_server_info(ns, hostname, _args, depth) {
  let ram = ns.getServerMaxRam(hostname);
  let level = ns.getServerRequiredHackingLevel(hostname);
  let ports = ns.getServerNumPortsRequired(hostname);

  let indent = "| ".repeat(depth);
  let info = ` - ${ram}GB, lv${level}, ${ports} ports`;

  return `\n${indent}${hostname}${info}`;
}

export function autocomplete(data, args) {
  return [...data.servers]
}
