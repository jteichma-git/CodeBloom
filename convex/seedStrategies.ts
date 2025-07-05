import { mutation } from "./_generated/server";

export const seedStrategies = mutation({
  args: {},
  handler: async (ctx) => {
    const strategies = [
      {
        title: "4-7-8 Breathing",
        description: "A breathing technique that promotes relaxation and reduces anxiety by regulating your nervous system.",
        instructions: "1. Sit comfortably with your back straight\n2. Exhale completely through your mouth\n3. Close your mouth and inhale through your nose for 4 counts\n4. Hold your breath for 7 counts\n5. Exhale through your mouth for 8 counts\n6. Repeat 3-4 times\n\nTip: If you feel dizzy, return to normal breathing and try again later.",
        researchSupport: "high" as const,
        categories: ["Calm", "Stress"],
        emotions: ["Anxious", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Systematically tense and release muscle groups to reduce physical tension and mental stress.",
        instructions: "1. Find a comfortable position lying down or sitting\n2. Start with your toes - tense them for 5 seconds, then release\n3. Move up to your calves - tense and release\n4. Continue with thighs, buttocks, abdomen, hands, arms, shoulders, neck, and face\n5. Hold each tension for 5 seconds, then release and notice the relaxation\n6. End by taking 3 deep breaths\n\nDuration: 10-15 minutes",
        researchSupport: "high" as const,
        categories: ["Calm", "Sleep", "Stress"],
        emotions: ["Tired", "Anxious", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Pomodoro Technique",
        description: "A time management method that breaks work into focused intervals with short breaks.",
        instructions: "1. Choose a task to focus on\n2. Set a timer for 25 minutes\n3. Work on the task with full focus - no distractions\n4. When the timer rings, take a 5-minute break\n5. After 4 pomodoros, take a longer 15-30 minute break\n\nBreak activities: stretch, hydrate, walk, or do breathing exercises",
        researchSupport: "high" as const,
        categories: ["Focus", "Stress"],
        emotions: ["Frazzled", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "5-4-3-2-1 Grounding",
        description: "A mindfulness technique that uses your senses to ground you in the present moment.",
        instructions: "When feeling anxious or overwhelmed, identify:\n\n5 things you can SEE\n4 things you can TOUCH\n3 things you can HEAR\n2 things you can SMELL\n1 thing you can TASTE\n\nName each item out loud or in your mind. Take your time with each sense.\n\nThis technique helps interrupt anxiety spirals and brings you back to the present.",
        researchSupport: "high" as const,
        categories: ["Calm", "Focus"],
        emotions: ["Anxious", "Overwhelmed", "Frazzled"],
        isActive: true,
      },
      {
        title: "Morning Sunlight Exposure",
        description: "Get natural light exposure within 2 hours of waking to regulate your circadian rhythm.",
        instructions: "1. Within 2 hours of waking, spend 10-30 minutes outside\n2. No sunglasses needed (but don't stare at the sun)\n3. If it's cloudy, stay out longer (up to 45 minutes)\n4. If you can't go outside, sit by a bright window\n5. Try to do this consistently every day\n\nBenefits: Better sleep, improved mood, increased energy, better focus",
        researchSupport: "high" as const,
        categories: ["Energy", "Sleep", "Mood"],
        emotions: ["Tired", "Sad"],
        isActive: true,
      },
      {
        title: "Cold Water Face Plunge",
        description: "Activate your body's natural alertness response by exposing your face to cold water.",
        instructions: "1. Fill a bowl with cold water (50-60°F/10-15°C)\n2. Take a deep breath and hold it\n3. Submerge your face from temples to chin for 30 seconds\n4. Alternatively, apply a cold, wet towel to your face\n5. Breathe normally when you lift your head\n\nThis activates the 'dive response' which increases alertness and focus.",
        researchSupport: "medium" as const,
        categories: ["Energy", "Focus"],
        emotions: ["Tired", "Restless"],
        isActive: true,
      },
      {
        title: "Gratitude Journaling",
        description: "Write down things you're grateful for to shift your mindset and improve mood.",
        instructions: "1. Set aside 5 minutes each day (morning or evening)\n2. Write down 3 specific things you're grateful for\n3. Be specific: instead of 'my family,' write 'my partner made me laugh at dinner'\n4. Include why you're grateful for each item\n5. Try to vary your entries each day\n\nMake it a habit by doing it at the same time each day.",
        researchSupport: "high" as const,
        categories: ["Mood", "Stress"],
        emotions: ["Sad", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Box Breathing",
        description: "A structured breathing pattern that calms the nervous system and improves focus.",
        instructions: "1. Sit comfortably with your feet on the floor\n2. Inhale through your nose for 4 counts\n3. Hold your breath for 4 counts\n4. Exhale through your mouth for 4 counts\n5. Hold empty lungs for 4 counts\n6. Repeat 4-8 times\n\nVisualize drawing a box with each breath phase. This is used by Navy SEALs for stress management.",
        researchSupport: "high" as const,
        categories: ["Calm", "Focus", "Stress"],
        emotions: ["Anxious", "Frazzled"],
        isActive: true,
      },
      {
        title: "Body Scan Meditation",
        description: "A mindfulness practice that increases body awareness and promotes relaxation.",
        instructions: "1. Lie down comfortably on your back\n2. Close your eyes and take 3 deep breaths\n3. Start at the top of your head, notice any sensations\n4. Slowly move your attention down through your body\n5. Notice each body part without trying to change anything\n6. If you find tension, breathe into that area\n7. Continue until you reach your toes\n\nDuration: 10-20 minutes",
        researchSupport: "high" as const,
        categories: ["Calm", "Sleep"],
        emotions: ["Tired", "Anxious"],
        isActive: true,
      },
      {
        title: "Single-Tasking Focus",
        description: "Deliberately focus on one task at a time to improve concentration and reduce stress.",
        instructions: "1. Choose one task to focus on\n2. Remove all distractions (phone, notifications, extra tabs)\n3. Set a specific time limit for the task\n4. Work on ONLY that task for the set time\n5. If other thoughts come up, write them down for later\n6. Take a short break when finished\n\nStart with 15-20 minute sessions and gradually increase.",
        researchSupport: "high" as const,
        categories: ["Focus", "Stress"],
        emotions: ["Frazzled", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Power Posing",
        description: "Use confident body language for 2 minutes to boost confidence and energy.",
        instructions: "1. Stand with feet shoulder-width apart\n2. Place hands on hips or raise arms in victory pose\n3. Lift your chin slightly and look forward\n4. Hold this position for 2 minutes\n5. Breathe deeply and feel the strength in your body\n6. Use before important meetings or when feeling low\n\nThis can increase confidence hormones and reduce stress hormones.",
        researchSupport: "medium" as const,
        categories: ["Energy", "Mood"],
        emotions: ["Tired", "Sad"],
        isActive: true,
      },
      {
        title: "Sleep Hygiene Routine",
        description: "Create a consistent pre-sleep routine to improve sleep quality and duration.",
        instructions: "1. Set a consistent bedtime and wake time\n2. 1 hour before bed: dim lights, avoid screens\n3. Keep bedroom cool (65-68°F), dark, and quiet\n4. Try calming activities: reading, gentle stretching, meditation\n5. Avoid caffeine 6 hours before bed\n6. If you can't fall asleep in 20 minutes, get up and do a quiet activity\n\nConsistency is key - stick to the routine even on weekends.",
        researchSupport: "high" as const,
        categories: ["Sleep", "Stress"],
        emotions: ["Tired", "Restless"],
        isActive: true,
      },
      {
        title: "Loving-Kindness Meditation",
        description: "Ancient Buddhist practice that cultivates goodwill and compassion toward yourself and others.",
        instructions: "1. Sit comfortably and close your eyes\n2. Begin with yourself: 'May I be happy, may I be healthy, may I be safe, may I live with ease'\n3. Bring to mind a loved one and repeat: 'May you be happy, may you be healthy, may you be safe, may you live with ease'\n4. Think of a neutral person and offer the same wishes\n5. Bring to mind someone difficult and extend the same compassion\n6. Finally, extend to all beings everywhere\n\nDuration: 10-20 minutes. Start with 5 minutes if new to the practice.",
        researchSupport: "high" as const,
        categories: ["Mood", "Calm", "Stress"],
        emotions: ["Sad", "Anxious", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Three Good Things",
        description: "Write down three positive events from your day and reflect on why they happened.",
        instructions: "1. At the end of each day, write down 3 things that went well\n2. For each event, answer: 'Why do you think this good thing happened?'\n3. Be specific - instead of 'had a good day,' write 'my colleague complimented my presentation'\n4. Include your role in making it happen\n5. Notice patterns in what brings you joy\n6. Keep this up for one week\n\nResearch shows this can boost happiness for up to 6 months.",
        researchSupport: "high" as const,
        categories: ["Mood", "Stress"],
        emotions: ["Sad", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Savoring Exercise",
        description: "Deliberately attend to and appreciate positive experiences to amplify their impact.",
        instructions: "1. Identify a recent positive experience (last 24-48 hours)\n2. Spend 15 minutes reflecting on it deeply\n3. Recall specific details: what you saw, heard, felt, smelled\n4. Focus on your emotions during the experience\n5. Think about what made it special\n6. Consider how it connects to your values or goals\n7. Savor the good feelings it brings up now\n\nDo this 3 times over the next week with different experiences.",
        researchSupport: "high" as const,
        categories: ["Mood", "Focus"],
        emotions: ["Sad", "Tired"],
        isActive: true,
      },
      {
        title: "Best Possible Self",
        description: "Visualize and write about your ideal future self to increase optimism and motivation.",
        instructions: "1. Imagine yourself 1 year from now, everything has gone as well as it possibly could\n2. Write for 15-20 minutes about this best possible version of yourself\n3. Be specific about your relationships, career, health, personal growth\n4. Focus on realistic but optimistic outcomes\n5. Describe how you feel in this future scenario\n6. What steps did 'future you' take to get there?\n7. Identify one small action you can take today toward this vision\n\nRepeat weekly for maximum benefit.",
        researchSupport: "high" as const,
        categories: ["Mood", "Energy"],
        emotions: ["Sad", "Tired"],
        isActive: true,
      },
      {
        title: "Character Strengths Spotting",
        description: "Identify and use your top character strengths in new ways to increase life satisfaction.",
        instructions: "1. Think about your top 3 personal strengths (e.g., creativity, kindness, perseverance)\n2. For the next week, use one strength in a completely new way each day\n3. Examples:\n   - Creativity: Try a new recipe or write a poem\n   - Kindness: Help a stranger or send an encouraging text\n   - Perseverance: Tackle a task you've been avoiding\n4. Notice how using your strengths makes you feel\n5. Reflect on the impact on others\n6. Keep a brief log of how you used each strength\n\nStrengths use is linked to higher wellbeing and life satisfaction.",
        researchSupport: "high" as const,
        categories: ["Mood", "Focus", "Energy"],
        emotions: ["Sad", "Tired"],
        isActive: true,
      },
      {
        title: "Acts of Kindness",
        description: "Perform multiple kind acts in one day to boost happiness and social connection.",
        instructions: "1. Choose one day to perform 5 acts of kindness\n2. Vary the types: some for strangers, some for loved ones\n3. Ideas: hold a door, give a compliment, buy coffee for someone, send a thank-you note\n4. Make them meaningful, not just automatic\n5. Notice the recipient's reaction\n6. Pay attention to how it makes you feel\n7. Reflect on the experience at day's end\n\nResearch shows doing several acts in one day is more effective than spreading them out.",
        researchSupport: "high" as const,
        categories: ["Mood", "Stress"],
        emotions: ["Sad", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Mindful Walking",
        description: "Walk slowly while paying full attention to each step and breath to ground yourself in the present.",
        instructions: "1. Find a quiet path 10-20 steps long (indoors or outdoors)\n2. Begin walking slower than normal\n3. Feel your feet making contact with the ground\n4. Notice the lifting, moving, and placing of each foot\n5. When you reach the end, pause and turn around mindfully\n6. If your mind wanders, gently return attention to your steps\n7. Coordinate with breathing: inhale for 2-3 steps, exhale for 2-3 steps\n\nDuration: 10-15 minutes. Can be done anywhere, anytime you need grounding.",
        researchSupport: "high" as const,
        categories: ["Calm", "Focus", "Energy"],
        emotions: ["Anxious", "Frazzled", "Restless"],
        isActive: true,
      },
      {
        title: "Two-Minute Rule",
        description: "If a task takes less than 2 minutes, do it immediately to reduce overwhelm and build momentum.",
        instructions: "1. When you notice a small task, ask: 'Can this be done in under 2 minutes?'\n2. If yes, do it right now instead of adding it to your to-do list\n3. Examples: respond to a text, file a document, wash a dish, make a quick call\n4. Don't overthink it - just start\n5. Notice how completing small tasks immediately affects your stress\n6. Use this rule throughout your day\n7. For larger tasks, break them into 2-minute chunks\n\nThis prevents small tasks from accumulating into overwhelming lists.",
        researchSupport: "medium" as const,
        categories: ["Focus", "Stress"],
        emotions: ["Overwhelmed", "Frazzled"],
        isActive: true,
      },
      {
        title: "Self-Compassion Break",
        description: "A three-step process to treat yourself with kindness during difficult moments.",
        instructions: "1. ACKNOWLEDGE: 'This is a moment of suffering' or 'This is difficult'\n2. NORMALIZE: 'Difficulty is part of life' or 'I'm not alone in this struggle'\n3. KINDNESS: Place hand on heart and say 'May I be kind to myself' or 'May I give myself what I need'\n\nUse this whenever you:\n- Make a mistake\n- Face criticism\n- Feel overwhelmed\n- Are hard on yourself\n\nSpeak to yourself as you would a good friend. Research shows self-compassion reduces anxiety and increases resilience.",
        researchSupport: "high" as const,
        categories: ["Calm", "Mood", "Stress"],
        emotions: ["Sad", "Anxious", "Overwhelmed"],
        isActive: true,
      },
      {
        title: "Physiological Sigh",
        description: "A specific breathing pattern that rapidly calms your nervous system using neuroscience research.",
        instructions: "1. Take a normal breath in through your nose\n2. When your lungs feel full, take a second, smaller inhale through your nose (double inhale)\n3. Make a long, slow exhale through your mouth\n4. The exhale should be longer than the total inhale time\n5. Repeat 1-3 times as needed\n6. Use anytime you feel stressed, anxious, or overwhelmed\n\nThis activates your parasympathetic nervous system more effectively than regular breathing. Developed by Stanford neuroscience research.",
        researchSupport: "high" as const,
        categories: ["Calm", "Focus", "Stress"],
        emotions: ["Anxious", "Frazzled", "Overwhelmed"],
        isActive: true,
      },
    ];

    // Check which strategies already exist
    const existingStrategies = await ctx.db.query("strategies").collect();
    const existingTitles = existingStrategies.map(s => s.title);
    
    // Filter to only new strategies
    const newStrategies = strategies.filter(s => !existingTitles.includes(s.title));
    
    if (newStrategies.length === 0) {
      console.log("All strategies already exist, skipping seed");
      return;
    }

    // Insert only new strategies
    for (const strategy of newStrategies) {
      await ctx.db.insert("strategies", strategy);
    }

    console.log(`Seeded ${newStrategies.length} new strategies. Total strategies: ${existingStrategies.length + newStrategies.length}`);
  },
});