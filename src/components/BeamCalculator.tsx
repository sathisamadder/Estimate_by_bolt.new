import React, { useState, useEffect } from 'react';
import { calculateBeam } from '../utils/calculations';
import { BeamCalculation } from '../types/estimation';

interface BeamCalculatorProps {
  onCalculationChange: (calculation: BeamCalculation | null) => void;
}

export function BeamCalculator({ onCalculationChange }: BeamCalculatorProps) {
  const [length, setLength] = useState<number>(20); // feet
  const [width, setWidth] = useState<number>(12); // inches
  const [depth, setDepth] = useState<number>(18); // inches
  const [topRodDia, setTopRodDia] = useState<number>(20); // mm
  const [topRodCount, setTopRodCount] = useState<number>(3);
  const [bottomRodDia, setBottomRodDia] = useState<number>(20); // mm
  const [bottomRodCount, setBottomRodCount] = useState<number>(3);
  const [stirrupDia, setStirrupDia] = useState<number>(10); // mm
  const [stirrupSpacing, setStirrupSpacing] = useState<number>(8); // inches
  const [calculation, setCalculation] = useState<BeamCalculation | null>(null);

  useEffect(() => {
    if (length && width && depth && topRodDia && topRodCount && bottomRodDia && bottomRodCount && stirrupDia && stirrupSpacing) {
      const result = calculateBeam(length, width, depth, topRodDia, topRodCount, bottomRodDia, bottomRodCount, stirrupDia, stirrupSpacing);
      setCalculation(result);
      onCalculationChange(result);
    } else {
      setCalculation(null);
      onCalculationChange(null);
    }
  }, [length, width, depth, topRodDia, topRodCount, bottomRodDia, bottomRodCount, stirrupDia, stirrupSpacing, onCalculationChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-purple-500 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        বিম ক্যালকুলেশন
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            প্রস্থ (ইঞ্চি)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="12"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="18"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            টপ রড ডায়া (মিমি)
          </label>
          <select
            value={topRodDia}
            onChange={(e) => setTopRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={16}>16mm</option>
            <option value={20}>20mm</option>
            <option value={25}>25mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            টপ রড সংখ্যা
          </label>
          <input
            type="number"
            value={topRodCount}
            onChange={(e) => setTopRodCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            বটম রড ডায়া (মিমি)
          </label>
          <select
            value={bottomRodDia}
            onChange={(e) => setBottomRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={16}>16mm</option>
            <option value={20}>20mm</option>
            <option value={25}>25mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            বটম রড সংখ্যা
          </label>
          <input
            type="number"
            value={bottomRodCount}
            onChange={(e) => setBottomRodCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            স্টিরাপ ডায়া (মিমি)
          </label>
          <select
            value={stirrupDia}
            onChange={(e) => setStirrupDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="8"
          />
        </div>
      </div>
      
      {calculation && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-3">ক্যালকুলেশন রেজাল্ট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">কংক্রিট ভলিউম:</span>
              <span className="ml-2 text-red-700 font-semibold">
                {calculation.concreteVolume.toFixed(2)} ঘন ফিট
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">স্টিলের ওজন:</span>
              <span className="ml-2 text-red-700 font-semibold">
                {calculation.steelWeight.toFixed(2)} কেজি
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}