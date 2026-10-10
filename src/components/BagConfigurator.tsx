import React from 'react';
import { 
  BagSpecs, 
  PrintingConfig, 
  PaperType, 
  PlasticType, 
  HandleType, 
  PrintMethod 
} from '../types/pricing';
import { 
  Box, 
  Layers, 
  Palette, 
  Sparkles, 
  Sliders
} from 'lucide-react';

interface BagConfiguratorProps {
  specs: BagSpecs;
  setSpecs: React.Dispatch<React.SetStateAction<BagSpecs>>;
  printing: PrintingConfig;
  setPrinting: React.Dispatch<React.SetStateAction<PrintingConfig>>;
}

export const BagConfigurator: React.FC<BagConfiguratorProps> = ({
  specs,
  setSpecs,
  printing,
  setPrinting,
}) => {
  const isPaper = specs.category === 'papel';

  const handleCategoryChange = (category: 'papel' | 'plastico') => {
    if (category === 'papel') {
      setSpecs((prev) => ({
        ...prev,
        category: 'papel',
        modelName: 'Sacola Papel Kraft S&A 24x32x10cm',
        handleType: 'alca_torcida',
        handleCostPerPair: 0.22,
      }));
    } else {
      setSpecs((prev) => ({
        ...prev,
        category: 'plastico',
        modelName: 'Sacola Plástica Boca de Palhaço S&A 30x40cm',
        handleType: 'alca_vazada',
        handleCostPerPair: 0.08,
      }));
    }
  };

  return (
    <div className="bg-slate-950 border-2 border-slate-900 ring-1 ring-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-black/60 space-y-6">
      {/* Header do Bloco */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            1. Especificações Técnicas da Embalagem (S&A)
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Geometria, matéria-prima industrial, acessórios e parâmetros de tiragem
          </p>
        </div>

        {/* Seletor de Categoria: Papel vs Plástico com Dourado */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border-2 border-amber-500/40 rounded-xl">
          <button
            type="button"
            onClick={() => handleCategoryChange('papel')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
              isPaper
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sacola de Papel
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('plastico')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
              !isPaper
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sacola Plástica
          </button>
        </div>
      </div>

      {/* Grid de Dimensões e Identificação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            Nome / Descrição do Modelo
          </label>
          <input
            type="text"
            value={specs.modelName}
            onChange={(e) => setSpecs({ ...specs, modelName: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:bg-black transition-all"
            placeholder="Ex: Sacola Kraft S&A Boutique M"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            Quantidade (Tiragem Líquida)
          </label>
          <input
            type="number"
            min="100"
            step="100"
            value={specs.quantidade}
            onChange={(e) => setSpecs({ ...specs, quantidade: Math.max(100, Number(e.target.value)) })}
            className="w-full px-3.5 py-2.5 text-sm font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-amber-400 tabular-nums focus:outline-none focus:border-amber-400 focus:bg-black transition-all"
          />
          <div className="flex gap-1.5 mt-2">
            {[500, 1000, 2500, 5000].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSpecs({ ...specs, quantidade: q })}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  specs.quantidade === q
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-400 hover:text-white'
                }`}
              >
                {q >= 1000 ? `${q / 1000}k` : q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            Refugo Técnico (Perda %)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={specs.perdaTecnicaPercent}
              onChange={(e) => setSpecs({ ...specs, perdaTecnicaPercent: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400 focus:bg-black transition-all"
            />
            <span className="absolute right-3.5 top-2.5 text-sm text-amber-400 font-black">%</span>
          </div>
          <span className="text-xs text-slate-300 font-semibold mt-1.5 block">
            Produção bruta: {Math.ceil(specs.quantidade * (1 + specs.perdaTecnicaPercent / 100)).toLocaleString('pt-BR')} un
          </span>
        </div>
      </div>

      {/* Dimensões Geométricas */}
      <div className="grid grid-cols-3 gap-3.5 p-4 bg-slate-900/90 border-2 border-slate-800 rounded-xl">
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">
            Largura (Frente) cm
          </label>
          <input
            type="number"
            min="5"
            max="120"
            step="1"
            value={specs.larguraCm}
            onChange={(e) => setSpecs({ ...specs, larguraCm: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm font-bold bg-slate-950 border-2 border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">
            Altura cm
          </label>
          <input
            type="number"
            min="5"
            max="150"
            step="1"
            value={specs.alturaCm}
            onChange={(e) => setSpecs({ ...specs, alturaCm: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm font-bold bg-slate-950 border-2 border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">
            {isPaper ? 'Fundo / Sanfona cm' : 'Sanfona (Fundo/Lat) cm'}
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="1"
            value={specs.profundidadeCm}
            onChange={(e) => setSpecs({ ...specs, profundidadeCm: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm font-bold bg-slate-950 border-2 border-slate-700 rounded-lg text-white tabular-nums focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Seção Condicional: Matéria-Prima (Papel vs Plástico) */}
      <div className="pt-2">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-400" />
          Substrato & Gramatura
        </h4>

        {isPaper ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Tipo de Papel
              </label>
              <select
                value={specs.paperType}
                onChange={(e) => setSpecs({ ...specs, paperType: e.target.value as PaperType })}
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="kraft_natural">Kraft Natural Pardo (Sustentável S&A)</option>
                <option value="kraft_branco">Kraft Branco (Alvejado Premium)</option>
                <option value="offset_branco">Offset Branco (Alta Alvura)</option>
                <option value="papel_duplex">Papel Cartão Duplex</option>
                <option value="papel_triplex">Papel Cartão Triplex (Extra Luxo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Gramatura do Papel (g/m²)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="60"
                  max="400"
                  step="5"
                  value={specs.gramaturaGsm}
                  onChange={(e) => setSpecs({ ...specs, gramaturaGsm: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
                />
                <div className="flex gap-1.5 items-center">
                  {[80, 100, 120, 150, 180, 225].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSpecs({ ...specs, gramaturaGsm: g })}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border font-bold transition-all ${
                        specs.gramaturaGsm === g
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white'
                      }`}
                    >
                      {g}g
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Polímero / Resina Plástica
              </label>
              <select
                value={specs.plasticType}
                onChange={(e) => setSpecs({ ...specs, plasticType: e.target.value as PlasticType })}
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="pead">PEAD - Polietileno Alta Densidade (Resistente / Fosco)</option>
                <option value="pebd">PEBD - Polietileno Baixa Densidade (Maleável / Brilhante)</option>
                <option value="oxibiodegradavel">Oxibiodegradável (Ecológico d2w)</option>
                <option value="reciclado_canela">Reciclado Canela (Econômico)</option>
                <option value="reciclado_cristal">Reciclado Cristal (Translúcido)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Espessura / Micragem (micras)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="30"
                  max="200"
                  step="5"
                  value={specs.espessuraMicras}
                  onChange={(e) => setSpecs({ ...specs, espessuraMicras: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
                />
                <div className="flex gap-1.5 items-center">
                  {[60, 70, 80, 100, 120].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSpecs({ ...specs, espessuraMicras: m })}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border font-bold transition-all ${
                        specs.espessuraMicras === m
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white'
                      }`}
                    >
                      {m}µ
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alça e Acessórios */}
      <div className="pt-2">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-amber-400" />
          Modelo de Alça
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Tipo de Alça
            </label>
            <select
              value={specs.handleType}
              onChange={(e) => {
                const val = e.target.value as HandleType;
                let defaultCost = 0.22;
                if (val === 'cordao_algodao') defaultCost = 0.55;
                if (val === 'fita_gorgurao') defaultCost = 0.95;
                if (val === 'fita_cetim') defaultCost = 0.80;
                if (val === 'alca_vazada') defaultCost = 0.08;
                if (val === 'alca_fita_plastica') defaultCost = 0.28;
                if (val === 'alca_camiseta') defaultCost = 0.03;
                setSpecs({ ...specs, handleType: val, handleCostPerPair: defaultCost });
              }}
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-900 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              {isPaper ? (
                <>
                  <option value="alca_torcida">Alça Torcida de Papel Kraft (Padrão S&A)</option>
                  <option value="cordao_algodao">Cordão de Algodão c/ Ponteira</option>
                  <option value="fita_gorgurao">Fita de Gorgurão Embutida (Luxo)</option>
                  <option value="fita_cetim">Fita de Cetim Brilhante</option>
                  <option value="alca_vazada">Alça Vazada com Reforço em Cartão</option>
                </>
              ) : (
                <>
                  <option value="alca_vazada">Boca de Palhaço / Vazada / Boca Triste</option>
                  <option value="alca_fita_plastica">Alça Fita Plástica Soldada (Boutique)</option>
                  <option value="alca_camiseta">Alça Camiseta (Mercado / Farmácia)</option>
                  <option value="cordao_algodao">Cordão / Ilhós em Plástico Grosso</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Custo do Par de Alça (R$/unidade)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm text-amber-400 font-black">R$</span>
              <input
                type="number"
                min="0"
                step="0.05"
                value={specs.handleCostPerPair}
                onChange={(e) => setSpecs({ ...specs, handleCostPerPair: Number(e.target.value) })}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-black bg-slate-900 border-2 border-slate-700 rounded-xl text-white tabular-nums focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Acabamentos Especiais */}
      <div className="pt-2">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Acabamentos & Reforços Estruturais
        </h4>

        {isPaper ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Laminação da Sacola
              </label>
              <select
                value={specs.paperFinishes.laminacao}
                onChange={(e) =>
                  setSpecs({
                    ...specs,
                    paperFinishes: {
                      ...specs.paperFinishes,
                      laminacao: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
              >
                <option value="nenhuma">Sem Laminação</option>
                <option value="bopp_fosca">Laminação Fosca BOPP (+ R$ 0,48/m²)</option>
                <option value="bopp_brilho">Laminação Brilho BOPP (+ R$ 0,38/m²)</option>
                <option value="plastificacao">Plastificação Simples</option>
              </select>
            </div>

            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={specs.paperFinishes.vernizUVLocalizado}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      paperFinishes: {
                        ...specs.paperFinishes,
                        vernizUVLocalizado: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
                />
                Verniz UV Local
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={specs.paperFinishes.hotStamping}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      paperFinishes: {
                        ...specs.paperFinishes,
                        hotStamping: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
                />
                Hot Stamping
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={specs.paperFinishes.relevoSeco}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      paperFinishes: {
                        ...specs.paperFinishes,
                        relevoSeco: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
                />
                Relevo Seco
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={specs.paperFinishes.ilhosMetalico}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      paperFinishes: {
                        ...specs.paperFinishes,
                        ilhosMetalico: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
                />
                Ilhós Metálico
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={specs.paperFinishes.reforcoFundoCartao}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      paperFinishes: {
                        ...specs.paperFinishes,
                        reforcoFundoCartao: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
                />
                Reforço Fundo Cartão
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={specs.paperFinishes.reforcoBocaCartao}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      paperFinishes: {
                        ...specs.paperFinishes,
                        reforcoBocaCartao: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
                />
                Reforço Boca Cartão
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={specs.plasticFinishes.reforcoBocaSoldada}
                onChange={(e) =>
                  setSpecs({
                    ...specs,
                    plasticFinishes: {
                      ...specs.plasticFinishes,
                      reforcoBocaSoldada: e.target.checked,
                    },
                  })
                }
                className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
              />
              Boca Soldada Reforçada
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={specs.plasticFinishes.tratamentoCorona}
                onChange={(e) =>
                  setSpecs({
                    ...specs,
                    plasticFinishes: {
                      ...specs.plasticFinishes,
                      tratamentoCorona: e.target.checked,
                    },
                  })
                }
                className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
              />
              Tratamento Corona
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={specs.plasticFinishes.sanfonaFundo}
                onChange={(e) =>
                  setSpecs({
                    ...specs,
                    plasticFinishes: {
                      ...specs.plasticFinishes,
                      sanfonaFundo: e.target.checked,
                    },
                  })
                }
                className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
              />
              Sanfona de Fundo
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-100 font-bold cursor-pointer bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={specs.plasticFinishes.pigmentacaoEspecial}
                onChange={(e) =>
                  setSpecs({
                    ...specs,
                    plasticFinishes: {
                      ...specs.plasticFinishes,
                      pigmentacaoEspecial: e.target.checked,
                    },
                  })
                }
                className="rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-0 accent-amber-400 w-4 h-4"
              />
              Cor Especial / Masterbatch
            </label>
          </div>
        )}
      </div>

      {/* Impressão e Tintas */}
      <div className="pt-2 border-t border-slate-800">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-amber-400" />
          Impressão & Personalização
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Método de Impressão
            </label>
            <select
              value={printing.method}
              onChange={(e) => {
                const method = e.target.value as PrintMethod;
                let setup = 150;
                let tinta = 0.08;
                if (method === 'flexografia') {
                  setup = 180;
                  tinta = 0.05;
                } else if (method === 'offset') {
                  setup = 280;
                  tinta = 0.15;
                } else if (method === 'sem_impressao') {
                  setup = 0;
                  tinta = 0;
                }
                setPrinting({
                  ...printing,
                  method,
                  custoMatrizSetupTotal: setup,
                  custoTintaPorUnidade: tinta,
                });
              }}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
            >
              <option value="flexografia">Flexografia (Rotativa)</option>
              <option value="serigrafia">Serigrafia / Silk-Screen</option>
              <option value="offset">Offset Plana (Alta Definição)</option>
              <option value="sem_impressao">Sem Impressão (Lisa)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Cores Frente / Verso
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="4"
                value={printing.coresFrente}
                onChange={(e) => setPrinting({ ...printing, coresFrente: Number(e.target.value) })}
                className="w-1/2 px-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded text-amber-400 text-center tabular-nums"
                title="Cores Frente"
              />
              <span className="text-amber-400 font-black self-center">x</span>
              <input
                type="number"
                min="0"
                max="4"
                value={printing.coresVerso}
                onChange={(e) => setPrinting({ ...printing, coresVerso: Number(e.target.value) })}
                className="w-1/2 px-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded text-amber-400 text-center tabular-nums"
                title="Cores Verso"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Cobertura de Tinta (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="100"
                step="5"
                value={printing.areaImpressaoPercent}
                onChange={(e) => setPrinting({ ...printing, areaImpressaoPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded text-white tabular-nums"
              />
              <span className="absolute right-2.5 top-2 text-xs text-amber-400 font-black">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Setup Matrizes (Clichês/Telas)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs text-amber-400 font-black">R$</span>
              <input
                type="number"
                min="0"
                step="10"
                value={printing.custoMatrizSetupTotal}
                onChange={(e) => setPrinting({ ...printing, custoMatrizSetupTotal: Number(e.target.value) })}
                className="w-full pl-8 pr-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded text-white tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Tinta / Tiro (R$/un)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs text-amber-400 font-black">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={printing.custoTintaPorUnidade}
                onChange={(e) => setPrinting({ ...printing, custoTintaPorUnidade: Number(e.target.value) })}
                className="w-full pl-8 pr-2.5 py-2 text-xs font-black bg-slate-900 border-2 border-slate-700 rounded text-white tabular-nums"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
