import React from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { CheckCircle, Activity, FileText, ShoppingCart, User, HeartPulse, Paperclip, Eye, X } from 'lucide-react';

interface SummaryViewProps {
    onFinish?: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ onFinish }) => {
    const { attendance, finishAttendance, canFinalize } = useAttendance();
    const [previewAttachment, setPreviewAttachment] = React.useState<string | null>(null);

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
                    {/* Dados Vitais - HIDDEN BY USER REQUEST */}

                    {/* Histórico e Manejo - HIDDEN BY USER REQUEST */}

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

                            {/* Revisão de Sistemas - HIDDEN BY USER REQUEST */}

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
                                        {attendance.anamnesis.attachments.map((fileEntry, idx) => {
                                            const [fileName] = fileEntry.includes('|data:') ? fileEntry.split('|') : [fileEntry];
                                            return (
                                                <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm group">
                                                    <Paperclip size={12} className="text-gray-400" />
                                                    <span className="text-[11px] font-medium text-gray-600 max-w-[150px] truncate">{fileName}</span>
                                                    <button
                                                        onClick={() => setPreviewAttachment(fileEntry)}
                                                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary-600 transition-colors"
                                                        title="Visualizar"
                                                    >
                                                        <Eye size={12} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Serviços & Encaminhamento */}
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
                                                <span className="font-bold text-gray-800">{item.name}</span>
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
                                <span className="text-2xl font-bold text-emerald-600">{totalServices.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        )}
                    </div>

                    {/* Prescription Summary */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
                        <SectionHeader title="Encaminhamento" colorClass="text-indigo-600" icon={FileText} />
                        {attendance.prescriptions.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-400">Nenhum encaminhamento registrado.</p>
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

            {/* Preview Modal */}
            {previewAttachment && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 truncate pr-4">
                                {previewAttachment.includes('|data:') ? previewAttachment.split('|')[0] : previewAttachment}
                            </h3>
                            <button
                                onClick={() => setPreviewAttachment(null)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-gray-100 flex items-center justify-center">
                            {(() => {
                                const isDataUrl = previewAttachment.includes('|data:');
                                const [fileName, fileUrl] = isDataUrl ? previewAttachment.split('|') : [previewAttachment, null];
                                const isImage = (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i) || fileUrl?.startsWith('data:image'));

                                if (isImage) {
                                    return (
                                        <img
                                            src={fileUrl || "/placeholder-image.jpg"}
                                            alt={fileName}
                                            className="max-w-full max-h-full object-contain rounded shadow-sm"
                                        />
                                    );
                                }

                                return (
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-4 py-12">
                                        <FileText size={48} />
                                        <p className="text-sm font-medium">Visualização não disponível para este formato</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
