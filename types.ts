export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: string;
  rating: string;      // O, E, A, M, U
  attendance: number;  // percentage
  workload: number;    // hours/percentage
}

export interface Task {
  id: string;
  title: string;
  assigneeName: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline: string;
  roleRequired: string;
}

export interface AttendanceRecord {
  id: string;
  empId: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  remark: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "ENABLED" | "DISABLED";
  javaCode: string;
}

export type UserRole =
  | "Trainer (Employee)"
  | "HR Manager"
  | "CEO"
  | "Project Manager"
  | "Coordinator"
  | "Operations Specialist"
  | "Finance Manager";
