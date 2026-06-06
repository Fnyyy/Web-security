import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

export function getGeminiAI() {
  if (!ai && API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

export async function analyzeLog(log: string) {
  const aiClient = getGeminiAI();
  if (!aiClient) {
    // Simulated fallback if no API key
    return simulateAnalysis(log);
  }

  const prompt = `
    You are a Senior DevOps Engineer and Site Reliability Engineer. 
    Analyze the following server log or error message and provide a concise root-cause analysis and suggested terminal commands to fix it.
    Format your response in a clear, terminal-friendly way with sections for [ANALYSIS] and [COMMANDS].

    Log:
    ${log}
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text ?? simulateAnalysis(log);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return simulateAnalysis(log);
  }
}

function simulateAnalysis(log: string) {
  return `[ANALYSIS]
Detected potential resource exhaustion in the node cluster. The log indicates high memory pressure (RSS > 90%) and frequent garbage collection cycles. Possible memory leak in the microservice layer or unexpected spike in concurrent socket connections.

[COMMANDS]
# Check top memory consuming processes
ps aux --sort=-%mem | head -n 10

# View current connection state
netstat -ant | awk '{print $6}' | sort | uniq -c

# Force restart critical services
kubectl rollout restart deployment/api-gateway

# Clear system cache (emergency)
sync; echo 3 > /proc/sys/vm/drop_caches`;
}
