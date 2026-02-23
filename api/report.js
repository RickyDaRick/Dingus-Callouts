export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, issue, quality, map } = req.body;

  if (!username || !issue || !quality || !map) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = `reports/report-${timestamp}.txt`;

  const content = `
Callout: ${username}
Map: ${map}
Quality: ${quality}
Issue: ${issue}
Timestamp: ${new Date().toISOString()}
  `.trim();

  const body = {
    message: `New report from ${username} at ${timestamp}`,
    content: Buffer.from(content).toString("base64"),
    branch: "main",
  };
  try {
    const token = process.env.GITHUB_REPORTER;

    const response = await fetch(
      `https://api.github.com/repos/RickyDaRick/Dingus-Callouts/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("GitHub API error:", text);
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Failed to send report:", err);
    return res.status(500).json({ error: err.message });
  }
}
