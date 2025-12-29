import React from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { CheckCircle, Activity, FileText, ShoppingCart, Pill, User, HeartPulse, Paperclip } from 'lucide-react';

interface SummaryViewProps {
    onFinish?: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ onFinish }) => {
    const { attendance, finishAttendance, canFinalize } = useAttendance();

    if (!attendance) return null;

    const SectionHeader = ({ title, colorClass, icon: Icon }: { title: string; colorClass: string; icon: React.ElementType }) => (
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 ${colorClass}`}>
            <div className={`p-1.5 rounded-lg bg-current/10`}>
                <Icon size={18} className="text-current" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
        </div>
    );

    const totalServices = attendance.services.reduce((acc, item) =>
        acc + (item.copay * item.quantity) + ((item.anticipationFee || 0) * item.quantity) + ((item.limitFee || 0) * item.quantity), 0
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Resumo do Atendimento</h2>
                    <p className="text-gray-500">Revise os dados clínicos e serviços antes de finalizar.</p>
                </div>
                {!canFinalize && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                        <Activity size={16} />
                        Pendências: Agenda ou Dados Obrigatórios
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Triagem & Anamnese */}
                <div className="space-y-8">
                    {/* Triage Summary */}
                    {/* Triage Summary */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
                        <SectionHeader title="Dados Vitais" colorClass="text-blue-600" icon={Activity} />
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Peso</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900">{attendance.anamnesis.vitals?.weight || attendance.triage.weight || '--'}</span>
                                    <span className="text-xs font-medium text-gray-500">kg</span>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Temp</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900">{attendance.anamnesis.vitals?.temp || attendance.triage.temperature || '--'}</span>
                                    <span className="text-xs font-medium text-gray-500">°C</span>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">F.C.</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900">{attendance.anamnesis.vitals?.heartRate || attendance.triage.heartRate || '--'}</span>
                                    <span className="text-xs font-medium text-gray-500">bpm</span>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">F.R.</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900">{attendance.anamnesis.vitals?.respRate || '--'}</span>
                                    <span className="text-xs font-medium text-gray-500">mpm</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Summary */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
                        <SectionHeader title="Histórico e Manejo" colorClass="text-indigo-600" icon={User} />
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Ambiente</span>
                                <span className="font-semibold text-gray-700 capitalize">{attendance.anamnesis.history?.environment || '--'}</span>
                            </div>
                            <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Alimentação</span>
                                <span className="font-semibold text-gray-700">{attendance.anamnesis.history?.diet?.replace('_', ' ') || '--'}</span>
                            </div>
                            <div className={`px-3 py-2 rounded-lg border ${attendance.anamnesis.history?.vaccination?.status === 'outdated' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Vacinação</span>
                                <span className={`font-bold ${attendance.anamnesis.history?.vaccination?.status === 'outdated' ? 'text-red-600' : 'text-gray-700'}`}>
                                    {attendance.anamnesis.history?.vaccination?.status === 'up_to_date' ? 'Em dia' :
                                        attendance.anamnesis.history?.vaccination?.status === 'outdated' ? 'Atrasada' : 'Não informado'}
                                    {attendance.anamnesis.history?.vaccination?.lastDate && ` (${attendance.anamnesis.history.vaccination.lastDate.split('-').reverse().join('/')})`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Anamnesis Summary */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
                        <SectionHeader title="Queixa e Exame Físico" colorClass="text-amber-600" icon={FileText} />
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    Queixa Principal
                                </label>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {attendance.anamnesis.mainComplaint || <span className="text-gray-400 italic">Nenhuma queixa registrada.</span>}
                                </p>
                            </div>

                            {attendance.anamnesis.systems && attendance.anamnesis.systems.length > 0 && (
                                <div className="border-t border-gray-100 pt-4">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-3 md:flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 hidden md:block" />
                                        Revisão de Sistemas
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {attendance.anamnesis.systems.map((sys, idx) => (
                                            <div key={idx} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-amber-200 transition-colors">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-gray-700">{sys.systemName}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${sys.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {sys.status === 'normal' ? 'Normal' : 'Alterado'}
                                                    </span>
                                                </div>
                                                {sys.observations && (
                                                    <p className="text-xs text-gray-600 mt-1 italic leading-relaxed pl-2 border-l-2 border-red-200">"{sys.observations}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {attendance.anamnesis.diagnosticHypothesis && (
                                <div className="border-t border-gray-100 pt-4">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Hipótese Diagnóstica</label>
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-xl flex gap-3">
                                        <HeartPulse size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                                            {attendance.anamnesis.diagnosticHypothesis}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {attendance.anamnesis.attachments && attendance.anamnesis.attachments.length > 0 && (
                                <div className="border-t border-gray-100 pt-4">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Anexos</label>
                                    <div className="flex flex-wrap gap-2">
                                        {attendance.anamnesis.attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 font-medium">
                                                <Paperclip size={12} className="text-gray-400" />
                                                {file}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Serviços & Receituário */}
                <div className="space-y-8">
                    {/* Services Summary */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-6 flex flex-col h-fit">
                        <SectionHeader title="Faturamento de Serviços" colorClass="text-emerald-600" icon={ShoppingCart} />

                        <div className="flex-1">
                            {attendance.services.length === 0 ? (
                                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">Nenhum serviço lançado.</p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {attendance.services.map(item => (
                                        <li key={item.id} className="flex flex-col py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-gray-800">{item.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 bg-white border px-1.5 rounded uppercase tracking-wider">x{item.quantity}</span>
                                                    <span className="font-bold text-gray-900">
                                                        {((item.copay + (item.anticipationFee || 0) + (item.limitFee || 0)) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1 pl-1">
                                                <div className="flex justify-between text-[11px] text-gray-500">
                                                    <span>Coparticipação</span>
                                                    <span>{(item.copay * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </div>

                                                {item.anticipationFee && item.anticipationFee > 0 && (
                                                    <div className="flex justify-between text-[11px] text-amber-600 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <div className="w-1 h-1 rounded-full bg-amber-400" />
                                                            Antecipação
                                                        </span>
                                                        <span>{(item.anticipationFee * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                    </div>
                                                )}

                                                {item.limitFee && item.limitFee > 0 && (
                                                    <div className="flex justify-between text-[11px] text-rose-600 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <div className="w-1 h-1 rounded-full bg-rose-400" />
                                                            Compra de limite
                                                        </span>
                                                        <span>{(item.limitFee * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {attendance.services.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total do Atendimento</span>
                                <span className="text-2xl font-black text-emerald-600">{totalServices.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        )}
                    </div>

                    {/* Prescription Summary */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
                        <SectionHeader title="Receituário" colorClass="text-purple-600" icon={Pill} />
                        {attendance.prescriptions.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-400">Nenhum medicamento prescrito.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {attendance.prescriptions.map(item => (
                                    <li key={item.id} className="text-sm bg-purple-50/30 p-4 rounded-xl border border-purple-50">
                                        <div className="font-bold text-gray-900 flex justify-between items-start mb-2">
                                            {item.name}
                                            <span className="text-[10px] px-2 py-0.5 bg-white rounded-full border border-purple-100 text-purple-600 font-bold uppercase tracking-wide">Uso contínuo</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs text-purple-900/70 mb-2">
                                            <div>
                                                <span className="block font-bold text-purple-900/40 uppercase text-[10px]">Dose</span>
                                                {item.dosage}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-purple-900/40 uppercase text-[10px]">Frequência</span>
                                                {item.frequency}
                                            </div>
                                        </div>
                                        <div className="text-xs text-purple-900/70">
                                            <span className="block font-bold text-purple-900/40 uppercase text-[10px]">Duração</span>
                                            {item.duration}
                                        </div>
                                        {item.notes && (
                                            <div className="mt-3 pt-2 border-t border-purple-100 text-xs text-gray-600 italic flex gap-1.5">
                                                <span className="font-bold not-italic">Obs:</span> {item.notes}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Validation Banner */}
            <div className={`rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300 ${canFinalize ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <CheckCircle size={32} className={canFinalize ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div>
                        <h4 className={`text-lg font-bold ${canFinalize ? 'text-white' : 'text-gray-700'}`}>
                            {canFinalize ? 'Pronto para finalizar' : 'Atendimento pendente'}
                        </h4>
                        <p className={`text-sm ${canFinalize ? 'text-blue-100' : 'text-gray-500'}`}>
                            {canFinalize
                                ? 'Isso irá gerar as cobranças, liberar receitas e encerrar o prontuário.'
                                : 'Verifique se agendou o atendimento e preencheu todos os dados obrigatórios.'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            finishAttendance();
                            if (onFinish) onFinish();
                        }}
                        disabled={!canFinalize}
                        className={`px-8 py-4 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2
                            ${canFinalize
                                ? 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                    >
                        {canFinalize ? 'FINALIZAR ATENDIMENTO' : 'Preencha os dados obrigatórios'}
                    </button>
                </div>
            </div>
        </div>
    );
};
