import React, { useState, useEffect } from 'react';
import { calculateSlab } from '../utils/calculations';
import { SlabCalculation } from '../types/estimation';

interface SlabCalculatorProps {
  onCalculationChange: (calculation: SlabCalculation | null) => void;
}

export function SlabCalculator({ onCalculationChange }: SlabCalculatorProps) {
  const [length, setLength] = useState<number>(20); // feet
  const [width, setWidth] = useState<number>(15); // feet
  const [thickness, setThickness] = useState<number>(6); // inches
  const [mainRodDia, setMainRodDia] = useState<number>(12); // mm
  const [mainRodSpacing, setMainRodSpacing] = useState<number>(8); // inches
  const [distributionRodDia, setDistributionRodDia] = useState<number>(10); // mm
  const [distributionRodSpacing, setDistributionRodSpacing] = useState<number>(8); // inches
  const [calculation, setCalculation] = useState<SlabCalculation | null>(null);

  useEffect(() => {
    if (length && width && thickness && mainRodDia && mainRodSpacing && distributionRodDia && distributionRodSpacing) {
      const result = calculateSlab(length, width, thickness, mainRodDia, mainRodSpacing, distributionRodDia, distributionRodSpacing);
      setCalculation(result);
      onCalculationChange(result);
    } else {
      setCalculation(null);
      onCalculationChange(null);
    }
  }, [length, width, thickness, mainRodDia, mainRodSpacing, distributionRodDia, distributionRodSpacing, onCalculationChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        স্ল্যাব ক্যালকুলেশন
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            দৈর্ঘ্য (ফিট)
          </label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            প্রস্থ (ফিট)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="15"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            পুরুত্ব (ইঞ্চি)
          </label>
          <input
            type="number"
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="6"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মেইন রড ডায়া (মিমি)
          </label>
          <select
            value={mainRodDia}
            onChange={(e) => setMainRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={10}>10mm</option>
            <option value={12}>12mm</option>
            <option value={16}>16mm</option>
            <option value={20}>20mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মেইন রড স্পেসিং (ইঞ্চি)
          </label>
          <input
            type="number"
            value={mainRodSpacing}
            onChange={(e) => setMainRodSpacing(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ডিস্ট্রিবিউশন রড ডায়া (মিমি)
          </label>
          <select
            value={distributionRodDia}
            onChange={(e) => setDistributionRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={8}>8mm</option>
            <option value={10}>10mm</option>
            <option value={12}>12mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ডিস্ট্রিবিউশন রড স্পেসিং (ইঞ্চি)
          </label>
          <input
            type="number"
            value={distributionRodSpacing}
            onChange={(e) => setDistributionRodSpacing(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="8"
          />
        </div>
      </div>
      
      {calculation && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">ক্যালকুলেশন রেজাল্ট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">কংক্রিট ভলিউম:</span>
              <span className="ml-2 text-indigo-700 font-semibold">
                {calculation.concreteVolume.toFixed(2)} ঘন ফিট
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">স্টিলের ওজন:</span>
              <span className="ml-2 text-indigo-700 font-semibold">
                {calculation.steelWeight.toFixed(2)} কেজি
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}