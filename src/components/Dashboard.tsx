import React, { useState, useEffect } from 'react';
import { Plus, Download, LogOut, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FCAPlan } from '../types';
import { FCAPlanForm } from './FCAPlanForm';
import { FCAPlanCard } from './FCAPlanCard';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [plans, setPlans] = useState<FCAPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FCAPlan | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluído' },
  ];

  useEffect(() => {
    loadPlans();
  }, [user, selectedStatus]);

  async function loadPlans() {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase.from('fca_plans').select('*');

      if (!user.is_admin) {
        query = query.eq('user_id', user.id);
      }

      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja deletar este plano?')) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from('fca_plans').delete().eq('id', id);
      if (error) throw error;
      loadPlans();
    } catch (error) {
      alert('Erro ao deletar plano');
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(plan: FCAPlan) {
    setEditingPlan(plan);
    setShowForm(true);
  }

  function handleNewPlan() {
    setEditingPlan(undefined);
    setShowForm(true);
  }

  function exportToCSV() {
    if (plans.length === 0) {
      alert('Nenhum plano para exportar');
      return;
    }

    const headers = [
      'Turno',
      'Data AGD',
      'Indústria de Gestão',
      'Indicadores',
      'Setor',
      'Fato',
      'Causa Raiz',
      'Ação',
      'Responsável',
      'Área',
      'Prazo Previsto',
      'Prazo Realizado',
      'Status',
      'Data de Criação',
    ];

    const rows = plans.map(plan => [
      plan.shift,
      plan.agd_date,
      plan.management_industry,
      plan.indicators,
      plan.sector,
      plan.fact,
      plan.root_cause,
      plan.action,
      plan.responsible,
      plan.area,
      plan.planned_deadline,
      plan.actual_deadline || '',
      plan.status === 'pending'
        ? 'Pendente'
        : plan.status === 'in_progress'
        ? 'Em Progresso'
        : 'Concluído',
      new Date(plan.created_at).toLocaleDateString('pt-BR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fca-planos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  async function handleLogout() {
    await logout();
  }

  const filteredPlans = selectedStatus
    ? plans.filter(plan => plan.status === selectedStatus)
    : plans;

  const stats = {
    total: plans.length,
    pending: plans.filter(p => p.status === 'pending').length,
    inProgress: plans.filter(p => p.status === 'in_progress').length,
    completed: plans.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plano de Ação FCA</h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo, {user?.name} {user?.is_admin ? '(Admin)' : ''}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total de Planos</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Pendentes</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium">Em Progresso</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Concluídos</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleNewPlan}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Plano
            </button>
            <button
              onClick={exportToCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-600">Carregando planos...</div>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">Nenhum plano encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <FCAPlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === plan.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <FCAPlanForm
          plan={editingPlan}
          onClose={() => {
            setShowForm(false);
            setEditingPlan(undefined);
          }}
          onSuccess={loadPlans}
        />
      )}
    </div>
  );
}
