
import { Member } from './types';

export const INCOME_CATEGORIES = [
  'Diezmo',
  'Ofrenda',
  'Ofrenda especial',
  'Pro-Templo',
  'Iglesia Central',
  'Pastora Principal',
  'Otros'
];

export const EXPENSE_CATEGORIES = [
  'Servicios',
  'Arriendos',
  'Salarios',
  'Mantenimiento',
  'Refrigerios',
  'Papelería',
  'Remesas',
  'Otros'
];

// Cuentas contables fijas para HELISA según especificación técnica
export const ACCOUNT_MAPPING: Record<string, string> = {
  // Ingresos (Créditos)
  'Diezmo': '42950901',
  'Ofrenda': '42950902',
  'Ofrenda especial': '42950903',
  'Pro-Templo': '42950904',
  'Iglesia Central': '28150504',
  'Pastora Principal': '28150501',
  'Otros': '', // Sin cuenta contable según solicitud
  
  // Fuentes / Bancos (Débitos)
  'Caja Efectivo': '110505',
  'Bancolombia': '11200502',
  'Caja Social': '11200501',
  
  // Egresos (Débitos)
  'Servicios': '5135',
  'Arriendos': '5120',
  'Salarios': '5105',
  'Remesas': '5195'
};

export const COLORS = {
  indigo: '#4f46e5',
  emerald: '#10b981',
  rose: '#ef4444',
  amber: '#f59e0b',
  slate: '#64748b'
};

export const MOCK_MEMBERS: Member[] = [
  { id: '123456', name: 'Juan Pérez', joinDate: '2023-01-10', status: 'Activo' },
  { id: '789012', name: 'María Rodríguez', joinDate: '2023-05-15', status: 'Activo' },
  { id: '345678', name: 'Carlos López', joinDate: '2024-02-20', status: 'Activo' },
  { id: '901234', name: 'Ana Martínez', joinDate: '2022-11-05', status: 'Inactivo' },
];
