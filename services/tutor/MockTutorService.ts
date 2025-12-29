import { Pet, Tutor } from '../../types';
import { MOCK_PETS_LIST } from '../../constants';

export interface TutorSearchResult {
    tutor: Tutor;
    pets: Pet[];
    status: 'active' | 'no_plan' | 'delinquent';
}

export class MockTutorService {
    // CPFs
    static CPF_HAPPY_PATH = "111.111.111-11";
    static CPF_MULTI_PET = "222.222.222-22";
    static CPF_NO_PLAN = "333.333.333-33";
    static CPF_DELINQUENT = "444.444.444-44";

    private mocks: Record<string, TutorSearchResult> = {
        [MockTutorService.CPF_HAPPY_PATH]: {
            tutor: { name: "Ana Silva", phone: "(11) 99999-1111", cpf: MockTutorService.CPF_HAPPY_PATH },
            pets: [MOCK_PETS_LIST[0]], // Single Pet
            status: 'active'
        },
        [MockTutorService.CPF_MULTI_PET]: {
            tutor: { name: "Bruno Souza", phone: "(11) 99999-2222", cpf: MockTutorService.CPF_MULTI_PET },
            pets: MOCK_PETS_LIST, // Multiple Pets
            status: 'active'
        },
        [MockTutorService.CPF_NO_PLAN]: {
            tutor: { name: "Carla Diaz", phone: "(11) 99999-3333", cpf: MockTutorService.CPF_NO_PLAN },
            pets: [MOCK_PETS_LIST[1]], // Single Pet (Simba)
            status: 'no_plan'
        },
        [MockTutorService.CPF_DELINQUENT]: {
            tutor: { name: "Daniel Rocha", phone: "(11) 99999-4444", cpf: MockTutorService.CPF_DELINQUENT },
            pets: [MOCK_PETS_LIST[0]], // Single Pet
            status: 'delinquent'
        }
    };

    async getTutorByCPF(cpf: string): Promise<TutorSearchResult | null> {
        // Mock async delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mocks[cpf] || null;
    }
}

export const mockTutorService = new MockTutorService();
