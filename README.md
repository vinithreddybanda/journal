# Mood Journal - AI-Powered Personal Journaling

A beautiful, modern journaling application with AI-powered mood analysis, built with Next.js, Supabase, and Groq AI.

## ✨ Features

- **🎨 Beautiful Design**: Cute, cinematic, and colorful interface with smooth animations
- **📅 Calendar Integration**: Navigate through your journal entries by date
- **🤖 AI Mood Analysis**: Get personalized mood insights powered by Groq AI
- **📝 Rich Text Editor**: OneNote-style writing experience
- **🔐 Authentication**: Secure user authentication with Supabase
- **📱 Responsive**: Works perfectly on desktop and mobile devices
- **🎯 Mood Tracking**: Visual mood indicators and summaries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd journal
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   ```

3. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create the following tables in your Supabase database:

   ```sql
   -- Users profile table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     email TEXT,
     full_name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     PRIMARY KEY (id)
   );

   -- Journal entries table
   CREATE TABLE journal_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users ON DELETE CASCADE,
     date DATE NOT NULL,
     title TEXT,
     content TEXT,
     mood_summary TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS (Row Level Security)
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own entries" ON journal_entries
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own entries" ON journal_entries
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own entries" ON journal_entries
     FOR UPDATE USING (auth.uid() = user_id);
   ```

4. **Set up Groq AI:**
   - Get your API key from [groq.com](https://groq.com)
   - Add it to your `.env.local` file

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🎨 Design Philosophy

- **Cute & Cinematic**: Soft gradients, rounded corners, and playful elements
- **Colorful**: Vibrant purple-to-pink gradients with complementary colors
- **Compact**: Clean, minimal interface that focuses on content
- **Typography**: Playfair Display for headings, Inter for body text
- **Smooth Transitions**: Framer Motion animations throughout

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth)
- **AI**: Groq API (Llama 3 model)
- **Icons**: Lucide React
- **Fonts**: Playfair Display, Inter
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── dashboard/         # Main journal interface
│   ├── login/            # Authentication pages
│   ├── signup/
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # shadcn/ui components
└── lib/
    ├── supabase.ts       # Database client
    └── groq.ts          # AI mood analysis
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Groq](https://groq.com/) for the AI mood analysis
- [Tailwind CSS](https://tailwindcss.com/) for the styling system

---

**Made with ❤️ for personal growth and emotional well-being**
