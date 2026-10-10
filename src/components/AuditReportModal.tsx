import React, { useState } from 'react';
import { PackagingQuote } from '../types/pricing';
import { 
  Printer, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Package
} from 'lucide-react';

interface AuditReportModalProps {
  quote: PackagingQuote;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClientMeta: (meta: {
    clienteNome: string;
    clienteDocumento: string;
    clienteCidadeUF: string;
    descricaoProjeto: string;
  }) => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  quote,
  isOpen,
  onClose,
  onUpdateClientMeta,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [metaForm, setMetaForm] = useState({
    clienteNome: quote.clienteNome,
    clienteDocumento: quote.clienteDocumento || '',
    clienteCidadeUF: quote.clienteCidadeUF || '',
    descricaoProjeto: quote.descricaoProjeto || '',
  });

  if (!isOpen) return null;

  const { dre, specs, printing, parecerPericial } = quote;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textReport = `
================================================================================
S&A EMBALAGENS — PROPOSTA COMERCIAL & LAUDO PERICIAL DE PRECIFICAÇÃO
Número: ${quote.numeroOrcamento} | Data: ${quote.dataCriacao}
================================================================================
CLIENTE: ${quote.clienteNome} (${quote.clienteDocumento})
LOCALIDADE: ${quote.clienteCidadeUF}
PROJETO: ${quote.descricaoProjeto}

1. ESPECIFICAÇÕES TÉCNICAS:
- Modelo: ${specs.modelName} (${specs.category === 'papel' ? 'Papel' : 'Plástico'})
- Dimensões: ${specs.larguraCm} x ${specs.alturaCm} x ${specs.profundidadeCm} cm
- Substrato: ${specs.category === 'papel' ? `${specs.paperType} ${specs.gramaturaGsm}g/m²` : `${specs.plasticType} ${specs.espessuraMicras} micras`}
- Alça: ${specs.handleType.replace('_', ' ')}
- Impressão: ${printing.method.toUpperCase()} (${printing.coresFrente}x${printing.coresVerso} cores)
- Quantidade Contratada: ${specs.quantidade.toLocaleString('pt-BR')} unidades
- Peso Total do Lote: ${quote.pesoTotalLoteKg.toFixed(1)} kg

2. CONDIÇÕES COMERCIAIS & FINANCEIRAS:
- Preço Unitário: R$ ${dre.precoVendaUnitario.toFixed(3)}
- Faturamento Bruto Total: R$ ${dre.receitaBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Frete: ${quote.logistics.modalidadeFrete.toUpperCase()} (R$ ${dre.custoFreteTotal.toFixed(2)})
- Prazo de Produção: ${quote.logistics.prazoDiasUteis} dias úteis
- Validade da Proposta: 10 dias corridos

3. DEMONSTRAÇÃO DO RESULTADO (DRE DO PEDIDO):
- Receita Operacional Bruta: R$ ${dre.receitaBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (100%)
- (-) Impostos sobre Venda (${dre.aliquotaEfetivaImpostos.toFixed(1)}%): - R$ ${dre.impostosTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- (=) Receita Líquida: R$ ${dre.receitaOperacionalLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- (-) Custo Produtos Vendidos (CPV Direto): - R$ ${dre.cpvTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- (=) Margem de Contribuição Bruta: R$ ${dre.margemContribuicaoBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- (-) Despesas Comerciais e Frete: - R$ ${dre.despesasVariaveisComerciaisTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- (=) Margem de Contribuição Líquida: R$ ${dre.margemContribuicaoLiquidaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${dre.margemContribuicaoLiquidaPercent.toFixed(1)}%)
- (-) Rateio de Custos Fixos Operacionais: - R$ ${dre.custosFixosRateadosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- (=) Lucro Operacional Líquido (EBITDA): R$ ${dre.lucroOperacionalLiquidoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${dre.margemLiquidaRealPercent.toFixed(1)}%)
- Ponto de Equilíbrio Operacional: ${dre.pontoEquilibrioUnidades.toLocaleString('pt-BR')} unidades

${parecerPericial}
================================================================================
    `.trim();

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const saveMetaChanges = () => {
    onUpdateClientMeta(metaForm);
    setIsEditingMeta(false);
  };

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-slate-100">
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="no-print p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-[11px]">
              S&A
            </div>
            <span className="font-bold text-sm text-white">
              Laudo Pericial & Proposta Comercial S&A Embalagens
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingMeta(!isEditingMeta)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              {isEditingMeta ? 'Cancelar Edição' : 'Editar Dados do Cliente'}
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formulário Rápido de Edição do Cliente (Oculto na Impressão) */}
        {isEditingMeta && (
          <div className="no-print p-4 bg-slate-950 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Nome do Cliente</label>
              <input
                type="text"
                value={metaForm.clienteNome}
                onChange={(e) => setMetaForm({ ...metaForm, clienteNome: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={metaForm.clienteDocumento}
                onChange={(e) => setMetaForm({ ...metaForm, clienteDocumento: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Cidade / UF</label>
              <input
                type="text"
                value={metaForm.clienteCidadeUF}
                onChange={(e) => setMetaForm({ ...metaForm, clienteCidadeUF: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={saveMetaChanges}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors"
              >
                Salvar Dados
              </button>
            </div>
          </div>
        )}

        {/* DOCUMENTO PRINCIPAL / LAUDO (Pronto para Visualização e Impressão A4) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:m-0 print:text-black">
          {/* Cabeçalho Oficial do Laudo com S&A Embalagens Amarelo Dourado */}
          <div className="border-b-2 border-amber-500/40 print:border-black pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px] shadow-md shadow-amber-500/20 print:border-black print:p-0">
                <div className="w-full h-full bg-slate-950 print:bg-white rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-sm tracking-tighter text-amber-400 print:text-black">
                    S&A
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white print:text-black">
                  S&A EMBALAGENS INDUSTRIAL
                </h1>
                <p className="text-xs text-amber-400/90 font-medium print:text-slate-800">
                  Fábrica de Embalagens Personalizadas · Papel & Plástico
                </p>
                <p className="text-[10px] text-slate-500 print:text-slate-600">
                  Referência Técnica: Catálogo Oficial S&A Embalagens / Gráfica Plus
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="font-bold text-white print:text-black text-sm">
                ORÇAMENTO / LAUDO Nº {quote.numeroOrcamento}
              </div>
              <div className="text-slate-400 print:text-slate-700">Data de Emissão: {quote.dataCriacao}</div>
              <div className="text-slate-400 print:text-slate-700">Validade da Proposta: 10 dias corridos</div>
            </div>
          </div>

          {/* Dados Cadastrais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs print:bg-white print:border-slate-300 print:text-black">
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px]">CLIENTE:</span>
              <span className="font-bold text-white print:text-black">{quote.clienteNome}</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px]">DOCUMENTO:</span>
              <span className="font-medium text-slate-300 print:text-slate-800">
                {quote.clienteDocumento || 'Não informado'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px]">LOCALIZAÇÃO:</span>
              <span className="font-medium text-slate-300 print:text-slate-800">
                {quote.clienteCidadeUF || 'São Paulo / SP'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 print:text-slate-600 block text-[10px]">PROJETO:</span>
              <span className="font-medium text-slate-300 print:text-slate-800">
                {quote.descricaoProjeto}
              </span>
            </div>
          </div>

          {/* 1. Proposta Comercial Principal em Dourado */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-4 print:bg-white print:border-slate-400 print:text-black">
            <h3 className="text-xs font-bold text-amber-400 print:text-black uppercase tracking-wider mb-2">
              1. Condições Comerciais Aprovadas (S&A)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[11px]">Tiragem Líquida:</span>
                <span className="text-lg font-bold text-white print:text-black tabular-nums">
                  {specs.quantidade.toLocaleString('pt-BR')} un
                </span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[11px]">Preço Unitário:</span>
                <span className="text-xl font-extrabold text-amber-400 print:text-black tabular-nums">
                  R$ {dre.precoVendaUnitario.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[11px]">Valor Total do Pedido:</span>
                <span className="text-lg font-bold text-white print:text-black tabular-nums">
                  R$ {formatBRL(dre.receitaBrutaTotal)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[11px]">Prazo de Entrega:</span>
                <span className="text-base font-semibold text-white print:text-black">
                  {quote.logistics.prazoDiasUteis} dias úteis
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-700 flex flex-wrap gap-4">
              <span>
                <strong>Modalidade de Frete:</strong> {quote.logistics.modalidadeFrete.toUpperCase()} (Total Frete: R$ {formatBRL(dre.custoFreteTotal)})
              </span>
              <span>
                <strong>Peso Total do Lote:</strong> {quote.pesoTotalLoteKg.toFixed(1)} kg
              </span>
              <span>
                <strong>Impostos:</strong> Inclusos ({dre.aliquotaEfetivaImpostos.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* 2. Especificações Técnicas */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider">
              2. Ficha Técnica da Embalagem
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded print:border-slate-300 print:bg-white">
                <span className="text-slate-500 print:text-slate-600 block text-[10px]">MODELO / LINHA:</span>
                <span className="font-medium text-white print:text-black">{specs.modelName}</span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded print:border-slate-300 print:bg-white">
                <span className="text-slate-500 print:text-slate-600 block text-[10px]">DIMENSÕES (L x A x P):</span>
                <span className="font-medium text-white print:text-black">
                  {specs.larguraCm} x {specs.alturaCm} x {specs.profundidadeCm} cm
                </span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded print:border-slate-300 print:bg-white">
                <span className="text-slate-500 print:text-slate-600 block text-[10px]">SUBSTRATO / BASE:</span>
                <span className="font-medium text-white print:text-black">
                  {specs.category === 'papel'
                    ? `${specs.paperType.replace('_', ' ').toUpperCase()} (${specs.gramaturaGsm} g/m²)`
                    : `${specs.plasticType.toUpperCase()} (${specs.espessuraMicras} micras)`}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded print:border-slate-300 print:bg-white">
                <span className="text-slate-500 print:text-slate-600 block text-[10px]">ALÇA:</span>
                <span className="font-medium text-white print:text-black">
                  {specs.handleType.replace('_', ' ').toUpperCase()} (Par: R$ {specs.handleCostPerPair.toFixed(2)})
                </span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded print:border-slate-300 print:bg-white">
                <span className="text-slate-500 print:text-slate-600 block text-[10px]">IMPRESSÃO:</span>
                <span className="font-medium text-white print:text-black">
                  {printing.method.toUpperCase()} ({printing.coresFrente}x{printing.coresVerso} cores)
                </span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded print:border-slate-300 print:bg-white">
                <span className="text-slate-500 print:text-slate-600 block text-[10px]">ÁREA DE PAPEL / FILME:</span>
                <span className="font-medium text-white print:text-black">
                  {quote.areaAbertaM2.toFixed(3)} m² aberta ({(quote.pesoUnitarioKg * 1000).toFixed(1)} g/un)
                </span>
              </div>
            </div>
          </div>

          {/* 3. DRE do Pedido */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider">
              3. Demonstração Contábil & Pericial de Margens (DRE Gerencial)
            </h3>
            <table className="w-full text-xs border border-slate-800 print:border-slate-400">
              <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-black">
                <tr>
                  <th className="py-1.5 px-3 text-left">Demonstrativo Financeiro do Lote</th>
                  <th className="py-1.5 px-3 text-right">Total (R$)</th>
                  <th className="py-1.5 px-3 text-right">Unitário (R$)</th>
                  <th className="py-1.5 px-3 text-right">% Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                <tr className="font-bold text-white print:text-black">
                  <td className="py-1 px-3">Receita Bruta Total de Comercialização</td>
                  <td className="py-1 px-3 text-right tabular-nums text-amber-400 print:text-black">R$ {formatBRL(dre.receitaBrutaTotal)}</td>
                  <td className="py-1 px-3 text-right tabular-nums text-amber-400 print:text-black">R$ {dre.precoVendaUnitario.toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">100.0%</td>
                </tr>
                <tr className="text-slate-400 print:text-slate-700">
                  <td className="py-1 px-3 pl-6">(-) Deduções Tributárias (Impostos)</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {formatBRL(dre.impostosTotais)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {(dre.impostosTotais / specs.quantidade).toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{dre.aliquotaEfetivaImpostos.toFixed(1)}%</td>
                </tr>
                <tr className="font-semibold text-slate-200 print:text-black">
                  <td className="py-1 px-3">(=) Receita Operacional Líquida (ROL)</td>
                  <td className="py-1 px-3 text-right tabular-nums">R$ {formatBRL(dre.receitaOperacionalLiquida)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">R$ {(dre.receitaOperacionalLiquida / specs.quantidade).toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{((dre.receitaOperacionalLiquida / dre.receitaBrutaTotal) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="text-slate-400 print:text-slate-700">
                  <td className="py-1 px-3 pl-6">(-) Custo dos Produtos Vendidos (CPV Direto)</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {formatBRL(dre.cpvTotal)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {dre.cpvUnitario.toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{((dre.cpvTotal / dre.receitaBrutaTotal) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="text-slate-400 print:text-slate-700">
                  <td className="py-1 px-3 pl-6">(-) Despesas Variáveis Comerciais e Frete</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {formatBRL(dre.despesasVariaveisComerciaisTotal)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {(dre.despesasVariaveisComerciaisTotal / specs.quantidade).toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{((dre.despesasVariaveisComerciaisTotal / dre.receitaBrutaTotal) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="font-semibold text-amber-400 print:text-black">
                  <td className="py-1 px-3">(=) Margem de Contribuição Líquida (MCL)</td>
                  <td className="py-1 px-3 text-right tabular-nums">R$ {formatBRL(dre.margemContribuicaoLiquidaTotal)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">R$ {dre.margemContribuicaoLiquidaUnitario.toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{dre.margemContribuicaoLiquidaPercent.toFixed(1)}%</td>
                </tr>
                <tr className="text-slate-400 print:text-slate-700">
                  <td className="py-1 px-3 pl-6">(-) Rateio de Custos e Despesas Fixas (Absorção)</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {formatBRL(dre.custosFixosRateadosTotal)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">- R$ {dre.custosFixosRateadosUnitario.toFixed(3)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{((dre.custosFixosRateadosTotal / dre.receitaBrutaTotal) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="font-bold text-emerald-400 print:text-black bg-slate-950/60 print:bg-slate-100">
                  <td className="py-1.5 px-3">(=) Lucro Operacional Líquido do Pedido (EBITDA)</td>
                  <td className="py-1.5 px-3 text-right tabular-nums">R$ {formatBRL(dre.lucroOperacionalLiquidoTotal)}</td>
                  <td className="py-1.5 px-3 text-right tabular-nums">R$ {dre.lucroOperacionalLiquidoUnitario.toFixed(3)}</td>
                  <td className="py-1.5 px-3 text-right tabular-nums">{dre.margemLiquidaRealPercent.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Parecer Pericial de Precificação */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300 print:bg-white print:border-slate-300 print:text-black whitespace-pre-line font-mono print:font-sans">
            {parecerPericial}
          </div>

          {/* Assinaturas Formais */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs print:text-black border-t border-slate-800 print:border-slate-300">
            <div>
              <div className="border-t border-slate-600 print:border-black pt-2 mx-8 font-semibold text-white print:text-black">
                Diretoria de Operações & Engenharia Gráfica
              </div>
              <div className="text-[11px] text-amber-400 print:text-slate-600 font-medium">S&A Embalagens Industrial</div>
            </div>
            <div>
              <div className="border-t border-slate-600 print:border-black pt-2 mx-8 font-semibold text-white print:text-black">
                Perito Contábil / Auditor de Custos
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600">Registro Profissional CRC / NBC TP 01</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
