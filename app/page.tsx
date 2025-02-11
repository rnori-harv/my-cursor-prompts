'use client';

import Navbar from "@/components/ui/navbar";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Ramp's Cursor Directory</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your one-stop destination for cursor customization
          </p>
        </div>
      </main>
    </div>
  );
}