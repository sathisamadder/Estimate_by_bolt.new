import React, { useState, useEffect } from 'react';
import { calculatePile } from '../utils/calculations';
import { PileCalculation } from '../types/estimation';

interface PileCalculatorProps {
  onCalculationChange: (calculation: PileCalculation | null) => void;
}

export function PileCalculator({ onCalculationChange }: PileCalculatorProps) {
  const [diameter, setDiameter] = useState<number>(24); // inches
  const [height, setHeight] = useState<number>(30); // feet
  const [mainRodDia, setMainRodDia] = useState<number>(20); // mm
  const [mainRodCount, setMainRodCount] = useState<number>(8);
  const [stirrupDia, setStirrupDia] = useState<number>(10); // mm
  const [stirrupSpacing, setStirrupSpacing] = useState<number>(6); // inches
  const [calculation, setCalculation] = useState<PileCalculation | null>(null);

  useEffect(() => {
    if (diameter && height && mainRodDia && mainRodCount && stirrupDia && stirrupSpacing) {
      const result = calculatePile(diameter, height, mainRodDia, mainRodCount, stirrupDia, stirrupSpacing);
      setCalculation(result);
      onCalculationChange(result);
    } else {
      setCalculation(null);
      onCalculationChange(null);
    }
  }, [diameter, height, mainRodDia, mainRodCount, stirrupDia, stirrupSpacing, onCalculationChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-primary-500 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        পাইল ক্যালকুলেশন
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ডায়ামিটার (ইঞ্চি)
          </label>
          <input
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="24"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            উচ্চতা (ফিট)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="30"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মেইন রড ডায়া (মিমি)
          </label>
          <select
            value={mainRodDia}
            onChange={(e) => setMainRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={12}>12mm</option>
            <option value={16}>16mm</option>
            <option value={20}>20mm</option>
            <option value={25}>25mm</option>
            <option value={32}>32mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মেইন রড সংখ্যা
          </label>
          <input
            type="number"
            value={mainRodCount}
            onChange={(e) => setMainRodCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            স্টিরাপ ডায়া (মিমি)
          </label>
          <select
            value={stirrupDia}
            onChange={(e) => setStirrupDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={8}>8mm</option>
            <option value={10}>10mm</option>
            <option value={12}>12mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            স্টিরাপ স্পেসিং (ইঞ্চি)
          </label>
          <input
            type="number"
            value={stirrupSpacing}
            onChange={(e) => setStirrupSpacing(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="6"
          />
        </div>
      </div>
      
      {calculation && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">ক্যালকুলেশন রেজাল্ট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">কংক্রিট ভলিউম:</span>
              <span className="ml-2 text-primary-700 font-semibold">
                {calculation.concreteVolume.toFixed(2)} ঘন ফিট
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">স্টিলের ওজন:</span>
              <span className="ml-2 text-primary-700 font-semibold">
                {calculation.steelWeight.toFixed(2)} কেজি
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}