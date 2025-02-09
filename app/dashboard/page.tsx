'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Prompt = {
  id: string;
  title: string;
  body: string;
  user_id: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Check for authentication session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchPrompts(session.user.id);
      }
    };

    getSession();
  }, [router]);

  // Function to fetch prompts for the signed-in user
  const fetchPrompts = async (userId: string) => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId);
    if (error) console.error('Error fetching prompts:', error.message);
    else setPrompts(data as Prompt[]);
  };

  // Create a new prompt
  const handleCreatePrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('prompts').insert([
      {
        title,
        body,
        user_id: user.id,
      },
    ]);
    if (error) console.error('Error creating prompt:', error.message);
    else {
      setTitle('');
      setBody('');
      fetchPrompts(user.id);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Prompts</h1>
      <form onSubmit={handleCreatePrompt} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Prompt Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Prompt Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          Create Prompt
        </button>
      </form>
      <div>
        {prompts.length > 0 ? (
          prompts.map((prompt) => (
            <div key={prompt.id} className="p-4 mb-4 border rounded">
              <h2 className="text-xl font-semibold">{prompt.title}</h2>
              <p>{prompt.body}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No prompts found.</p>
        )}
      </div>
    </div>
  );
}