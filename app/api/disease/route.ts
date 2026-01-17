import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";

export const runtime = "nodejs";

// Check if running on Vercel at runtime
function isRunningOnVercel(): boolean {
  return !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL);
}

// Check if Python is available locally
function canRunPythonLocally(): boolean {
  try {
    const venvPython = path.join(process.cwd(), ".venv", "bin", "python");
    if (existsSync(venvPython)) {
      return true;
    }
    // Check if python3 exists by checking common paths
    const commonPaths = ["/usr/bin/python3", "/usr/local/bin/python3"];
    return commonPaths.some(p => existsSync(p));
  } catch {
    return false;
  }
}

function getPythonPath(): string {
  const venvPython = path.join(process.cwd(), ".venv", "bin", "python");
  if (existsSync(venvPython)) {
    return venvPython;
  }
  return "python3";
}

// Call the Python serverless function on Vercel
async function callPythonServerless(imageBase64: string, model: string, requestUrl: string): Promise<unknown> {
  // Build the URL for the Python serverless function
  const url = new URL(requestUrl);
  const baseUrl = `${url.protocol}//${url.host}`;
  
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
    const errorText = await response.text();
    throw new Error(`Python function failed: ${response.status} - ${errorText}`);
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
  
  // Determine execution mode at runtime
  const onVercel = isRunningOnVercel();
  const canUsePython = canRunPythonLocally();
  const useServerlessFunction = onVercel || !canUsePython;

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

    if (useServerlessFunction) {
      // On Vercel or no local Python: call the Python serverless function
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
      data = await callPythonServerless(base64Image, model, request.url);
    } else {
      // Local development with Python available: use spawn
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
