import React from 'react';
import { ProjectEstimate } from '../types/estimation';
import { Calculator, FileText, TrendingUp } from 'lucide-react';

interface ProjectSummaryProps {
  estimate: ProjectEstimate;
}

export function ProjectSummary({ estimate }: ProjectSummaryProps) {
  const formatNumber = (num: number) => num.toLocaleString('bn-BD', { maximumFractionDigits: 2 });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calculator className="w-8 h-8 text-primary-600 mr-3" />
        প্রজেক্ট সামারি
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট কংক্রিট</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatNumber(estimate.totalConcreteVolume)}
              </p>
              <p className="text-xs text-gray-500">ঘন ফিট</p>
            </div>
            <FileText className="w-8 h-8 text-primary-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">মোট স্টিল</p>
              <p className="text-2xl font-bold text-success-600">
                {formatNumber(estimate.totalSteelWeight)}
              </p>
              <p className="text-xs text-gray-500">কেজি</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">স্টিল (টন)</p>
              <p className="text-2xl font-bold text-warning-600">
                {formatNumber(estimate.totalSteelWeight / 1000)}
              </p>
              <p className="text-xs text-gray-500">মেট্রিক টন</p>
            </div>
            <TrendingUp className="w-8 h-8 text-warning-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-error-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">কংক্রিট (ঘন মিটার)</p>
              <p className="text-2xl font-bold text-error-600">
                {formatNumber(estimate.totalConcreteVolume * 0.0283168)}
              </p>
              <p className="text-xs text-gray-500">ঘন মিটার</p>
            </div>
            <FileText className="w-8 h-8 text-error-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">বিস্তারিত ব্রেকডাউন</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">স্ট্রাকচারাল এলিমেন্ট</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">সংখ্যা</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">কংক্রিট (ঘন ফিট)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">স্টিল (কেজি)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">পাইল</td>
                <td className="py-3 px-4 text-right text-gray-600">{estimate.piles.length}</td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.piles.reduce((sum, pile) => sum + pile.concreteVolume, 0))}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.piles.reduce((sum, pile) => sum + pile.steelWeight, 0))}
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">ফুটিং</td>
                <td className="py-3 px-4 text-right text-gray-600">{estimate.footings.length}</td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.footings.reduce((sum, footing) => sum + footing.concreteVolume, 0))}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.footings.reduce((sum, footing) => sum + footing.steelWeight, 0))}
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">কলাম</td>
                <td className="py-3 px-4 text-right text-gray-600">{estimate.columns.length}</td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.columns.reduce((sum, column) => sum + column.concreteVolume, 0))}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.columns.reduce((sum, column) => sum + column.steelWeight, 0))}
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">বিম</td>
                <td className="py-3 px-4 text-right text-gray-600">{estimate.beams.length}</td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.beams.reduce((sum, beam) => sum + beam.concreteVolume, 0))}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.beams.reduce((sum, beam) => sum + beam.steelWeight, 0))}
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">স্ল্যাব</td>
                <td className="py-3 px-4 text-right text-gray-600">{estimate.slabs.length}</td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.slabs.reduce((sum, slab) => sum + slab.concreteVolume, 0))}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatNumber(estimate.slabs.reduce((sum, slab) => sum + slab.steelWeight, 0))}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-800">মোট</td>
                <td className="py-3 px-4 text-right font-bold text-gray-800">
                  {estimate.piles.length + estimate.footings.length + estimate.columns.length + estimate.beams.length + estimate.slabs.length}
                </td>
                <td className="py-3 px-4 text-right font-bold text-primary-600">
                  {formatNumber(estimate.totalConcreteVolume)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-success-600">
                  {formatNumber(estimate.totalSteelWeight)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}