import React, { useState, useEffect } from 'react';
import { calculateFooting } from '../utils/calculations';
import { FootingCalculation } from '../types/estimation';

interface FootingCalculatorProps {
  onCalculationChange: (calculation: FootingCalculation | null) => void;
}

export function FootingCalculator({ onCalculationChange }: FootingCalculatorProps) {
  const [length, setLength] = useState<number>(8); // feet
  const [width, setWidth] = useState<number>(8); // feet
  const [depth, setDepth] = useState<number>(36); // inches
  const [mainRodDia, setMainRodDia] = useState<number>(16); // mm
  const [mainRodSpacing, setMainRodSpacing] = useState<number>(8); // inches
  const [distributionRodDia, setDistributionRodDia] = useState<number>(12); // mm
  const [distributionRodSpacing, setDistributionRodSpacing] = useState<number>(8); // inches
  const [calculation, setCalculation] = useState<FootingCalculation | null>(null);

  useEffect(() => {
    if (length && width && depth && mainRodDia && mainRodSpacing && distributionRodDia && distributionRodSpacing) {
      const result = calculateFooting(length, width, depth, mainRodDia, mainRodSpacing, distributionRodDia, distributionRodSpacing);
      setCalculation(result);
      onCalculationChange(result);
    } else {
      setCalculation(null);
      onCalculationChange(null);
    }
  }, [length, width, depth, mainRodDia, mainRodSpacing, distributionRodDia, distributionRodSpacing, onCalculationChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-warning-500 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        ফুটিং ক্যালকুলেশন
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
            placeholder="8"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
            placeholder="8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            গভীরতা (ইঞ্চি)
          </label>
          <input
            type="number"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
            placeholder="36"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মেইন রড ডায়া (মিমি)
          </label>
          <select
            value={mainRodDia}
            onChange={(e) => setMainRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
          >
            <option value={12}>12mm</option>
            <option value={16}>16mm</option>
            <option value={20}>20mm</option>
            <option value={25}>25mm</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
          >
            <option value={10}>10mm</option>
            <option value={12}>12mm</option>
            <option value={16}>16mm</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500"
            placeholder="8"
          />
        </div>
      </div>
      
      {calculation && (
        <div className="mt-6 p-4 bg-warning-50 rounded-lg">
          <h3 className="text-lg font-semibold text-warning-900 mb-3">ক্যালকুলেশন রেজাল্ট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">কংক্রিট ভলিউম:</span>
              <span className="ml-2 text-warning-700 font-semibold">
                {calculation.concreteVolume.toFixed(2)} ঘন ফিট
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">স্টিলের ওজন:</span>
              <span className="ml-2 text-warning-700 font-semibold">
                {calculation.steelWeight.toFixed(2)} কেজি
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}