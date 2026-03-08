import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the frontend's static data file
const DATA_FILE_PATH = path.join(__dirname, '..', 'frontend', 'public', 'data.json');

// Ensure the directory exists
if (!fs.existsSync(path.dirname(DATA_FILE_PATH))) {
    fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true });
}

// Zod schema for validation
const preserveDataSchema = z.object({
  feed: z.array(z.object({
    id: z.string(),
    category: z.enum(['OFFICIAL', 'FUNDING', 'LOCAL', 'SOCIAL']),
    date: z.string(),
    title: z.string(),
    summary: z.string(),
    source: z.string(),
    sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'])
  })),
  timeline: z.array(z.object({
    id: z.string(),
    year: z.string(),
    month: z.string().optional(),
    title: z.string(),
    description: z.string(),
    status: z.enum(['completed', 'in-progress', 'future'])
  })),
  neighborWatch: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    description: z.string()
  }))
});

// API Key Check
const API_KEY = process.env.GEMINI_API_KEY;

async function loadExistingData() {
    try {
        if (fs.existsSync(DATA_FILE_PATH)) {
            const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            return JSON.parse(rawData);
        }
    } catch (e) {
        console.log("No existing data found or error reading, starting fresh.");
    }
    
    // Default fallback
    return {
        feed: [],
        timeline: [
            { id: "t1", year: "2022", month: "Dec", title: "Acquisition", description: "387 acres protected.", status: "completed" },
            { id: "t2", year: "2023 - 2027", title: "Cleanup (Oil Remediation)", description: "Capping 300+ wells.", status: "in-progress" },
            { id: "t3", year: "2024 - 2026", title: "Restoration Planning", description: "Resource & Resilience plans.", status: "in-progress" },
            { id: "t4", year: "2027+", title: "Public Access Construction", description: "Trails and gateways.", status: "future" }
        ],
        neighborWatch: [
            { id: "nw1", type: "FIRE", title: "Fuel Modification", description: "Spring Clearance Scheduled: Late April" }
        ]
    };
}

async function generateUpdates(existingData) {
    console.log("Contacting Gemini for intelligence updates...");
    
    const prompt = `
    You are an AI generating intelligence updates for the Randall Preserve Watch static dashboard.
    Given the existing data, generate 1 new realistic intelligence feed item (news/update).
    Return ONLY a valid JSON object. Focus on generating a new item for the 'feed' array.
    Keep the existing timeline and neighborWatch items exactly the same, or add 1 if highly appropriate.
    Ensure dates are formatted nicely (e.g. 'March 8, 2026').

    CRITICAL INSTRUCTION: You MUST return a JSON object with this exact structure:
    {
      "feed": [
        {
          "id": "unique-string-id",
          "category": "OFFICIAL" | "FUNDING" | "LOCAL" | "SOCIAL",
          "date": "Month DD, YYYY",
          "title": "A short descriptive title",
          "summary": "A 2-3 sentence summary of the update.",
          "source": "Source Name (e.g. MRCA, local news)",
          "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED"
        }
      ],
      "timeline": [... existing timeline ...],
      "neighborWatch": [... existing neighborWatch ...]
    }

    Existing Data:
    ${JSON.stringify(existingData)}
    `;

    try {
        console.log("Sending request to Gemini API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        let newJsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Received response from Gemini.");
        
        if (!newJsonStr) {
            throw new Error("No text returned from Gemini.");
        }

        // Handle possible markdown wrapping if the LLM didn't respect being ONLY a JSON string
        if (newJsonStr.includes('```json')) {
            newJsonStr = newJsonStr.match(/```json\n([\s\S]*?)\n```/)[1];
        } else if (newJsonStr.includes('```')) {
             newJsonStr = newJsonStr.match(/```\n([\s\S]*?)\n```/)[1];
        }

        const newData = JSON.parse(newJsonStr);
        
        // Validate with Zod
        const validatedData = preserveDataSchema.parse(newData);
        return validatedData;

    } catch (error) {
        console.error("AI Generation or Validation failed:", error);
        throw error;
    }
}

async function updateGit() {
    if (!fs.existsSync(path.join(__dirname, '..', '.git'))) {
        console.log("Skipping git operations: Not a git repository.");
        return;
    }
    console.log("Committing and pushing changes to GitHub via simple-git...");
    const git = simpleGit(path.join(__dirname, '..'));

    try {
        await git.add(['frontend/public/data.json']);
        
        const status = await git.status();
        if (status.staged.length === 0) {
            console.log("No changes to commit.");
            return;
        }

        await git.commit(`Automated Intelligence Update: ${new Date().toISOString()}`);
        console.log("Committed successfully.");
        
    } catch (e) {
        console.error("Git automation failed:", e);
    }
}

async function main() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("WARNING: GEMINI_API_KEY is not set in generator/.env");
        }

        const data = await loadExistingData();
        
        // In a real environment, you'd fetch latest news or scrape here before passing to LLM
        // For demonstration, we just ask the LLM to invent a plausible update based on context
        const updatedData = process.env.GEMINI_API_KEY ? await generateUpdates(data) : data;

        // Save
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2));
        console.log(`Saved updated data to ${DATA_FILE_PATH}`);

        // Push
        await updateGit();
        
        console.log("Cron job finished successfully.");
    } catch (error) {
        console.error("Generator job failed:", error);
        process.exit(1);
    }
}

main();
