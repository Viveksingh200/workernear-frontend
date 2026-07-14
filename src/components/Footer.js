"use client";

import React from "react";
import { useLanguage } from "../context/languageContext";
import { Briefcase } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-50 border-t border-gray-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-10">
          
          {/* Logo and About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 shadow-sm shadow-orange-500/10">
                <Briefcase className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                {t.brand}
              </span>
            </div>
            <p className="text-sm leading-6 text-zinc-600 font-light max-w-xs">
              {t.footerDesc}
            </p>
          </div>

          {/* Company links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 uppercase">
              {t.company}
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://dev-viveksingh-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-650 hover:text-zinc-900 transition-colors"
                >
                  {t.aboutUs}
                </a>
              </li>
              <li>
                <a
                  href="https://dev-viveksingh-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-650 hover:text-zinc-900 transition-colors"
                >
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom copyright line */}
        <div className=" pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            &copy; Vivek Singh
          </p>
        </div>
      </div>
    </footer>
  );
}
