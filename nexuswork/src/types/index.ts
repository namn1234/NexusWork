export interface Job {
  _id: string;
  title: string;
  companyName: string;
  companyShort: string;
  salary: string;
  location: string;
  tags: string[];
  category: string;
  description: string;
  featured: boolean;
  logoColor: string;
  salaryMin: number;
}

export interface Company {
  _id?: string;
  name: string;
  short: string;
  industry: string;
  jobs: number;
  col: string;
}

export interface Category {
  icon: string;
  name: string;
  count: string;
}

export type Page = "home" | "jobs" | "companies" | "saved" | "profile";
export type SortOption = "recent" | "salary" | "company";
export type JobType = "" | "Remote" | "Full-time" | "Part-time" | "Contract";
