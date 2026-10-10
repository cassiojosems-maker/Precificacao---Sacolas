import React, { useState } from 'react';
import { CATALOG_PRESETS, CatalogPreset } from '../data/catalogPresets';
import { X, Check, Box } from 'lucide-react';

interface CatalogPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: CatalogPreset) => void;
}

export const CatalogPresetsModal: React.FC<CatalogPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [filter, setFilter] = useState<'todos' | 'papel' | 'plastico'>('todos');

  if (!isOpen) return null;

  const filteredPresets = CATALOG_PRESETS.filter((p) => {
    if (filter === 'todos') return true;
    return p.category === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header com Amarelo Dourado S&A */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Catálogo de Linhas S&A Embalagens
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Modelos padronizados com gramaturas, alças e acabamentos dos catálogos de sacolas de papel e plástico
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Visual Banner Preview */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setFilter('todos')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'todos'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({CATALOG_PRESETS.length})
            </button>
            <button
              onClick={() => setFilter('papel')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'papel'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sacolas de Papel
            </button>
            <button
              onClick={() => setFilter('plastico')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'plastico'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sacolas Plásticas
            </button>
          </div>

          <div className="text-xs text-amber-300/80 font-medium">
            Parâmetros industriais reais calibrados com o parque gráfico S&A.
          </div>
        </div>

        {/* Visual Product Cards Showcase */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Visual Thumbnails Hero Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div className="relative rounded-xl overflow-hidden border border-amber-500/20 group h-32 bg-slate-950">
              <img
                src="/src/assets/images/hero_paper_bags_1791588884784.jpg"
                alt="Sacolas de Papel Kraft e Offset S&A"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                <span className="text-xs font-extrabold text-amber-300">Linha Papel Kraft & Offset S&A</span>
                <span className="text-[11px] text-slate-300">Kraft 80g a 140g · Alça Torcida & Gorgurão</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-amber-500/20 group h-32 bg-slate-950">
              <img
                src="/src/assets/images/hero_plastic_bags_1791588899321.jpg"
                alt="Sacolas Plásticas PEAD e PEBD S&A"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                <span className="text-xs font-extrabold text-amber-300">Linha Plástica PEBD & PEAD S&A</span>
                <span className="text-[11px] text-slate-300">Boca Vazada, Alça Fita & Camiseta</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-amber-400/60 rounded-xl p-4 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-amber-400">
                      {preset.badge}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {preset.category === 'papel' ? 'Papel' : 'Plástico'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{preset.subtitle}</p>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {preset.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] text-slate-300">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {preset.specs.larguraCm} x {preset.specs.alturaCm} x {preset.specs.profundidadeCm} cm
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {preset.category === 'papel'
                        ? `${preset.specs.gramaturaGsm} g/m²`
                        : `${preset.specs.espessuraMicras} micras`}
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Alça: {preset.specs.handleType.replace('_', ' ')}
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Impressão: {preset.printing.method}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Tiragem Padrão:{' '}
                    <span className="font-bold text-white">
                      {preset.specs.quantidade.toLocaleString('pt-BR')} un
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Carregar no Simulador
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
