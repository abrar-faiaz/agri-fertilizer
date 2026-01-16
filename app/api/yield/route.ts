import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";

function getPythonPath(): string {
  const venvPython = path.join(process.cwd(), ".venv", "bin", "python");
  if (existsSync(venvPython)) {
    return venvPython;
  }
  return "python3";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scriptPath = path.join(process.cwd(), "scripts", "predict_yield.py");
    const pythonPath = getPythonPath();

    const result = await new Promise<string>((resolve, reject) => {
      const proc = spawn(pythonPath, [scriptPath], {
        cwd: process.cwd(),
      });

      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });

      proc.on("error", reject);

      proc.stdin.write(JSON.stringify(body));
      proc.stdin.end();
    });

    const data = JSON.parse(result.trim());
    return NextResponse.json({ prediction: data.prediction });
  } catch (error) {
    console.error("Yield prediction error:", error);
    return NextResponse.json(
      { error: "Failed to generate yield prediction." },
      { status: 500 }
    );
  }
}
