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
    ];

    // Check if strategies already exist
    const existingStrategies = await ctx.db.query("strategies").collect();
    if (existingStrategies.length > 0) {
      console.log("Strategies already exist, skipping seed");
      return;
    }

    // Insert all strategies
    for (const strategy of strategies) {
      await ctx.db.insert("strategies", strategy);
    }

    console.log(`Seeded ${strategies.length} strategies`);
  },
});