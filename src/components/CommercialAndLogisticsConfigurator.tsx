import React from 'react';
import { CommercialConfig, LogisticsConfig } from '../types/pricing';
import { Truck, Percent, Receipt } from 'lucide-react';

interface CommercialAndLogisticsConfiguratorProps {
  commercial: CommercialConfig;
  setCommercial: React.Dispatch<React.SetStateAction<CommercialConfig>>;
  logistics: LogisticsConfig;
  setLogistics: React.Dispatch<React.SetStateAction<LogisticsConfig>>;
  pesoEstimadoKg: number;
}

export const CommercialAndLogisticsConfigurator: React.FC<CommercialAndLogisticsConfiguratorProps> = ({
  commercial,
  setCommercial,
  logistics,
  setLogistics,
  pesoEstimadoKg,
}) => {
  return (
    <div className="bg-slate-950 border-2 border-slate-900 ring-1 ring-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-black/60 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-400" />
          3. Tributação, Margem de Lucro & Logística de Envio (Frete)
        </h3>
        <p className="text-xs text-slate-300 font-medium mt-0.5">
          Fórmula de precificação (Markup divisor), impostos, comissões e frete CIF/FOB
        </p>
      </div>

      {/* Grid Tributário e Comercial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
            Regime Tributário
          </label>
          <select
            value={commercial.regimeTributario}
            onChange={(e) => {
              const reg = e.target.value as any;
              let aliq = 8.5;
              if (reg === 'lucro_presumido') aliq = 14.5;
              if (reg === 'lucro_real') aliq = 18.0;
              setCommercial({ ...commercial, regimeTributario: reg, aliquotaImpostosPercent: aliq });
            }}
            className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
          >
            <option value="simples_nacional">Simples Nacional (Anexo II Indústria)</option>
            <option value="lucro_presumido">Lucro Presumido (ICMS + IPI + PIS/COFINS)</option>
            <option value="lucro_real">Lucro Real (Débito e Crédito)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
            Alíquota de Impostos (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              min="0"
              max="40"
              value={commercial.aliquotaImpostosPercent}
              onChange={(e) =>
                setCommercial({
                  ...commercial,
                  aliquotaImpostosPercent: Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2.5 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-amber-400 font-black">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
            Comissão de Vendas (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              min="0"
              max="20"
              value={commercial.comissaoVendasPercent}
              onChange={(e) =>
                setCommercial({
                  ...commercial,
                  comissaoVendasPercent: Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2.5 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-amber-400 font-black">%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
            Taxa Gateway / Cartão (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="15"
              value={commercial.taxaFinanceiraGatewayPercent}
              onChange={(e) =>
                setCommercial({
                  ...commercial,
                  taxaFinanceiraGatewayPercent: Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2.5 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-amber-400 font-black">%</span>
          </div>
        </div>
      </div>

      {/* Margem de Lucro e Método de Precificação em Dourado */}
      <div className="p-4 bg-slate-900/90 border-2 border-amber-500/40 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-black text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-amber-400" />
            Margem Líquida Desejada (% sobre a venda)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="1"
                min="1"
                max="60"
                value={commercial.margemLucroDesejadaPercent}
                onChange={(e) =>
                  setCommercial({
                    ...commercial,
                    margemLucroDesejadaPercent: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2 text-lg font-black bg-slate-950 border-2 border-amber-400 rounded-lg text-amber-400 tabular-nums focus:outline-none focus:border-amber-300"
              />
              <span className="absolute right-3.5 top-2.5 text-sm text-amber-400 font-black">%</span>
            </div>
            <div className="flex gap-1.5 items-center">
              {[15, 20, 25, 30].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCommercial({ ...commercial, margemLucroDesejadaPercent: m })}
                  className={`px-3 py-2 text-xs font-black rounded-lg border transition-all ${
                    commercial.margemLucroDesejadaPercent === m
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/40'
                      : 'bg-slate-950 border-slate-700 text-slate-200 hover:text-white hover:border-amber-400'
                  }`}
                >
                  {m}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">
            Método de Precificação (Markup)
          </label>
          <select
            value={commercial.metodoMarkup}
            onChange={(e) =>
              setCommercial({ ...commercial, metodoMarkup: e.target.value as any })
            }
            className="w-full px-3 py-2.5 text-xs font-bold bg-slate-950 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          >
            <option value="markup_divisor_dentro">
              Markup Divisor (Por Dentro - Padrão S&A Embalagens & Perícia)
            </option>
            <option value="markup_multiplicador_fora">
              Markup Multiplicador (Por Fora)
            </option>
          </select>
          <span className="text-[11px] text-slate-300 font-medium mt-1 block">
            {commercial.metodoMarkup === 'markup_divisor_dentro'
              ? 'Garante que a margem líquida seja exatamente a percentagem da receita bruta após descontar impostos e custos.'
              : 'Multiplica o custo total pela margem e embute impostos posteriormente.'}
          </span>
        </div>
      </div>

      {/* Logística e Frete */}
      <div className="pt-2 border-t border-slate-800">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-amber-400" />
          Logística & Taxas de Envio (Frete S&A)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Modalidade de Frete
            </label>
            <select
              value={logistics.modalidadeFrete}
              onChange={(e) =>
                setLogistics({ ...logistics, modalidadeFrete: e.target.value as any })
              }
              className="w-full px-3 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              <option value="cif_peso_transportadora">
                CIF - Transportadora por Peso (R$/kg)
              </option>
              <option value="cif_fixo">CIF - Valor Fixo por Lote / Entrega Própria</option>
              <option value="fob">FOB - Retirada na Fábrica (Sem Custo)</option>
            </select>
          </div>

          {logistics.modalidadeFrete === 'cif_peso_transportadora' ? (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Taxa de Frete (R$/kg)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-amber-400 font-black">R$</span>
                <input
                  type="number"
                  step="0.20"
                  min="0"
                  value={logistics.custoFretePorKg}
                  onChange={(e) =>
                    setLogistics({ ...logistics, custoFretePorKg: Number(e.target.value) })
                  }
                  className="w-full pl-9 pr-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-xs text-amber-300 font-bold mt-1 block">
                Peso total estimado do lote: {pesoEstimadoKg.toFixed(1)} kg
              </span>
            </div>
          ) : logistics.modalidadeFrete === 'cif_fixo' ? (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Valor Total do Frete (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-amber-400 font-black">R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={logistics.valorFreteFixoTotal}
                  onChange={(e) =>
                    setLogistics({
                      ...logistics,
                      valorFreteFixoTotal: Number(e.target.value),
                    })
                  }
                  className="w-full pl-9 pr-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center text-xs text-slate-300 font-semibold pt-5">
              <span>Frete por conta do cliente (retirada FOB na fábrica S&A).</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Prazo de Produção & Envio
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="1"
                max="60"
                value={logistics.prazoDiasUteis}
                onChange={(e) =>
                  setLogistics({
                    ...logistics,
                    prazoDiasUteis: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3.5 top-2 text-xs text-amber-400 font-black">dias úteis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
