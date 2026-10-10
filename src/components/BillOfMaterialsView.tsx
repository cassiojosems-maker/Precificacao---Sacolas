import React from 'react';
import { PackagingQuote } from '../types/pricing';
import { Layers, PackageCheck, Scale, Ruler } from 'lucide-react';

interface BillOfMaterialsViewProps {
  quote: PackagingQuote;
}

export const BillOfMaterialsView: React.FC<BillOfMaterialsViewProps> = ({ quote }) => {
  const { bom, specs, pesoUnitarioKg, pesoTotalLoteKg, areaAbertaM2, dre } = quote;

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              ENGENHARIA INDUSTRIAL · S&A EMBALAGENS
            </span>
            <span>·</span>
            <span>{specs.modelName}</span>
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Ficha Técnica & Composição de Custos Diretos (BOM)
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Ruler className="w-4 h-4 text-amber-400" />
            <span>Área Aberta:</span>
            <span className="font-bold text-white tabular-nums">
              {areaAbertaM2.toFixed(3)} m²
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Peso Unit.:</span>
            <span className="font-bold text-white tabular-nums">
              {(pesoUnitarioKg * 1000).toFixed(1)} g
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <PackageCheck className="w-4 h-4 text-amber-400" />
            <span>Lote Total:</span>
            <span className="font-bold text-white tabular-nums">
              {pesoTotalLoteKg.toFixed(1)} kg
            </span>
          </div>
        </div>
      </div>

      {/* Tabela BOM */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">Categoria</th>
              <th className="py-2.5 px-3">Item / Insumo</th>
              <th className="py-2.5 px-3">Consumo Unitário</th>
              <th className="py-2.5 px-3 text-right">Custo Unit. (R$)</th>
              <th className="py-2.5 px-3 text-right">Custo Lote (R$)</th>
              <th className="py-2.5 px-3 text-right">% do CPV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {bom.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.categoria === 'Materia-Prima'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                        : item.categoria === 'Acessorio'
                        ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                        : item.categoria === 'Operacao'
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : item.categoria === 'Setup'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.categoria}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-white">{item.item}</td>
                <td className="py-2.5 px-3 text-slate-400 tabular-nums">{item.consumoUnitario}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-200">
                  R$ {item.custoUnitario.toFixed(3)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-200">
                  R$ {formatBRL(item.custoTotalLote)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-bold text-amber-400">
                  {item.percentualDoCustoDireto.toFixed(1)}%
                </td>
              </tr>
            ))}
            {/* Total CPV */}
            <tr className="bg-slate-950/90 font-extrabold text-white border-t-2 border-amber-500/60">
              <td colSpan={3} className="py-3 px-3">
                TOTAL CPV DIRETO (S&A EMBALAGENS)
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-amber-400 font-bold">
                R$ {dre.cpvUnitario.toFixed(3)}
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-amber-400 font-bold">
                R$ {formatBRL(dre.cpvTotal)}
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-amber-400 font-bold">100.0%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Observação técnica de perdas */}
      <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400">
        <span className="font-bold text-amber-400">Nota de Engenharia Fabril S&A: </span>
        Os insumos e matérias-primas foram calculados incorporando a tolerância técnica de{' '}
        <span className="text-white font-bold">{specs.perdaTecnicaPercent.toFixed(1)}%</span> de
        refugo para acerto de clichê/registro de cores e arranque de máquina. Para entregar as{' '}
        <span className="text-white font-bold">{specs.quantidade.toLocaleString('pt-BR')}</span>{' '}
        sacolas líquidas, a fábrica processará aproximadamente{' '}
        <span className="text-white font-bold">
          {Math.ceil(specs.quantidade * (1 + specs.perdaTecnicaPercent / 100)).toLocaleString('pt-BR')}
        </span>{' '}
        unidades brutas.
      </div>
    </div>
  );
};
