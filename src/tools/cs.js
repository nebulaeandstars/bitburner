import { path as find_path } from "/lib/path.js";

/** @param {NS} ns **/
export async function main(ns) {
  let target = ns.args[0];

  let command = "home;";
  let path = find_path(ns, target).slice(1);
  path.forEach((server) => {
    command += ` connect ${server};`;
  })

  const doc = eval("document");
  const terminal_input = doc.getElementById("terminal-input");
  terminal_input.value = command;

  const handler = Object.keys(terminal_input)[1];
  terminal_input[handler].onChange({ target: terminal_input });
  terminal_input[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
}

export function autocomplete(data) {
  return [...data.servers]
}
