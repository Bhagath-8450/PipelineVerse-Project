
import "dotenv/config";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.log("ERROR: GitHub token is missing.");
  process.exit(1);
}

const response = await fetch("https://api.github.com/user", {
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  }
});

const data = await response.json();

console.log("HTTP Status:", response.status);

if (response.ok) {
  console.log("Authenticated GitHub account:", data.login);
} else {
  console.log("GitHub error:", data.message);
}
