
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Sparkles, 
  Download, 
  Layers, 
  Type as TypeIcon, 
  Palette, 
  Settings2,
  ChevronRight,
  Monitor,
  Smartphone,
  Layout,
  FileJson,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Minimize2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { analyzeWebsite } from "./services/api";
import { CompositionData } from "./types";
import { LuxuryLayout, EditorialLayout, CinemaLayout, SaasLayout } from "./templates/Layouts";
import { toPng, toSvg } from "html-to-image";
import JSZip from "jszip";

export default function App() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [composition, setComposition] = useState<CompositionData | null>(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [isExporting, setIsExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDemo = () => {
    setComposition({
      title: "The Art of Sound",
      description: "Premium acoustics meets cinematic design in our most advanced listening experience yet.",
      features: ["Cinematic Spatial Audio", "Adaptive Noise Control", "Lossless Architecture"],
      brand: {
        name: "Auralis",
        logoUrl: "",
        colors: ["#6366f1", "#050505"],
        typography: { primary: "Cormorant Garamond", secondary: "Inter" }
      },
      domain: "auralis.audio",
      instagram: "@auralis.sound",
      screenshots: {
        desktop: "https://images.unsplash.com/photo-1546435770-a3e426ff473b?auto=format&fit=crop&q=80&w=1440&h=900",
        mobile: "https://images.unsplash.com/photo-1546435770-a3e426ff473b?auto=format&fit=crop&q=80&w=390&h=844"
      },
      layout: 'cinema',
      lights: { glowColor: "#6366f1", intensity: 0.7 }
    });
  };

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeWebsite(url);
      setComposition(data.composition);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze website. Ensure the URL is valid and accessible.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportPng = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `showcase-${composition?.brand.name || 'render'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSvg = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toSvg(previewRef.current, {
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `showcase-${composition?.brand.name || 'render'}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    if (!composition) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${composition.title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="render">
        <h1>${composition.title}</h1>
        <p>${composition.description}</p>
        <div class="screenshots">
            <img src="assets/desktop.png" class="desktop">
            <img src="assets/mobile.png" class="mobile">
        </div>
    </div>
</body>
</html>`;

      zip.file("index.html", htmlContent);
      zip.file("composition.json", JSON.stringify(composition, null, 2));
      
      const assets = zip.folder("assets");
      if (assets) {
        // Simple base64 strip
        const desktopData = composition.screenshots.desktop.split(',')[1];
        const mobileData = composition.screenshots.mobile.split(',')[1];
        assets.file("desktop.png", desktopData, { base64: true });
        assets.file("mobile.png", mobileData, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `project-${composition.brand.name}.zip`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden font-sans">
      {/* Header / Sidebar Control */}
      <AnimatePresence>
        {!composition && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
            <div className="max-w-xl w-full px-8 flex flex-col items-center text-center relative z-10">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mb-10 border border-white/10 rounded-3xl flex items-center justify-center bg-white/5 backdrop-blur-xl rotate-45"
              >
                <div className="-rotate-45">
                   <Sparkles className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                </div>
              </motion.div>
              <h1 className="text-6xl font-serif mb-6 leading-tight tracking-tight text-white">Editorial Studio <span className="text-indigo-500">AI</span></h1>
              <p className="text-white/40 mb-12 text-lg max-w-md leading-relaxed">
                Transform any digital destination into a cinematic premium composition automatically using advanced vision and semantic analysis.
              </p>
              <div className="relative w-full group">
                <Input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g. apple.com)"
                  className="h-16 bg-white/5 border-white/10 rounded-2xl px-8 text-lg pr-44 transition-all focus:bg-white/10 focus:border-indigo-500/50 text-white placeholder:text-white/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button 
                  onClick={handleAnalyze}
                  className="absolute right-2 top-2 h-12 px-8 rounded-xl bg-white text-black hover:bg-indigo-50 font-bold transition-all"
                >
                  Analyze
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="mt-10">
                <button 
                  onClick={handleDemo}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 hover:text-indigo-400 transition-all border-b border-white/5 pb-1 hover:border-indigo-500/30"
                >
                  Or Explore with Sample Data
                </button>
              </div>
              <div className="mt-20 flex gap-12 items-center opacity-20 text-[9px] uppercase tracking-[0.5em] font-bold">
                <span>Direct Capture</span>
                <span>Gemini 1.5 Pro</span>
                <span>4K Portfolio</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center max-w-sm w-full">
              <div className="relative w-24 h-24 mb-10">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-indigo-500 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-b-2 border-white/20 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-serif mb-4">Capturing Reality</h2>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "easeInOut" }}
                  className="h-full bg-indigo-500"
                />
              </div>
              <div className="flex flex-col items-center gap-2 opacity-50">
                 <p className="text-xs uppercase tracking-widest flex items-center gap-2">
                   <Loader2 className="w-3 h-3 animate-spin" />
                   Visiting {url}
                 </p>
                 <p className="text-xs uppercase tracking-widest">Extracting Brand Identity</p>
                 <p className="text-xs uppercase tracking-widest">Generating Editorial Plan</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {composition && (
        <div className="flex h-screen w-full">
          {/* Main Content Area */}
          <main className="flex-1 relative flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505] z-30">
               <div className="flex items-center gap-4">
                 <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">Editorial Studio</span>
                 <ChevronRight className="w-3 h-3 opacity-20" />
                 <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">{composition.brand.name}</span>
               </div>
               
               <div className="flex items-center gap-3">
                 <Button 
                    variant="ghost" 
                    className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white"
                    onClick={() => setComposition(null)}
                  >
                    New Project
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="bg-white/5 hover:bg-white/10 rounded-xl px-4 text-[9px] uppercase tracking-[0.2em] font-bold"
                    onClick={() => window.open(url, '_blank')}
                  >
                    View Source <ExternalLink className="w-3 d-3 ml-2" />
                  </Button>
               </div>
            </header>

            {/* Preview Canvas */}
            <div className={`flex-1 overflow-auto bg-[#0a0a0a] p-10 flex items-center justify-center transition-all ${isFullscreen ? 'fixed inset-0 z-50 p-0' : ''}`}>
              <div 
                ref={previewRef}
                className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] aspect-video h-full max-h-[800px] w-auto overflow-hidden bg-black"
                style={{ aspectRatio: '16/9' }}
                id="artwork-canvas"
              >
                {composition.layout === 'cinema' && <CinemaLayout data={composition} />}
                {composition.layout === 'luxury' && <LuxuryLayout data={composition} />}
                {composition.layout === 'editorial' && <EditorialLayout data={composition} />}
                {composition.layout === 'saas' && <SaasLayout data={composition} />}
                {/* Fallback to saas for others for now */}
                {!['luxury', 'editorial', 'cinema', 'saas'].includes(composition.layout) && <SaasLayout data={composition} />}
              </div>
            </div>
            
            {/* Bottom Controls / Stats */}
            <footer className="h-12 border-t border-white/5 px-8 flex items-center justify-between bg-[#050505]/50 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] opacity-40">
               <div className="flex gap-6">
                 <span>Capture: 2026.05.18</span>
                 <span>Format: 4K Ultra HD</span>
               </div>
               <div className="flex gap-6">
                 <span>Framer Motion Ready</span>
                 <span>Next.js 15 Compiled</span>
               </div>
            </footer>
          </main>

          {/* Right Sidebar - Editor */}
          <aside className="w-96 border-l border-white/5 bg-[#080808] z-40 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-6 pt-6 mb-6">
                 <TabsList className="w-full bg-white/5 p-1 rounded-xl">
                   <TabsTrigger value="preview" className="flex-1 rounded-lg text-xs uppercase tracking-widest">
                     <Layout className="w-3 h-3 mr-2" /> Design
                   </TabsTrigger>
                   <TabsTrigger value="export" className="flex-1 rounded-lg text-xs uppercase tracking-widest">
                     <Download className="w-3 h-3 mr-2" /> Export
                   </TabsTrigger>
                 </TabsList>
              </div>

              <ScrollArea className="flex-1 px-6">
                <TabsContent value="preview" className="space-y-8 mt-0 pb-10">
                   {/* Layout Selection */}
                   <div className="space-y-3">
                     <Label className="text-[10px] uppercase tracking-widest opacity-40">Composition Template</Label>
                     <div className="grid grid-cols-2 gap-2">
                        {['cinema', 'luxury', 'editorial', 'saas'].map(l => (
                          <button 
                            key={l}
                            onClick={() => setComposition({...composition, layout: l as any})}
                            className={`p-4 rounded-xl border text-center transition-all ${composition.layout === l ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'}`}
                          >
                             <span className="text-[10px] uppercase tracking-widest block">{l}</span>
                          </button>
                        ))}
                     </div>
                   </div>

                   {/* Typography System */}
                   <div className="space-y-4">
                      <Label className="text-[10px] uppercase tracking-widest opacity-40">Typography System</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Primary Font (Headings)</p>
                          <Input 
                            value={composition.brand.typography.primary}
                            onChange={(e) => setComposition({
                              ...composition,
                              brand: {
                                ...composition.brand,
                                typography: { ...composition.brand.typography, primary: e.target.value }
                              }
                            })}
                            placeholder="e.g. Playfair Display"
                            className="bg-white/5 border-white/5 rounded-xl h-10 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Secondary Font (Interface)</p>
                          <Input 
                            value={composition.brand.typography.secondary}
                            onChange={(e) => setComposition({
                              ...composition,
                              brand: {
                                ...composition.brand,
                                typography: { ...composition.brand.typography, secondary: e.target.value }
                              }
                            })}
                            placeholder="e.g. Outfit"
                            className="bg-white/5 border-white/5 rounded-xl h-10 text-xs"
                          />
                        </div>
                      </div>
                   </div>

                   {/* Content Elements */}
                   <div className="space-y-4">
                      <Label className="text-[10px] uppercase tracking-widest opacity-40">Content Elements</Label>
                      <div className="space-y-2">
                        <Input 
                          value={composition.title}
                          onChange={(e) => setComposition({...composition, title: e.target.value})}
                          placeholder="Headline"
                          className="bg-white/5 border-white/5 rounded-xl h-12"
                        />
                        <Input 
                          value={composition.description}
                          onChange={(e) => setComposition({...composition, description: e.target.value})}
                          placeholder="Description"
                          className="bg-white/5 border-white/5 rounded-xl h-12"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            value={composition.domain || ""}
                            onChange={(e) => setComposition({...composition, domain: e.target.value})}
                            placeholder="Domain"
                            className="bg-white/5 border-white/5 rounded-xl h-10 text-xs"
                          />
                          <Input 
                            value={composition.instagram || ""}
                            onChange={(e) => setComposition({...composition, instagram: e.target.value})}
                            placeholder="Instagram"
                            className="bg-white/5 border-white/5 rounded-xl h-10 text-xs"
                          />
                        </div>
                      </div>
                   </div>

                   {/* Visuals */}
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] uppercase tracking-widest opacity-40">Atmospheric Intensity</Label>
                          <span className="text-[10px] text-indigo-400 font-mono">{Math.round(composition.lights.intensity * 100)}%</span>
                        </div>
                        <Slider 
                           value={[composition.lights.intensity * 100]}
                           onValueChange={(val: any) => {
                             const v = Array.isArray(val) ? val[0] : val;
                             if (composition) {
                               setComposition({
                                 ...composition,
                                 lights: { ...composition.lights, intensity: v / 100 }
                               });
                             }
                           }}
                           max={100}
                           step={1}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-widest opacity-40">Brand Accent</Label>
                        <div className="flex gap-2">
                          {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map(c => (
                            <button 
                              key={c}
                              onClick={() => setComposition({
                                ...composition,
                                lights: { ...composition.lights, glowColor: c }
                              })}
                              className={`w-8 h-8 rounded-full border-2 transition-transform ${composition.lights.glowColor === c ? 'scale-125 border-white' : 'border-transparent hover:scale-110'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                   </div>
                   
                   {/* Features */}
                   <div className="space-y-3">
                     <Label className="text-[10px] uppercase tracking-widest opacity-40">Extracted Features</Label>
                     <div className="space-y-2">
                        {composition.features.map((f, i) => (
                          <div key={i} className="flex gap-2">
                            <Input 
                              value={f}
                              onChange={(e) => {
                                const newFeatures = [...composition.features];
                                newFeatures[i] = e.target.value;
                                setComposition({...composition, features: newFeatures});
                              }}
                              className="bg-white/5 border-white/5 rounded-xl text-xs h-10"
                            />
                          </div>
                        ))}
                     </div>
                   </div>
                </TabsContent>

                <TabsContent value="export" className="space-y-6 mt-0 pb-10">
                   <Card className="bg-white/5 border-white/5 p-6 rounded-2xl overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileJson className="w-12 h-12" />
                      </div>
                      <h4 className="text-sm font-medium mb-2">Clean Project Export</h4>
                      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        Export full-fidelity HTML, CSS, and JS. All assets are optimized for production.
                      </p>
                      <Button 
                        disabled={isExporting}
                        onClick={handleExportZip}
                        className="w-full bg-white text-black hover:bg-gray-200 rounded-xl py-6"
                      >
                         {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileJson className="w-4 h-4 mr-2" />}
                         Download Zip Bundle
                      </Button>
                   </Card>

                   <Card className="bg-white/5 border-white/5 p-6 rounded-2xl overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                      <h4 className="text-sm font-medium mb-2">High-Res Render</h4>
                      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        Capture the current composition in 4K resolution as a premium artwork.
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          disabled={isExporting}
                          onClick={handleExportPng}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-xl py-6"
                        >
                           {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                           PNG
                        </Button>
                        <Button 
                          disabled={isExporting}
                          onClick={handleExportSvg}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl py-6"
                        >
                           {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Layers className="w-4 h-4 mr-2" />}
                           SVG
                        </Button>
                      </div>
                   </Card>

                   <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
                     <p className="text-[10px] leading-relaxed text-indigo-300 uppercase tracking-widest font-medium">
                       Note: Exported files include all device mockups, custom typography, and atmospheric lighting filters.
                     </p>
                   </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </aside>
        </div>
      )}
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
