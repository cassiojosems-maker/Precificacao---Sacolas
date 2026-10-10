import React from 'react';
import { PackagingQuote } from '../types/pricing';
import { FileText, ShieldCheck } from 'lucide-react';

interface DREStatementProps {
  quote: PackagingQuote;
}

export const DREStatement: React.FC<DREStatementProps> = ({ quote }) => {
  const { dre, specs } = quote;
  const qty = specs.quantidade;

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatUnit = (val: number) => val.toFixed(3);

  const getPercentOfGross = (val: number) => {
    if (dre.receitaBrutaTotal === 0) return '0.0%';
    return `${((val / dre.receitaBrutaTotal) * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              S&A EMBALAGENS · NBC TP 01 / CUSTEIO POR ABSORÇÃO
            </span>
            <span>·</span>
            <span>Lote: {qty.toLocaleString('pt-BR')} unidades</span>
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Demonstração do Resultado do Exercício (DRE do Pedido)
          </h3>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-amber-500/30 rounded-xl text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">Margem Líquida Efetiva:</span>
          <span className="text-amber-400 font-black tabular-nums text-sm">
            {dre.margemLiquidaRealPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Tabela Estruturada de DRE com Tema Dourado S&A */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">Conta / Linha de Resultado</th>
              <th className="py-2.5 px-3 text-right">Valor Total (R$)</th>
              <th className="py-2.5 px-3 text-right">Unitário (R$)</th>
              <th className="py-2.5 px-3 text-right">% Receita Bruta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {/* 1. Receita Bruta */}
            <tr className="bg-amber-500/10 font-black text-white border-l-2 border-amber-400">
              <td className="py-2.5 px-3 text-amber-300">1. RECEITA OPERACIONAL BRUTA</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-amber-400 font-bold">
                R$ {formatBRL(dre.receitaBrutaTotal)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums text-amber-400 font-bold">
                R$ {formatUnit(dre.precoVendaUnitario)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums font-bold">100.0%</td>
            </tr>

            {/* Deduções */}
            <tr className="text-rose-300/90">
              <td className="py-2 px-3 pl-6">
                (-) Deduções Tributárias (Impostos {dre.aliquotaEfetivaImpostos.toFixed(1)}%)
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                - R$ {formatBRL(dre.impostosTotais)}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                - R$ {formatUnit(dre.impostosTotais / qty)}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.impostosTotais)}
              </td>
            </tr>

            {/* 2. Receita Líquida */}
            <tr className="bg-slate-950/40 font-bold text-slate-100">
              <td className="py-2.5 px-3">2. (=) RECEITA OPERACIONAL LÍQUIDA (ROL)</td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.receitaOperacionalLiquida)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.receitaOperacionalLiquida / qty)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.receitaOperacionalLiquida)}
              </td>
            </tr>

            {/* CPV Direto Header */}
            <tr className="font-semibold text-amber-300/90 bg-amber-500/5">
              <td className="py-2 px-3">
                3. (-) CUSTO DOS PRODUTOS VENDIDOS (CPV DIRETO)
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                - R$ {formatBRL(dre.cpvTotal)}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                - R$ {formatUnit(dre.cpvUnitario)}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.cpvTotal)}
              </td>
            </tr>

            {/* CPV Detalhes */}
            <tr className="text-slate-400">
              <td className="py-1.5 px-3 pl-8">· Matéria-Prima Principal (Papel / Filme)</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.custoMateriaPrimaTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.custoMateriaPrimaTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custoMateriaPrimaTotal)}
              </td>
            </tr>
            <tr className="text-slate-400">
              <td className="py-1.5 px-3 pl-8">· Insumos, Alças, Tintas e Acabamentos Nobres</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.custoInsumosAcabamentosTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.custoInsumosAcabamentosTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custoInsumosAcabamentosTotal)}
              </td>
            </tr>
            <tr className="text-slate-400">
              <td className="py-1.5 px-3 pl-8">· Mão de Obra e Operação de Máquina</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.custoMaoDeObraDiretaTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.custoMaoDeObraDiretaTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custoMaoDeObraDiretaTotal)}
              </td>
            </tr>
            <tr className="text-slate-400">
              <td className="py-1.5 px-3 pl-8">· Matrizes de Impressão & Setup Exclusivo (Clichês/Telas)</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.custoSetupMatrizesTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.custoSetupMatrizesTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custoSetupMatrizesTotal)}
              </td>
            </tr>
            <tr className="text-slate-400">
              <td className="py-1.5 px-3 pl-8">· Perdas Técnicas de Registro e Arranque</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.custoPerdasTecnicasTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.custoPerdasTecnicasTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custoPerdasTecnicasTotal)}
              </td>
            </tr>

            {/* 4. Margem de Contribuição Bruta */}
            <tr className="bg-slate-950/40 font-bold text-amber-200">
              <td className="py-2.5 px-3">4. (=) MARGEM DE CONTRIBUIÇÃO BRUTA FABRIL</td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.margemContribuicaoBrutaTotal)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.margemContribuicaoBrutaTotal / qty)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.margemContribuicaoBrutaTotal)}
              </td>
            </tr>

            {/* Despesas Variáveis Comerciais */}
            <tr className="text-rose-300/80">
              <td className="py-1.5 px-3 pl-6">(-) Comissão de Venda Representante</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                - R$ {formatBRL(dre.comissaoVendasTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                - R$ {formatUnit(dre.comissaoVendasTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.comissaoVendasTotal)}
              </td>
            </tr>
            <tr className="text-rose-300/80">
              <td className="py-1.5 px-3 pl-6">(-) Taxa Financeira / Gateway de Pagamento</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                - R$ {formatBRL(dre.taxasFinanceirasTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                - R$ {formatUnit(dre.taxasFinanceirasTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.taxasFinanceirasTotal)}
              </td>
            </tr>
            <tr className="text-rose-300/80">
              <td className="py-1.5 px-3 pl-6">(-) Frete e Logística de Despacho (CIF)</td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                - R$ {formatBRL(dre.custoFreteTotal)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                - R$ {formatUnit(dre.custoFreteTotal / qty)}
              </td>
              <td className="py-1.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custoFreteTotal)}
              </td>
            </tr>

            {/* 5. Margem de Contribuição Líquida */}
            <tr className="bg-amber-500/10 font-black text-amber-400">
              <td className="py-2.5 px-3">5. (=) MARGEM DE CONTRIBUIÇÃO LÍQUIDA (MCL)</td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                R$ {formatBRL(dre.margemContribuicaoLiquidaTotal)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                R$ {formatUnit(dre.margemContribuicaoLiquidaUnitario)}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.margemContribuicaoLiquidaTotal)}
              </td>
            </tr>

            {/* Rateio Fixo */}
            <tr className="text-amber-300/80">
              <td className="py-2 px-3 pl-6">
                (-) Custos e Despesas Fixas Rateadas (Custeio por Absorção)
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                - R$ {formatBRL(dre.custosFixosRateadosTotal)}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                - R$ {formatUnit(dre.custosFixosRateadosUnitario)}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                {getPercentOfGross(dre.custosFixosRateadosTotal)}
              </td>
            </tr>

            {/* 6. Lucro Operacional Líquido */}
            <tr className="bg-gradient-to-r from-amber-500/20 to-emerald-950/40 border-t-2 border-amber-500 font-black text-emerald-400 text-sm">
              <td className="py-3 px-3">
                6. (=) RESULTADO OPERACIONAL LÍQUIDO DO PEDIDO (EBITDA)
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-emerald-400">
                R$ {formatBRL(dre.lucroOperacionalLiquidoTotal)}
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-emerald-400">
                R$ {formatUnit(dre.lucroOperacionalLiquidoUnitario)}
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-emerald-400">
                {dre.margemLiquidaRealPercent.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cartões de Análise Técnica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Ponto de Equilíbrio (Break-Even)</span>
          <div className="text-lg font-bold text-white tabular-nums">
            {dre.pontoEquilibrioUnidades.toLocaleString('pt-BR')} unidades
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Faturamento necessário: R$ {formatBRL(dre.pontoEquilibrioReceita)}.
            {dre.pontoEquilibrioUnidades <= qty ? (
              <span className="text-amber-400 font-medium ml-1">
                Lote supera o break-even em {(qty - dre.pontoEquilibrioUnidades).toLocaleString('pt-BR')} un.
              </span>
            ) : (
              <span className="text-rose-400 font-medium ml-1">
                Atenção: Tiragem abaixo do ponto de equilíbrio.
              </span>
            )}
          </p>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Índice de Margem de Contribuição</span>
          <div className="text-lg font-bold text-amber-400 tabular-nums">
            {dre.margemContribuicaoLiquidaPercent.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            A cada R$ 100 faturados na S&A, sobram R$ {dre.margemContribuicaoLiquidaPercent.toFixed(2)} para amortizar estrutura fabril e gerar lucro.
          </p>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Absorção Estrutural da Planta</span>
          <div className="text-lg font-bold text-amber-400 tabular-nums">
            R$ {formatUnit(dre.custosFixosRateadosUnitario)} / sacola
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Garante a blindagem contábil contra perdas invisíveis de overhead fabril.
          </p>
        </div>
      </div>
    </div>
  );
};
