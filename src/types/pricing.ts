/**
 * Tipos e interfaces para o PrecificaPack
 * Sistema de Engenharia de Custos e Precificação de Embalagens (Papel & Plástico)
 */

export type BagCategory = 'papel' | 'plastico';

// Tipos de papel
export type PaperType = 
  | 'kraft_natural' 
  | 'kraft_branco' 
  | 'offset_branco' 
  | 'papel_duplex' 
  | 'papel_triplex';

// Tipos de plástico
export type PlasticType = 
  | 'pead' 
  | 'pebd' 
  | 'oxibiodegradavel' 
  | 'reciclado_canela' 
  | 'reciclado_cristal';

// Tipos de alça
export type HandleType = 
  | 'alca_torcida' 
  | 'cordao_algodao' 
  | 'fita_gorgurao' 
  | 'fita_cetim' 
  | 'alca_vazada' // boca de palhaço / boca triste
  | 'alca_fita_plastica' 
  | 'alca_camiseta';

// Métodos de impressão
export type PrintMethod = 
  | 'flexografia' 
  | 'serigrafia' 
  | 'offset' 
  | 'sem_impressao';

// Acabamentos de papel
export interface PaperFinishes {
  laminacao: 'nenhuma' | 'bopp_fosca' | 'bopp_brilho' | 'plastificacao';
  vernizUVLocalizado: boolean;
  hotStamping: boolean;
  relevoSeco: boolean;
  ilhosMetalico: boolean;
  reforcoFundoCartao: boolean;
  reforcoBocaCartao: boolean;
}

// Acabamentos de plástico
export interface PlasticFinishes {
  reforcoBocaSoldada: boolean;
  sanfonaFundo: boolean;
  sanfonaLateral: boolean;
  tratamentoCorona: boolean;
  pigmentacaoEspecial: boolean; // plástico colorido ou perolizado
}

// Especificações físicas da embalagem
export interface BagSpecs {
  category: BagCategory;
  modelName: string;
  larguraCm: number;
  alturaCm: number;
  profundidadeCm: number; // sanfona ou fundo
  
  // Específico para papel
  paperType: PaperType;
  gramaturaGsm: number; // g/m² (ex: 80, 100, 120, 150, 180, 250)
  paperFinishes: PaperFinishes;
  
  // Específico para plástico
  plasticType: PlasticType;
  espessuraMicras: number; // micras (ex: 60, 80, 100, 120) ou 0.006 a 0.015 cm
  plasticFinishes: PlasticFinishes;

  // Alça
  handleType: HandleType;
  handleCostPerPair: number;

  // Tiragem e Perdas
  quantidade: number;
  perdaTecnicaPercent: number; // % de refugo de setup e rodagem (ex: 5%)
}

// Configurações de impressão
export interface PrintingConfig {
  method: PrintMethod;
  coresFrente: number; // 0 a 4
  coresVerso: number; // 0 a 4
  areaImpressaoPercent: number; // Cobertura média (ex: 30% traço, 80% chapado)
  custoMatrizSetupTotal: number; // Custo de clichês / telas / chapas CTP
  custoTintaPorUnidade: number; // Custo de tinta direta por unidade
}

// Estrutura de Custos Fixos e Rateio (Custeio por Absorção Pleno)
export interface FixedOverheadConfig {
  aluguelFabricaMensal: number;
  energiaEletricaMensal: number;
  salariosIndiretosMensal: number; // Gerência, PCP, mecânicos
  depreciacaoMaquinasMensal: number;
  administrativoSistemasMensal: number;
  
  // Capacidade e método de rateio
  capacidadeMensalUnidades: number; // Sacolas/mês da fábrica
  horasDisponiveisMes: number; // Horas produtivas da fábrica (ex: 220h)
  tempoProducaoHorasEstimado: number; // Tempo de máquina deste lote
  criterioRateio: 'por_unidade' | 'por_tempo_maquina' | 'overhead_sobre_direto';
  overheadPercentualSobreDireto: number; // se método for percentual (ex: 15%)
}

// Mão de Obra e Operação Direta
export interface OperationalCosts {
  custoHoraMaquina: number; // R$/hora
  velocidadeNominalUnPorHora: number; // unidades por hora (ex: 1500)
  tempoSetupMinutos: number; // tempo de acerto de máquina (ex: 45 min)
  custoEmbalagemTransporteUnitario: number; // Caixa de papelão / fita por sacola
}

