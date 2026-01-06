import { Pet, Service, Tutor } from "./types";

// CPFs Gatilhos
export const CPF_HAPPY_PATH = "111.111.111-11";
export const CPF_MULTI_PET = "222.222.222-22";
export const CPF_NO_PLAN = "333.333.333-33";
export const CPF_DELINQUENT = "444.444.444-44";

export const MOCK_TUTOR: Tutor = {
  name: "Karina Almeida dos Santos",
  phone: "(11) 98765-4321",
  cpf: "123.456.789-01"
};

// Cenário com múltiplos pets
export const MOCK_PETS_LIST: Pet[] = [
  {
    id: "pet-1",
    name: "Luna",
    type: "Gato",
    breed: "Siamês",
    gender: "Fêmea",
    birthDate: "30/06/2018",
    age: "07 anos",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    weight: "4.5kg",
    plan: "Plano Conforto",
    hasAppointment: true,
    appointmentInfo: "14/01/2026 - 14:30\nWeVets - Unidade Jardins\n3 serviço(s) - R$ 310.00"
  },
  {
    id: "pet-2",
    name: "Simba",
    type: "Gato",
    breed: "Siamês",
    gender: "Fêmea",
    birthDate: "15/05/2020",
    age: "05 anos",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    weight: "3.2kg",
    plan: "Plano Conforto",
    hasAppointment: false
  }
];

// Pet padrão para cenário normal/inadimplente
export const MOCK_PET: Pet = MOCK_PETS_LIST[0];

// Dados do Orçamento Salvo (Mock)
export const MOCK_BUDGET_ITEMS = [
  { name: "Consulta Clínica Geral", price: 150.00 },
  { name: "Hemograma Completo", price: 70.00 },
  { name: "Vacina Antirrábica", price: 90.00 }
];

export const PLANS = [
  {
    name: "Plano Básico",
    price: "89,90",
    features: [
      "Vacinas Obrigatórias",
      "Consultas em Horário Comercial",
      "Consultas em Horário de Plantão (Coparticipação)",
      "Exames Laboratoriais Básicos",
      "Rede Credenciada Básica"
    ]
  },
  {
    name: "Plano Conforto",
    price: "149,90",
    baseFeatures: "Tudo do plano Básico e mais:",
    features: [
      "Consultas de Plantão Sem Coparticipação",
      "Exames de Imagem Simples",
      "Exames Laboratoriais Completos",
      "Hospitais WeVets 24h"
    ]
  },
  {
    name: "Plano Super",
    price: "299,90",
    baseFeatures: "Tudo do plano Conforto e mais:",
    features: [
      "Especialistas (Cardio, Dermato, Oftalmo)",
      "Exames de Alta Complexidade (com limites)",
      "Cirurgias Eletivas (Castração)",
      "Internação (até 24h)"
    ]
  },
  {
    name: "Plano Ultra",
    price: "499,90",
    baseFeatures: "Tudo do plano Super e mais:",
    features: [
      "Cobertura Total de Especialistas",
      "Exames de Imagem Avançados (Tomografia/Ressonância)",
      "Internação Ilimitada",
      "Reembolso de Despesas (Livre Escolha)"
    ]
  }
];

