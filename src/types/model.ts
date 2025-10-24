export interface SignupFormData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string; // Should be 'M', 'F', or 'O'
  age: number;
  location?: string;
  openness?: string; // 'introvert', 'extrovert', 'ambivert'
  interests?: string; // Comma-separated string
  exp_qual?: string; // Expected qualities, comma-separated string
  relation_type?: string; // 'casual', 'short-term', 'long-term'
  social_habits?: string; // Comma-separated string
  past_relations?: string; // 'yes' or 'no'
  values?: string;
  style?: string;
  traits?: string;
  commitment?: string;
  resolution?: string;
  score?: number; // Default to 0.0
  image_url?: string;
}