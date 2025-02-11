'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import { AddPromptButton } from '@/components/ui/addprompt';
import { PromptCard } from '@/components/ui/promptcard';
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Prompt = {
  id: string;
  title: string;
  body: string;
  user_id: string;
};

type PromptFormValues = {
  title: string
  body: string
}

/**
 * DashboardPage displays the list of prompt cards at the top level.
 * A floating "Add Prompt" button at the bottom right triggers a modal to create a new prompt.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const form = useForm<PromptFormValues>({
    defaultValues: {
      title: '',
      body: '',
    },
  })

  // Function to fetch prompts for the signed-in user
  const fetchPrompts = async (userId: string) => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
    if (error) console.error('Error fetching prompts:', error.message)
    else setPrompts(data as Prompt[])
  }

  // Update onSubmit to persist data to Supabase
  const onSubmit = async (data: PromptFormValues) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      
      if (!session?.user) {
        throw new Error('No user session found')
      }

      // Insert the new prompt into Supabase
      const { data: newPrompt, error } = await supabase
        .from('prompts')
        .insert([
          {
            title: data.title,
            body: data.body,
            user_id: session.user.id,
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Update local state with the new prompt
      setPrompts((prev) => [newPrompt, ...prev])
      
      // Reset form and close modal
      form.reset()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating prompt:', error)
      // You might want to show an error message to the user here
    }
  }

  // Check for authentication session and fetch prompts
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')  // Redirect to home instead of /login
      } else {
        setUser(session.user)
        fetchPrompts(session.user.id)
      }
    }

    getSession()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-6">My Prompts</h1>
          {/* Grid Container for Prompt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.length > 0 ? (
              prompts.map((prompt) => (
                <PromptCard 
                  key={prompt.id} 
                  title={prompt.title} 
                  prompt={prompt.body} 
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No prompts found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating "Add Prompt" Button */}
      <div className="fixed bottom-8 right-8">
        <AddPromptButton onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Modal for Creating a Prompt using Shadcn Form Components */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Prompt</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Prompt Title" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Body</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Prompt Body" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground active:bg-destructive/90 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <AddPromptButton type="submit" />
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}