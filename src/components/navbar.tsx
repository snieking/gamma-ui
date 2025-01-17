'use client'

import { useChromia } from "@/lib/chromia-connect/chromia-context";
import { AuthButtons } from "./auth/auth-buttons";

export function Navbar() {
  const { chromiaSession } = useChromia();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex items-center justify-start">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Gamma UI
            </h1>
          </div>

          {/* Right - Auth Buttons */}
          <div className="flex items-center justify-end">
            <AuthButtons isHeader={true} />
          </div>
        </div>
      </div>
    </nav>
  );
}
