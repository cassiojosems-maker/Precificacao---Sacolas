import React from 'react';
import { FixedOverheadConfig, OperationalCosts } from '../types/pricing';
import { Factory, Cog } from 'lucide-react';

interface CostAndOverheadConfiguratorProps {
  overhead: FixedOverheadConfig;
  setOverhead: React.Dispatch<React.SetStateAction<FixedOverheadConfig>>;
  operational: OperationalCosts;
  setOperational: React.Dispatch<React.SetStateAction<OperationalCosts>>;
}

export const CostAndOverheadConfigurator: React.FC<CostAndOverheadConfiguratorProps> = ({
  overhead,
  setOverhead,
  operational,
  setOperational,
}) => {
  const totalDespesasFixasMensais =
    overhead.aluguelFabricaMensal +
    overhead.energiaEletricaMensal +
    overhead.salariosIndiretosMensal +
    overhead.depreciacaoMaquinasMensal +
    overhead.administrativoSistemasMensal;

  return (
    <div className="bg-slate-950 border-2 border-slate-900 ring-1 ring-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-black/60 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Factory className="w-5 h-5 text-amber-400" />
          2. Rateio de Custos Fixos & Operação Industrial (Custeio por Absorção)
        </h3>
        <p className="text-xs text-slate-300 font-medium mt-0.5">
          Despesas fabris estruturais, capacidade instalada da planta e tempo de máquina
        </p>
      </div>

      {/* Grid de Custos Fixos da Fábrica */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Aluguel do Galpão
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
            <input
              type="number"
              step="100"
              value={overhead.aluguelFabricaMensal}
              onChange={(e) =>
                setOverhead({ ...overhead, aluguelFabricaMensal: Number(e.target.value) })
              }
              className="w-full pl-9 pr-2.5 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Energia Elétrica Ind.
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
            <input
              type="number"
              step="100"
              value={overhead.energiaEletricaMensal}
              onChange={(e) =>
                setOverhead({ ...overhead, energiaEletricaMensal: Number(e.target.value) })
              }
              className="w-full pl-9 pr-2.5 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Salários Indiretos / PCP
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
            <input
              type="number"
              step="500"
              value={overhead.salariosIndiretosMensal}
              onChange={(e) =>
                setOverhead({ ...overhead, salariosIndiretosMensal: Number(e.target.value) })
              }
              className="w-full pl-9 pr-2.5 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Depreciação de Máquinas
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
            <input
              type="number"
              step="100"
              value={overhead.depreciacaoMaquinasMensal}
              onChange={(e) =>
                setOverhead({ ...overhead, depreciacaoMaquinasMensal: Number(e.target.value) })
              }
              className="w-full pl-9 pr-2.5 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Adm, TI & Sistemas
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
            <input
              type="number"
              step="100"
              value={overhead.administrativoSistemasMensal}
              onChange={(e) =>
                setOverhead({ ...overhead, administrativoSistemasMensal: Number(e.target.value) })
              }
              className="w-full pl-9 pr-2.5 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Barra de Totais e Critério de Rateio */}
      <div className="p-4 bg-slate-900/90 border-2 border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <span className="text-xs font-bold text-slate-300 block uppercase tracking-wide">Total Despesas Fixas / Mês</span>
          <span className="text-xl font-black text-amber-400 tabular-nums">
            R$ {totalDespesasFixasMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Critério de Alocação de Rateio
          </label>
          <select
            value={overhead.criterioRateio}
            onChange={(e) =>
              setOverhead({ ...overhead, criterioRateio: e.target.value as any })
            }
            className="w-full px-3 py-2 text-xs font-bold bg-slate-950 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          >
            <option value="por_unidade">Por Unidade Produzida (Capacidade Mensal)</option>
            <option value="por_tempo_maquina">Por Tempo de Máquina Ocupada (Horas)</option>
            <option value="overhead_sobre_direto">Overhead % sobre Custo Direto</option>
          </select>
        </div>

        <div>
          {overhead.criterioRateio === 'por_unidade' ? (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Capacidade Nominal (unidades/mês)
              </label>
              <input
                type="number"
                step="5000"
                value={overhead.capacidadeMensalUnidades}
                onChange={(e) =>
                  setOverhead({ ...overhead, capacidadeMensalUnidades: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-black bg-slate-950 border-2 border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-amber-300 font-bold mt-1 block">
                Custo fixo base: R$ {(totalDespesasFixasMensais / Math.max(overhead.capacidadeMensalUnidades, 1)).toFixed(3)} / un
              </span>
            </div>
          ) : overhead.criterioRateio === 'por_tempo_maquina' ? (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Horas Disponíveis / Mês
              </label>
              <input
                type="number"
                step="10"
                value={overhead.horasDisponiveisMes}
                onChange={(e) =>
                  setOverhead({ ...overhead, horasDisponiveisMes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-black bg-slate-950 border-2 border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-amber-300 font-bold mt-1 block">
                Custo fixo base: R$ {(totalDespesasFixasMensais / Math.max(overhead.horasDisponiveisMes, 1)).toFixed(2)} / hora
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Percentual de Overhead (%)
              </label>
              <input
                type="number"
                step="1"
                value={overhead.overheadPercentualSobreDireto}
                onChange={(e) =>
                  setOverhead({ ...overhead, overheadPercentualSobreDireto: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-black bg-slate-950 border-2 border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mão de Obra e Máquina */}
      <div className="pt-2 border-t border-slate-800">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Cog className="w-4 h-4 text-amber-400" />
          Operação Direta & Maquinário S&A
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Custo Hora-Máquina (R$/h)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
              <input
                type="number"
                step="5"
                value={operational.custoHoraMaquina}
                onChange={(e) =>
                  setOperational({ ...operational, custoHoraMaquina: Number(e.target.value) })
                }
                className="w-full pl-9 pr-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Velocidade (un/hora)
            </label>
            <input
              type="number"
              step="100"
              value={operational.velocidadeNominalUnPorHora}
              onChange={(e) =>
                setOperational({ ...operational, velocidadeNominalUnPorHora: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Tempo de Setup (minutos)
            </label>
            <input
              type="number"
              step="5"
              value={operational.tempoSetupMinutos}
              onChange={(e) =>
                setOperational({ ...operational, tempoSetupMinutos: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Embalagem Fardo / Cx (R$/un)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-black">R$</span>
              <input
                type="number"
                step="0.01"
                value={operational.custoEmbalagemTransporteUnitario}
                onChange={(e) =>
                  setOperational({
                    ...operational,
                    custoEmbalagemTransporteUnitario: Number(e.target.value),
                  })
                }
                className="w-full pl-9 pr-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
