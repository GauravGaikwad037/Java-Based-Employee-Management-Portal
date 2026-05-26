import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Java Enterprise Initial Mock Data for the simulation
// This represents our Spring DB (H2 or PostgreSQL) managed state
const employees = [
  { id: "EMP001", name: "Dinesh Kumar", role: "CEO", department: "Executive Office", email: "dinesh.ceo@javaorg.com", status: "Active", rating: "O", attendance: 98, workload: 40 },
  { id: "EMP002", name: "Ananya S.", role: "HR Manager", department: "Human Resources", email: "ananya.hr@javaorg.com", status: "Active", rating: "E", attendance: 95, workload: 60 },
  { id: "EMP003", name: "Vikram Rathore", role: "Project Manager", department: "Engineering", email: "vikram.pm@javaorg.com", status: "Active", rating: "E", attendance: 93, workload: 75 },
  { id: "EMP004", name: "Rohit Sharma", role: "Trainer", department: "Training & Onboarding", email: "rohit.trainer@javaorg.com", status: "Active", rating: "A", attendance: 94, workload: 50 },
  { id: "EMP005", name: "Sneha Patel", role: "Coordinator", department: "Operations", email: "sneha.coord@javaorg.com", status: "Active", rating: "M", attendance: 90, workload: 55 },
  { id: "EMP006", name: "Amit Shah", role: "Operations Specialist", department: "Operations", email: "amit.ops@javaorg.com", status: "Active", rating: "E", attendance: 96, workload: 65 },
  { id: "EMP007", name: "Riya Sen", role: "Finance Manager", department: "Finance", email: "riya.finance@javaorg.com", status: "Active", rating: "O", attendance: 97, workload: 45 },
];

const tasks = [
  { id: "TSK101", title: "Refactor EmployeeController.java to include Spring Security rules", assigneeName: "Rohit Sharma", status: "IN_PROGRESS", priority: "HIGH", deadline: "2026-06-01", roleRequired: "Trainer" },
  { id: "TSK102", title: "Conduct HR Training Seminar for new Spring Security Filters", assigneeName: "Rohit Sharma", status: "TODO", priority: "MEDIUM", deadline: "2026-06-05", roleRequired: "Trainer" },
  { id: "TSK103", title: "Draft Payroll Budget Analysis Report Q2", assigneeName: "Riya Sen", status: "IN_PROGRESS", priority: "HIGH", deadline: "2026-05-30", roleRequired: "Finance Manager" },
  { id: "TSK104", title: "Approve pending Java-based automated workflow routes", assigneeName: "Amit Shah", status: "TODO", priority: "LOW", deadline: "2026-06-10", roleRequired: "Operations Specialist" },
  { id: "TSK105", title: "Formulate annual 40% workload reduction strategy overview", assigneeName: "Dinesh Kumar", status: "DONE", priority: "HIGH", deadline: "2026-05-24", roleRequired: "CEO" },
];

