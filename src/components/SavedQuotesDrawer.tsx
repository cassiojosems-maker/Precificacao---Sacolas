import React, { useState } from 'react';
import { PackagingQuote } from '../types/pricing';
import { 
  X, 
  Trash2, 
  Download, 
  Copy, 
  Search, 
  FolderOpen 
} from 'lucide-react';

interface SavedQuotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: PackagingQuote[];
  onLoadQuote: (quote: PackagingQuote) => void;
  onDeleteQuote: (id: string) => void;
  onDuplicateQuote: (quote: PackagingQuote) => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const SavedQuotesDrawer: React.FC<SavedQuotesDrawerProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  onLoadQuote,
  onDeleteQuote,
  onDuplicateQuote,
  onExportJSON,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredQuotes = savedQuotes.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      q.numeroOrcamento.toLowerCase().includes(term) ||
      q.clienteNome.toLowerCase().includes(term) ||
      q.specs.modelName.toLowerCase().includes(term)
    );
  });

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-amber-500/30 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              Orçamentos Salvos S&A ({savedQuotes.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Export Actions */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por cliente, modelo ou nº..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onExportCSV}
              className="flex-1 py-1.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3 text-amber-400" />
              Exportar CSV
            </button>
            <button
              onClick={onExportJSON}
              className="flex-1 py-1.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3 text-amber-400" />
              Backup JSON
            </button>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredQuotes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nenhum orçamento encontrado no histórico.
            </div>
          ) : (
            filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-amber-400">{q.numeroOrcamento}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{q.dataCriacao}</span>
                </div>

                <div className="font-bold text-white text-xs">{q.clienteNome}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{q.specs.modelName}</div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      {q.specs.quantidade.toLocaleString('pt-BR')} un · R$ {q.dre.precoVendaUnitario.toFixed(3)}/un
                    </span>
                    <span className="font-extrabold text-amber-400 tabular-nums">
                      R$ {formatBRL(q.dre.receitaBrutaTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDuplicateQuote(q)}
                      title="Duplicar orçamento"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteQuote(q.id)}
                      title="Excluir"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onLoadQuote(q);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
