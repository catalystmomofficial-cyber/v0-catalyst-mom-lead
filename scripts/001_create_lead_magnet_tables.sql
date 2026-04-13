-- Create table for lead magnet questionnaire responses
CREATE TABLE IF NOT EXISTS public.lead_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  primary_goal TEXT NOT NULL,
  activity_level TEXT NOT NULL,
  equipment TEXT NOT NULL,
  dietary_preferences TEXT NOT NULL,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.lead_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own responses" ON public.lead_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" ON public.lead_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" ON public.lead_responses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own responses" ON public.lead_responses
  FOR DELETE USING (auth.uid() = user_id);