export const SERVICES: Service[] = [
  // --- CONSULTAS ---
  {
    id: "1",
    code: "CONS-001",
    name: "Consulta Clínica Geral",
    category: "Consulta",
    price: 150.00,
    copay: 25.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "2",
    code: "CONS-002",
    name: "Consulta Plantão/Emergência",
    category: "Consulta",
    price: 250.00,
    copay: 50.00,
    actionType: 'cart',
    warning: "Consulta emergencial (Fora do horário comercial)",
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "3",
    code: "ESP-001",
    name: "Consulta Especialista - Dermatologia",
    category: "Consulta",
    price: 220.00,
    copay: 45.00,
    actionType: 'cart',
    tags: [
      { label: "Carência de 60 dias", type: "error", icon: "x" },
      { label: "Limite 3/ano", type: "success", icon: "check" },
    ]
  },
  {
    id: "4",
    code: "ESP-002",
    name: "Consulta Especialista - Cardiologia",
    category: "Consulta",
    price: 220.00,
    copay: 45.00,
    actionType: 'cart',
    disabled: true,
    tags: [
      { label: "Limite atingido", type: "error", icon: "x" },
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "5",
    code: "ESP-003",
    name: "Consulta Especialista - Oftalmologia",
    category: "Consulta",
    price: 220.00,
    copay: 45.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "6",
    code: "ESP-004",
    name: "Consulta Especialista - Ortopedia",
    category: "Consulta",
    price: 250.00,
    copay: 50.00,
    actionType: 'upgrade',
    disabled: true,
    warning: "Exclusivo para Plano Premium/Black",
    tags: [
      { label: "Sem cobertura", type: "error", icon: "x" },
    ]
  },
  {
    id: "7",
    code: "ESP-005",
    name: "Consulta Especialista - Felinos",
    category: "Consulta",
    price: 200.00,
    copay: 40.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "8",
    code: "ESP-006",
    name: "Consulta Especialista - Oncologia",
    category: "Consulta",
    price: 300.00,
    copay: 0.00,
    actionType: 'internal_only',
    warning: "Rede credenciada não atende. Apenas Rede Interna.",
    tags: [
      { label: "Sem cobertura na Rede Credenciada", type: "error", icon: "x" },
    ]
  },

  // --- VACINAS ---
  {
    id: "10",
    code: "VAC-001",
    name: "Vacina Polivalente V8/V10 (Cães)",
    category: "Vacina",
    price: 120.00,
    copay: 0.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura Total", type: "success", icon: "check" },
    ]
  },
  {
    id: "11",
    code: "VAC-002",
    name: "Vacina Antirrábica",
    category: "Vacina",
    price: 90.00,
    copay: 0.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura Total", type: "success", icon: "check" },
    ]
  },
  {
    id: "12",
    code: "VAC-003",
    name: "Vacina Contra Gripe (Bordetella)",
    category: "Vacina",
    price: 110.00,
    copay: 20.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "13",
    code: "VAC-004",
    name: "Vacina Quádrupla/Quíntupla (Gatos)",
    category: "Vacina",
    price: 120.00,
    copay: 0.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura Total", type: "success", icon: "check" },
    ]
  },
  {
    id: "14",
    code: "VAC-005",
    name: "Vacina Giárdia",
    category: "Vacina",
    price: 130.00,
    copay: 25.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },

  // --- EXAMES ---
  {
    id: "20",
    code: "LAB-001",
    name: "Hemograma Completo",
    category: "Exame",
    price: 70.00,
    copay: 15.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "21",
    code: "LAB-002",
    name: "Perfil Bioquímico (Renal/Hepático)",
    category: "Exame",
    price: 160.00,
    copay: 35.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "22",
    code: "LAB-003",
    name: "Urinálise (Tipo 1)",
    category: "Exame",
    price: 60.00,
    copay: 10.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "23",
    code: "IMG-001",
    name: "Ultrassom Abdominal Total",
    category: "Exame",
    price: 250.00,
    copay: 60.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "24",
    code: "IMG-002",
    name: "Raio-X (Simples/Por projeção)",
    category: "Exame",
    price: 180.00,
    copay: 40.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "25",
    code: "IMG-003",
    name: "Ecocardiograma",
    category: "Exame",
    price: 320.00,
    copay: 75.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },
  {
    id: "26",
    code: "EXT-001",
    name: "Ressonância Magnética",
    category: "Exame",
    price: 1200.00,
    copay: 0,
    actionType: 'none',
    disabled: true,
    tags: [
      { label: "Serviço indisponível na unidade", type: "error", icon: "x" }
    ]
  },
  {
    id: "27",
    code: "EXT-002",
    name: "Endoscopia Digestiva",
    category: "Exame",
    price: 650.00,
    copay: 0,
    actionType: 'forward',
    disabled: true,
    tags: [
      { label: "Requer Encaminhamento", type: "error", icon: "x" }
    ]
  },

  // --- CIRURGIAS ---
  {
    id: "40",
    code: "CIR-001",
    name: "Castração Eletiva (Fêmea até 10kg)",
    category: "Cirurgia",
    price: 900.00,
    copay: 200.00,
    actionType: 'cart',
    warning: "Requer exames pré-cirúrgicos aprovados",
    tags: [
      { label: "Carência", type: "success", icon: "check" },
    ]
  },
  {
    id: "41",
    code: "CIR-002",
    name: "Tartarectomia (Limpeza de Tártaro)",
    category: "Cirurgia",
    price: 750.00,
    copay: 150.00,
    actionType: 'cart',
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  },

  // --- INTERNAÇÃO ---
  {
    id: "50",
    code: "INT-001",
    name: "Diária de Internação (até 12h)",
    category: "Internação",
    price: 450.00,
    copay: 100.00,
    actionType: 'cart',
    warning: "Sujeito à disponibilidade de leito",
    tags: [
      { label: "Cobertura", type: "success", icon: "check" },
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Todos', count: 23 },
  { id: 'consultas', label: 'Consultas', count: 7 },
  { id: 'vacinas', label: 'Vacinas', count: 5 },
  { id: 'exames', label: 'Exames', count: 8 },
  { id: 'cirurgias', label: 'Cirurgias', count: 2 },
  { id: 'internacao', label: 'Internação', count: 1 },
];

export const MOCK_ATTENDANCE_HISTORY = [
  {
    id: '1',
    date: '15/01/2025',
    time: '14:30',
    unit: 'Unidade Jardins',
    type: 'Atendimento Clínico',
    status: 'completed',
    vetName: 'Dr. Fernando Oliveira',
    diagnosis: 'Gastroenterite aguda',
    treatment: 'Prescrição de antiemético e protetor gástrico, dieta leve por 3 dias',
    services: ['Consulta Clínica Geral', 'Hemograma Completo', 'Ultrassom Abdominal Total'],
    documents: ['Exame_Sangue.pdf', 'receita_medicamento.pdf']
  },
  {
    id: '2',
    date: '20/12/2024',
    time: '10:15',
    unit: 'Unidade Jardins',
    type: 'Retorno Clínico',
    status: 'completed',
    vetName: 'Dr. Fernando Oliveira',
    diagnosis: 'Recuperação satisfatória',
    services: ['Consulta Retorno (Cortesia)']
  },
  {
    id: '3',
    date: '02/10/2024',
    time: '16:45',
    unit: 'Unidade Moema',
    type: 'Vacinação Anual',
    status: 'completed',
    vetName: 'Dra. Amanda Silva',
    services: ['Vacina Polivalente V8/V10 (Cães)', 'Vacina Antirrábica']
  }
];