import React, { useState, useMemo, useEffect } from 'react';
import { 
  BagSpecs, 
  PrintingConfig, 
  FixedOverheadConfig, 
  OperationalCosts, 
  CommercialConfig, 
  LogisticsConfig, 
  PackagingQuote 
} from './types/pricing';
import { CATALOG_PRESETS, DEFAULT_FIXED_OVERHEAD, CatalogPreset } from './data/catalogPresets';
import { calculateQuote } from './utils/pricingEngine';
import { Header, GoldThemeOption } from './components/Header';
import { FinancialSummaryCard } from './components/FinancialSummaryCard';
import { BagConfigurator } from './components/BagConfigurator';
import { CostAndOverheadConfigurator } from './components/CostAndOverheadConfigurator';
import { CommercialAndLogisticsConfigurator } from './components/CommercialAndLogisticsConfigurator';
import { DREStatement } from './components/DREStatement';
import { BillOfMaterialsView } from './components/BillOfMaterialsView';
import { SensitivityAnalysis } from './components/SensitivityAnalysis';
import { AuditReportModal } from './components/AuditReportModal';
import { CatalogPresetsModal } from './components/CatalogPresetsModal';
import { SavedQuotesDrawer } from './components/SavedQuotesDrawer';
import { Save, Check, Printer } from 'lucide-react';

const STORAGE_KEY = 'precificapack_sa_quotes_v1';
const THEME_STORAGE_KEY = 'precificapack_gold_theme_v1';

