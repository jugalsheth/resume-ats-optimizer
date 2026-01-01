"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resume ATS Optimizer</h3>
            <p className="text-neutral-400">
              AI-powered resume optimization tool to help you pass ATS systems and land your dream job.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Built With</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-neutral-800 rounded-md text-sm">Next.js 14</span>
              <span className="px-3 py-1 bg-neutral-800 rounded-md text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-neutral-800 rounded-md text-sm">Tailwind CSS</span>
              <span className="px-3 py-1 bg-neutral-800 rounded-md text-sm">Groq AI</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/optimizer" className="hover:text-white transition-colors">
                Optimizer
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} Resume ATS Optimizer. Built with ❤️ for job seekers.</p>
        </div>
      </div>
    </footer>
  );
}

