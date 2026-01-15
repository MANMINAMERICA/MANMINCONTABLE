
import React, { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import IncomeForm from './components/IncomeForm';
import BatchIncomeForm from './components/BatchIncomeForm';
import ExpenseForm from './components/ExpenseForm';
import Conciliation from './components/Conciliation';
import Remittances from './components/Remittances';
import Reports from './components/Reports';
import MemberManager from './components/MemberManager';
import CashDetail from './components/CashDetail';
import BanksDetail from './components/BanksDetail';
import { 
  UserRole, 
  View, 
  Income, 
  Expense, 
  Balances, 
  TransactionMethod, 
  TransactionStatus,
  BankAccount,
  Member
} from './types';
import { MOCK_MEMBERS } from './constants';

const App: React.FC = () => {
  const [view, setView] = React.useState<View>('dashboard');
  const [role, setRole] = React.useState<UserRole>(UserRole.ADMIN);
  
  // Cargar datos iniciales desde LocalStorage o usar vacíos
  const [incomes, setIncomes] = React.useState<Income[]>(() => {
    const saved = localStorage.getItem('canaan_incomes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [expenses, setExpenses] = React.useState<Expense[]>(() => {
    const saved = localStorage.getItem('canaan_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [members, setMembers] = React.useState<Member[]>(() => {
    const saved = localStorage.getItem('canaan_members');
    return saved ? JSON.parse(saved) : MOCK_MEMBERS;
  });

  const [editingIncome, setEditingIncome] = React.useState<Income | null>(null);

  // Efecto para persistir cambios en tiempo real
  useEffect(() => {
    localStorage.setItem('canaan_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('canaan_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('canaan_members', JSON.stringify(members));
  }, [members]);

  const calculateBalances = (): Balances => {
    let cash = 0;
    let banks = 0;
    let totalRemittanceIn = 0;
    let totalRemittanceOut = 0;

    incomes.forEach(inc => {
      if (inc.status === TransactionStatus.CONFIRMED) {
        if (inc.method === TransactionMethod.CASH) {
          cash += inc.total;
        } else {
          banks += inc.total;
        }
      }

      inc.breakdown.forEach(b => {
        if (b.category === 'Iglesia Central' || b.category === 'Pastora Principal') {
          totalRemittanceIn += b.amount;
        }
      });
    });

    expenses.forEach(exp => {
      if (exp.source === 'Caja Efectivo') {
        cash -= exp.amount;
      } else {
        banks -= exp.amount;
      }
      if (exp.category === 'Remesas') {
        totalRemittanceOut += exp.amount;
      }
    });

    return { 
      cash, 
      banks, 
      remittances: totalRemittanceIn - totalRemittanceOut 
    };
  };

  const balances = calculateBalances();

  const handleAddMember = (member: Member) => setMembers([...members, member]);
  const handleUpdateMember = (id: string, updates: Partial<Member>) => 
    setMembers(members.map(m => m.id === id ? { ...m, ...updates } : m));
  const handleDeleteMember = (id: string) => {
    if (confirm('¿Eliminar miembro? Esto no borrará sus transacciones históricas pero no podrá ser seleccionado en nuevos registros.')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleSaveIncome = (income: Income) => {
    if (editingIncome) {
      setIncomes(incomes.map(inc => inc.id === editingIncome.id ? income : inc));
      setEditingIncome(null);
    } else {
      setIncomes([...incomes, income]);
    }
    setView('dashboard');
  };

  const handleDeleteIncome = (id: string) => {
    if (confirm('¿Eliminar este registro permanentemente?')) {
      setIncomes(incomes.filter(inc => inc.id !== id));
    }
  };

  const handleEditIncome = (income: Income) => {
    if (income.isBatch) {
      setView('batch-income');
      setEditingIncome(income);
    } else {
      setEditingIncome(income);
      setView('income');
    }
  };

  const handleConciliate = (id: string, bankDate: string) => {
    setIncomes(incomes.map(inc => 
      inc.id === id 
        ? { ...inc, status: TransactionStatus.CONFIRMED, reconciliationDate: bankDate } 
        : inc
    ));
  };

  const handleMarkRemittanceSent = (id: string, date: string, source: 'Caja Efectivo' | BankAccount) => {
    const income = incomes.find(inc => inc.id === id);
    if (!income) return;

    setIncomes(prev => prev.map(inc => 
      inc.id === id 
        ? { ...inc, remittanceSent: true, remittanceSentDate: date } 
        : inc
    ));

    const remittanceAmount = income.breakdown
      .filter(b => b.category === 'Iglesia Central' || b.category === 'Pastora Principal')
      .reduce((sum, b) => sum + b.amount, 0);

    if (remittanceAmount > 0) {
      const originName = income.method === TransactionMethod.CASH ? 'Caja' : income.bank;
      const autoExpense: Expense = {
        id: `AUTO-REM-${Math.random().toString(36).substr(2, 5)}`,
        date: date,
        amount: remittanceAmount,
        category: 'Remesas',
        source: source,
        responsible: role,
        thirdParty: 'Iglesia Central',
        description: `Giro de Remesa: ${originName} → ${source}`
      };
      setExpenses(prev => [...prev, autoExpense]);
    }
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
    setView('dashboard');
  };

  const handleSendRemittance = (amount: number) => {
    const remittanceExpense: Expense = {
      id: `SWAP-${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      category: 'Remesas',
      source: 'Caja Efectivo',
      responsible: role,
      thirdParty: 'Iglesia Central',
      description: 'Giro Masivo de Remesas (Swap de Efectivo)'
    };
    handleAddExpense(remittanceExpense);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            balances={balances} 
            incomes={incomes} 
            expenses={expenses} 
            role={role} 
            onNavigate={setView}
            onEditIncome={handleEditIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        );
      case 'cash':
        return <CashDetail incomes={incomes} expenses={expenses} balances={balances} onNavigate={setView} />;
      case 'banks':
        return <BanksDetail incomes={incomes} expenses={expenses} />;
      case 'income':
        return (
          <IncomeForm 
            members={members} 
            onSave={handleSaveIncome} 
            onCancel={() => { setView('dashboard'); setEditingIncome(null); }} 
            onQuickAddMember={handleAddMember}
            initialData={editingIncome || undefined}
          />
        );
      case 'batch-income':
        return (
          <BatchIncomeForm 
            members={members}
            onSave={handleSaveIncome}
            onCancel={() => { setView('dashboard'); setEditingIncome(null); }}
            initialData={editingIncome || undefined}
          />
        );
      case 'expenses':
        return <ExpenseForm onSave={handleAddExpense} onCancel={() => setView('dashboard')} role={role} />;
      case 'conciliation':
        return <Conciliation pendingIncomes={incomes.filter(i => i.status === TransactionStatus.PENDING)} onConciliate={handleConciliate} />;
      case 'remittances':
        return (
          <Remittances 
            balances={balances} 
            incomes={incomes}
            onSendRemittance={handleSendRemittance} 
            onMarkSent={handleMarkRemittanceSent}
            role={role} 
          />
        );
      case 'reports':
        return <Reports incomes={incomes} expenses={expenses} />;
      case 'members':
        return <MemberManager members={members} onAddMember={handleAddMember} onUpdateMember={handleUpdateMember} onDeleteMember={handleDeleteMember} />;
      default:
        return <Dashboard balances={balances} incomes={incomes} expenses={expenses} role={role} onNavigate={setView} onEditIncome={handleEditIncome} onDeleteIncome={handleDeleteIncome} />;
    }
  };

  return (
    <Layout activeView={view} setView={(v) => { setView(v); setEditingIncome(null); }} role={role} setRole={setRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
