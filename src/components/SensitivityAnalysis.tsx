import React from 'react';
import { PackagingQuote } from '../types/pricing';
import { TrendingUp, ArrowDownRight, Check } from 'lucide-react';

interface SensitivityAnalysisProps {
  quote: PackagingQuote;
  onApplyQuantity: (qty: number) => void;
}

export const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({
  quote,
  onApplyQuantity,
}) => {
  const { sensitivity, specs } = quote;

  const maxPrice = Math.max(...sensitivity.map((s) => s.precoUnitarioSugerido), 1);

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              ECONOMIA DE ESCALA GRÁFICA · S&A EMBALAGENS
            </span>
            <span>·</span>
            <span>Diluição de Matrizes, Clichês e Acertos</span>
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Curva de Sensibilidade por Tiragem (Preço x Volume)
          </h3>
        </div>
        <p className="text-xs text-slate-400 sm:text-right max-w-sm">
          Clique em qualquer volume para recalcular o orçamento com a tiragem selecionada.
        </p>
      </div>

      {/* Visualização de Gráfico de Barras com Amarelo Dourado */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Comparativo Visual: Preço Unitário por Tiragem
        </h4>

        <div className="space-y-2.5">
          {sensitivity.map((tier) => {
            const isSelected = tier.quantidade === specs.quantidade;
            const barWidthPercent = Math.max((tier.precoUnitarioSugerido / maxPrice) * 100, 15);

            return (
              <div
                key={tier.quantidade}
                onClick={() => onApplyQuantity(tier.quantidade)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white tabular-nums">
                      {tier.quantidade.toLocaleString('pt-BR')} un
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] rounded font-bold uppercase tracking-wider">
                        Tiragem Atual
                      </span>
                    )}
                    {tier.economiaEscalaRelativaPercent > 0 && (
                      <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-0.5">
                        <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
                        -{tier.economiaEscalaRelativaPercent.toFixed(1)}% economia
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-amber-400 tabular-nums">
                      R$ {tier.precoUnitarioSugerido.toFixed(3)}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1.5 font-medium">
                      (Total: R$ {formatBRL(tier.receitaTotal)})
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso Dourada */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela Comparativa Detalhada */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">Tiragem</th>
              <th className="py-2.5 px-3 text-right">Preço Unit. Sugerido</th>
              <th className="py-2.5 px-3 text-right">Faturamento Total</th>
              <th className="py-2.5 px-3 text-right">Custo Direto Unit.</th>
              <th className="py-2.5 px-3 text-right">Rateio Fixo Unit.</th>
              <th className="py-2.5 px-3 text-right">Lucro Unitário</th>
              <th className="py-2.5 px-3 text-right">Economia Escala</th>
              <th className="py-2.5 px-3 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sensitivity.map((tier) => {
              const isSelected = tier.quantidade === specs.quantidade;
              return (
                <tr
                  key={tier.quantidade}
                  className={`transition-colors ${
                    isSelected ? 'bg-amber-500/10 font-bold text-white' : 'hover:bg-slate-950/30'
                  }`}
                >
                  <td className="py-2.5 px-3 tabular-nums font-extrabold">
                    {tier.quantidade.toLocaleString('pt-BR')} un
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-amber-400 font-extrabold">
                    R$ {tier.precoUnitarioSugerido.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    R$ {formatBRL(tier.receitaTotal)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                    R$ {tier.custoUnitarioDireto.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                    R$ {tier.rateioFixoUnitario.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-semibold">
                    R$ {tier.lucroUnitario.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {tier.economiaEscalaRelativaPercent > 0 ? (
                      <span className="text-amber-400 font-semibold">
                        -{tier.economiaEscalaRelativaPercent.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-500">Base</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {isSelected ? (
                      <span className="text-[11px] text-amber-400 font-bold flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selecionado
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onApplyQuantity(tier.quantidade)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-lg transition-all"
                      >
                        Simular
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
