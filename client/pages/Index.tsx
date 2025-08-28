import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { MobileLayout } from "@/components/MobileLayout";
import { MobileTable } from "@/components/MobileTable";
import {
  Building2,
  Calculator,
  Plus,
  Settings,
  Download,
  Printer,
  Save,
  BarChart3,
  FileText,
  PieChart,
  Activity,
  Layers,
  Home,
  Wrench,
  Palette,
  User,
  Menu,
  Search,
  Filter,
  SortAsc,
  Edit,
  Copy,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
} from "lucide-react";
import { computeItem, getUnitLabel, DEFAULT_RATES as EST_DEFAULT_RATES, findItemDef, computeProjectTotals } from "@/lib/estimation";

// Construction item types with enhanced categorization
const CONSTRUCTION_ITEMS = {
  foundation: {
    label: "Foundation Works",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    items: [
      { id: "pile", name: "Pile Foundation", unit: "cft" },
      { id: "footing", name: "Isolated Footing", unit: "cft" },
      { id: "combined_footing", name: "Combined Footing", unit: "cft" },
      { id: "strap_footing", name: "Strap Footing", unit: "cft" },
      { id: "strip_footing", name: "Strip Footing", unit: "cft" },
      { id: "raft", name: "Raft Foundation", unit: "cft" },
      { id: "retaining_wall", name: "Retaining Wall", unit: "cft" },
    ]
  },
  structure: {
    label: "Structural Works",
    icon: Layers,
    color: "text-green-600",
    bgColor: "bg-green-50",
    items: [
      { id: "column", name: "Column", unit: "cft" },
      { id: "beam", name: "Beam", unit: "cft" },
      { id: "slab", name: "Slab", unit: "cft" },
      { id: "stair", name: "Staircase", unit: "cft" },
      { id: "lintel", name: "Lintel", unit: "cft" },
    ]
  },
  masonry: {
    label: "Masonry Works",
    icon: Home,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    items: [
      { id: "brick_wall", name: "Brick Wall", unit: "sft" },
      { id: "block_wall", name: "Block Wall", unit: "sft" },
      { id: "partition", name: "Partition Wall", unit: "sft" },
    ]
  },
  finishing: {
    label: "Finishing Works",
    icon: Palette,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    items: [
      { id: "plaster", name: "Plaster Work", unit: "sft" },
      { id: "tiles", name: "Tile Work", unit: "sft" },
      { id: "paint", name: "Paint Work", unit: "sft" },
    ]
  },
  utilities: {
    label: "Utility Works",
    icon: Wrench,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    items: [
      { id: "plumbing", name: "Plumbing Work", unit: "point" },
      { id: "electrical", name: "Electrical Work", unit: "point" },
      { id: "hvac", name: "HVAC Work", unit: "point" },
    ]
  },
  custom: {
    label: "Custom",
    icon: Package,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    items: [
      { id: "custom", name: "Custom Item", unit: "unit" }
    ]
  }
};

// Default material rates (BDT)
const DEFAULT_RATES = EST_DEFAULT_RATES as const;

interface EstimateItem {
  id: string;
  itemId: string;
  type: string;
  category: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    thickness?: number;
    quantity?: number;
  };
  reinforcement: {
    mainBars: number;
    stirrups: number;
    spacing: number;
  };
  materials: {
    cement: number;
    sand: number;
    aggregate: number;
    brick?: number;
    steel: number;
  };
  volume: number;
  area?: number;
  subtotal?: number;
  totalCost: number;
  createdAt: string;
  isMultiple: boolean;
  multipleQuantity: number;
}

