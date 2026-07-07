import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';
import mammoth from 'mammoth';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';


dotenv.config({ path: path.resolve(process.cwd(), 'GEMINI_API_KEY.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());


const evaluationSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  overall_score: z.number().min(0).max(100),
  matched_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  experience_summary: z.string(),
  red_flags: z.array(z.string()),
  recommendation: z.enum(['strong_fit', 'moderate_fit', 'weak_fit']),
});

function cleanJsonResponse(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function evaluate(cvText, jobDescriptionText) {
  const interaction = await ai.interactions.create({
    model: "gemini-2.5-flash",
   response_format: {
      type: "text",
      mime_type: "application/json",
    },
    input: `You are a technical recruiter assistant. Given a CV and a job description, evaluate fit.

Return ONLY valid JSON matching this schema:
{
  "name": string,
  "phone": string,
  "email": string,
  "overall_score": number (0-100),
  "matched_skills": string[],
  "missing_skills": string[],
  "experience_summary": string,
  "red_flags": string[],
  "recommendation": "strong_fit" | "moderate_fit" | "weak_fit"}
Job Description:${jobDescriptionText} CV:${cvText}`,
  });
  const answer = cleanJsonResponse(interaction.output_text);
  console.log(answer);
  const parsedJson = JSON.parse(answer);
  const validated = evaluationSchema.parse(parsedJson);
  const jsonString = JSON.stringify(validated, null, 2);

fs.writeFile('output.json', jsonString, 'utf8', (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("Success: Output saved as output.json");
  }
  
});
return validated;
}

app.post('/api/evaluate', async (req, res) => {
  try {
    const { cvText, jobDescriptionText } = req.body;
    if (!cvText || !jobDescriptionText) {
      return res.status(400).json({ error: 'Missing cvText or jobDescription' });
    }
    const evaluation = await evaluate(cvText, jobDescriptionText);
    console.log('Evaluation before sending:', evaluation);
    res.json({ evaluation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

app.listen(3000, () => console.log('Server running'));
