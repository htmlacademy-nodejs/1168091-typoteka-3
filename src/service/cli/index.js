import generate from "./generate.js";
import help from "./help.js";
import version from "./version.js";
import server from "./server.js";
import fill from "./fill.js";

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill
};

export default Cli;
