import {
  BagSpecs,
  PrintingConfig,
  FixedOverheadConfig,
  OperationalCosts,
  CommercialConfig,
  LogisticsConfig,
  PackagingQuote,
  OrderDRE,
  BillOfMaterialsItem,
  SensitivityTier,
} from '../types/pricing';

// Tabela de preços de matérias-primas por kg (mercado industrial brasileiro)
const PRECOS_PAPEL_KG: Record<string, number> = {
  kraft_natural: 10.80,
  kraft_branco: 13.50,
  offset_branco: 14.90,
  papel_duplex: 12.40,
  papel_triplex: 15.80,
};

const PRECOS_RESINA_PLASTICA_KG: Record<string, number> = {
  pebd: 18.20,
  pead: 16.50,
  oxibiodegradavel: 22.80,
  reciclado_canela: 11.20,
  reciclado_cristal: 14.10,
};

// Densidade dos polímeros em g/cm³
const DENSIDADES_PLASTICO: Record<string, number> = {
  pead: 0.95,
  pebd: 0.92,
  oxibiodegradavel: 0.93,
  reciclado_canela: 0.94,
  reciclado_cristal: 0.93,
};

/**
 * Calcula as dimensões físicas abertas e o peso da sacola
 */
export function calculatePhysicalMetrics(specs: BagSpecs) {
  const { larguraCm, alturaCm, profundidadeCm, category } = specs;

  if (category === 'papel') {
    // Desenvolvimento do papel aberto da sacola
    // Tubo horizontal: 2 faces + 2 sanfonas laterais + pestana de colagem de 3cm
    const larguraAbertaCm = 2 * larguraCm + 2 * profundidadeCm + 3.0;
    // Altura desdobrada: altura da sacola + fundo dobrado (aprox 80% da profundidade) + vira de boca (4cm)
    const alturaAbertaCm = alturaCm + profundidadeCm * 0.8 + 4.0;
    const areaAbertaM2 = (larguraAbertaCm * alturaAbertaCm) / 10000;

    // Peso em kg por unidade
    const pesoUnitarioKg = areaAbertaM2 * (specs.gramaturaGsm / 1000);
    // Inclui reforços de fundo e boca se habilitados (~15g adicionais)
    let pesoAcessorios = 0.008; // alça e cola
    if (specs.paperFinishes.reforcoFundoCartao) pesoAcessorios += 0.006;
    if (specs.paperFinishes.reforcoBocaCartao) pesoAcessorios += 0.005;

    const pesoTotalUnitarioKg = pesoUnitarioKg + pesoAcessorios;
    return {
      areaAbertaM2,
      pesoUnitarioKg: pesoTotalUnitarioKg,
    };
  } else {
    // Sacola plástica (filme tubular ou aberto com solda)
    // Área de plástico considerando 2 faces + sanfonas
    const areaAbertaM2 = (2 * (larguraCm + profundidadeCm) * (alturaCm + profundidadeCm * 0.5)) / 10000;
    
    // Espessura em cm (micras / 10000)
    const espessuraCm = specs.espessuraMicras / 10000;
    const densidade = DENSIDADES_PLASTICO[specs.plasticType] || 0.93;
    
    // Volume em cm³
    const volumeCm3 = 2 * (larguraCm + profundidadeCm) * (alturaCm + profundidadeCm * 0.4) * espessuraCm;
    const pesoPlasticoKg = (volumeCm3 * densidade) / 1000;
    
    return {
      areaAbertaM2,
      pesoUnitarioKg: Math.max(pesoPlasticoKg, 0.005),
    };
  }
}

/**
 * Motor principal de cálculo de custos, DRE e precificação
 */
