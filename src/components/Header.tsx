import React from 'react';
import { Building2, Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">স্ট্রাকচারাল এস্টিমেশন</h1>
              <p className="text-primary-100 text-sm md:text-base">প্রফেশনাল কনস্ট্রাকশন ক্যালকুলেটর</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <Calculator className="w-5 h-5" />
            <span className="text-sm font-medium">অটো ক্যালকুলেশন</span>
          </div>
        </div>
      </div>
    </header>
  );
}