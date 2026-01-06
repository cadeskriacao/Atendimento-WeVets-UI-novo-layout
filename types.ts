
export interface Service {
  id: string;
  code: string;
  name: string;
  category: 'Consulta' | 'Vacina' | 'Exame' | 'Cirurgia' | 'Internação';
  price: number;
  copay: number;
  tags: {
    label: string;
    type: 'success' | 'warning' | 'error' | 'neutral';
    icon?: 'check' | 'x' | 'clock';
  }[];
  warning?: string;
  disabled?: boolean;
  actionType: 'cart' | 'forward' | 'none' | 'upgrade'; // 'upgrade' offers plan change
}

export interface CartItem extends Service {
  quantity: number;
  anticipationFee?: number; // Valor da antecipação de carência, se houver
  limitFee?: number; // Valor da compra de limite, se houver
}

export interface Pet {
  id: string; // Added ID for selection
  name: string;
  type: string;
  breed: string;
  gender: string;
  birthDate: string;
  age: string;
  weight?: string;
  image: string;
  plan?: string; // Added for the UI card
  hasAppointment?: boolean; // For the badge
  appointmentInfo?: string; // Detail line
}

export interface Tutor {
  name: string;
  phone: string;
  cpf: string;
}

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  time: string;
  unit: string;
  type: string;
  status: 'completed' | 'cancelled' | 'in_progress';
  vetName: string;
  diagnosis?: string;
  treatment?: string;
  services: string[];
  documents?: string[];
}

export type ModalType = 'none' | 'finalize' | 'schedule' | 'details' | 'search' | 'petSelection' | 'budgetDetails' | 'anamnesis' | 'gracePeriod' | 'confirmBudget' | 'limitExceeded' | 'noCoverage' | 'serviceDetails' | 'cancelAttendance' | 'updateWeight' | 'tutorInfo' | 'upgradePlan' | 'attendanceHistory' | 'cpfInput';

// --- Clinical Attendance Types ---

export type AttendanceStatus = 'INITIATED' | 'BUDGET_SENT' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'SCHEDULED';

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  INITIATED: 'Iniciado',
  BUDGET_SENT: 'Orçamento Enviado',
  IN_PROGRESS: 'Em atendimento médico',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
  SCHEDULED: 'Agendado'
};

export type AttendanceStep = 'ANAMNESIS' | 'SERVICES' | 'PRESCRIPTION' | 'SUMMARY';

export interface TriageData {
  weight?: string;
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  respiratoryRate?: string;
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface SystemReview {
  systemName: string; // 'Digestive', 'Respiratory', 'Cardiovascular', etc.
  status: 'normal' | 'abnormal' | 'not_observed';
  observations?: string; // Required if abnormal
}

export interface AnamnesisHistory {
  environment?: 'casa' | 'apartamento' | 'sitio' | 'rua';
  diet?: 'razão_seca' | 'úmida' | 'natural' | 'mista';
  vaccination: {
    status: 'up_to_date' | 'outdated' | 'unknown';
    lastDate?: string;
    notes?: string;
  };
  deworming?: {
    date?: string;
    product?: string;
  };
}

export interface AnamnesisVitals {
  weight?: string;
  temp?: string;
  heartRate?: string;
  respRate?: string;
  ecc?: string; // Escore de Condição Corporal 1-9
}

export interface AnamnesisData {
  mainComplaint: string;
  history: AnamnesisHistory;
  vitals: AnamnesisVitals;
  systems: SystemReview[];
  diagnosticHypothesis?: string;
  attachments?: string[];
}

export interface Attendance {
  id: string;
  petId: string;
  tutorId: string;
  status: AttendanceStatus;
  currentStep: AttendanceStep;

  triage: TriageData;
  anamnesis: AnamnesisData;
  services: CartItem[]; // Encapsulating the Cart
  prescriptions: PrescriptionItem[];

  schedulingInfo?: {
    date: string;
    time: string;
    location: 'clinic' | 'home';
  };
  cancellationReason?: string;
  budgetGenerated?: boolean;

  createdAt: string;
  updatedAt: string;
}
export type SaleStatus = 'CONCLUÍDA' | 'AGUARDANDO_PAGAMENTO' | 'CANCELADA';

export interface ISale {
  id: string;
  attendanceId: string;
  date: string; // ISO Date
  petName: string;
  tutorName: string;
  tutorCpf: string;
  status: SaleStatus;
  grossValue: number;
  commissionRate: number; // e.g., 0.2 for 20%
  commissionValue: number;
  netValue: number;
}
