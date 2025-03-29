# Stuud - AI-Powered College Services Chatbot

Stuud is a mobile application that provides college students with an AI-powered chatbot to access college services, find faculty information, navigate classrooms, and stay updated with events.

## Features

- **AI-Powered Chatbot**: Ask questions about faculty, classrooms, events, and timetables
- **Pictorial Classroom Navigation**: Interactive campus map with classroom locations
- **Smart Search & Filtering**: Search faculty by name, subject, or location
- **Admin Data Feed System**: Interface for administrators to enter college data
- **Notifications & Reminders**: Stay updated with events and timetable changes

## Tech Stack

- **Frontend**: React Native with TypeScript
- **Backend**: Supabase (PostgreSQL, authentication, real-time DB)
- **AI/NLP**: OpenAI API (GPT-4) for chatbot responses
- **Database**: PostgreSQL (via Supabase)
- **Maps**: React Native Maps for classroom navigation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/stuud.git
   cd stuud
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_KEY=your_supabase_anon_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Follow the Expo instructions to run the app on your device or emulator.

## Project Structure

```
stuud/
├── assets/              # Static assets like images
├── src/
│   ├── components/      # Reusable UI components
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens
│   ├── services/        # API services (Supabase, OpenAI)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── App.tsx              # Main app component
├── babel.config.js      # Babel configuration
└── package.json         # Project dependencies
```

## Supabase Database Schema

The application uses the following tables in Supabase:

- **faculty**: Faculty information (name, subjects, cabin, contact)
- **classrooms**: Classroom information (name, location, building, floor)
- **events**: College events (title, description, dates, location)
- **timetable**: Class schedules (day, time, subject, faculty, classroom)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT API
- Supabase for the backend infrastructure
- React Native community for the excellent libraries and tools 