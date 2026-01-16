import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
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
  let tempFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const model = String(formData.get("model") ?? "keras");

    if (!image) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = image.name.split(".").pop() ?? "jpg";
    tempFilePath = path.join(tmpdir(), `${randomUUID()}.${extension}`);

    await writeFile(tempFilePath, buffer);

    const scriptPath = path.join(process.cwd(), "scripts", "predict_disease.py");
    const pythonPath = getPythonPath();

    const result = await new Promise<string>((resolve, reject) => {
      const proc = spawn(pythonPath, [scriptPath, model, tempFilePath!], {
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
    });

    const data = JSON.parse(result.trim());
    return NextResponse.json(data);
  } catch (error) {
    console.error("Disease detection error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image." },
      { status: 500 }
    );
  } finally {
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => undefined);
    }
  }
}
