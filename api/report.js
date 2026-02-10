import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const report = req.body;
    const filePath = path.join(process.cwd(), "reports.json");

    let reports = [];
    try {
      reports = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {}

    reports.push({
      ...report,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2));

    return res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
