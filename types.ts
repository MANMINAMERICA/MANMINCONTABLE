
export enum UserRole {
  ADMIN = 'Administrador',
  TREASURER = 'Tesorero',
  AUDITOR = 'Auditor'
}

export enum TransactionMethod {
  CASH = 'Efectivo',
  BANK = 'Consignación'
}

export enum BankAccount {
  BANCOLOMBIA = 'Bancolombia',
  CAJA_SOCIAL = 'Caja Social',
  NONE = 'N/A'
}

export enum TransactionStatus {
  PENDING = 'Pendiente',
  CONFIRMED = 'Confirmado'
}

export interface Member {
  id: string; // Cédula/NIT
  name: string;
  joinDate: string;
  status: 'Activo' | 'Inactivo';
}

export interface IncomeBreakdown {
  category: string;
  amount: number;
  memberId?: string;   // Nuevo: ID del donante específico en lotes
  memberName?: string; // Nuevo: Nombre del donante específico en lotes
}

export interface Income {
  id: string;
  date: string;
  worshipDate: string;
  memberId: string;    // En lotes será "BATCH"
  memberName: string;  // En lotes será "Depósito Consolidado"
  method: TransactionMethod;
  bank: BankAccount;
  breakdown: IncomeBreakdown[];
  total: number;
  notes: string;
  status: TransactionStatus;
  reconciliationDate?: string;
  isRemittance?: boolean; 
  remittanceSent?: boolean; 
  remittanceSentDate?: string; 
  isBatch?: boolean;   // Nuevo: Identificador de ingreso por lote
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  source: 'Caja Efectivo' | BankAccount;
  responsible: string;
  thirdParty: string;
  description: string;
}

export interface Balances {
  cash: number;
  banks: number;
  remittances: number;
}

export type View = 'dashboard' | 'income' | 'batch-income' | 'expenses' | 'conciliation' | 'remittances' | 'reports' | 'members' | 'cash' | 'banks';
