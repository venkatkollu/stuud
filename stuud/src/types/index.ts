export interface Faculty {
  id: string;
  name: string;
  subjects: string[];
  cabin: string;
  email?: string;
  phone?: string;
}

export interface Classroom {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  building?: string;
  floor?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface Timetable {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
  classroom: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Map: undefined;
  Search: undefined;
  Admin: undefined;
  Profile: undefined;
}; 