const attendanceRecords = [
  { id: "ATT001", empId: "EMP004", name: "Rohit Sharma", date: "2026-05-26", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present", remark: "On time" },
  { id: "ATT002", empId: "EMP002", name: "Ananya S.", date: "2026-05-26", checkIn: "08:45 AM", checkOut: "05:45 PM", status: "Present", remark: "On time" },
  { id: "ATT003", empId: "EMP003", name: "Vikram Rathore", date: "2026-05-26", checkIn: "09:15 AM", checkOut: "06:15 PM", status: "Present", remark: "Slight delay" },
  { id: "ATT004", empId: "EMP005", name: "Sneha Patel", date: "2026-05-26", checkIn: "10:00 AM", checkOut: "06:00 PM", status: "Late", remark: "Traffic" },
];

// Interactive automated Java routes representation
const automationWorkflows = [
  { id: "WF001", name: "LeaveRequestWorkflow", trigger: "Employee submits LeaveDTO", action: "HRManager validation + mailer microservice", status: "ENABLED", javaCode: "workflowChain.addStep(new ValidateLeaveStep()).addStep(new SendHRNotifyStep());" },
  { id: "WF002", name: "PayrollApprovalAutomator", trigger: "Monthly trigger (Cron 0 0 1 * * )", action: "FinanceManager validation auto-approves if <= 50,000 INR", status: "ENABLED", javaCode: "workflowChain.addStep(new FetchPayrollEntriesStep()).addStep(new AutoApproveLimitStep(50000));" },
  { id: "WF003", name: "TaskAssignmentListener", trigger: "ProjectManager assigns TSK", action: "Triggers real-time websocket and trainer slack webhook", status: "DISABLED", javaCode: "workflowChain.addStep(new CreateTaskStep()).addStep(new PushSlackAlertStep());" },
];

// API Endpoints for interactive Java DB simulator
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

app.post("/api/employees/update", (req, res) => {
  const { id, rating, workload, attendance } = req.body;
  const emp = employees.find((e) => e.id === id);
  if (emp) {
    if (rating !== undefined) emp.rating = rating;
    if (workload !== undefined) emp.workload = Number(workload);
    if (attendance !== undefined) emp.attendance = Number(attendance);
    return res.json({ success: true, employee: emp });
  }
  res.status(404).json({ error: "Employee not found in H2 DB Simulation" });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks/create", (req, res) => {
  const { title, assigneeName, priority, deadline, roleRequired } = req.body;
  const newId = `TSK${100 + tasks.length + 1}`;
  const newTask = {
    id: newId,
    title,
    assigneeName: assigneeName || "Unassigned",
    status: "TODO",
    priority: priority || "MEDIUM",
    deadline: deadline || "2026-06-30",
    roleRequired: roleRequired || "Trainer",
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.post("/api/tasks/update-status", (req, res) => {
  const { id, status } = req.body;
  const t = tasks.find((tk) => tk.id === id);
  if (t) {
    t.status = status;
    return res.json({ success: true, task: t });
  }
  res.status(404).json({ error: "Task code block not found" });
});

app.get("/api/attendance", (req, res) => {
  res.json(attendanceRecords);
});

app.post("/api/attendance/check-in", (req, res) => {
  const { empName, remark } = req.body;
  const newRec = {
    id: `ATT${100 + attendanceRecords.length + 1}`,
    empId: "EMP004", // default trainer
    name: empName,
    date: new Date().toISOString().split("T")[0],
    checkIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    checkOut: "Pending",
    status: "Present",
    remark: remark || "Checked in via Portal API Router",
  };
  attendanceRecords.unshift(newRec);
  res.json(newRec);
});

app.get("/api/workflows", (req, res) => {
  res.json(automationWorkflows);
});

app.post("/api/workflows/toggle", (req, res) => {
  const { id } = req.body;
  const wf = automationWorkflows.find((w) => w.id === id);
  if (wf) {
    wf.status = wf.status === "ENABLED" ? "DISABLED" : "ENABLED";
    return res.json({ success: true, workflow: wf });
  }
  res.status(404).json({ error: "Workflow entity not found" });
});

app.post("/api/workflows/create", (req, res) => {
  const { name, trigger, action, javaCode } = req.body;
  const newWf = {
    id: `WF00${automationWorkflows.length + 1}`,
    name,
    trigger,
    action,
    status: "ENABLED",
    javaCode: javaCode || `workflowChain.addStep(new ${name}CustomStep());`,
  };
  automationWorkflows.push(newWf);
  res.json(newWf);
});

// AI Assistant Proxy - Utilizes Gemini-3.5-flash server-side
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt, currentRole, contextCode } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemPrompt = `You are the core Java Enterprise AI Assistant integrated inside the Employee Management Portal (designed for ${currentRole}).
The user has a Java-based Spring Boot & Hibernate workspace representing this ERP.
Use your expertise to:
1. Provide precise Spring Boot Java code, JPA annotations, or Spring Security Spring Boot snippets.
2. Formulate real JPA Repository queries, Maven dependencies, or mock SQL.
3. Be short/concise with explanations, focusing on highly optimized Java/Spring framework patterns.
4. Keep security robust with Spring Security annotations (e.g. '@PreAuthorize("hasRole(\\'HR\\')")').
Keep code responses beautifully formatted inside Markdown block code \`\`\`java.

Context of current simulated Java code being view / debugged:
${contextCode ? "```java\n" + contextCode + "\n```" : "No file is open in the Java editor right now."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini server-side API error:", error);
    res.status(500).json({
      error: error?.message || "Internal server error contacting Google GenAI on port 3000",
    });
  }
});

// Configure Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Java ERP Server Wrapper] online on http://localhost:${PORT}`);
  });
}

startServer();
