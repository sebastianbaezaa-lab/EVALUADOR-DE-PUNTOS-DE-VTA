import React, { useState } from 'react';
import { Building2, MapPin, DollarSign, Calculator, Loader2, Info } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeProperty } from './services/geminiService';

export default function App() {
  const [address, setAddress] = useState('');
  const [rentalAmount, setRentalAmount] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !rentalAmount) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const amount = parseFloat(rentalAmount.replace(/[^0-9.-]+/g, ''));
      if (isNaN(amount)) throw new Error('Por favor ingresa un monto válido.');
      
      const analysisText = await analyzeProperty(address, amount);
      setResult(analysisText);
    } catch (err: any) {
      setError(err.message || 'Se produjo un error al analizar la propiedad.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRentalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic formatting for Chilean pesos
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      const formatted = new Intl.NumberFormat('es-CL').format(parseInt(value, 10));
      setRentalAmount(formatted);
    } else {
      setRentalAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">ASF Property Analyzer</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide hidden sm:block">Expansión Comercial • Chile</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter text-right">
            Inteligencia<br className="sm:hidden" /> Inmobiliaria
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4">
            <div className="bento-card sticky top-8">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  Nueva Evaluación
                </h2>
                <p className="text-xs text-slate-500 mt-1 italic">
                  Ingresa los datos para análisis de viabilidad comercial.
                </p>
              </div>
              
              <div>
                <form onSubmit={handleAnalyze} className="space-y-5">
                  <div>
                    <label htmlFor="address" className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                      Dirección de la Propiedad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 shadow-sm placeholder:text-slate-400 transition-all font-sans"
                        placeholder="Ej: Av. Valparaíso 123, Viña del Mar"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rentalAmount" className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1">
                      Monto de Arriendo (CLP)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="rentalAmount"
                        value={rentalAmount}
                        onChange={handleRentalChange}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold text-indigo-600 shadow-sm placeholder:text-slate-400 transition-all font-sans"
                        placeholder="1.200.000"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-2 font-medium">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAnalyzing || !address || !rentalAmount}
                    className="w-full flex justify-center items-center py-3 px-4 border border-indigo-500 rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:border-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all mt-4"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Analizando...
                      </>
                    ) : (
                      'Generar Reporte de Viabilidad'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {isAnalyzing ? (
              <div className="bento-card flex flex-col items-center justify-center p-12 h-full min-h-[400px]">
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <Building2 className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
                <h3 className="mt-6 text-sm font-bold text-slate-800 uppercase">Analizando propiedad...</h3>
                <p className="text-slate-500 text-[11px] mt-2 text-center max-w-sm italic">
                  Procesando datos demográficos, flujo peatonal y competencia en base a la ubicación ingresada.
                </p>
              </div>
            ) : result ? (
              <div className="bento-card overflow-hidden !p-0">
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase">Reporte de Viabilidad</h3>
                  <div className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">
                    ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </div>
                </div>
                <div className="p-8">
                  <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-extrabold prose-p:font-medium prose-p:text-slate-700 prose-h2:text-indigo-900 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3 prose-h2:mb-6 prose-h3:text-slate-800 prose-h3:uppercase prose-h3:text-sm prose-h3:tracking-wide prose-strong:text-slate-900 prose-strong:font-bold prose-ul:font-medium">
                    <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bento-card flex flex-col items-center justify-center p-12 h-full min-h-[400px] border-dashed border-2">
                <div className="p-4 bg-indigo-50 rounded-2xl mb-4 text-indigo-600">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase mb-2">Esperando datos</h3>
                <p className="text-slate-500 text-center max-w-sm text-[11px] font-medium leading-relaxed italic">
                  Ingresa la dirección y el monto de arriendo en el panel izquierdo para generar un análisis completo de viabilidad para ASF.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