// Tributos, Comissões e Custos Comerciais
export interface CommercialConfig {
  regimeTributario: 'simples_nacional' | 'lucro_presumido' | 'lucro_real';
  aliquotaImpostosPercent: number; // % total de impostos s/ venda (ex: 8.5% Simples)
  comissaoVendasPercent: number; // % comissão do vendedor (ex: 5%)
  taxaFinanceiraGatewayPercent: number; // % taxa cartão / gateway / antecipação (ex: 3%)
  
  // Margem e Precificação
  margemLucroDesejadaPercent: number; // Margem Líquida Desejada %
  metodoMarkup: 'markup_divisor_dentro' | 'markup_multiplicador_fora';
}

// Logística e Frete
export interface LogisticsConfig {
  modalidadeFrete: 'fob' | 'cif_fixo' | 'cif_peso_transportadora';
  valorFreteFixoTotal: number; // Se fixo
  custoFretePorKg: number; // Se por transportadora R$/kg
  distanciaKm?: number;
  prazoDiasUteis: number;
}

// Ficha Técnica / BOM (Bill of Materials) do Lote
export interface BillOfMaterialsItem {
  categoria: 'Materia-Prima' | 'Insumo' | 'Acessorio' | 'Operacao' | 'Setup';
  item: string;
  consumoUnitario: string;
  custoUnitario: number;
  custoTotalLote: number;
  percentualDoCustoDireto: number;
}

// Demonstração do Resultado do Exercício (DRE) do Pedido
export interface OrderDRE {
  // Receita
  receitaBrutaTotal: number;
  precoVendaUnitario: number;
  
  // Deduções
  impostosTotais: number;
  aliquotaEfetivaImpostos: number;
  receitaOperacionalLiquida: number;

  // Custo dos Produtos Vendidos (CPV)
  custoMateriaPrimaTotal: number;
  custoInsumosAcabamentosTotal: number;
  custoMaoDeObraDiretaTotal: number;
  custoPerdasTecnicasTotal: number;
  custoSetupMatrizesTotal: number;
  cpvTotal: number;
  cpvUnitario: number;

  // Margem de Contribuição Bruta
  margemContribuicaoBrutaTotal: number;
  margemContribuicaoBrutaPercent: number;

  // Despesas Comerciais e Frete
  comissaoVendasTotal: number;
  taxasFinanceirasTotal: number;
  custoFreteTotal: number;
  despesasVariaveisComerciaisTotal: number;

  // Margem de Contribuição Líquida
  margemContribuicaoLiquidaTotal: number;
  margemContribuicaoLiquidaUnitario: number;
  margemContribuicaoLiquidaPercent: number;

  // Rateio Fixo
  custosFixosRateadosTotal: number;
  custosFixosRateadosUnitario: number;

  // Resultado Operacional Líquido (EBITDA do Pedido)
  lucroOperacionalLiquidoTotal: number;
  lucroOperacionalLiquidoUnitario: number;
  margemLiquidaRealPercent: number;

  // Ponto de Equilíbrio (Break-Even)
  pontoEquilibrioUnidades: number;
  pontoEquilibrioReceita: number;
}

// Item da Curva de Escala e Sensibilidade
export interface SensitivityTier {
  quantidade: number;
  precoUnitarioSugerido: number;
  receitaTotal: number;
  custoUnitarioDireto: number;
  rateioFixoUnitario: number;
  lucroUnitario: number;
  margemLiquidaPercent: number;
  economiaEscalaRelativaPercent: number; // Desconto em relação à menor tiragem
}

// Pedido Completo
export interface PackagingQuote {
  id: string;
  numeroOrcamento: string;
  dataCriacao: string;
  clienteNome: string;
  clienteDocumento?: string;
  clienteCidadeUF?: string;
  descricaoProjeto: string;
  specs: BagSpecs;
  printing: PrintingConfig;
  overhead: FixedOverheadConfig;
  operational: OperationalCosts;
  commercial: CommercialConfig;
  logistics: LogisticsConfig;
  
  // Cálculos Gerados
  pesoUnitarioKg: number;
  pesoTotalLoteKg: number;
  areaAbertaM2: number;
  dre: OrderDRE;
  bom: BillOfMaterialsItem[];
  sensitivity: SensitivityTier[];
  parecerPericial: string;
}