export function calculateQuote(
  specs: BagSpecs,
  printing: PrintingConfig,
  overhead: FixedOverheadConfig,
  operational: OperationalCosts,
  commercial: CommercialConfig,
  logistics: LogisticsConfig,
  meta?: {
    id?: string;
    numeroOrcamento?: string;
    dataCriacao?: string;
    clienteNome?: string;
    clienteDocumento?: string;
    clienteCidadeUF?: string;
    descricaoProjeto?: string;
  }
): PackagingQuote {
  const { areaAbertaM2, pesoUnitarioKg } = calculatePhysicalMetrics(specs);
  const quantidade = Math.max(specs.quantidade, 100);
  const fatorRefugo = 1 + specs.perdaTecnicaPercent / 100;
  const quantidadeBrutaProduzir = Math.ceil(quantidade * fatorRefugo);

  // 1. Custo de Matéria-Prima Principal (MPD)
  let custoMateriaPrimaBaseUnitario = 0;
  let descricaoMateriaPrima = '';

  if (specs.category === 'papel') {
    const precoKg = PRECOS_PAPEL_KG[specs.paperType] || 11.50;
    custoMateriaPrimaBaseUnitario = pesoUnitarioKg * precoKg;
    descricaoMateriaPrima = `Papel ${specs.paperType.replace('_', ' ').toUpperCase()} ${specs.gramaturaGsm}g/m²`;
  } else {
    let precoKg = PRECOS_RESINA_PLASTICA_KG[specs.plasticType] || 17.00;
    if (specs.plasticFinishes.pigmentacaoEspecial) precoKg += 1.80;
    custoMateriaPrimaBaseUnitario = pesoUnitarioKg * precoKg;
    descricaoMateriaPrima = `Filme Polimérico ${specs.plasticType.toUpperCase()} ${specs.espessuraMicras} micras`;
  }

  // 2. Acabamentos e Insumos Especiais
  let custoAcabamentosUnitario = 0;
  if (specs.category === 'papel') {
    if (specs.paperFinishes.laminacao === 'bopp_fosca') custoAcabamentosUnitario += areaAbertaM2 * 0.48;
    if (specs.paperFinishes.laminacao === 'bopp_brilho') custoAcabamentosUnitario += areaAbertaM2 * 0.38;
    if (specs.paperFinishes.laminacao === 'plastificacao') custoAcabamentosUnitario += areaAbertaM2 * 0.32;
    if (specs.paperFinishes.vernizUVLocalizado) custoAcabamentosUnitario += 0.28;
    if (specs.paperFinishes.hotStamping) custoAcabamentosUnitario += 0.35;
    if (specs.paperFinishes.relevoSeco) custoAcabamentosUnitario += 0.16;
    if (specs.paperFinishes.ilhosMetalico) custoAcabamentosUnitario += 0.30;
    if (specs.paperFinishes.reforcoFundoCartao) custoAcabamentosUnitario += 0.14;
    if (specs.paperFinishes.reforcoBocaCartao) custoAcabamentosUnitario += 0.12;
    custoAcabamentosUnitario += 0.04; // Cola e adesivos estruturais
  } else {
    if (specs.plasticFinishes.reforcoBocaSoldada) custoAcabamentosUnitario += 0.08;
    if (specs.plasticFinishes.tratamentoCorona) custoAcabamentosUnitario += 0.03;
  }

  // Custo de Alça
  const custoAlcaUnitario = specs.handleCostPerPair;

  // 3. Impressão e Tintas
  const totalCores = printing.method === 'sem_impressao' ? 0 : printing.coresFrente + printing.coresVerso;
  const custoTintaUnitario = totalCores * printing.custoTintaPorUnidade * (printing.areaImpressaoPercent / 50);
  const custoMatrizSetupUnitario = quantidade > 0 ? printing.custoMatrizSetupTotal / quantidade : 0;

  // 4. Mão de Obra e Operação Direta (MOD)
  const tempoSetupHoras = operational.tempoSetupMinutos / 60;
  const tempoRodagemHoras = quantidadeBrutaProduzir / operational.velocidadeNominalUnPorHora;
  const tempoTotalMaquinaHoras = tempoSetupHoras + tempoRodagemHoras;
  const custoMaoDeObraTotal = tempoTotalMaquinaHoras * operational.custoHoraMaquina;
  const custoMaoDeObraUnitario = custoMaoDeObraTotal / quantidade;

  // 5. Embalagem de Transporte / Fardo
  const custoEmbalagemTransporteUnitario = operational.custoEmbalagemTransporteUnitario;

  // Custo Unitário Direto com Perda Técnica incorporada
  const custoMateriaPrimaComPerda = custoMateriaPrimaBaseUnitario * fatorRefugo;
  const custoInsumosComPerda = (custoAcabamentosUnitario + custoAlcaUnitario + custoTintaUnitario) * fatorRefugo;
  const custoPerdaTecnicaUnitario = (custoMateriaPrimaBaseUnitario + custoAcabamentosUnitario + custoAlcaUnitario + custoTintaUnitario) * (specs.perdaTecnicaPercent / 100);

  // CPV Unitário Direto (antes do rateio fixo)
  const cpvUnitarioDireto = custoMateriaPrimaComPerda + custoInsumosComPerda + custoMaoDeObraUnitario + custoMatrizSetupUnitario + custoEmbalagemTransporteUnitario;
  const cpvTotalDireto = cpvUnitarioDireto * quantidade;

  // 6. Rateio de Custos e Despesas Fixas (Custeio por Absorção)
  const despesasFixasMensais = 
    overhead.aluguelFabricaMensal +
    overhead.energiaEletricaMensal +
    overhead.salariosIndiretosMensal +
    overhead.depreciacaoMaquinasMensal +
    overhead.administrativoSistemasMensal;

  let custosFixosRateadosTotal = 0;
  if (overhead.criterioRateio === 'por_unidade') {
    const taxaFixaPorUnidade = despesasFixasMensais / Math.max(overhead.capacidadeMensalUnidades, 1000);
    custosFixosRateadosTotal = taxaFixaPorUnidade * quantidade;
  } else if (overhead.criterioRateio === 'por_tempo_maquina') {
    const taxaFixaPorHora = despesasFixasMensais / Math.max(overhead.horasDisponiveisMes, 1);
    custosFixosRateadosTotal = taxaFixaPorHora * tempoTotalMaquinaHoras;
  } else {
    // Overhead percentual
    custosFixosRateadosTotal = cpvTotalDireto * (overhead.overheadPercentualSobreDireto / 100);
  }
  const custosFixosRateadosUnitario = custosFixosRateadosTotal / quantidade;

  // 7. Frete e Logística
  const pesoTotalLoteKg = pesoUnitarioKg * quantidade * 1.05; // 5% de tara da caixa
  let custoFreteTotal = 0;
  if (logistics.modalidadeFrete === 'cif_fixo') {
    custoFreteTotal = logistics.valorFreteFixoTotal;
  } else if (logistics.modalidadeFrete === 'cif_peso_transportadora') {
    custoFreteTotal = Math.max(pesoTotalLoteKg * logistics.custoFretePorKg, 45.0); // piso mínimo
  }
  const custoFreteUnitario = custoFreteTotal / quantidade;

  // 8. Formação de Preço de Comercialização
  // Custo Base a ser coberto: CPV Direto + Rateio Fixo + Frete
  const custoBaseTotal = cpvTotalDireto + custosFixosRateadosTotal + custoFreteTotal;
  const custoBaseUnitario = custoBaseTotal / quantidade;

  // Percentuais sobre o Preço de Venda Bruto
  const percImpostos = commercial.aliquotaImpostosPercent;
  const percComissao = commercial.comissaoVendasPercent;
  const percTaxaFinanceira = commercial.taxaFinanceiraGatewayPercent;
  const percMargemDesejada = commercial.margemLucroDesejadaPercent;

  let precoVendaUnitario = 0;
  let receitaBrutaTotal = 0;

  if (commercial.metodoMarkup === 'markup_divisor_dentro') {
    // Fórmula do Markup Divisor ("por dentro"):
    // Preço = Custo / (1 - (Impostos% + Comissao% + Taxas% + Margem%))
    const totalDeducoesMargemPerc = percImpostos + percComissao + percTaxaFinanceira + percMargemDesejada;
    const divisor = Math.max(1 - totalDeducoesMargemPerc / 100, 0.08); // Trava mínima de segurança
    precoVendaUnitario = custoBaseUnitario / divisor;
    receitaBrutaTotal = precoVendaUnitario * quantidade;
  } else {
    // Markup Multiplicador ("por fora"):
    const markupMultiplicador = 1 + (percMargemDesejada / 100);
    const encargoTributario = 1 / Math.max(1 - (percImpostos + percComissao + percTaxaFinanceira) / 100, 0.15);
    precoVendaUnitario = custoBaseUnitario * markupMultiplicador * encargoTributario;
    receitaBrutaTotal = precoVendaUnitario * quantidade;
  }

  // 9. DRE do Pedido
  const impostosTotais = receitaBrutaTotal * (percImpostos / 100);
  const receitaOperacionalLiquida = receitaBrutaTotal - impostosTotais;

  // Componentes do CPV Total
  const custoMateriaPrimaTotal = custoMateriaPrimaComPerda * quantidade;
  const custoInsumosAcabamentosTotal = (custoAcabamentosUnitario + custoAlcaUnitario + custoTintaUnitario) * fatorRefugo * quantidade;
  const custoPerdasTecnicasTotal = custoPerdaTecnicaUnitario * quantidade;
  const custoSetupMatrizesTotal = printing.custoMatrizSetupTotal;
  const cpvTotal = cpvTotalDireto;
  const cpvUnitario = cpvUnitarioDireto;

  const margemContribuicaoBrutaTotal = receitaOperacionalLiquida - cpvTotal;
  const margemContribuicaoBrutaPercent = (margemContribuicaoBrutaTotal / Math.max(receitaOperacionalLiquida, 1)) * 100;

  const comissaoVendasTotal = receitaBrutaTotal * (percComissao / 100);
  const taxasFinanceirasTotal = receitaBrutaTotal * (percTaxaFinanceira / 100);
  const despesasVariaveisComerciaisTotal = comissaoVendasTotal + taxasFinanceirasTotal + custoFreteTotal;

  const margemContribuicaoLiquidaTotal = margemContribuicaoBrutaTotal - despesasVariaveisComerciaisTotal;
  const margemContribuicaoLiquidaUnitario = margemContribuicaoLiquidaTotal / quantidade;
  const margemContribuicaoLiquidaPercent = (margemContribuicaoLiquidaTotal / Math.max(receitaOperacionalLiquida, 1)) * 100;

  const lucroOperacionalLiquidoTotal = margemContribuicaoLiquidaTotal - custosFixosRateadosTotal;
  const lucroOperacionalLiquidoUnitario = lucroOperacionalLiquidoTotal / quantidade;
  const margemLiquidaRealPercent = (lucroOperacionalLiquidoTotal / Math.max(receitaBrutaTotal, 1)) * 100;

  // Ponto de Equilíbrio (Break-Even)
  // Custos fixos associados ao pedido: Ferramental de setup exclusivo + Rateio Fixo
  const custosFixosDoLote = printing.custoMatrizSetupTotal + custosFixosRateadosTotal;
  const precoLiquidoVariavelUnitario = precoVendaUnitario * (1 - (percImpostos + percComissao + percTaxaFinanceira) / 100);
  const custoVariavelDiretoUnitario = custoMateriaPrimaComPerda + (custoAcabamentosUnitario + custoAlcaUnitario + custoTintaUnitario) * fatorRefugo + custoMaoDeObraUnitario + custoEmbalagemTransporteUnitario + custoFreteUnitario;
  const mcu = Math.max(precoLiquidoVariavelUnitario - custoVariavelDiretoUnitario, 0.05);
  const pontoEquilibrioUnidades = Math.ceil(custosFixosDoLote / mcu);
  const pontoEquilibrioReceita = pontoEquilibrioUnidades * precoVendaUnitario;

  const dre: OrderDRE = {
    receitaBrutaTotal,
    precoVendaUnitario,
    impostosTotais,
    aliquotaEfetivaImpostos: percImpostos,
    receitaOperacionalLiquida,
    custoMateriaPrimaTotal,
    custoInsumosAcabamentosTotal,
    custoMaoDeObraDiretaTotal: custoMaoDeObraTotal,
    custoPerdasTecnicasTotal,
    custoSetupMatrizesTotal,
    cpvTotal,
    cpvUnitario,
    margemContribuicaoBrutaTotal,
    margemContribuicaoBrutaPercent,
    comissaoVendasTotal,
    taxasFinanceirasTotal,
    custoFreteTotal,
    despesasVariaveisComerciaisTotal,
    margemContribuicaoLiquidaTotal,
    margemContribuicaoLiquidaUnitario,
    margemContribuicaoLiquidaPercent,
    custosFixosRateadosTotal,
    custosFixosRateadosUnitario,
    lucroOperacionalLiquidoTotal,
    lucroOperacionalLiquidoUnitario,
    margemLiquidaRealPercent,
    pontoEquilibrioUnidades,
    pontoEquilibrioReceita,
  };

  // 10. Bill of Materials (BOM)
  const bom: BillOfMaterialsItem[] = [
    {
      categoria: 'Materia-Prima',
      item: descricaoMateriaPrima,
      consumoUnitario: `${(pesoUnitarioKg * 1000).toFixed(1)} g / un`,
      custoUnitario: custoMateriaPrimaComPerda,
      custoTotalLote: custoMateriaPrimaTotal,
      percentualDoCustoDireto: (custoMateriaPrimaTotal / cpvTotal) * 100,
    },
    {
      categoria: 'Acessorio',
      item: `Alça: ${specs.handleType.replace('_', ' ').toUpperCase()}`,
      consumoUnitario: '1 par / un',
      custoUnitario: custoAlcaUnitario * fatorRefugo,
      custoTotalLote: custoAlcaUnitario * fatorRefugo * quantidade,
      percentualDoCustoDireto: ((custoAlcaUnitario * fatorRefugo * quantidade) / cpvTotal) * 100,
    },
    {
      categoria: 'Insumo',
      item: `Tintas & Insumos Químicos (${totalCores} cores)`,
      consumoUnitario: `${printing.areaImpressaoPercent}% cobertura`,
      custoUnitario: custoTintaUnitario * fatorRefugo,
      custoTotalLote: custoTintaUnitario * fatorRefugo * quantidade,
      percentualDoCustoDireto: ((custoTintaUnitario * fatorRefugo * quantidade) / cpvTotal) * 100,
    },
    {
      categoria: 'Setup',
      item: `Matrizes & Ferramentais (${printing.method.toUpperCase()} - Clichês/Telas)`,
      consumoUnitario: 'Diluído no lote',
      custoUnitario: custoMatrizSetupUnitario,
      custoTotalLote: printing.custoMatrizSetupTotal,
      percentualDoCustoDireto: (printing.custoMatrizSetupTotal / cpvTotal) * 100,
    },
    {
      categoria: 'Operacao',
      item: `Mão de Obra e Operação de Máquina (${tempoTotalMaquinaHoras.toFixed(2)}h)`,
      consumoUnitario: `${(operational.velocidadeNominalUnPorHora).toLocaleString('pt-BR')} un/h`,
      custoUnitario: custoMaoDeObraUnitario,
      custoTotalLote: custoMaoDeObraTotal,
      percentualDoCustoDireto: (custoMaoDeObraTotal / cpvTotal) * 100,
    },
    {
      categoria: 'Insumo',
      item: 'Embalagem de Fardo / Caixa Corrugada Despacho',
      consumoUnitario: '1 un por embalagem',
      custoUnitario: custoEmbalagemTransporteUnitario,
      custoTotalLote: custoEmbalagemTransporteUnitario * quantidade,
      percentualDoCustoDireto: ((custoEmbalagemTransporteUnitario * quantidade) / cpvTotal) * 100,
    },
  ];

  if (custoAcabamentosUnitario > 0) {
    bom.push({
      categoria: 'Insumo',
      item: 'Acabamentos Nobres (Laminação / Hot Stamp / Verniz / Reforços)',
      consumoUnitario: 'Conforme especificação',
      custoUnitario: custoAcabamentosUnitario * fatorRefugo,
      custoTotalLote: custoAcabamentosUnitario * fatorRefugo * quantidade,
      percentualDoCustoDireto: ((custoAcabamentosUnitario * fatorRefugo * quantidade) / cpvTotal) * 100,
    });
  }

  // 11. Curva de Escala e Análise de Sensibilidade
  const tiragensEscala = [250, 500, 1000, 2500, 5000, 10000];
  if (!tiragensEscala.includes(quantidade)) {
    tiragensEscala.push(quantidade);
    tiragensEscala.sort((a, b) => a - b);
  }

  // Preço base de referência da menor tiragem para calcular economia de escala
  let precoBaseMenorTiragem = 0;

  const sensitivity: SensitivityTier[] = tiragensEscala.map((qty, idx) => {
    const setupUnit = printing.custoMatrizSetupTotal / qty;
    const tempoRodagem = (qty * fatorRefugo) / operational.velocidadeNominalUnPorHora;
    const tempoTotal = tempoSetupHoras + tempoRodagem;
    const modTotal = tempoTotal * operational.custoHoraMaquina;
    const modUnit = modTotal / qty;

    const cpvUnit = custoMateriaPrimaComPerda + (custoAcabamentosUnitario + custoAlcaUnitario + custoTintaUnitario) * fatorRefugo + modUnit + setupUnit + custoEmbalagemTransporteUnitario;
    
    let rateioFixo = 0;
    if (overhead.criterioRateio === 'por_unidade') {
      rateioFixo = despesasFixasMensais / Math.max(overhead.capacidadeMensalUnidades, 1000);
    } else if (overhead.criterioRateio === 'por_tempo_maquina') {
      rateioFixo = (despesasFixasMensais / Math.max(overhead.horasDisponiveisMes, 1)) * (tempoTotal / qty);
    } else {
      rateioFixo = cpvUnit * (overhead.overheadPercentualSobreDireto / 100);
    }

    let freteUnit = 0;
    if (logistics.modalidadeFrete === 'cif_fixo') {
      freteUnit = logistics.valorFreteFixoTotal / qty;
    } else if (logistics.modalidadeFrete === 'cif_peso_transportadora') {
      freteUnit = (pesoUnitarioKg * 1.05) * logistics.custoFretePorKg;
    }

    const cBase = cpvUnit + rateioFixo + freteUnit;
    const divisor = Math.max(1 - (percImpostos + percComissao + percTaxaFinanceira + percMargemDesejada) / 100, 0.08);
    const precoUnit = cBase / divisor;
    const recTot = precoUnit * qty;
    const lucroTot = recTot * (percMargemDesejada / 100);

    if (idx === 0) precoBaseMenorTiragem = precoUnit;
    const economia = precoBaseMenorTiragem > 0 ? ((precoBaseMenorTiragem - precoUnit) / precoBaseMenorTiragem) * 100 : 0;

    return {
      quantidade: qty,
      precoUnitarioSugerido: precoUnit,
      receitaTotal: recTot,
      custoUnitarioDireto: cpvUnit,
      rateioFixoUnitario: rateioFixo,
      lucroUnitario: lucroTot / qty,
      margemLiquidaPercent: percMargemDesejada,
      economiaEscalaRelativaPercent: Math.max(0, economia),
    };
  });

  // 12. Laudo Pericial de Precificação & Parecer Contábil (NBC TP 01)
  const parecerPericial = `LAUDO PERICIAL DE ENGENHARIA DE CUSTOS & PRECIFICAÇÃO INDUSTRIAL
Em observância às Normas Brasileiras de Contabilidade (NBC TP 01 - Perícia Contábil e NBC PP 01 - Perito), atesta-se a consistência material da presente estrutura de custos para o lote de ${quantidade.toLocaleString('pt-BR')} unidades de ${specs.modelName}.

1. NEXO CAUSAL & MATERIALIDADE:
O Custo dos Produtos Vendidos (CPV) foi mensurado em R$ ${cpvTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (R$ ${cpvUnitario.toFixed(3)}/unidade), contemplando matéria-prima direta ponderada por refugo técnico de ${specs.perdaTecnicaPercent.toFixed(1)}%, insumos gráficos e mão de obra operacional direta (${tempoTotalMaquinaHoras.toFixed(2)}h de ocupação fabril).

2. ABSORÇÃO DE CUSTOS FIXOS:
Adotando o Custeio por Absorção Pleno, o lote absorve R$ ${custosFixosRateadosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (R$ ${custosFixosRateadosUnitario.toFixed(3)}/unidade) da estrutura operacional da planta, garantindo cobertura patrimonial de aluguel, energia, depreciação e suporte indireto.

3. PREÇO DE COMERCIALIZAÇÃO & MARGEM DE CONTRIBUIÇÃO:
O Preço de Comercialização sugerido de R$ ${precoVendaUnitario.toFixed(3)} por unidade (Total: R$ ${receitaBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) assegura Margem de Contribuição Líquida de ${margemContribuicaoLiquidaPercent.toFixed(1)}% e Lucro Operacional Líquido (EBITDA) de ${margemLiquidaRealPercent.toFixed(1)}% (R$ ${lucroOperacionalLiquidoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}), após a retenção dos tributos (${percImpostos.toFixed(1)}%), encargos comerciais e taxas logísticas.

4. PONTO DE EQUILÍBRIO OPERACIONAL:
O lote atinge o Ponto de Equilíbrio em ${pontoEquilibrioUnidades.toLocaleString('pt-BR')} unidades (R$ ${pontoEquilibrioReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}), atestando viabilidade comercial e solvência da proposta.`;

  const dateNow = new Date().toLocaleDateString('pt-BR');
  const quoteId = meta?.id || `ORC-${Date.now().toString().slice(-6)}`;
  const numeroOrcamento = meta?.numeroOrcamento || `PP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  return {
    id: quoteId,
    numeroOrcamento,
    dataCriacao: meta?.dataCriacao || dateNow,
    clienteNome: meta?.clienteNome || 'Cliente Corporativo',
    clienteDocumento: meta?.clienteDocumento || 'CNPJ / CPF não informado',
    clienteCidadeUF: meta?.clienteCidadeUF || 'São Paulo / SP',
    descricaoProjeto: meta?.descricaoProjeto || `Produção industrial de ${specs.modelName}`,
    specs,
    printing,
    overhead,
    operational,
    commercial,
    logistics,
    pesoUnitarioKg,
    pesoTotalLoteKg,
    areaAbertaM2,
    dre,
    bom,
    sensitivity,
    parecerPericial,
  };
}
