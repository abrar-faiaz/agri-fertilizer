import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";

export const runtime = "nodejs";

// Check if running on Vercel (production)
const isVercel = process.env.VERCEL === "1";

function getPythonPath(): string {
  const venvPython = path.join(process.cwd(), ".venv", "bin", "python");
  if (existsSync(venvPython)) {
    return venvPython;
  }
  return "python3";
}

// Call the Python serverless function on Vercel
async function callPythonServerless(imageBase64: string, model: string): Promise<unknown> {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const response = await fetch(`${baseUrl}/api/disease-python`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      model: model,
    }),
  });

  if (!response.ok) {
    throw new Error(`Python function failed: ${response.status}`);
  }

  return response.json();
}

// Run locally with Python spawn
async function runLocalPython(tempFilePath: string, model: string): Promise<unknown> {
  const scriptPath = path.join(process.cwd(), "scripts", "predict_disease.py");
  const pythonPath = getPythonPath();

  const result = await new Promise<string>((resolve, reject) => {
    const proc = spawn(pythonPath, [scriptPath, model, tempFilePath], {
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

  return JSON.parse(result.trim());
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
    
    let data: unknown;

    if (isVercel) {
      // On Vercel: call the Python serverless function with base64 image
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
      data = await callPythonServerless(base64Image, model);
    } else {
      // Local development: use spawn
      const extension = image.name.split(".").pop() ?? "jpg";
      tempFilePath = path.join(tmpdir(), `${randomUUID()}.${extension}`);
      await writeFile(tempFilePath, buffer);
      data = await runLocalPython(tempFilePath, model);
    }

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
