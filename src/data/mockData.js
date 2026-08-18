// Mock data for the AI Project Mentor frontend.
// Later this can be replaced with real API calls via src/services/api.js.

export const mockProjects = [
  {
    id: 1,
    name: "Student Placement Portal",
    description:
      "A portal where students can register, upload their resume, and apply for campus placement drives. Admins can post job openings and shortlist candidates.",
    techStack: ["React", "FastAPI", "SQL Server", "Ollama"],
    createdAt: "2026-07-04",
  },
  {
    id: 2,
    name: "Hospital Appointment System",
    description:
      "A scheduling system for patients to book appointments with doctors, manage slots, and receive reminders for upcoming visits.",
    techStack: ["React", "FastAPI", "SQL Server"],
    createdAt: "2026-07-18",
  },
  {
    id: 3,
    name: "AI Resume Mentor",
    description:
      "An AI-powered resume analysis tool that reviews student resumes, suggests improvements, and generates interview preparation questions.",
    techStack: ["React", "FastAPI", "SQL Server", "GPT-OSS"],
    createdAt: "2026-08-01",
  },
];

export const mockTasks = [
  {
    id: 1,
    title: "Design login and registration screens",
    description: "Create responsive login and signup forms with validation.",
    projectId: 1,
    priority: "High",
    status: "Completed",
    aiGenerated: false,
    createdAt: "2026-07-05",
    updatedAt: "2026-07-09",
  },
  {
    id: 2,
    title: "Build FastAPI auth endpoints",
    description: "Implement /api/auth/register and /api/auth/login with JWT tokens.",
    projectId: 1,
    priority: "High",
    status: "In Progress",
    aiGenerated: false,
    createdAt: "2026-07-06",
    updatedAt: "2026-07-12",
  },
  {
    id: 3,
    title: "Create SQL Server schema for students",
    description: "Design tables for students, resumes, applications and job postings.",
    projectId: 1,
    priority: "Medium",
    status: "Pending",
    aiGenerated: false,
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07",
  },
  {
    id: 4,
    title: "Integrate Ollama for resume screening",
    description: "Call the Ollama Cloud API to score resumes against job descriptions.",
    projectId: 1,
    priority: "Medium",
    status: "Pending",
    aiGenerated: true,
    createdAt: "2026-07-10",
    updatedAt: "2026-07-10",
  },
  {
    id: 5,
    title: "Doctor availability calendar",
    description: "Build a calendar view showing available appointment slots per doctor.",
    projectId: 2,
    priority: "High",
    status: "In Progress",
    aiGenerated: false,
    createdAt: "2026-07-20",
    updatedAt: "2026-07-25",
  },
  {
    id: 6,
    title: "Patient registration form",
    description: "Create a form for patients to register with contact and medical details.",
    projectId: 2,
    priority: "Medium",
    status: "Completed",
    aiGenerated: false,
    createdAt: "2026-07-21",
    updatedAt: "2026-07-24",
  },
  {
    id: 7,
    title: "Appointment booking API",
    description: "Implement POST /api/appointments and slot conflict validation.",
    projectId: 2,
    priority: "High",
    status: "Pending",
    aiGenerated: false,
    createdAt: "2026-07-22",
    updatedAt: "2026-07-22",
  },
  {
    id: 8,
    title: "Resume upload and parsing",
    description: "Allow PDF upload and extract text for AI analysis.",
    projectId: 3,
    priority: "High",
    status: "In Progress",
    aiGenerated: false,
    createdAt: "2026-08-02",
    updatedAt: "2026-08-06",
  },
  {
    id: 9,
    title: "GPT-OSS prompt tuning",
    description: "Experiment with prompts to generate resume improvement suggestions.",
    projectId: 3,
    priority: "Medium",
    status: "Pending",
    aiGenerated: true,
    createdAt: "2026-08-03",
    updatedAt: "2026-08-03",
  },
  {
    id: 10,
    title: "Interview question generator",
    description: "Generate mock interview questions based on the resume content.",
    projectId: 3,
    priority: "Low",
    status: "Pending",
    aiGenerated: true,
    createdAt: "2026-08-04",
    updatedAt: "2026-08-04",
  },
];

