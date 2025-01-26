import {crawl} from "/lib/crawl.js";

/** @param {NS} ns **/
export async function main(ns) {
  let files = await crawl(ns, "home", get_files);
  ns.tprint(`------------------------------\n${files}------------------------------\n`);
}

function get_files(ns, hostname) {
  let files = ns.ls(hostname);
  let files_str = "";

  for (let i = 0; i < files.length; i++) {
    if (include_filename(ns, files[i])) {
      files_str += `  ${files[i]}\n`;
    }
  }

  if (files_str != "") {
    var out = `${hostname}:\n${files_str}\n`;
  } else {
    var out = "";
  }

  return out;
}

function include_filename(ns, filename) {
  let hidden_filetypes = [".js", ".script"];
  let ext = filename.substring(filename.lastIndexOf("."))
  return !hidden_filetypes.includes(ext);
}
