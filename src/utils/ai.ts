import { GoogleGenAI } from '@google/genai';

// Offline Emergency Knowledge Base Fallback
const SAFETY_KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['purify', 'water', 'drink', 'clean', 'chlorine', 'boil', 'aquatabs', 'filter'],
    answer: `🚰 EMERGENCY WATER PURIFICATION PROTOCOL:
1. Settle & Filter: If water is cloudy, let silt settle for 30 minutes, then pour clear top water through clean cloth or coffee filter.
2. Boiling (Best Method): Bring water to a vigorous rolling boil for at least 3 full minutes. Let it cool naturally.
3. Aquatabs / Chlorine: Add 1 tablet per 20 Liters of clear water. Stir vigorously and wait 30 minutes before drinking.
4. Household Bleach (Plain Unscented 5% Sodium Hypochlorite): Add 4 drops per 1 Liter of clear water (or 8 drops if cloudy). Mix and wait 30 minutes. It should have a faint chlorine scent.
5. SODIS (Solar): Fill clear plastic bottles, shake, and place on a corrugated roof in bright sunlight for 6 hours minimum.`,
  },
  {
    keywords: ['trapped', 'rising', 'house', 'roof', 'stuck', 'window', 'escape', 'room'],
    answer: `⚠️ IMMEDIATE FLOOD SURVIVAL INSTRUCTIONS:
1. Move to the highest level or roof immediately. Do NOT hide in an enclosed attic without a direct roof hatch, as water can trap you against the ceiling.
2. Turn off the main electrical breaker and gas valve BEFORE water reaches them. If water is already touching sockets, DO NOT touch any electrical panels.
3. Take your emergency Go-Bag, phone, power bank, whistle, and warm clothing.
4. Signal for rescue: Wave bright colored cloth, flash a torch in pulses of 3 (SOS), or use the Macho Audio Beacon.
5. Stay visible to airborne rescue drones and helicopters.`,
  },
  {
    keywords: ['snake', 'bite', 'venom', 'spider', 'scorpion'],
    answer: `🐍 FLOOD SNAKEBITE EMERGENCY FIRST AID:
1. Stay Calm & Still: Movement accelerates venom circulation through the lymphatic system.
2. DO NOT cut the wound, suck out venom, apply ice, or use a tight tourniquet.
3. Pressure Immobilization: Wrap a wide bandage firmly over the bite and up the limb (like for a sprained ankle), but keep pulse detectable.
4. Splint the limb to prevent bending. Keep the bitten area at or slightly below heart level.
5. Note the snake's color/shape without trying to capture it. Evacuate immediately to a medical shelter with anti-venom (e.g., Red Cross Hub).`,
  },
  {
    keywords: ['walk', 'car', 'drive', 'cross', 'current', 'wade'],
    answer: `🚫 FLOODWATER CROSSING DANGERS:
• 15 cm (6 inches) of moving water will knock down a healthy adult.
• 30 cm (12 inches) will sweep away passenger cars and sedans.
• 60 cm (24 inches) will float SUVs, trucks, and 4x4s.
• Turn Around, Don't Drown! Submerged roadbeds may have washed away into deep sinkholes.
• Hidden hazards include open manholes, electrocution from downed live wires, and sharp metal debris.`,
  },
  {
    keywords: ['cholera', 'diarrhea', 'vomit', 'illness', 'disease', 'fever', 'hygiene'],
    answer: `🩺 CHOLERA & POST-FLOOD EPIDEMIC PREVENTION:
1. Oral Rehydration Solution (ORS): Dissolve 1 ORS sachet in 1L of boiled water. If unavailable, mix 6 level teaspoons of sugar + 1/2 level teaspoon of salt in 1L clean water.
2. Hygiene: Wash hands thoroughly with soap or wood ash before eating and after handling waste.
3. Food: Eat only freshly cooked, steaming hot meals. Avoid raw peeled fruits or salads washed in unboiled water.
4. Report any sudden watery diarrhea immediately to Red Cross or local health post.`,
  },
  {
    keywords: ['helicopter', 'signal', 'rescue', 'beacon', 'air', 'mirror'],
    answer: `🚁 SIGNALING SEARCH & RESCUE AIRCRAFT:
1. High Contrast Marker: Lay a large X on the roof or clearing using brightly colored tarps, sheets, or contrasting rocks.
2. Ground-to-Air Signals:
   - Wave both arms up and down: "Need immediate rescue!"
   - Stand with arms in 'Y' shape: "Yes / Safe to land here."
3. Light Signals: Flash mirrors or phone flashlights toward the aircraft cockpit in bursts of 3.
4. Smoke: In daylight, green vegetation produces thick white smoke; rubber produces black smoke.`,
  },
];

export async function querySafetyAssistant(prompt: string, contextSummary?: string): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return 'Please ask a specific flood safety, medical, or evacuation question.';

  // Attempt Gemini API if key is available
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (window as any).__GEMINI_API_KEY__;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are the AI Disaster Safety Specialist for Macho, an emergency flood mitigation and disaster relief network for East Africa (Kenya, Tanzania, Uganda, Ethiopia).
Respond with concise, actionable, high-priority emergency advice. Use bullet points and emergency emojis. Keep instructions clear for high-stress situations.
Local Context: ${contextSummary || 'East African flood response network'}
User Query: ${cleanPrompt}`,
              },
            ],
          },
        ],
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call fell back to emergency knowledge base:', err);
    }
  }

  // Smart Offline Knowledge Base Matcher
  const lower = cleanPrompt.toLowerCase();
  for (const item of SAFETY_KNOWLEDGE_BASE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.answer;
    }
  }

  return `🛡️ GENERAL FLOOD RESCUE & SURVIVAL PROTOCOL:
• Seek highest elevation immediately: Move to permanent multi-story structures, high ground shelters, or designated county arenas.
• Disconnect Utilities: Shut off electricity at the main board and seal cooking gas cylinders.
• Do not touch floodwater directly: Treat all floodwater as contaminated with sewage, chemicals, and biohazards.
• Purify drinking water: Boil for 3+ minutes or treat with 1 Aquatab per 20L.
• Keep emergency communication open: Use Macho Offline Mesh and broadcast your GPS coordinates to responders.`;
}
