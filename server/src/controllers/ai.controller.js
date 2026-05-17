const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGemini = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// @desc    Get AI skill suggestions for a user
// @route   POST /api/ai/skill-suggestions
// @access  Private
const getSkillSuggestions = async (req, res) => {
  try {
    const genAI = getGemini();
    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured. Please add your Gemini API key.',
      });
    }

    const { currentSkills, interests, goals } = req.body;

    const prompt = `You are an AI career advisor for SkillSpark, a skill-sharing platform.
    
User profile:
- Current skills: ${currentSkills?.join(', ') || 'None specified'}
- Interests: ${interests?.join(', ') || 'Not specified'}
- Goals: ${goals || 'Not specified'}

Based on this profile, suggest 5 specific skills this person should learn or teach next.
For each skill, provide:
1. Skill name
2. Why it's relevant (1 sentence)
3. Potential credits they could earn per session (10-50)
4. Difficulty level (Beginner/Intermediate/Advanced)

Return as a JSON array with objects: { name, reason, creditsPerSession, difficulty }
Only return the JSON array, no markdown, no explanation.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let suggestions;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleanJson);
    } catch {
      suggestions = [
        { name: 'React Development', reason: 'High demand in the job market', creditsPerSession: 20, difficulty: 'Intermediate' },
        { name: 'Python Programming', reason: 'Versatile language for AI and web', creditsPerSession: 18, difficulty: 'Beginner' },
        { name: 'UI/UX Design', reason: 'Growing field with many opportunities', creditsPerSession: 22, difficulty: 'Intermediate' },
      ];
    }

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI project matching for a sparky
// @route   POST /api/ai/project-match
// @access  Private (sparky only)
const getProjectMatches = async (req, res) => {
  try {
    const genAI = getGemini();
    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured.',
      });
    }

    const { skills, projects } = req.body;

    const prompt = `You are an AI matching engine for SkillSpark.

Sparky's skills: ${skills?.map(s => s.name).join(', ') || 'None'}

Available projects: ${JSON.stringify(projects?.slice(0, 10) || [])}

Analyze the match between the sparky's skills and each project.
Return a JSON array of objects: { projectId, matchScore (0-100), matchReason (1 sentence), suggestedBidAmount }
Only return the JSON array, no markdown.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let matches;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      matches = JSON.parse(cleanJson);
    } catch {
      matches = projects?.map(p => ({
        projectId: p._id,
        matchScore: Math.floor(Math.random() * 40) + 60,
        matchReason: 'Your skills align with this project requirements.',
        suggestedBidAmount: p.budget - 10,
      })) || [];
    }

    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI-generated bio for sparky onboarding
// @route   POST /api/ai/generate-bio
// @access  Private
const generateBio = async (req, res) => {
  try {
    const genAI = getGemini();
    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured.',
      });
    }

    const { skills, experience, tone } = req.body;

    const prompt = `Write a professional bio for a SkillSpark tutor/freelancer profile.
Skills: ${skills || 'programming, web development'}
Experience: ${experience || 'a few years of experience'}
Tone: ${tone || 'professional but friendly'}

Write 2-3 sentences that would attract clients. Make it engaging and personal.
Only return the bio text, no extra explanation.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const bio = result.response.text().trim();

    res.json({ success: true, bio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI learning path recommendations
// @route   POST /api/ai/learning-path
// @access  Private
const getLearningPath = async (req, res) => {
  try {
    const genAI = getGemini();
    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured.',
      });
    }

    const { goal, currentLevel, timeAvailable } = req.body;

    const prompt = `Create a personalized learning path for someone on SkillSpark.
Goal: ${goal || 'Become a full-stack developer'}
Current level: ${currentLevel || 'Beginner'}
Time available: ${timeAvailable || '10 hours per week'}

Create a 4-step learning path. For each step provide:
- stepNumber (1-4)
- title
- description (1-2 sentences)
- estimatedDuration (e.g., "2 weeks")
- resources (array of 2-3 skill/topic names to search on SkillSpark)

Return only a JSON array. No markdown.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let learningPath;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      learningPath = JSON.parse(cleanJson);
    } catch {
      learningPath = [
        { stepNumber: 1, title: 'Foundations', description: 'Build the basics.', estimatedDuration: '2 weeks', resources: ['HTML', 'CSS', 'JavaScript'] },
        { stepNumber: 2, title: 'Core Skills', description: 'Develop core competency.', estimatedDuration: '3 weeks', resources: ['React', 'Node.js'] },
      ];
    }

    res.json({ success: true, learningPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkillSuggestions, getProjectMatches, generateBio, getLearningPath };
