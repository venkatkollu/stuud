import { createClient } from '@supabase/supabase-js';
import { Faculty, Classroom, Event, Timetable } from '../types';

// Hardcoded Supabase URL and anon key to avoid Node.js compatibility issues
const supabaseUrl = 'https://wrsbuekefxbrkreguctv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indyc2J1ZWtlZnhicmtyZWd1Y3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTY3OTAsImV4cCI6MjA1NzA5Mjc5MH0.yDmnNQifzJfbpby_jJEHJcyq2yttQwTyJjglaFtzf8E';

const supabase = createClient(supabaseUrl, supabaseKey);

export const getFaculty = async (): Promise<Faculty[]> => {
  const { data, error } = await supabase
    .from('faculty')
    .select('*');
  
  if (error) {
    console.error('Error fetching faculty:', error);
    return [];
  }
  
  return data || [];
};

export const getClassrooms = async (): Promise<Classroom[]> => {
  const { data, error } = await supabase
    .from('classrooms')
    .select('*');
  
  if (error) {
    console.error('Error fetching classrooms:', error);
    return [];
  }
  
  return data || [];
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*');
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data || [];
};

export const getTimetable = async (): Promise<Timetable[]> => {
  const { data, error } = await supabase
    .from('timetable')
    .select('*');
  
  if (error) {
    console.error('Error fetching timetable:', error);
    return [];
  }
  
  return data || [];
};

export const addFaculty = async (faculty: Omit<Faculty, 'id'>): Promise<Faculty | null> => {
  const { data, error } = await supabase
    .from('faculty')
    .insert([faculty])
    .select();
  
  if (error) {
    console.error('Error adding faculty:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const addClassroom = async (classroom: Omit<Classroom, 'id'>): Promise<Classroom | null> => {
  const { data, error } = await supabase
    .from('classrooms')
    .insert([classroom])
    .select();
  
  if (error) {
    console.error('Error adding classroom:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const addEvent = async (event: Omit<Event, 'id'>): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();
  
  if (error) {
    console.error('Error adding event:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const addTimetable = async (timetable: Omit<Timetable, 'id'>): Promise<Timetable | null> => {
  const { data, error } = await supabase
    .from('timetable')
    .insert([timetable])
    .select();
  
  if (error) {
    console.error('Error adding timetable:', error);
    return null;
  }
  
  return data?.[0] || null;
}; 