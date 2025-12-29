import React, { useState } from 'react';
import { Search, ShoppingCart, Check, X, AlertTriangle } from 'lucide-react';
import { Service, CartItem } from '../types';
import { SERVICES, CATEGORIES } from '../constants';
import { Button, Input } from './ui';

interface ServiceListProps {
  onAddToCart: (service: Service) => void;
  onOpenAnamnesis: () => void;
  hasAnamnesis: boolean;
  unlockedServices?: string[]; // IDs of services that had grace period paid or limit bought
  onServiceClick?: (service: Service, type: 'grace' | 'limit' | 'noCoverage') => void; // Intercept click for special logic
  onServiceForward?: (service: Service) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  onAddToCart,
  onOpenAnamnesis,
  hasAnamnesis,
  unlockedServices = [],
  onServiceClick,
  onServiceForward
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = SERVICES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' ||
      (activeCategory === 'consultas' && s.category === 'Consulta') ||
      (activeCategory === 'vacinas' && s.category === 'Vacina') ||
      (activeCategory === 'exames' && s.category === 'Exame') ||
      (activeCategory === 'cirurgias' && s.category === 'Cirurgia') ||
      (activeCategory === 'internacao' && s.category === 'Internação');
    return matchesSearch && matchesCategory;
  });

  const handleServiceClick = (service: Service) => {
    const isUnlocked = unlockedServices.includes(service.id);

    // Check for Grace Period (Carência) - Error Type
    const hasGracePeriod = service.tags.some(t => t.label.toLowerCase().includes('carência') && t.type === 'error');

    // Check for Limit Reached (Limite atingido) - Error Type
    const hasLimitReached = service.tags.some(t => t.label.toLowerCase().includes('limite') && t.type === 'error');

    // Check for No Coverage (Sem cobertura) - Error Type
    const hasNoCoverage = service.tags.some(t => t.label.toLowerCase().includes('sem cobertura') && t.type === 'error');

    if (!isUnlocked && onServiceClick) {
      if (hasNoCoverage) {
        onServiceClick(service, 'noCoverage');
        return;
      }
      if (hasLimitReached) {
        onServiceClick(service, 'limit');
        return;
      }
      if (hasGracePeriod) {
        onServiceClick(service, 'grace');
        return;
      }
    }

    if (!service.disabled && service.actionType === 'cart') {
      onAddToCart(service);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Selecione o serviço</h3>
          <p className="text-sm text-gray-500">Busque por nome, código ou filtre por categoria</p>
        </div>
      </div>

      {/* Search Bar - Full Width */}
      <div className="mb-8">
        <div className="relative group">
          <Input
            leftIcon={<Search className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />}
            type="text"
            className="bg-gray-100 border-gray-200 focus:bg-white transition-all h-12"
            placeholder="Pesquise por procedimento ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 border-b border-gray-100 mb-6 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all
              ${activeCategory === cat.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            {cat.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredServices.map((service) => {
          const isUnlocked = unlockedServices.includes(service.id);

          return (
            <div key={service.id} className="p-5 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group bg-white flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-100">{service.code}</span>
                  {service.name.startsWith(service.category) && <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{service.category}</span>}
                </div>
                <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-primary-700 transition-colors">
                  {service.name.replace(service.category, '').trim() || service.name}
                </h4>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {service.tags.map((tag, idx) => {
                    const isErrorTag = tag.type === 'error';
                    if (isUnlocked && isErrorTag) {
                      return (
                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100 text-emerald-700 bg-emerald-50">
                          <Check size={12} />
                          {tag.label.replace('atingido', 'liberado').replace('de 60 dias', 'liberada').replace('Serviço indisponível', 'Disponível').replace('Sem cobertura', 'Cobertura')}
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border
                                ${tag.type === 'success' ? 'border-emerald-100 text-emerald-700 bg-emerald-50' : ''}
                                ${tag.type === 'error' ? 'border-amber-100 text-amber-700 bg-amber-50' : ''}
                            `}>
                        {tag.type === 'error' && <AlertTriangle size={12} />}
                        {tag.label}
                      </div>
                    )
                  })}
                </div>

                {service.warning && (
                  <div className="mt-2 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">
                    {service.warning}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center self-end md:self-center">
                {service.actionType === 'forward' ? (
                  <Button variant="outline" size="sm" onClick={() => onServiceForward && onServiceForward(service)} className="border-primary-200 text-primary-700 hover:bg-primary-50 font-semibold">
                    Encaminhar
                  </Button>
                ) : service.actionType === 'upgrade' ? (
                  <Button variant="outline" size="sm" onClick={() => handleServiceClick(service)} className="border-primary-200 text-primary-700 hover:bg-primary-50 font-semibold">
                    Ofertar Upgrade
                  </Button>
                ) : service.actionType === 'none' ? (
                  <Button variant="ghost" disabled size="icon" className="bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed h-10 w-10 p-0 rounded-full">
                    <ShoppingCart size={18} />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleServiceClick(service)}
                    disabled={service.disabled && !service.tags.some(t => t.type === 'error')}
                    size="icon"
                    className={`h-10 w-10 p-0 rounded-full transition-all shadow-sm
                              ${service.disabled && !service.tags.some(t => t.type === 'error')
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : 'bg-white text-primary-600 border border-primary-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 hover:shadow-primary-500/30 hover:shadow-lg hover:-translate-y-0.5'}
                            `}
                  >
                    {service.disabled && service.tags.some(t => t.type === 'error') ? <AlertTriangle size={18} /> : <ShoppingCart size={18} />}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