interface ProjectSummary {
  totalItems: number;
  totalVolume: number;
  totalSteel: number;
  totalCost: number;
  categoryBreakdown: Record<string, { items: number; cost: number }>;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("items");
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EstimateItem | null>(null);
  const [customRates, setCustomRates] = useState(DEFAULT_RATES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [projectName, setProjectName] = useState("Sathisamadder - Estimates 20");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();

  // Form state for new/edit item
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    description: "",
    length: "",
    width: "",
    height: "",
    thickness: "",
    quantity: "1",
    mainBars: "12",
    stirrups: "8",
    spacing: "6",
    isMultiple: false,
    multipleQuantity: "1",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("construction-items");
    const savedRates = localStorage.getItem("custom-rates");
    const savedProject = localStorage.getItem("project-name");
    const savedClient = localStorage.getItem("client-info");
    
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error("Error loading items:", error);
      }
    }
    
    if (savedRates) {
      try {
        setCustomRates(JSON.parse(savedRates));
      } catch (error) {
        console.error("Error loading rates:", error);
      }
    }
    
    if (savedProject) {
      setProjectName(savedProject);
    }

    if (savedClient) {
      try {
        setClientInfo(JSON.parse(savedClient));
      } catch (error) {
        console.error("Error loading client info:", error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback(() => {
    localStorage.setItem("construction-items", JSON.stringify(items));
    localStorage.setItem("custom-rates", JSON.stringify(customRates));
    localStorage.setItem("project-name", projectName);
    localStorage.setItem("client-info", JSON.stringify(clientInfo));
    toast({
      title: "Project Saved",
      description: "Your project data has been saved locally.",
    });
  }, [items, customRates, projectName, clientInfo, toast]);

  // Calculate materials and cost for an item using centralized logic
  const calculateItem = useCallback((data: any) => {
    const dims = {
      length: parseFloat(data.length) || 0,
      width: parseFloat(data.width) || 0,
      height: parseFloat(data.height) || 0,
      thickness: parseFloat(data.thickness) || 0,
      quantity: parseFloat(data.quantity) || 1,
      multiple: data.isMultiple ? parseFloat(data.multipleQuantity) || 1 : 1,
    };
    const result = computeItem(data.type, dims, customRates as any);
    return {
      volume: result.materials.volume,
      brickQuantity: result.materials.bricks,
      plasterArea: result.materials.area,
      materials: {
        cement: result.materials.cement,
        sand: result.materials.sand,
        aggregate: result.materials.aggregate,
        brick: result.materials.bricks,
        steel: result.materials.steel,
      },
      totalCost: result.totalWithAdjustments,
      subtotal: result.costs.subtotal,
    };
  }, [customRates]);

  // Add new item
  const handleAddItem = useCallback(() => {
    if (!formData.type) {
      toast({ title: "Select Item Type", description: "Please choose an item type.", variant: "destructive" });
      return;
    }

    const def = findItemDef(formData.type);
    const has = (v: string) => v !== "" && !isNaN(parseFloat(v));
    let valid = false;
    if (def?.mode === "wall") {
      valid = has(formData.length) && has(formData.height);
    } else if (def?.mode === "area") {
      valid = has(formData.length) && has(formData.width);
    } else {
      valid = has(formData.length) && has(formData.width) && (has(formData.height) || has(formData.thickness || ""));
    }
    if (!valid) {
      toast({ title: "Missing Information", description: "Dimensions incomplete for selected item.", variant: "destructive" });
      return;
    }

    const calculations = calculateItem(formData);
    const categoryInfo = Object.values(CONSTRUCTION_ITEMS).find(cat =>
      cat.items.some(item => item.id === formData.type)
    );
    const itemInfo = categoryInfo?.items.find(item => item.id === formData.type) || { id: "custom", name: "Custom Item", unit: "unit" } as any;

    const newItem: EstimateItem = {
      id: Date.now().toString(),
      itemId: `${formData.type.toUpperCase()}-${String(items.length + 1).padStart(3, '0')}`,
      type: itemInfo?.name || formData.type,
      category: categoryInfo?.label || "Other",
      description: formData.description || `${itemInfo?.name} - ${formData.length}' × ${formData.width}' × ${formData.height}'`,
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        thickness: parseFloat(formData.thickness) || undefined,
        quantity: parseFloat(formData.quantity),
      },
      reinforcement: {
        mainBars: parseFloat(formData.mainBars),
        stirrups: parseFloat(formData.stirrups),
        spacing: parseFloat(formData.spacing),
      },
      materials: calculations.materials,
      volume: calculations.volume,
      area: calculations.plasterArea,
      subtotal: calculations.subtotal,
      totalCost: calculations.totalCost,
      createdAt: new Date().toISOString(),
      isMultiple: formData.isMultiple,
      multipleQuantity: parseFloat(formData.multipleQuantity),
    };

    setItems(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Item Added",
      description: `${newItem.type} has been added to your project.`,
    });
  }, [formData, items.length, calculateItem, toast]);

  // Reset form
  const resetForm = () => {
    setFormData({
      type: "",
      category: "",
      description: "",
      length: "",
      width: "",
      height: "",
      thickness: "",
      quantity: "1",
      mainBars: "12",
      stirrups: "8",
      spacing: "6",
      isMultiple: false,
      multipleQuantity: "1",
    });
  };

  // Edit item
  const handleEditItem = (item: EstimateItem) => {
    setEditingItem(item);
    setFormData({
      type: Object.values(CONSTRUCTION_ITEMS)
        .flatMap(cat => cat.items)
        .find(i => i.name === item.type)?.id || "",
      category: item.category,
      description: item.description,
      length: item.dimensions.length.toString(),
      width: item.dimensions.width.toString(),
      height: item.dimensions.height.toString(),
      thickness: item.dimensions.thickness?.toString() || "",
      quantity: item.dimensions.quantity?.toString() || "1",
      mainBars: item.reinforcement.mainBars.toString(),
      stirrups: item.reinforcement.stirrups.toString(),
      spacing: item.reinforcement.spacing.toString(),
      isMultiple: item.isMultiple,
      multipleQuantity: item.multipleQuantity.toString(),
    });
    setIsAddDialogOpen(true);
  };

  // Update item
  const handleUpdateItem = () => {
    if (!editingItem) return;

    const calculations = calculateItem(formData);
    const categoryInfo = Object.values(CONSTRUCTION_ITEMS).find(cat =>
      cat.items.some(item => item.id === formData.type)
    );
    const itemInfo = categoryInfo?.items.find(item => item.id === formData.type) || { id: "custom", name: "Custom Item", unit: "unit" } as any;

    const updatedItem: EstimateItem = {
      ...editingItem,
      type: itemInfo?.name || formData.type,
      category: categoryInfo?.label || "Other",
      description: formData.description || `${itemInfo?.name} - ${formData.length}' × ${formData.width}' × ${formData.height}'`,
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        thickness: parseFloat(formData.thickness) || undefined,
        quantity: parseFloat(formData.quantity),
      },
      reinforcement: {
        mainBars: parseFloat(formData.mainBars),
        stirrups: parseFloat(formData.stirrups),
        spacing: parseFloat(formData.spacing),
      },
      materials: calculations.materials,
      volume: calculations.volume,
      area: calculations.plasterArea,
      subtotal: calculations.subtotal,
      totalCost: calculations.totalCost,
      isMultiple: formData.isMultiple,
      multipleQuantity: parseFloat(formData.multipleQuantity),
    };

    setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    setIsAddDialogOpen(false);
    setEditingItem(null);
    resetForm();

    toast({
      title: "Item Updated",
      description: "The item has been successfully updated.",
    });
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Deleted",
      description: "The item has been removed from your project.",
    });
  };

  // Duplicate item
  const handleDuplicateItem = (item: EstimateItem) => {
    const duplicatedItem: EstimateItem = {
      ...item,
      id: Date.now().toString(),
      itemId: `${item.itemId}-COPY`,
      description: `${item.description} (Copy)`,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, duplicatedItem]);
    toast({
      title: "Item Duplicated",
      description: "A copy of the item has been created.",
    });
  };

  // Calculate project summary
  const projectSummary: ProjectSummary = {
    totalItems: items.length,
    totalVolume: items.reduce((sum, item) => sum + item.volume, 0),
    totalSteel: items.reduce((sum, item) => sum + item.materials.steel, 0),
    totalCost: items.reduce((sum, item) => sum + (item.subtotal ?? item.totalCost), 0),
    categoryBreakdown: items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { items: 0, cost: 0 };
      }
      acc[item.category].items += 1;
      acc[item.category].cost += (item.subtotal ?? item.totalCost);
      return acc;
    }, {} as Record<string, { items: number; cost: number }>),
  };

  const totals = computeProjectTotals(items.map(i => i.subtotal ?? i.totalCost), customRates as any);

  // Format currency
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.itemId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "cost":
          return b.totalCost - a.totalCost;
        case "volume":
          return b.volume - a.volume;
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Prepare data for mobile table
  const mobileTableItems = filteredItems.map(item => {
    const categoryInfo = Object.values(CONSTRUCTION_ITEMS).find(cat => cat.label === item.category);
    return {
      ...item,
      icon: categoryInfo?.icon || Building2,
      color: categoryInfo?.color || "text-gray-600",
      bgColor: categoryInfo?.bgColor || "bg-gray-50",
      reinforcement: item.materials.steel,
      brickQuantity: item.materials.brick,
      plasterArea: item.type.includes("plaster") || item.type.includes("paint") || item.type.includes("tiles") 
        ? item.dimensions.length * item.dimensions.width 
        : undefined,
      unit: Object.values(CONSTRUCTION_ITEMS)
        .flatMap(cat => cat.items)
        .find(i => i.name === item.type)?.unit || "cft",
    };
  });

  // Export data
  const handleExport = () => {
    const exportData = {
      projectName,
      summary: projectSummary,
      items: items,
      customRates,
      client: clientInfo,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_estimate.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your project data has been exported successfully.",
    });
  };

  // Print report
  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Ready",
      description: "The print dialog has been opened.",
    });
  };

  // Mobile layout wrapper
  if (isMobile) {
    return (
      <MobileLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddItem={() => setIsAddDialogOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onSave={saveData}
        onExport={handleExport}
        onPrint={handlePrint}
        projectName={projectName}
        totalCost={formatBDT(totals.grandTotal)}
        itemCount={projectSummary.totalItems}
      >
        <div className="p-4 space-y-4">
          {activeTab === "client" && (
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Client name" value={clientInfo.name} onChange={(e)=>setClientInfo(prev=>({...prev,name:e.target.value}))} />
                <Input placeholder="Email" type="email" value={clientInfo.email} onChange={(e)=>setClientInfo(prev=>({...prev,email:e.target.value}))} />
                <Input placeholder="Phone" value={clientInfo.phone} onChange={(e)=>setClientInfo(prev=>({...prev,phone:e.target.value}))} />
                <Textarea placeholder="Address" value={clientInfo.address} onChange={(e)=>setClientInfo(prev=>({...prev,address:e.target.value}))} />
                <Separator />
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" value={projectName} onChange={(e)=>setProjectName(e.target.value)} />
                <div className="text-sm text-gray-700">Total Estimate: <span className="font-semibold text-brand-700">{formatBDT(totals.grandTotal)}</span></div>
                <Button className="bg-brand-500 hover:bg-brand-600" onClick={saveData}>Save Client & Project</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "items" && (
            <div className="space-y-4">
              {/* Search and Filter Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {Object.values(CONSTRUCTION_ITEMS).map(category => (
                            <SelectItem key={category.label} value={category.label}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date Added</SelectItem>
                          <SelectItem value="cost">Cost (High to Low)</SelectItem>
                          <SelectItem value="volume">Volume (High to Low)</SelectItem>
                          <SelectItem value="type">Type (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items List */}
              <MobileTable
                items={mobileTableItems}
                onEdit={handleEditItem}
                onDuplicate={handleDuplicateItem}
                onDelete={handleDeleteItem}
                formatBDT={formatBDT}
              />
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-4">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-brand-600" />
                    <span>Project Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-blue-600">{projectSummary.totalItems}</p>
                      <p className="text-sm text-gray-600">Total Items</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Activity className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-green-600">{Math.round(projectSummary.totalVolume)}</p>
                      <p className="text-sm text-gray-600">Total Volume (cft)</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-orange-600">{Math.round(projectSummary.totalSteel)}</p>
                      <p className="text-sm text-gray-600">Steel Required (kg)</p>
                    </div>
                    <div className="text-center p-3 bg-brand-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-brand-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-brand-600">{formatBDT(totals.grandTotal)}</p>
                      <p className="text-sm text-gray-600">Total Cost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(projectSummary.categoryBreakdown).map(([category, data]) => {
                      const categoryInfo = Object.values(CONSTRUCTION_ITEMS).find(cat => cat.label === category);
                      const IconComponent = categoryInfo?.icon || Building2;
                      const percentage = (data.cost / projectSummary.totalCost) * 100;
                      
                      return (
                        <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${categoryInfo?.bgColor || 'bg-gray-100'}`}>
                              <IconComponent className={`h-4 w-4 ${categoryInfo?.color || 'text-gray-600'}`} />
                            </div>
                            <div>
                              <p className="font-medium">{category}</p>
                              <p className="text-sm text-gray-600">{data.items} items</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-brand-600">{formatBDT(data.cost)}</p>
                            <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "details" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-brand-600" />
                  <span>Detailed Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Detailed Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate comprehensive project reports with material breakdowns and cost analysis.
                    </p>
                    <Button className="bg-brand-500 hover:bg-brand-600">
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-brand-600" />
                  <span>Project Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View detailed charts and analytics for better project insights.
                    </p>
                    <Button className="bg-brand-500 hover:bg-brand-600">
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MobileLayout>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen gpt5-gradient">
      {/* Desktop Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl ring-1 ring-black/5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F60f84872b4b14093aa9e83d9ad74d969%2F46361fbad51e408b89450daa00371588"
                  alt="ROY Logo"
                  className="w-8 h-8 object-contain bg-transparent"
                  style={{ background: "transparent", backdropFilter: "none" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <Calculator className="h-7 w-7 text-white hidden" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ROY</h1>
                <p className="text-sm text-gray-600">Professional Construction Estimator</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back</p>
                <p className="font-medium text-gray-900">{currentUser?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => logout().catch(console.error)}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{projectName}</h2>
              <p className="text-gray-600">
                {projectSummary.totalItems} items • {formatBDT(totals.grandTotal)} total
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setIsPricingOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Pricing
              </Button>
              <Button variant="outline" onClick={saveData}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-brand-500 hover:bg-brand-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="client" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Client</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Project Items</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Cost Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Detailed Report</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.values(CONSTRUCTION_ITEMS).map(category => (
                        <SelectItem key={category.label} value={category.label}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Added</SelectItem>
                      <SelectItem value="cost">Cost (High to Low)</SelectItem>
                      <SelectItem value="volume">Volume (High to Low)</SelectItem>
                      <SelectItem value="type">Type (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
              <CardContent className="p-0">
                <MobileTable
                  items={mobileTableItems}
                  onEdit={handleEditItem}
                  onDuplicate={handleDuplicateItem}
                  onDelete={handleDeleteItem}
                  formatBDT={formatBDT}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            {/* Summary content similar to mobile but in desktop layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-600">{projectSummary.totalItems}</p>
                  <p className="text-gray-600">Total Items</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-600">{Math.round(projectSummary.totalVolume)}</p>
                  <p className="text-gray-600">Total Volume (cft)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-orange-600">{Math.round(projectSummary.totalSteel)}</p>
                  <p className="text-gray-600">Steel Required (kg)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-brand-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-brand-600">{formatBDT(totals.grandTotal)}</p>
                  <p className="text-gray-600">Total Cost</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(projectSummary.categoryBreakdown).map(([category, data]) => {
                    const categoryInfo = Object.values(CONSTRUCTION_ITEMS).find(cat => cat.label === category);
                    const IconComponent = categoryInfo?.icon || Building2;
                    const percentage = (data.cost / projectSummary.totalCost) * 100;
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${categoryInfo?.bgColor || 'bg-gray-100'}`}>
                            <IconComponent className={`h-6 w-6 ${categoryInfo?.color || 'text-gray-600'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{category}</p>
                            <p className="text-sm text-gray-600">{data.items} items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-600">{formatBDT(data.cost)}</p>
                          <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Detailed Report</h3>
                  <p className="text-gray-600 mb-6">
                    Generate comprehensive project reports with material breakdowns and cost analysis.
                  </p>
                  <Button className="bg-brand-500 hover:bg-brand-600">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 mb-6">
                    View detailed charts and analytics for better project insights.
                  </p>
                  <Button className="bg-brand-500 hover:bg-brand-600">
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Item Dialog/Sheet */}
      {isMobile ? (
        <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <SheetContent side="bottom" className="h-[90vh]">
            <SheetHeader>
              <SheetTitle>
                {editingItem ? "Edit Item" : "Add New Item"}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4 py-4">
                {/* Form content - same as desktop but optimized for mobile */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="type">Item Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONSTRUCTION_ITEMS).map(([key, category]) => (
                          <div key={key}>
                            <div className="px-2 py-1 text-sm font-medium text-gray-500">
                              {category.label}
                            </div>
                            {category.items.map(item => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter item description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="length">Length ({getUnitLabel(formData.type,'length')}) *</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.length}
                        onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width ({getUnitLabel(formData.type,'width')}) *</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.width}
                        onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height ({getUnitLabel(formData.type,'height')}) *</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="thickness">Thickness ({getUnitLabel(formData.type,'thickness')})</Label>
                      <Input
                        id="thickness"
                        type="number"
                        step="0.1"
                        placeholder="0.33"
                        value={formData.thickness}
                        onChange={(e) => setFormData(prev => ({ ...prev, thickness: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multiple"
                      checked={formData.isMultiple}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMultiple: checked }))}
                    />
                    <Label htmlFor="multiple">Multiple Units</Label>
                  </div>

                  {formData.isMultiple && (
                    <div>
                      <Label htmlFor="multipleQuantity">Quantity</Label>
                      <Input
                        id="multipleQuantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={formData.multipleQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, multipleQuantity: e.target.value }))}
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Reinforcement Details</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="mainBars">Main Bars (mm)</Label>
                        <Select value={formData.mainBars} onValueChange={(value) => setFormData(prev => ({ ...prev, mainBars: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10mm</SelectItem>
                            <SelectItem value="12">12mm</SelectItem>
                            <SelectItem value="16">16mm</SelectItem>
                            <SelectItem value="20">20mm</SelectItem>
                            <SelectItem value="25">25mm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stirrups">Stirrups (mm)</Label>
                        <Select value={formData.stirrups} onValueChange={(value) => setFormData(prev => ({ ...prev, stirrups: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6mm</SelectItem>
                            <SelectItem value="8">8mm</SelectItem>
                            <SelectItem value="10">10mm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="spacing">Spacing (inch)</Label>
                        <Input
                          id="spacing"
                          type="number"
                          placeholder="6"
                          value={formData.spacing}
                          onChange={(e) => setFormData(prev => ({ ...prev, spacing: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingItem ? handleUpdateItem : handleAddItem}
                    className="flex-1 bg-brand-500 hover:bg-brand-600"
                  >
                    {editingItem ? "Update Item" : "Add Item"}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Item" : "Add New Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Same form content as mobile but in dialog format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="type">Item Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONSTRUCTION_ITEMS).map(([key, category]) => (
                        <div key={key}>
                          <div className="px-2 py-1 text-sm font-medium text-gray-500">
                            {category.label}
                          </div>
                          {category.items.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter item description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="length">Length (ft) *</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.length}
                    onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (ft) *</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.width}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height (ft) *</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="thickness">Thickness (ft)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    step="0.1"
                    placeholder="0.33"
                    value={formData.thickness}
                    onChange={(e) => setFormData(prev => ({ ...prev, thickness: e.target.value }))}
                  />
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="multiple"
                    checked={formData.isMultiple}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMultiple: checked }))}
                  />
                  <Label htmlFor="multiple">Multiple Units</Label>
                </div>

                {formData.isMultiple && (
                  <div className="col-span-2">
                    <Label htmlFor="multipleQuantity">Quantity</Label>
                    <Input
                      id="multipleQuantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.multipleQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, multipleQuantity: e.target.value }))}
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <Separator />
                </div>

                <div className="col-span-2">
                  <h4 className="font-medium mb-3">Reinforcement Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="mainBars">Main Bars (mm)</Label>
                      <Select value={formData.mainBars} onValueChange={(value) => setFormData(prev => ({ ...prev, mainBars: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10mm</SelectItem>
                          <SelectItem value="12">12mm</SelectItem>
                          <SelectItem value="16">16mm</SelectItem>
                          <SelectItem value="20">20mm</SelectItem>
                          <SelectItem value="25">25mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stirrups">Stirrups (mm)</Label>
                      <Select value={formData.stirrups} onValueChange={(value) => setFormData(prev => ({ ...prev, stirrups: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6mm</SelectItem>
                          <SelectItem value="8">8mm</SelectItem>
                          <SelectItem value="10">10mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="spacing">Spacing (inch)</Label>
                      <Input
                        id="spacing"
                        type="number"
                        placeholder="6"
                        value={formData.spacing}
                        onChange={(e) => setFormData(prev => ({ ...prev, spacing: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="bg-brand-500 hover:bg-brand-600"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Pricing Settings Dialog */}
      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Material Pricing Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cement">Cement (BDT/bag)</Label>
                <Input
                  id="cement"
                  type="number"
                  value={customRates.cement}
                  onChange={(e) => setCustomRates(prev => ({ ...prev, cement: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="sand">Sand (BDT/cft)</Label>
                <Input
                  id="sand"
                  type="number"
                  value={customRates.sand}
                  onChange={(e) => setCustomRates(prev => ({ ...prev, sand: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="aggregate">Aggregate (BDT/cft)</Label>
                <Input
                  id="aggregate"
                  type="number"
                  value={customRates.aggregate}
                  onChange={(e) => setCustomRates(prev => ({ ...prev, aggregate: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="brick">Brick (BDT/piece)</Label>
                <Input
                  id="brick"
                  type="number"
                  value={customRates.brick}
                  onChange={(e) => setCustomRates(prev => ({ ...prev, brick: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="steel">Steel (BDT/kg)</Label>
                <Input
                  id="steel"
                  type="number"
                  value={customRates.steel}
                  onChange={(e) => setCustomRates(prev => ({ ...prev, steel: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="labor">Labor (BDT/day)</Label>
                <Input
                  id="labor"
                  type="number"
                  value={customRates.labor}
                  onChange={(e) => setCustomRates(prev => ({ ...prev, labor: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setCustomRates(DEFAULT_RATES)}
              >
                Reset to Default
              </Button>
              <Button
                onClick={() => setIsPricingOpen(false)}
                className="bg-brand-500 hover:bg-brand-600"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