export default function App() {
  // Estado inicial carregado a partir do primeiro preset (Kraft Delivery GG)
  const initialPreset = CATALOG_PRESETS[0];

  const [specs, setSpecs] = useState<BagSpecs>(initialPreset.specs);
  const [printing, setPrinting] = useState<PrintingConfig>(initialPreset.printing);
  const [overhead, setOverhead] = useState<FixedOverheadConfig>(DEFAULT_FIXED_OVERHEAD);
  const [operational, setOperational] = useState<OperationalCosts>(initialPreset.operational);
  const [commercial, setCommercial] = useState<CommercialConfig>(initialPreset.commercial);
  const [logistics, setLogistics] = useState<LogisticsConfig>(initialPreset.logistics);

  // Tema de Fundo Amarelo Dourado S&A
  const [goldTheme, setGoldTheme] = useState<GoldThemeOption>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'vibrante' || savedTheme === 'solar' || savedTheme === 'ouro_rico') {
        return savedTheme as GoldThemeOption;
      }
    } catch (e) {
      // fallback
    }
    return 'vibrante';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, goldTheme);
    } catch (e) {
      // ignore
    }
  }, [goldTheme]);

  // Metadados do Cliente e Projeto
  const [clientMeta, setClientMeta] = useState({
    clienteNome: 'Grupo Gastronômico & Varejo Brasil',
    clienteDocumento: '12.345.678/0001-90',
    clienteCidadeUF: 'São Paulo / SP',
    descricaoProjeto: 'Fornecimento de Embalagens Personalizadas Linha Delivery S&A',
    numeroOrcamento: `SA-${new Date().getFullYear()}-0104`,
  });

  // Navegação e Modais
  const [activeTab, setActiveTab] = useState<'simulador' | 'dre' | 'bom' | 'escala' | 'laudo'>('simulador');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Histórico salvo em LocalStorage
  const [savedQuotes, setSavedQuotes] = useState<PackagingQuote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Erro ao ler orçamentos locais', e);
    }
    return [];
  });

  // Salvar no localStorage sempre que savedQuotes mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedQuotes));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  }, [savedQuotes]);

  // Exibir Toast temporário com styling dourado
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cálculo do Pedido em tempo real com precisão analítica
  const quote = useMemo(() => {
    return calculateQuote(
      specs,
      printing,
      overhead,
      operational,
      commercial,
      logistics,
      {
        clienteNome: clientMeta.clienteNome,
        clienteDocumento: clientMeta.clienteDocumento,
        clienteCidadeUF: clientMeta.clienteCidadeUF,
        descricaoProjeto: clientMeta.descricaoProjeto,
        numeroOrcamento: clientMeta.numeroOrcamento,
      }
    );
  }, [specs, printing, overhead, operational, commercial, logistics, clientMeta]);

  // Carregar modelo pré-configurado
  const handleSelectPreset = (preset: CatalogPreset) => {
    setSpecs(preset.specs);
    setPrinting(preset.printing);
    setOperational(preset.operational);
    setCommercial(preset.commercial);
    setLogistics(preset.logistics);
    setClientMeta((prev) => ({
      ...prev,
      descricaoProjeto: `Produção industrial de ${preset.specs.modelName}`,
    }));
    showToast(`Modelo "${preset.name}" carregado com sucesso!`);
  };

  // Salvar orçamento atual
  const handleSaveCurrentQuote = () => {
    const newQuote: PackagingQuote = {
      ...quote,
      id: `SA-ORC-${Date.now()}`,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };
    setSavedQuotes((prev) => [newQuote, ...prev.filter((q) => q.numeroOrcamento !== newQuote.numeroOrcamento)]);
    showToast(`Orçamento ${newQuote.numeroOrcamento} salvo no histórico!`);
  };

  // Carregar orçamento do histórico
  const handleLoadQuote = (loaded: PackagingQuote) => {
    setSpecs(loaded.specs);
    setPrinting(loaded.printing);
    setOverhead(loaded.overhead);
    setOperational(loaded.operational);
    setCommercial(loaded.commercial);
    setLogistics(loaded.logistics);
    setClientMeta({
      clienteNome: loaded.clienteNome,
      clienteDocumento: loaded.clienteDocumento || '',
      clienteCidadeUF: loaded.clienteCidadeUF || '',
      descricaoProjeto: loaded.descricaoProjeto || '',
      numeroOrcamento: loaded.numeroOrcamento,
    });
    showToast(`Orçamento ${loaded.numeroOrcamento} carregado!`);
  };

  // Excluir orçamento do histórico
  const handleDeleteQuote = (id: string) => {
    setSavedQuotes((prev) => prev.filter((q) => q.id !== id));
    showToast('Orçamento excluído com sucesso.');
  };

  // Duplicar orçamento
  const handleDuplicateQuote = (target: PackagingQuote) => {
    const duplicated: PackagingQuote = {
      ...target,
      id: `SA-ORC-${Date.now()}`,
      numeroOrcamento: `${target.numeroOrcamento}-COPIA`,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };
    setSavedQuotes((prev) => [duplicated, ...prev]);
    showToast(`Cópia criada: ${duplicated.numeroOrcamento}`);
  };

  // Exportar histórico para JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedQuotes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sa_embalagens_orcamentos_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Arquivo JSON gerado e baixado.');
  };

  // Exportar histórico para CSV
  const handleExportCSV = () => {
    if (savedQuotes.length === 0) {
      showToast('Nenhum orçamento salvo para exportar.');
      return;
    }
    const headers = [
      'Numero',
      'Data',
      'Cliente',
      'Modelo',
      'Categoria',
      'Quantidade',
      'Preco_Unitario',
      'Faturamento_Total',
      'CPV_Unitario',
      'Margem_Liquida_Percent',
      'Lucro_Liquido_Total',
    ];
    const rows = savedQuotes.map((q) => [
      q.numeroOrcamento,
      q.dataCriacao,
      `"${q.clienteNome}"`,
      `"${q.specs.modelName}"`,
      q.specs.category,
      q.specs.quantidade,
      q.dre.precoVendaUnitario.toFixed(3),
      q.dre.receitaBrutaTotal.toFixed(2),
      q.dre.cpvUnitario.toFixed(3),
      q.dre.margemLiquidaRealPercent.toFixed(1),
      q.dre.lucroOperacionalLiquidoTotal.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sa_embalagens_relatorio_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Planilha CSV gerada e baixada.');
  };

  // Classes do fundo em Amarelo Dourado conforme a seleção
  const backgroundClasses = 
    goldTheme === 'vibrante'
      ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600'
      : goldTheme === 'solar'
      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500'
      : 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700';

  return (
    <div className={`min-h-screen ${backgroundClasses} flex flex-col font-sans transition-all duration-300`}>
      {/* Toast Notification com Alto Contraste */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-950 text-amber-400 text-xs font-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border-2 border-amber-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenPrintReport={() => setIsAuditReportOpen(true)}
        savedCount={savedQuotes.length}
        goldTheme={goldTheme}
        setGoldTheme={setGoldTheme}
      />

      {/* Conteúdo Principal com Cartões de Alto Contraste sobre o Fundo Dourado */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Strip Executivo de KPIs Financeiros em Tempo Real */}
        <FinancialSummaryCard quote={quote} />

        {/* Barra de Ações Rápidas do Simulador */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 bg-slate-950 border-2 border-slate-900 ring-1 ring-amber-500/40 rounded-2xl shadow-xl shadow-black/40">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-black text-amber-400 uppercase tracking-wider">Orçamento S&A:</span>
            <span className="bg-slate-900 text-amber-300 border border-amber-400/50 px-2.5 py-1 rounded-lg font-mono font-black text-xs">
              {clientMeta.numeroOrcamento}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-bold text-white text-xs">{clientMeta.clienteNome}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveCurrentQuote}
              className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Salvar Orçamento</span>
            </button>

            <button
              onClick={() => setIsAuditReportOpen(true)}
              className="px-4 py-2 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Laudo & Impressão</span>
            </button>
          </div>
        </div>

        {/* Exibição Conforme Aba Selecionada */}
        {activeTab === 'simulador' && (
          <div className="space-y-6">
            {/* Bloco 1: Geometria e Matéria-Prima */}
            <BagConfigurator
              specs={specs}
              setSpecs={setSpecs}
              printing={printing}
              setPrinting={setPrinting}
            />

            {/* Bloco 2: Rateio Fixo e Máquinas */}
            <CostAndOverheadConfigurator
              overhead={overhead}
              setOverhead={setOverhead}
              operational={operational}
              setOperational={setOperational}
            />

            {/* Bloco 3: Tributos, Margem e Frete */}
            <CommercialAndLogisticsConfigurator
              commercial={commercial}
              setCommercial={setCommercial}
              logistics={logistics}
              setLogistics={setLogistics}
              pesoEstimadoKg={quote.pesoTotalLoteKg}
            />
          </div>
        )}

        {activeTab === 'dre' && (
          <DREStatement quote={quote} />
        )}

        {activeTab === 'bom' && (
          <BillOfMaterialsView quote={quote} />
        )}

        {activeTab === 'escala' && (
          <SensitivityAnalysis
            quote={quote}
            onApplyQuantity={(qty) => {
              setSpecs((prev) => ({ ...prev, quantidade: qty }));
              showToast(`Tiragem atualizada para ${qty.toLocaleString('pt-BR')} unidades.`);
            }}
          />
        )}

        {activeTab === 'laudo' && (
          <div className="space-y-4">
            <div className="p-5 bg-slate-950 border-2 border-slate-900 ring-1 ring-amber-500/40 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-white text-base">Laudo Técnico & Proposta Formal S&A</h3>
                <p className="text-xs text-slate-300 font-medium">
                  Parecer contábil fundamentado em NBC TP 01 e proposta pronta para emissão judicial ou comercial
                </p>
              </div>
              <button
                onClick={() => setIsAuditReportOpen(true)}
                className="px-5 py-2.5 text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                Abrir Visualizador Completo / PDF
              </button>
            </div>
            <DREStatement quote={quote} />
          </div>
        )}
      </main>

      {/* Footer Executivo com Fundo Escuro para Máxima Legibilidade */}
      <footer className="no-print mt-auto border-t-2 border-amber-500/40 bg-slate-950 py-6 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left flex items-center gap-2">
            <span className="font-black text-amber-400 text-sm tracking-wide">S&A EMBALAGENS INDUSTRIAL</span>
            <span className="text-slate-600">·</span>
            <span className="font-medium text-slate-200">Engenharia de Custos, Custeio por Absorção e Formação de Preço</span>
          </div>
          <div className="text-slate-400 text-[11px] font-medium">
            Conforme Normas Brasileiras de Contabilidade NBC TP 01 / NBC PP 01
          </div>
        </div>
      </footer>

      {/* Modais e Gavetas */}
      <CatalogPresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <SavedQuotesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedQuotes={savedQuotes}
        onLoadQuote={handleLoadQuote}
        onDeleteQuote={handleDeleteQuote}
        onDuplicateQuote={handleDuplicateQuote}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
      />

      <AuditReportModal
        quote={quote}
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
        onUpdateClientMeta={(meta) => {
          setClientMeta((prev) => ({
            ...prev,
            ...meta,
          }));
          showToast('Dados do cliente atualizados.');
        }}
      />
    </div>
  );
}
