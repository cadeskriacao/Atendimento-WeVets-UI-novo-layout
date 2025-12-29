import React, { useState } from 'react';
import { PLANS } from '../constants';
import { Button } from './ui';

interface PlanSelectionProps {
  onBack: () => void;
}

export const PlanSelection: React.FC<PlanSelectionProps> = ({ onBack }) => {
  const [period, setPeriod] = useState<'anual' | 'mensal'>('anual');

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          Este pet ainda não possui um plano WeVets ativo.
        </h1>
      </div>

      <div className="w-full max-w-[1300px] border border-gray-200 rounded-xl p-4 md:p-12 bg-white shadow-sm mb-10">
        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setPeriod('anual')}
              className={`px-8 py-2.5 rounded-md font-bold transition-all ${period === 'anual'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'bg-transparent text-gray-500 hover:text-primary-600'
                }`}
            >
              Anual
            </button>
            <button
              onClick={() => setPeriod('mensal')}
              className={`px-8 py-2.5 rounded-md font-bold transition-all ${period === 'mensal'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'bg-transparent text-gray-500 hover:text-primary-600'
                }`}
            >
              Mensal
            </button>
          </div>
        </div>

        <div className="text-center text-sm font-medium text-primary-600 mb-10 bg-primary-50 inline-block px-4 py-1 rounded-full mx-auto table">
          ✨ Contratando o plano anual o cliente ganha 02 meses grátis
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan, index) => (
            <div key={index} className="bg-gray-100 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary-100">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className="text-2xl text-primary-600 font-bold mb-6">R$ {plan.price} <span className="text-sm text-gray-500 font-normal">/mês</span></div>

              <div className="flex-grow w-full text-left mb-8 border-t border-gray-200 pt-6">
                {plan.baseFeatures && (
                  <p className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">{plan.baseFeatures}</p>
                )}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 leading-tight flex items-start gap-2">
                      <span className="text-primary-400 mt-0.5">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full border-primary-600 text-primary-600 font-bold hover:bg-primary-600 hover:text-white"
                onClick={() => {
                  // Mock interaction
                  alert(`Link da oferta ${plan.name} enviado para o tutor!`);
                }}
              >
                Enviar oferta
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={onBack}
        className="px-8 py-3 text-primary-600 font-bold hover:bg-primary-50 text-base h-auto"
      >
        ← Voltar para busca
      </Button>
    </div>
  );
};