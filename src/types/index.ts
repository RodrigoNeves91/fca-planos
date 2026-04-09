export interface User {
  id: string;
  email: string;
  name: string;
  sector: string;
  is_admin: boolean;
}

export interface FCAPlan {
  id: string;
  user_id: string;
  shift: string;
  agd_date: string;
  management_industry: string;
  indicators: string;
  sector: string;
  fact: string;
  root_cause: string;
  action: string;
  responsible: string;
  area: string;
  planned_deadline: string;
  actual_deadline: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
