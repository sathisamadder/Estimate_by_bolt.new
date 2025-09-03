import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { PileCalculator } from './components/PileCalculator';
import { FootingCalculator } from './components/FootingCalculator';
import { ColumnCalculator } from './components/ColumnCalculator';
import { BeamCalculator } from './components/BeamCalculator';
import { SlabCalculator } from './components/SlabCalculator';
import { ProjectSummary } from './components/ProjectSummary';
import { 
  PileCalculation, 
  FootingCalculation, 
  ColumnCalculation, 
  BeamCalculation, 
  SlabCalculation,
  ProjectEstimate 
} from './types/estimation';

function App() {
  const [activeTab, setActiveTab] = useState('pile');
  const [pileCalculations, setPileCalculations] = useState<PileCalculation[]>([]);
  const [footingCalculations, setFootingCalculations] = useState<FootingCalculation[]>([]);
  const [columnCalculations, setColumnCalculations] = useState<ColumnCalculation[]>([]);
  const [beamCalculations, setBeamCalculations] = useState<BeamCalculation[]>([]);
  const [slabCalculations, setSlabCalculations] = useState<SlabCalculation[]>([]);

  const handlePileCalculation = useCallback((calculation: PileCalculation | null) => {
    if (calculation) {
      setPileCalculations([calculation]);
    } else {
      setPileCalculations([]);
    }
  }, []);

  const handleFootingCalculation = useCallback((calculation: FootingCalculation | null) => {
    if (calculation) {
      setFootingCalculations([calculation]);
    } else {
      setFootingCalculations([]);
    }
  }, []);

  const handleColumnCalculation = useCallback((calculation: ColumnCalculation | null) => {
    if (calculation) {
      setColumnCalculations([calculation]);
    } else {
      setColumnCalculations([]);
    }
  }, []);

  const handleBeamCalculation = useCallback((calculation: BeamCalculation | null) => {
    if (calculation) {
      setBeamCalculations([calculation]);
    } else {
      setBeamCalculations([]);
    }
  }, []);

  const handleSlabCalculation = useCallback((calculation: SlabCalculation | null) => {
    if (calculation) {
      setSlabCalculations([calculation]);
    } else {
      setSlabCalculations([]);
    }
  }, []);

  const projectEstimate: ProjectEstimate = {
    piles: pileCalculations,
    footings: footingCalculations,
    columns: columnCalculations,
    beams: beamCalculations,
    slabs: slabCalculations,
    totalConcreteVolume: [
      ...pileCalculations,
      ...footingCalculations,
      ...columnCalculations,
      ...beamCalculations,
      ...slabCalculations
    ].reduce((sum, calc) => sum + calc.concreteVolume, 0),
    totalSteelWeight: [
      ...pileCalculations,
      ...footingCalculations,
      ...columnCalculations,
      ...beamCalculations,
      ...slabCalculations
    ].reduce((sum, calc) => sum + calc.steelWeight, 0)
  };

  const renderActiveCalculator = () => {
    switch (activeTab) {
      case 'pile':
        return <PileCalculator onCalculationChange={handlePileCalculation} />;
      case 'footing':
        return <FootingCalculator onCalculationChange={handleFootingCalculation} />;
      case 'column':
        return <ColumnCalculator onCalculationChange={handleColumnCalculation} />;
      case 'beam':
        return <BeamCalculator onCalculationChange={handleBeamCalculation} />;
      case 'slab':
        return <SlabCalculator onCalculationChange={handleSlabCalculation} />;
      default:
        return <PileCalculator onCalculationChange={handlePileCalculation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {renderActiveCalculator()}
          </div>
          
          <div className="xl:col-span-1">
            <ProjectSummary estimate={projectEstimate} />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © ২০২৫ স্ট্রাকচারাল এস্টিমেশন অ্যাপ্লিকেশন। সকল অধিকার সংরক্ষিত।
          </p>
          <p className="text-gray-400 text-sm mt-2">
            প্রফেশনাল কনস্ট্রাকশন ক্যালকুলেশনের জন্য ডিজাইন করা হয়েছে
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;