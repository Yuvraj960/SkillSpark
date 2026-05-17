require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const { Mentor } = require('../models/Mentor');
const Campaign = require('../models/Campaign');

const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  console.log('🌱 Clearing existing data...');
  await User.deleteMany({});
  await Project.deleteMany({});
  await Resource.deleteMany({});
  await Mentor.deleteMany({});
  await Campaign.deleteMany({});

  console.log('👤 Creating users...');

  // Create sparkies
  const sparky1 = await User.create({
    name: 'John Smith',
    email: 'john.smith@skillspark.com',
    password: 'password123',
    type: 'sparky',
    isOnboarded: true,
    aboutMe: 'Passionate senior frontend developer with 8+ years of experience building beautiful, performant web applications.',
    contactEmail: 'john.smith@skillspark.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    githubUrl: 'https://github.com',
    overallRating: 4.9,
    totalReviews: 48,
    sessionsCompleted: 24,
    totalEarnings: 480,
    credits: 50,
    skills: [
      { name: 'Advanced JavaScript', description: 'Master modern JS: ES6+, async/await, closures, prototypes', category: 'programming', sessionLength: 60, creditsPerSession: 20, isRemote: true, sessions: 12 },
      { name: 'React & Redux', description: 'Build scalable React apps with state management', category: 'programming', sessionLength: 60, creditsPerSession: 22, isRemote: true, sessions: 8 },
      { name: 'CSS Animations & Tailwind', description: 'Create stunning UI with modern CSS techniques', category: 'design', sessionLength: 45, creditsPerSession: 15, isRemote: true, sessions: 4 },
    ],
  });

  const sparky2 = await User.create({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@skillspark.com',
    password: 'password123',
    type: 'sparky',
    isOnboarded: true,
    aboutMe: 'UX/UI Designer with a passion for creating user-centered digital experiences. Former Google Design intern.',
    contactEmail: 'sarah.johnson@skillspark.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    portfolioUrl: 'https://example.com',
    overallRating: 5.0,
    totalReviews: 32,
    sessionsCompleted: 18,
    totalEarnings: 640,
    credits: 50,
    skills: [
      { name: 'Figma Design', description: 'Professional UI design with components and design systems', category: 'design', sessionLength: 60, creditsPerSession: 25, isRemote: true, sessions: 10 },
      { name: 'User Research', description: 'Conduct usability tests and create actionable insights', category: 'design', sessionLength: 90, creditsPerSession: 30, isRemote: true, sessions: 8 },
    ],
  });

  const sparky3 = await User.create({
    name: 'Michael Wilson',
    email: 'michael.wilson@skillspark.com',
    password: 'password123',
    type: 'sparky',
    isOnboarded: true,
    aboutMe: 'Full Stack Developer specializing in MERN stack. Love teaching complex backend concepts in simple ways.',
    contactEmail: 'michael.wilson@skillspark.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    githubUrl: 'https://github.com',
    overallRating: 4.8,
    totalReviews: 56,
    sessionsCompleted: 30,
    totalEarnings: 900,
    credits: 50,
    skills: [
      { name: 'Node.js & Express', description: 'Build production-ready REST APIs and middleware', category: 'programming', sessionLength: 60, creditsPerSession: 22, isRemote: true, sessions: 15 },
      { name: 'MongoDB & Mongoose', description: 'Database design, aggregation pipelines, and optimization', category: 'programming', sessionLength: 60, creditsPerSession: 20, isRemote: true, sessions: 10 },
      { name: 'Docker & DevOps', description: 'Containerize apps and set up CI/CD pipelines', category: 'programming', sessionLength: 90, creditsPerSession: 28, isRemote: true, sessions: 5 },
    ],
  });

  const sparky4 = await User.create({
    name: 'Emily Brown',
    email: 'emily.brown@skillspark.com',
    password: 'password123',
    type: 'sparky',
    isOnboarded: true,
    aboutMe: 'Digital Marketing Specialist with proven track record of growing brands online. SEO expert and content strategist.',
    contactEmail: 'emily.brown@skillspark.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    overallRating: 4.7,
    totalReviews: 29,
    sessionsCompleted: 15,
    totalEarnings: 300,
    credits: 50,
    skills: [
      { name: 'SEO Strategy', description: 'Rank on Google: technical SEO, link building, content optimization', category: 'marketing', sessionLength: 60, creditsPerSession: 18, isRemote: true, sessions: 8 },
      { name: 'Social Media Marketing', description: 'Build and grow your brand across social platforms', category: 'marketing', sessionLength: 60, creditsPerSession: 16, isRemote: true, sessions: 7 },
    ],
  });

  const sparky5 = await User.create({
    name: 'David Lee',
    email: 'david.lee@skillspark.com',
    password: 'password123',
    type: 'sparky',
    isOnboarded: true,
    aboutMe: 'Data Scientist and ML Engineer. PhD in Computer Science. Passionate about making AI accessible to everyone.',
    contactEmail: 'david.lee@skillspark.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    overallRating: 4.9,
    totalReviews: 37,
    sessionsCompleted: 20,
    totalEarnings: 800,
    credits: 50,
    skills: [
      { name: 'Python & Data Science', description: 'Pandas, NumPy, data visualization, and EDA', category: 'programming', sessionLength: 60, creditsPerSession: 25, isRemote: true, sessions: 12 },
      { name: 'Machine Learning', description: 'Build and train ML models with scikit-learn and TensorFlow', category: 'programming', sessionLength: 90, creditsPerSession: 35, isRemote: true, sessions: 8 },
    ],
  });

  // Create clients
  const client1 = await User.create({
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    password: 'password123',
    type: 'client',
    credits: 150,
    interests: ['Web Development', 'AI/ML', 'Entrepreneurship'],
  });

  const client2 = await User.create({
    name: 'Tech Innovators Inc',
    email: 'tech@innovators.com',
    password: 'password123',
    type: 'client',
    credits: 500,
    interests: ['React', 'Node.js', 'Mobile Development'],
  });

  console.log('📋 Creating projects...');
  await Project.create([
    {
      clientId: client2._id,
      clientName: 'Tech Innovators Inc',
      title: 'E-commerce Platform Development',
      description: 'We need a modern e-commerce platform with product listings, shopping cart, and Stripe payment integration. The platform should be mobile-first and blazing fast.',
      requirements: ['React', 'Node.js', 'Stripe Payment', 'MongoDB', 'Responsive Design'],
      budget: 250,
      deadline: new Date('2026-07-25'),
      status: 'open',
      bids: [
        {
          sparkyId: sparky3._id,
          sparkyName: 'Michael Wilson',
          sparkyAvatar: sparky3.avatarUrl,
          sparkyRating: 4.8,
          amount: 220,
          proposal: 'I can build this full-stack platform using React, Node.js, and MongoDB with Stripe integration. I have delivered 5+ similar projects.',
          estimatedDuration: '3 weeks',
          status: 'pending',
        },
      ],
    },
    {
      clientId: client1._id,
      clientName: 'Alex Thompson',
      title: 'Portfolio Website with Animations',
      description: 'I need a stunning personal portfolio website with smooth animations, dark mode, and a contact form. Should showcase projects beautifully.',
      requirements: ['React', 'Framer Motion', 'Tailwind CSS', 'EmailJS'],
      budget: 150,
      deadline: new Date('2026-06-15'),
      status: 'open',
      bids: [],
    },
    {
      clientId: client2._id,
      clientName: 'Tech Innovators Inc',
      title: 'Marketing Dashboard Analytics UI',
      description: 'Build a beautiful analytics dashboard to visualize our marketing KPIs. Needs charts, real-time updates, and CSV export functionality.',
      requirements: ['React', 'Chart.js', 'Data Visualization', 'REST API Integration'],
      budget: 200,
      deadline: new Date('2026-06-30'),
      status: 'open',
      bids: [],
    },
    {
      clientId: client1._id,
      clientName: 'Alex Thompson',
      title: 'Python Data Analysis Script',
      description: 'Need a Python script to analyze our sales data CSV files, generate weekly reports, and send automated email summaries.',
      requirements: ['Python', 'Pandas', 'Matplotlib', 'SMTP Email'],
      budget: 100,
      deadline: new Date('2026-06-10'),
      status: 'open',
      bids: [],
    },
  ]);

  console.log('📚 Creating resources...');
  await Resource.create([
    {
      title: 'Getting Started with React Hooks',
      type: 'article',
      category: 'Programming',
      author: 'John Smith',
      description: 'A comprehensive guide to understanding and using React Hooks in your projects.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&auto=format&fit=crop',
      readTime: 8,
      tags: ['React', 'JavaScript', 'Frontend'],
      isFeatured: true,
      content: '<p>React Hooks revolutionized how we write React components...</p>',
    },
    {
      title: 'UI Design Principles Everyone Should Know',
      type: 'article',
      category: 'Design',
      author: 'Sarah Johnson',
      description: 'Master the fundamental principles of great UI design that separate good from great.',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop',
      readTime: 12,
      tags: ['UI', 'Design', 'Figma'],
    },
    {
      title: 'JavaScript Fundamentals Masterclass',
      type: 'video',
      category: 'Programming',
      author: 'David Lee',
      description: 'Complete JavaScript fundamentals from variables to advanced async patterns.',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop',
      duration: 45,
      tags: ['JavaScript', 'Programming', 'Beginner'],
      isFeatured: true,
    },
    {
      title: 'SEO Secrets for 2025',
      type: 'article',
      category: 'Marketing',
      author: 'Emily Brown',
      description: 'Cutting-edge SEO strategies that actually work in the current Google algorithm landscape.',
      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&auto=format&fit=crop',
      readTime: 10,
      tags: ['SEO', 'Marketing', 'Google'],
    },
    {
      title: 'Build a REST API with Node.js',
      type: 'video',
      category: 'Programming',
      author: 'Michael Wilson',
      description: 'Learn to build a production-ready REST API with Node.js, Express, and MongoDB.',
      imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop',
      duration: 60,
      tags: ['Node.js', 'API', 'Backend'],
    },
    {
      title: 'Career Growth in Tech Industry',
      type: 'article',
      category: 'Career',
      author: 'Michael Wilson',
      description: 'Navigate your tech career with strategies from industry veterans.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop',
      readTime: 10,
      tags: ['Career', 'Growth', 'Tech'],
    },
    {
      title: 'Interactive CSS Grid Quiz',
      type: 'interactive',
      category: 'Programming',
      author: 'Sarah Johnson',
      description: 'Test your CSS Grid knowledge with this interactive quiz and exercises.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
      readTime: 15,
      tags: ['CSS', 'Grid', 'Interactive'],
      content: JSON.stringify([
        { question: 'Which property defines grid columns?', options: ['grid-columns', 'grid-template-columns', 'column-template', 'grid-cols'], answer: 1 },
        { question: 'What does "fr" unit stand for?', options: ['fraction', 'free', 'frame', 'full'], answer: 0 },
      ]),
    },
  ]);

  console.log('🎓 Creating mentors...');
  await Mentor.create([
    {
      name: 'Dr. Robert Chen',
      title: 'Tech Industry Expert & Executive Coach',
      bio: 'Former CTO at three Fortune 500 companies. Specialized in helping engineers transition into leadership roles.',
      experience: '15+ years in tech leadership',
      specialties: ['Career Development', 'Tech Leadership', 'Executive Coaching', 'Startup Strategy'],
      creditsPerSession: 30,
      availability: '2-3 days',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
      rating: 4.9,
      totalSessions: 150,
      tags: ['leadership', 'career', 'tech'],
    },
    {
      name: 'Prof. Maria Garcia',
      title: 'Computer Science Professor & Researcher',
      bio: 'PhD from MIT, 20+ years of academic experience. Expert in algorithms, data structures, and AI research.',
      experience: '20+ years in academia and AI research',
      specialties: ['Academic Guidance', 'Research Methodology', 'Algorithms', 'Computer Science'],
      creditsPerSession: 25,
      availability: '1-2 days',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      rating: 4.8,
      totalSessions: 200,
      tags: ['academic', 'research', 'algorithms'],
    },
    {
      name: 'James Wilson',
      title: 'Serial Entrepreneur & Startup Advisor',
      bio: 'Founded and exited 3 tech startups. Now helps founders navigate the early stage journey with practical advice.',
      experience: 'Founded 3 tech startups, $20M+ total exits',
      specialties: ['Entrepreneurship', 'Product Strategy', 'Fundraising', 'MVP Development'],
      creditsPerSession: 35,
      availability: '3-4 days',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
      rating: 4.9,
      totalSessions: 89,
      tags: ['startup', 'entrepreneurship', 'product'],
    },
  ]);

  console.log('💰 Creating fundraising campaigns...');
  await Campaign.create([
    {
      creatorId: sparky1._id,
      creatorName: 'John Smith',
      creatorType: 'sparky',
      title: 'Advanced Web Dev Course Creation',
      description: 'I\'m raising funds to create a comprehensive, free web development course covering React, Node.js, and deployment. Will be 40+ hours of content.',
      goal: 500,
      raised: 320,
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      category: 'education',
      backers: [{ userId: client1._id, amount: 50 }, { userId: client2._id, amount: 100 }],
    },
    {
      creatorId: sparky2._id,
      creatorName: 'Sarah Johnson',
      creatorType: 'sparky',
      title: 'Open Source Design System for Startups',
      description: 'Creating a comprehensive, free design system that small startups can use to build professional-looking products fast.',
      goal: 750,
      raised: 420,
      endsAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      category: 'design',
      backers: [{ userId: client1._id, amount: 100 }],
    },
  ]);

  console.log('✅ Seed data created successfully!');
  console.log('\n📧 Test credentials:');
  console.log('  Sparky: john.smith@skillspark.com / password123');
  console.log('  Client: alex.thompson@example.com / password123');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
