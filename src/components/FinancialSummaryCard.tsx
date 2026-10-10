import React from 'react';
import { PackagingQuote } from '../types/pricing';
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Scale, 
  ShieldCheck, 
  Target 
} from 'lucide-react';

interface FinancialSummaryCardProps {
  quote: PackagingQuote;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ quote }) => {
  const { dre, specs, pesoTotalLoteKg, pesoUnitarioKg } = quote;

  return (
    <div className="bg-slate-950 border-2 border-slate-900 ring-1 ring-amber-500/40 rounded-2xl p-6 mb-6 shadow-2xl shadow-black/60 relative overflow-hidden">
      {/* Decorative Golden Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <span className="font-black text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
              {specs.category === 'papel' ? 'Sacola de Papel' : 'Sacola Plástica'} S&A
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-white font-bold">{specs.modelName}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-200 font-semibold">{specs.quantidade.toLocaleString('pt-BR')} unidades</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Resumo Executivo de Precificação S&A
          </h2>
        </div>

        {/* Quick Golden Metric Badge with High Visibility */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
              Preço Unitário Sugerido
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
              R$ {dre.precoVendaUnitario.toFixed(3)}
            </span>
          </div>
          <div className="h-10 w-px bg-slate-700 hidden sm:block" />
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
              Faturamento Bruto
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              R$ {dre.receitaBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Grid with Maximum Visibility */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-4 relative z-10">
        {/* CPV Direto */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-bold">CPV Unitário</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-black text-white tabular-nums">
            R$ {dre.cpvUnitario.toFixed(3)}
          </div>
          <div className="text-xs text-slate-300 mt-0.5 font-medium">
            Total: R$ {dre.cpvTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Rateio Fixo */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-bold">Rateio Fixo Unit.</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-black text-white tabular-nums">
            R$ {dre.custosFixosRateadosUnitario.toFixed(3)}
          </div>
          <div className="text-xs text-slate-300 mt-0.5 font-medium">
            Total: R$ {dre.custosFixosRateadosTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Margem de Contribuição */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-bold">Margem Contrib.</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-400 tabular-nums">
            {dre.margemContribuicaoLiquidaPercent.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-300 mt-0.5 font-medium">
            R$ {dre.margemContribuicaoLiquidaTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Lucro Operacional Líquido */}
        <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-bold">Lucro Líq. (EBITDA)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-400 tabular-nums">
            R$ {dre.lucroOperacionalLiquidoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-emerald-300 mt-0.5 tabular-nums font-bold">
            {dre.margemLiquidaRealPercent.toFixed(1)}% líquida
          </div>
        </div>

        {/* Ponto de Equilíbrio */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-bold">Break-Even</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-black text-white tabular-nums">
            {dre.pontoEquilibrioUnidades.toLocaleString('pt-BR')} un
          </div>
          <div className="text-xs mt-0.5 font-bold">
            {dre.pontoEquilibrioUnidades <= specs.quantidade ? (
              <span className="text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" /> Lote Viável
              </span>
            ) : (
              <span className="text-rose-400">Abaixo do Break-Even</span>
            )}
          </div>
        </div>

        {/* Logística & Peso */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="font-bold">Peso & Frete</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-black text-white tabular-nums">
            {pesoTotalLoteKg.toFixed(1)} kg
          </div>
          <div className="text-xs text-slate-300 mt-0.5 font-medium">
            {(pesoUnitarioKg * 1000).toFixed(1)}g/un · Frete: R$ {dre.custoFreteTotal.toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
};
