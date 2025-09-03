import React, { useState, useEffect } from 'react';
import { calculateColumn } from '../utils/calculations';
import { ColumnCalculation } from '../types/estimation';

interface ColumnCalculatorProps {
  onCalculationChange: (calculation: ColumnCalculation | null) => void;
}

export function ColumnCalculator({ onCalculationChange }: ColumnCalculatorProps) {
  const [length, setLength] = useState<number>(1.5); // feet
  const [width, setWidth] = useState<number>(1.5); // feet
  const [height, setHeight] = useState<number>(12); // feet
  const [mainRodDia, setMainRodDia] = useState<number>(20); // mm
  const [mainRodCount, setMainRodCount] = useState<number>(8);
  const [tieRodDia, setTieRodDia] = useState<number>(10); // mm
  const [tieSpacing, setTieSpacing] = useState<number>(6); // inches
  const [calculation, setCalculation] = useState<ColumnCalculation | null>(null);

  useEffect(() => {
    if (length && width && height && mainRodDia && mainRodCount && tieRodDia && tieSpacing) {
      const result = calculateColumn(length, width, height, mainRodDia, mainRodCount, tieRodDia, tieSpacing);
      setCalculation(result);
      onCalculationChange(result);
    } else {
      setCalculation(null);
      onCalculationChange(null);
    }
  }, [length, width, height, mainRodDia, mainRodCount, tieRodDia, tieSpacing, onCalculationChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-error-500 rounded-lg mr-3 flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        কলাম ক্যালকুলেশন
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            দৈর্ঘ্য (ফিট)
          </label>
          <input
            type="number"
            step="0.1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
            placeholder="1.5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            প্রস্থ (ফিট)
          </label>
          <input
            type="number"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
            placeholder="1.5"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
            placeholder="12"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মেইন রড ডায়া (মিমি)
          </label>
          <select
            value={mainRodDia}
            onChange={(e) => setMainRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
          >
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
            placeholder="8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            টাই রড ডায়া (মিমি)
          </label>
          <select
            value={tieRodDia}
            onChange={(e) => setTieRodDia(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
          >
            <option value={8}>8mm</option>
            <option value={10}>10mm</option>
            <option value={12}>12mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            টাই স্পেসিং (ইঞ্চি)
          </label>
          <input
            type="number"
            value={tieSpacing}
            onChange={(e) => setTieSpacing(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500"
            placeholder="6"
          />
        </div>
      </div>
      
      {calculation && (
        <div className="mt-6 p-4 bg-error-50 rounded-lg">
          <h3 className="text-lg font-semibold text-error-900 mb-3">ক্যালকুলেশন রেজাল্ট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">কংক্রিট ভলিউম:</span>
              <span className="ml-2 text-error-700 font-semibold">
                {calculation.concreteVolume.toFixed(2)} ঘন ফিট
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">স্টিলের ওজন:</span>
              <span className="ml-2 text-error-700 font-semibold">
                {calculation.steelWeight.toFixed(2)} কেজি
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}