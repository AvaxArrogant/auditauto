const fs = require("fs");
const { execSync } = require("child_process");

const env = fs.readFileSync(".env.example", "utf8");
const lines = env.split("\n").filter((line) => line.trim() && !line.startsWith("#"));

for (const line of lines) {
  const [key, ...rest] = line.split("=");
  const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  try {
    console.log(`Setting ${key}`);
    execSync(`npx netlify env:set ${key} "${value}"`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Failed to set ${key}: ${err.message}`);
  }
}