export const mockAIInteractions = [
  {
    id: 1,
    projectId: 1,
    projectName: "Student Placement Portal",
    userPrompt:
      "Break down the requirement: students should be able to apply to job postings and track their application status.",
    aiTaskType: "Break Requirement into Tasks",
    modelName: "GPT-OSS",
    createdAt: "2026-07-11",
    response: {
      requirementUnderstanding:
        "The system should let students view job postings, submit applications, and track the status of each application over time.",
      frontendTasks: [
        "Build a job listings page with filters by role and company.",
        "Create an application form with resume attachment.",
        "Add an application status tracker page.",
      ],
      backendTasks: [
        "Implement GET /api/jobs and GET /api/jobs/{id}.",
        "Implement POST /api/applications.",
        "Implement GET /api/applications?student_id=.",
      ],
      databaseTasks: [
        "Create applications table with status column.",
        "Add foreign keys to students and job_postings.",
      ],
      testingSteps: [
        "Verify a student can submit an application.",
        "Verify status updates reflect on the tracker.",
        "Test applying to a closed job posting.",
      ],
      possibleBlockers: [
        "Resume file size limits may need tuning.",
        "Concurrent applications could cause race conditions.",
      ],
      recommendedNextAction:
        "Start with the job listings page so students have something to apply to.",
    },
  },
  {
    id: 2,
    projectId: 2,
    projectName: "Hospital Appointment System",
    userPrompt: "Generate a project plan for the appointment booking system.",
    aiTaskType: "Generate Project Plan",
    modelName: "GPT-OSS",
    createdAt: "2026-07-22",
    response: {
      requirementUnderstanding:
        "A scheduling system connecting patients with doctors, handling slot availability and reminders.",
      frontendTasks: [
        "Patient registration and profile.",
        "Doctor selection and slot picker.",
        "Appointment confirmation screen.",
      ],
      backendTasks: [
        "Auth endpoints for patients and doctors.",
        "Slot management endpoints.",
        "Booking and cancellation endpoints.",
      ],
      databaseTasks: [
        "Tables: patients, doctors, appointments, slots.",
        "Index appointments by doctor and date.",
      ],
      testingSteps: [
        "Book an available slot.",
        "Attempt double-booking a slot.",
        "Cancel and rebook a slot.",
      ],
      possibleBlockers: [
        "Timezone handling for reminders.",
        "Slot concurrency across devices.",
      ],
      recommendedNextAction:
        "Define the database schema first, then build the slot picker UI.",
    },
  },
  {
    id: 3,
    projectId: 3,
    projectName: "AI Resume Mentor",
    userPrompt: "Recommend the next task I should work on.",
    aiTaskType: "Recommend Next Task",
    modelName: "GPT-OSS",
    createdAt: "2026-08-05",
    response: {
      requirementUnderstanding:
        "The user wants to know which task to prioritise next for the AI Resume Mentor project.",
      frontendTasks: [
        "Complete the resume preview component.",
        "Add loading states for AI analysis.",
      ],
      backendTasks: [
        "Finalise the resume text extraction endpoint.",
        "Add rate limiting to the AI analysis endpoint.",
      ],
      databaseTasks: [
        "Store analysis results per resume.",
      ],
      testingSteps: [
        "Test extraction with multi-page PDFs.",
        "Verify AI response rendering.",
      ],
      possibleBlockers: [
        "Large PDFs may exceed Ollama token limits.",
      ],
      recommendedNextAction:
        "Finish resume text extraction before tuning prompts, since prompts depend on clean input.",
    },
  },
  {
    id: 4,
    projectId: 1,
    projectName: "Student Placement Portal",
    userPrompt: "Identify possible blockers for the resume screening feature.",
    aiTaskType: "Identify Project Blockers",
    modelName: "GPT-OSS",
    createdAt: "2026-08-08",
    response: {
      requirementUnderstanding:
        "The user wants to surface risks that could delay the resume screening feature.",
      frontendTasks: [
        "Show a fallback message when AI is unavailable.",
      ],
      backendTasks: [
        "Add retry logic for Ollama API timeouts.",
        "Cache responses to reduce API cost.",
      ],
      databaseTasks: [
        "Store raw and processed resume text separately.",
      ],
      testingSteps: [
        "Simulate Ollama downtime.",
        "Test with malformed resumes.",
      ],
      possibleBlockers: [
        "Ollama rate limits under heavy load.",
        "Inconsistent resume formats reducing accuracy.",
      ],
      recommendedNextAction:
        "Add a fallback and retry path before relying on AI output in production.",
    },
  },
];

// AI task types shown in the AI Mentor form
export const aiTaskTypes = [
  "Generate Project Plan",
  "Break Requirement into Tasks",
  "Recommend Next Task",
  "Identify Project Blockers",
  "Explain Implementation",
  "Generate Testing Checklist",
];

export const priorityOptions = ["Low", "Medium", "High"];
export const statusOptions = ["Pending", "In Progress", "Completed"];
