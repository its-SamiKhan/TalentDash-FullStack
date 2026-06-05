'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companySlug: string;
  logoUrl: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Internship';
  experience: 'Entry (0-1 yr)' | 'Junior (1-3 yrs)' | 'Mid (3-5 yrs)' | 'Senior (5-8 yrs)' | 'Lead (8+ yrs)';
  minSalary: number; // in Lakhs INR
  maxSalary: number; // in Lakhs INR
  skills: string[];
  postedAt: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export const JOBS_DATA: Job[] = [
  {
    id: 'google-staff-fe',
    title: 'Staff Frontend Engineer',
    companyName: 'Google',
    companySlug: 'google',
    logoUrl: '/logos/google.svg',
    location: 'Bengaluru, India',
    type: 'Full-time',
    experience: 'Lead (8+ yrs)',
    minSalary: 55,
    maxSalary: 75,
    skills: ['React', 'TypeScript', 'Web Performance', 'System Design'],
    postedAt: '2 hours ago',
    description: 'We are looking for a Staff Frontend Engineer to lead core developer infrastructure and performance initiatives for Google\'s search and portal platforms. You will guide technical roadmaps and mentor engineering teams.',
    requirements: [
      '8+ years of professional software engineering experience.',
      'Expertise in frontend web architectures, framework design, and core performance metrics.',
      'Strong leadership skills with experience scaling systems and technical guidelines.'
    ],
    benefits: [
      'Comprehensive health, dental, and vision insurance.',
      'Generous stock options (GSUs) and annual performance bonuses.',
      'Free gourmet meals, micro-kitchens, and on-site wellness centers.'
    ]
  },
  {
    id: 'google-sde-iii',
    title: 'Software Engineer III',
    companyName: 'Google',
    companySlug: 'google',
    logoUrl: '/logos/google.svg',
    location: 'Bengaluru, India',
    type: 'Full-time',
    experience: 'Mid (3-5 yrs)',
    minSalary: 32,
    maxSalary: 45,
    skills: ['Go', 'C++', 'Java', 'Distributed Systems'],
    postedAt: '1 day ago',
    description: 'Join the Google Cloud core platform team. You will build and scale reliable back-end infrastructure supporting Google Cloud Platform databases and computing frameworks.',
    requirements: [
      '3+ years of experience with backend architectures.',
      'Proficiency in Java, Go, C++, or Python.',
      'Experience building high-throughput, low-latency microservices.'
    ],
    benefits: [
      'Premium medical insurance and family protection coverage.',
      'Hybrid work model (3 days in office, 2 days remote).',
      'Dedicated learning budgets and certifications programs.'
    ]
  },
  {
    id: 'amazon-sde-ii',
    title: 'SDE-II (Software Development Engineer)',
    companyName: 'Amazon',
    companySlug: 'amazon',
    logoUrl: '/logos/amazon.svg',
    location: 'Hyderabad, India',
    type: 'Full-time',
    experience: 'Mid (3-5 yrs)',
    minSalary: 28,
    maxSalary: 38,
    skills: ['Java', 'AWS', 'DynamoDB', 'Microservices'],
    postedAt: '5 hours ago',
    description: 'Amazon Fulfillment Technologies (AFT) is looking for an experienced SDE-II to design and execute high-scale inventory management databases that power warehouses globally.',
    requirements: [
      '3+ years of experience writing clean, scalable object-oriented code.',
      'Hands-on experience with AWS services (EC2, S3, DynamoDB, Lambda).',
      'Strong algorithm design and database performance optimization skills.'
    ],
    benefits: [
      'Competitive base pay with biennial stock refreshes.',
      'Relocation assistance and home-office setups.',
      'Employee discounts across Amazon retail sites.'
    ]
  },
  {
    id: 'meta-pm-ai',
    title: 'Product Manager - AI Platform',
    companyName: 'Meta',
    companySlug: 'meta',
    logoUrl: '/logos/meta.svg',
    location: 'Remote',
    type: 'Remote',
    experience: 'Senior (5-8 yrs)',
    minSalary: 40,
    maxSalary: 55,
    skills: ['AI Product Management', 'PyTorch', 'LLMs', 'Roadmapping'],
    postedAt: '3 hours ago',
    description: 'Shape the future of AI inside Meta\'s Family of Apps. You will lead cross-functional engineering and design groups to deploy large language model features to billions of users.',
    requirements: [
      '5+ years of Product Management experience, preferably in artificial intelligence or machine learning products.',
      'Familiarity with deep learning frameworks and foundation models.',
      'Exceptional communication and user-empathy skills.'
    ],
    benefits: [
      '100% remote flexibility with home workspace stipends.',
      'Top-tier equity grants and annual performance multipliers.',
      'Paid family leave and health advocacy accounts.'
    ]
  },
  {
    id: 'nvidia-dl-engineer',
    title: 'Senior Deep Learning Engineer',
    companyName: 'NVIDIA',
    companySlug: 'nvidia',
    logoUrl: '/logos/nvidia.svg',
    location: 'Bengaluru, India',
    type: 'Full-time',
    experience: 'Senior (5-8 yrs)',
    minSalary: 45,
    maxSalary: 65,
    skills: ['Python', 'CUDA', 'C++', 'PyTorch', 'TensorRT'],
    postedAt: '2 days ago',
    description: 'We are seeking a senior deep learning engineer to optimize neural network inference speeds. You will deploy models onto NVIDIA hardware architectures utilizing CUDA and TensorRT compiler stacks.',
    requirements: [
      '5+ years of software design experience in DL/ML compilers.',
      'Expertise in GPU programming (CUDA, OpenCL) and compiler architectures.',
      'Background in scaling inference parameters for LLMs.'
    ],
    benefits: [
      'NVIDIA stock purchase discount plan (ESPP).',
      'Annual equity grants and health packages.',
      'Access to state-of-the-art supercomputing compute clusters.'
    ]
  },
  {
    id: 'razorpay-backend',
    title: 'Backend Engineer (Node/Go)',
    companyName: 'Razorpay',
    companySlug: 'razorpay',
    logoUrl: '/logos/razorpay.svg',
    location: 'Pune, India',
    type: 'Full-time',
    experience: 'Junior (1-3 yrs)',
    minSalary: 18,
    maxSalary: 26,
    skills: ['Go', 'Node.js', 'Redis', 'PostgreSQL'],
    postedAt: '1 day ago',
    description: 'Razorpay Payment Gateway Core team. Help scale transactions pipelines handling 10,000+ API requests per second with high-availability targets.',
    requirements: [
      '1.5+ years of backend development experience using Golang or Node.js.',
      'Familiarity with SQL databases and cache structures.',
      'Basic understanding of payment processing and transaction ledger systems.'
    ],
    benefits: [
      'Comprehensive family insurance options.',
      'Flexible leaves and zero-question wellness days off.',
      'Catered meals and state-of-the-art office spaces.'
    ]
  },
  {
    id: 'zepto-react-native',
    title: 'SDE-I (React Native)',
    companyName: 'Zepto',
    companySlug: 'zepto',
    logoUrl: '/logos/zepto.svg',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: 'Junior (1-3 yrs)',
    minSalary: 14,
    maxSalary: 20,
    skills: ['React Native', 'TypeScript', 'Redux', 'Mobile Performance'],
    postedAt: '12 hours ago',
    description: 'Join our customer delivery app group. You will build highly responsive, smooth features on the iOS/Android apps to support rapid quick-commerce flows.',
    requirements: [
      '1+ years of React Native or core mobile (Swift/Kotlin) app design.',
      'Proficiency in TypeScript and modern state stores.',
      'Familiarity with offline storage and geolocation tracking services.'
    ],
    benefits: [
      'Performance-tied fast growth options.',
      'Fun startup culture with active social calendar.',
      'Free Zepto Pass and grocery subscription vouchers.'
    ]
  },
  {
    id: 'flipkart-senior-java',
    title: 'Senior Backend Engineer (Java/Go)',
    companyName: 'Flipkart',
    companySlug: 'flipkart',
    logoUrl: '/logos/flipkart.svg',
    location: 'Bengaluru, India',
    type: 'Full-time',
    experience: 'Senior (5-8 yrs)',
    minSalary: 30,
    maxSalary: 42,
    skills: ['Java', 'Apache Kafka', 'Cassandra', 'System Design'],
    postedAt: '4 hours ago',
    description: 'Help design Flipkart Big Billion Days order processing system. Build concurrent systems processing high millions of orders concurrently.',
    requirements: [
      '5+ years of experience developing enterprise backend systems.',
      'Proficiency in concurrency, data structures, and NoSQL databases.',
      'Experience with message brokers (Kafka, RabbitMQ) under peak-traffic.'
    ],
    benefits: [
      'Competitive compensation with gratuity and annual bonuses.',
      'Corporate cab transportation and hybrid flexibility.',
      'Regular tech talks, workshops, and internal hackathons.'
    ]
  },
  {
    id: 'tcs-systems-engineer',
    title: 'Systems Engineer',
    companyName: 'TCS',
    companySlug: 'tcs',
    logoUrl: '/logos/tcs.svg',
    location: 'Noida, India',
    type: 'Full-time',
    experience: 'Entry (0-1 yr)',
    minSalary: 6,
    maxSalary: 10,
    skills: ['Java', 'SQL', 'Unix', 'Core Software Engineering'],
    postedAt: '2 days ago',
    description: 'Start your tech journey at TCS. You will join our enterprise software solutions teams supporting global financial systems.',
    requirements: [
      'B.Tech/B.E. in Computer Science or related engineering domains.',
      'Basic knowledge of Java/C++, relational databases, and operating systems.',
      'Strong problem-solving attitude and active communication skills.'
    ],
    benefits: [
      'Structured career progress paths and corporate training academy.',
      'Stable work environment and retirement benefits plans.',
      'Comprehensive health coverage for self and dependants.'
    ]
  },
  {
    id: 'meesho-fullstack',
    title: 'Software Engineer - Fullstack',
    companyName: 'Meesho',
    companySlug: 'meesho',
    logoUrl: '/logos/meesho.svg',
    location: 'Gurugram, India',
    type: 'Full-time',
    experience: 'Junior (1-3 yrs)',
    minSalary: 20,
    maxSalary: 28,
    skills: ['React', 'Node.js', 'Next.js', 'AWS', 'MongoDB'],
    postedAt: '6 hours ago',
    description: 'Meesho Reseller Tools division. You will build user dashboard panels and tools helping millions of entrepreneurs sell product catalogs seamlessly online.',
    requirements: [
      '2+ years of fullstack software engineering experience.',
      'Comfortable with Next.js/React and Node.js server backends.',
      'Familiarity with deployment pipelines and database integrations.'
    ],
    benefits: [
      'Comprehensive ESOP options and health plans.',
      'Unlimited WFH/hybrid flexibility options.',
      'Skill acquisition allocations and gym sponsorships.'
    ]
  }
];

function JobsBoardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters parsing
  const initialQuery = searchParams.get('query') || '';
  const initialLoc = searchParams.get('location') || '';

  // Local state
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLoc);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<number>(0);

  const [activeJobId, setActiveJobId] = useState<string>(JOBS_DATA[0]?.id || '');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);

  // Apply Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [appReference, setAppReference] = useState('');

  // Confetti particles for success wizard step
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; size: number; duration: number }[]>([]);

  // Saved state for Jobs
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('saved-jobs');
    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleSaveJob = (id: string) => {
    setSavedJobs((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((item) => item !== id);
      } else {
        next = [...prev, id];
      }
      localStorage.setItem('saved-jobs', JSON.stringify(next));
      return next;
    });
  };

  // Apply parameters on search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (location) params.set('location', location);
    router.push(`/jobs?${params.toString()}`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setQuery('');
    setLocation('');
    setSelectedTypes([]);
    setSelectedExp([]);
    setMinSalary(0);
    router.push('/jobs');
  };

  // Filter Jobs
  const filteredJobs = JOBS_DATA.filter(job => {
    // Keyword match
    if (query) {
      const q = query.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.companyName.toLowerCase().includes(q);
      const matchSkills = job.skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }
    // Location match
    if (location) {
      const loc = location.toLowerCase();
      if (!job.location.toLowerCase().includes(loc)) return false;
    }
    // Job Type match
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(job.type)) return false;
    }
    // Experience match
    if (selectedExp.length > 0) {
      if (!selectedExp.includes(job.experience)) return false;
    }
    // Salary match
    if (minSalary > 0) {
      if (job.maxSalary < minSalary) return false;
    }
    return true;
  });

  const activeJobIdToUse = filteredJobs.some(j => j.id === activeJobId)
    ? activeJobId
    : (filteredJobs[0]?.id || '');

  const activeJob = JOBS_DATA.find(j => j.id === activeJobIdToUse);

  const handleToggleType = (typeStr: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeStr) ? prev.filter(t => t !== typeStr) : [...prev, typeStr]
    );
  };

  const handleToggleExp = (expStr: string) => {
    setSelectedExp(prev =>
      prev.includes(expStr) ? prev.filter(e => e !== expStr) : [...prev, expStr]
    );
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyStep < 3) {
      setApplyStep(prev => prev + 1);
    } else {
      setApplyStep(4);
      setAppReference(`TD-${Math.floor(100000 + Math.random() * 900000)}`);
      const colors = ['#FF5A5F', '#FFB74D', '#81C995', '#4285F4', '#AB47BC'];
      const particles = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 50 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        duration: 1.5 + Math.random()
      }));
      setConfetti(particles);
    }
  };

  const closeApplyWizard = () => {
    setShowApplyModal(false);
    setApplyStep(1);
    // Reset form
    setFullName('');
    setEmail('');
    setPhone('');
    setResumeText('');
    setCoverLetter('');
    setAppReference('');
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-[#FF5A5F]/5 to-transparent rounded-full -mr-10 -mt-10" />
        <div className="flex flex-col gap-2 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/10 px-2.5 py-1 rounded-md w-fit">
            OPPORTUNITIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#222222] tracking-tight">
            Find Your Next <span className="text-[#FF5A5F]">Tech Role</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#717171] max-w-xl">
            crowdsourced career intelligence meets active applications. Real companies, verified salaries, direct applications.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 mt-4 relative z-10 w-full">
          <div className="flex-1 flex items-center gap-2 border border-[#EBEBEB] rounded-xl px-4 py-3 bg-slate-50">
            <span className="text-base">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search job title, skills, or company..."
              className="w-full text-xs sm:text-sm font-semibold text-[#222222] placeholder:text-[#717171]/60 focus:outline-none bg-transparent"
            />
          </div>
          <div className="md:w-64 flex items-center gap-2 border border-[#EBEBEB] rounded-xl px-4 py-3 bg-slate-50">
            <span className="text-base">📍</span>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City or Remote..."
              className="w-full text-xs sm:text-sm font-semibold text-[#222222] placeholder:text-[#717171]/60 focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-[#FF5A5F]/15 cursor-pointer"
          >
            Find Jobs
          </button>
        </form>
      </div>

      {/* 2. Main split section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-6 bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-[#EBEBEB] pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#222222]">Filters</h3>
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-bold text-[#FF5A5F] hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Job Type Checkboxes */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717171]">Job Type</span>
            {['Full-time', 'Contract', 'Remote', 'Internship'].map(t => (
              <label key={t} className="flex items-center gap-2 text-xs font-semibold text-[#484848] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={() => handleToggleType(t)}
                  className="rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F]/20 cursor-pointer h-4 w-4"
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          {/* Experience Checkboxes */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717171]">Experience Level</span>
            {['Entry (0-1 yr)', 'Junior (1-3 yrs)', 'Mid (3-5 yrs)', 'Senior (5-8 yrs)', 'Lead (8+ yrs)'].map(e => (
              <label key={e} className="flex items-center gap-2 text-xs font-semibold text-[#484848] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedExp.includes(e)}
                  onChange={() => handleToggleExp(e)}
                  className="rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F]/20 cursor-pointer h-4 w-4"
                />
                <span>{e}</span>
              </label>
            ))}
          </div>

          {/* Min Salary threshold */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717171]">Min Salary (LPA)</span>
            <select
              value={minSalary}
              onChange={e => setMinSalary(Number(e.target.value))}
              className="w-full border border-[#EBEBEB] rounded-lg p-2.5 text-xs font-semibold text-[#484848] bg-white cursor-pointer"
            >
              <option value={0}>Any Compensation</option>
              <option value={10}>₹10L+ LPA</option>
              <option value={20}>₹20L+ LPA</option>
              <option value={30}>₹30L+ LPA</option>
              <option value={50}>₹50L+ LPA</option>
            </select>
          </div>
        </div>

        {/* Center/Right Column: Jobs list + details panel */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Job cards list */}
          <div className="md:col-span-5 flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center text-xs font-bold text-[#717171] px-1">
              <span>{filteredJobs.length} Jobs Found</span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <span className="text-3xl">📭</span>
                <p className="text-xs font-bold text-[#222222]">No matching positions found.</p>
                <p className="text-[10px] text-[#717171] leading-relaxed">
                  Try refining your search terms or clearing some active filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-white bg-[#FF5A5F] hover:bg-[#ff4449] px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredJobs.map(job => {
                const isActive = job.id === activeJobId;
                const isSaved = savedJobs.includes(job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => setActiveJobId(job.id)}
                    className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 transition-all cursor-pointer shadow-xs hover:shadow-sm ${
                      isActive ? 'border-[#FF5A5F] ring-1 ring-[#FF5A5F]/15' : 'border-[#EBEBEB] hover:border-[#FF5A5F]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border border-[#EBEBEB] rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-slate-50 relative p-1.5">
                          <Image
                            src={job.logoUrl}
                            alt={job.companyName}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#222222] group-hover:text-[#FF5A5F] line-clamp-1">
                            {job.title}
                          </h4>
                          <span className="text-[10px] font-bold text-[#717171]">{job.companyName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-[#FF5A5F] bg-[#FF5A5F]/5 px-2 py-0.5 rounded border border-[#FF5A5F]/10">
                          ₹{job.minSalary}L - ₹{job.maxSalary}L
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                          className={`text-sm cursor-pointer hover:scale-110 transition-transform ${
                            isSaved ? 'text-[#FF5A5F]' : 'text-slate-300 hover:text-[#FF5A5F]'
                          }`}
                          title={isSaved ? 'Unsave job' : 'Save job'}
                        >
                          {isSaved ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-[#484848] bg-slate-100 px-1.5 py-0.5 rounded">
                        {job.location}
                      </span>
                      <span className="text-[9px] font-bold text-[#484848] bg-slate-100 px-1.5 py-0.5 rounded">
                        {job.type}
                      </span>
                      <span className="text-[9px] font-bold text-[#484848] bg-slate-100 px-1.5 py-0.5 rounded">
                        {job.experience.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#EBEBEB]/60 pt-2.5 text-[9px] font-bold text-[#717171]">
                      <span>{job.skills.slice(0, 3).join(' • ')}</span>
                      <span>{job.postedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Job Details pane */}
          <div className="md:col-span-7 bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-xs flex flex-col gap-6 sticky top-6">
            {activeJob ? (
              <div className="flex flex-col gap-6">
                {/* Header panel */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EBEBEB] pb-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 border border-[#EBEBEB] rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-slate-50 p-2 relative">
                      <Image
                        src={activeJob.logoUrl}
                        alt={activeJob.companyName}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#222222] tracking-tight">
                        {activeJob.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#717171]">
                        <Link href={`/companies/${activeJob.companySlug}`} className="hover:text-[#FF5A5F] hover:underline">
                          {activeJob.companyName}
                        </Link>
                        <span>•</span>
                        <span>{activeJob.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => toggleSaveJob(activeJob.id)}
                      className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        savedJobs.includes(activeJob.id)
                          ? 'border-[#FF5A5F] bg-[#FF5A5F]/5 text-[#FF5A5F]'
                          : 'border-[#EBEBEB] bg-white text-[#717171] hover:text-[#FF5A5F] hover:border-[#FF5A5F]/40'
                      }`}
                      title={savedJobs.includes(activeJob.id) ? 'Unsave job' : 'Save job'}
                    >
                      {savedJobs.includes(activeJob.id) ? '❤️' : '🤍'}
                    </button>
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="flex-1 sm:flex-initial bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-extrabold text-xs px-6 h-10 rounded-xl transition-all shadow-sm shadow-[#FF5A5F]/15 cursor-pointer select-none text-center"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Job metadata boxes */}
                <div className="grid grid-cols-3 gap-4 border-b border-[#EBEBEB] pb-5">
                  <div className="flex flex-col bg-slate-50 border border-[#EBEBEB] rounded-xl p-3 text-center">
                    <span className="text-[9px] font-bold text-[#717171] uppercase tracking-wider">Salary Range</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#222222] mt-0.5">
                      ₹{activeJob.minSalary}L - ₹{activeJob.maxSalary}L
                    </span>
                  </div>
                  <div className="flex flex-col bg-slate-50 border border-[#EBEBEB] rounded-xl p-3 text-center">
                    <span className="text-[9px] font-bold text-[#717171] uppercase tracking-wider">Job Type</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#222222] mt-0.5">
                      {activeJob.type}
                    </span>
                  </div>
                  <div className="flex flex-col bg-slate-50 border border-[#EBEBEB] rounded-xl p-3 text-center">
                    <span className="text-[9px] font-bold text-[#717171] uppercase tracking-wider">Experience</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#222222] mt-0.5">
                      {activeJob.experience.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* About role */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#222222]">Job Description</h3>
                  <p className="text-xs text-[#484848] leading-relaxed">
                    {activeJob.description}
                  </p>
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#222222]">Requirements</h3>
                  <ul className="list-disc list-inside flex flex-col gap-1.5 pl-1">
                    {activeJob.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs text-[#484848] leading-relaxed">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#222222]">Benefits & Perks</h3>
                  <ul className="list-disc list-inside flex flex-col gap-1.5 pl-1">
                    {activeJob.benefits.map((ben, idx) => (
                      <li key={idx} className="text-xs text-[#484848] leading-relaxed">
                        {ben}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 border-t border-[#EBEBEB] pt-5">
                  <span className="text-[10px] font-bold text-[#717171] uppercase mr-1 self-center">Skills:</span>
                  {activeJob.skills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-[#FF5A5F] bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 px-2.5 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                <span className="text-4xl">💼</span>
                <p className="text-sm font-bold text-[#222222]">Select a position to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Multi-Step Apply Wizard Modal */}
      {showApplyModal && activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg bg-white border border-[#EBEBEB] rounded-2xl shadow-xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal header */}
            <div className="flex justify-between items-center border-b border-[#EBEBEB] pb-3">
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider">
                  Apply to {activeJob.companyName}
                </h3>
                <span className="text-[11px] font-bold text-[#717171]">{activeJob.title}</span>
              </div>
              <button
                onClick={closeApplyWizard}
                className="text-base text-[#717171] hover:text-[#222222] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step indicators */}
            {applyStep < 4 && (
              <div className="grid grid-cols-3 gap-2 w-full">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex flex-col gap-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${
                      applyStep >= step ? 'bg-[#FF5A5F]' : 'bg-slate-100'
                    }`} />
                    <span className={`text-[8px] font-bold uppercase text-center ${
                      applyStep === step ? 'text-[#FF5A5F]' : 'text-[#717171]'
                    }`}>
                      {step === 1 ? 'Personal Info' : step === 2 ? 'Resume Details' : 'Q&A'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={handleApplySubmit} className="flex flex-col gap-4 flex-1">
              
              {/* Step 1: Personal Info */}
              {applyStep === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#717171]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#717171]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. aarav@talentdash.com"
                      className="border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#717171]">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Resume / Experience details */}
              {applyStep === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#717171]">Resume / Professional Summary</label>
                    <textarea
                      required
                      rows={6}
                      value={resumeText}
                      onChange={e => setResumeText(e.target.value)}
                      placeholder="Paste your resume details, employment history, and links to your GitHub/Portfolio here..."
                      className="border border-[#EBEBEB] rounded-xl p-3 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Cover letter & screening */}
              {applyStep === 3 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#717171]">Why do you want to join {activeJob.companyName}?</label>
                    <textarea
                      required
                      rows={5}
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      placeholder={`Tell the team why you are excited about the ${activeJob.title} position at ${activeJob.companyName}...`}
                      className="border border-[#EBEBEB] rounded-xl p-3 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Success state with Confetti */}
              {applyStep === 4 && (
                <div className="flex flex-col items-center text-center gap-4 py-6 relative overflow-hidden">
                  
                  {/* Custom CSS SVG Confetti Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      {confetti.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r={c.size / 5}
                          fill={c.color}
                          opacity="0.8"
                          className="animate-bounce"
                          style={{
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: `${c.duration}s`,
                          }}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Animated success checkmark circle */}
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 flex items-center justify-center text-3xl font-black relative z-10 animate-pulse">
                    ✓
                  </div>
                  
                  <div className="flex flex-col gap-1 relative z-10">
                    <h3 className="text-sm font-black text-[#222222] uppercase tracking-wider">Application Submitted!</h3>
                    <p className="text-xs text-[#717171]">
                      Thank you for applying, {fullName.split(' ')[0]}. Your application has been logged.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-[#EBEBEB] rounded-xl p-4 w-full flex flex-col gap-1.5 text-left relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#717171]">
                      <span>Application Reference</span>
                      <span className="text-[#222222]">#{appReference}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#717171]">
                      <span>Role Applied</span>
                      <span className="text-[#222222]">{activeJob.title}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#717171]">
                      <span>Company Name</span>
                      <span className="text-[#222222]">{activeJob.companyName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 border-t border-[#EBEBEB] pt-4 mt-2">
                {applyStep < 4 ? (
                  <>
                    {applyStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setApplyStep(prev => prev - 1)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 border border-[#EBEBEB] text-[#484848] font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-2 bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer select-none"
                    >
                      {applyStep === 3 ? 'Submit Application' : 'Next Step'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={closeApplyWizard}
                    className="w-full bg-[#FF5A5F] hover:bg-[#ff4449] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer select-none"
                  >
                    Done
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function JobsPageClient() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#717171]">Loading Jobs Board...</div>}>
      <JobsBoardContent />
    </Suspense>
  );
}
