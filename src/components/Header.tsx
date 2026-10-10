import React from 'react';
import { 
  Calculator, 
  FileText, 
  Printer, 
  FolderOpen, 
  Layers, 
  TrendingUp, 
  Package,
  Sun
} from 'lucide-react';

export type GoldThemeOption = 'vibrante' | 'solar' | 'ouro_rico';

interface HeaderProps {
  activeTab: 'simulador' | 'dre' | 'bom' | 'escala' | 'laudo';
  setActiveTab: (tab: 'simulador' | 'dre' | 'bom' | 'escala' | 'laudo') => void;
  onOpenPresets: () => void;
  onOpenSavedDrawer: () => void;
  onOpenPrintReport: () => void;
  savedCount: number;
  goldTheme: GoldThemeOption;
  setGoldTheme: (theme: GoldThemeOption) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPresets,
  onOpenSavedDrawer,
  onOpenPrintReport,
  savedCount,
  goldTheme,
  setGoldTheme,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-slate-950 border-b-2 border-amber-500/60 shadow-xl shadow-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: S&A Embalagens Brand Mark in Amarelo Dourado */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 p-[2px] shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <span className="font-black text-xs tracking-tighter text-amber-400">
                  S&A
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white whitespace-nowrap">
                  S&A <span className="text-amber-400">EMBALAGENS</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black uppercase tracking-wider shadow-sm">
                  PrecificaPack
                </span>
              </div>
              <span className="hidden sm:inline-block text-[11px] text-slate-300 font-medium">
                Engenharia de Custos Industriais & Formação de Preço
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links with High Contrast Gold Active State */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('simulador')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'simulador'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('dre')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dre'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              DRE do Pedido
            </button>
            <button
              onClick={() => setActiveTab('bom')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'bom'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Ficha Técnica
            </button>
            <button
              onClick={() => setActiveTab('escala')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'escala'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Escala & Volume
            </button>
            <button
              onClick={() => setActiveTab('laudo')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'laudo'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Laudo & Proposta
            </button>
          </nav>

          {/* Zone 3: Primary Action Buttons with Amarelo Dourado S&A */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Seletor de Tom de Amarelo Dourado para o Fundo */}
            <div className="hidden lg:flex items-center bg-slate-900 border border-amber-500/40 rounded-lg p-0.5 text-[11px]">
              <span className="px-2 text-amber-400 font-bold flex items-center gap-1">
                <Sun className="w-3 h-3" /> Fundo:
              </span>
              <button
                onClick={() => setGoldTheme('vibrante')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  goldTheme === 'vibrante'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Amarelo Dourado Vibrante S&A"
              >
                Vibrante
              </button>
              <button
                onClick={() => setGoldTheme('solar')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  goldTheme === 'solar'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Amarelo Ouro Solar"
              >
                Solar
              </button>
              <button
                onClick={() => setGoldTheme('ouro_rico')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  goldTheme === 'ouro_rico'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Ouro Rico Acetinado"
              >
                Ouro Rico
              </button>
            </div>

            <button
              onClick={onOpenPresets}
              className="px-3 py-2 text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/40 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              title="Carregar modelos do catálogo S&A Embalagens"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Catálogo</span> S&A
            </button>

            <button
              onClick={onOpenSavedDrawer}
              className="px-3 py-2 text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-amber-500/40 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              title="Ver orçamentos salvos"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Histórico</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 rounded text-slate-950 font-black">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenPrintReport}
              className="px-3.5 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-500/30 transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Relatório / PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-bold ${
              activeTab === 'simulador' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Simulador
          </button>
          <button
            onClick={() => setActiveTab('dre')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-bold ${
              activeTab === 'dre' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            DRE do Pedido
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-bold ${
              activeTab === 'bom' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 bg-slate-950'
            }`}
          >
            Ficha Técnica
          </button>
          <button
            onClick={() => setActiveTab('escala')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-bold ${
              activeTab === 'escala' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Escala
          </button>
          <button
            onClick={() => setActiveTab('laudo')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-bold ${
              activeTab === 'laudo' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Laudo & Proposta
          </button>
        </div>
      </div>
    </header>
  );
};
