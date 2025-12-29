import React from 'react';
import { X, Check } from 'lucide-react';

interface NotificationProps {
  onClose: () => void;
  onAction?: () => void;
}

export const PaymentLinkSentToast: React.FC<NotificationProps> = ({ onClose, onAction }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-primary-50 border border-primary-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        {/* Decorative strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-primary-400 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-primary-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-primary-900 font-bold text-base mb-1 pr-6">
            Link enviado com sucesso
          </h3>

          <p className="text-primary-700 text-sm mb-3 leading-relaxed">
            Link de pagamento enviado ao tutor com sucesso.
          </p>

          {/* Simulando o botão 'Simular Pagamento' para ver o fluxo verde */}
          <button
            onClick={onAction}
            className="text-xs bg-white border border-primary-200 text-primary-700 px-3 py-1.5 rounded font-medium hover:bg-primary-100 transition-colors shadow-sm"
          >
            (Simular Pagamento Realizado)
          </button>
        </div>
      </div>
    </div>
  );
};

export const PlanActiveToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-teal-900 font-bold text-base mb-1">
            Plano ativo
          </h3>

          <p className="text-teal-700 text-sm leading-relaxed">
            O tutor realizou o pagamento das faturas em aberto e está com o plano ativo novamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export const GracePeriodSuccessToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-teal-900 font-bold text-base mb-1">
            Antecipação de carência realizada com sucesso!
          </h3>

          <p className="text-teal-700 text-sm leading-relaxed">
            O tutor realizou a antecipação de carência referente a consulta especializada - Dermatologia
          </p>
        </div>
      </div>
    </div>
  );
};

export const LimitPurchasedToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-teal-900 font-bold text-base mb-1">
            Limite adquirido com sucesso pelo tutor
          </h3>

          <p className="text-teal-700 text-sm leading-relaxed">
            O limite extra foi liberado e o serviço pode ser agendado.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ForwardSuccessToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-primary-50 border border-primary-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-primary-400 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-primary-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-primary-900 font-bold text-base mb-1">
            Encaminhamento realizado
          </h3>

          <p className="text-primary-700 text-sm leading-relaxed">
            O tutor foi direcionado para a rede WeVets.
          </p>
        </div>
      </div>
    </div>
  );
};

export const UpgradeSuccessToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-teal-900 font-bold text-base mb-1">
            Upgrade realizado com sucesso
          </h3>

          <p className="text-teal-700 text-sm leading-relaxed">
            O plano foi atualizado e o serviço agora possui cobertura.
          </p>
        </div>
      </div>
    </div>
  );
};

export const FinalizeFeesPaidToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-teal-900 font-bold text-base mb-1">
            Antecipação realizada
          </h3>

          <p className="text-teal-700 text-sm leading-relaxed">
            O tutor realizou o pagamento da antecipação com sucesso. O atendimento pode ser finalizado.
          </p>
        </div>
      </div>
    </div>
  );
};

export const AttendanceCancelledToast: React.FC<NotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
        >
          <X size={18} />
        </button>

        <div className="pl-3">
          <h3 className="text-teal-900 font-bold text-base mb-1">
            Atendimento cancelado com sucesso!
          </h3>
        </div>
      </div>
    </div>
  );
};

export const AttendanceFinalizedToast: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
    <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
      >
        <X size={18} />
      </button>
      <div className="pl-3">
        <h3 className="text-teal-900 font-bold text-base mb-1">
          Atendimento finalizado
        </h3>
        <p className="text-teal-700 text-sm leading-relaxed">
          O Atendimento foi encerrado com sucesso.
        </p>
      </div>
    </div>
  </div>
);

export const ScheduleSuccessToast: React.FC<{ onClose: () => void, date: string, time: string }> = ({ onClose, date, time }) => (
  <div className="fixed top-24 right-4 md:right-8 z-[60] w-full max-w-sm animate-in slide-in-from-right fade-in duration-300">
    <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-xl p-5 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors p-1 rounded-full hover:bg-teal-100"
      >
        <X size={18} />
      </button>
      <div className="pl-3">
        <h3 className="text-teal-900 font-bold text-base mb-1">
          Agendamento realizado com sucesso
        </h3>
        <p className="text-teal-700 text-sm leading-relaxed">
          Agendado para {new Date(date).toLocaleDateString('pt-BR')} às {time}
        </p>
      </div>
    </div>
  </div>
);

