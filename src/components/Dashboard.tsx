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
  const [restrictedMode, setRestrictedMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluído' },
  ];

  useEffect(() => { loadPlans(); }, [user, selectedStatus]);

  async function loadPlans() {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase.from('fca_plans').select('*');
      if (!user.is_admin) query = query.eq('user_id', user.id);
      if (selectedStatus) query = query.eq('status', selectedStatus);
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
    } catch { alert('Erro ao deletar plano'); }
    finally { setDeletingId(null); }
  }

  function handleEdit(plan: FCAPlan) { setEditingPlan(plan); setRestrictedMode(false); setShowForm(true); }
  function handleEditRestricted(plan: FCAPlan) { setEditingPlan(plan); setRestrictedMode(true); setShowForm(true); }
  function handleNewPlan() { setEditingPlan(undefined); setRestrictedMode(false); setShowForm(true); }

  function exportToCSV() {
    if (plans.length === 0) { alert('Nenhum plano para exportar'); return; }
    const headers = ['Turno','Data AGD','Indústria de Gestão','Indicadores','Setor','Fato','Causa Raiz','Ação','Responsável','Área','Prazo Previsto','Prazo Realizado','Status','Data de Criação'];
    const rows = plans.map(p => [p.shift,p.agd_date,p.management_industry,p.indicators,p.sector,p.fact,p.root_cause,p.action,p.responsible,p.area,p.planned_deadline,p.actual_deadline||'',p.status==='pending'?'Pendente':p.status==='in_progress'?'Em Progresso':'Concluído',new Date(p.created_at).toLocaleDateString('pt-BR')]);
    const csv = [headers.join(','),...rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fca-planos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  const filteredPlans = selectedStatus ? plans.filter(p => p.status === selectedStatus) : plans;
  const stats = {
    total: plans.length,
    pending: plans.filter(p => p.status === 'pending').length,
    inProgress: plans.filter(p => p.status === 'in_progress').length,
    completed: plans.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plano de Ação FCA</h1>
            <p className="text-gray-600 text-sm">Bem-vindo, {user?.name} {user?.is_admin ? '(Admin)' : ''}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-full mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-xs font-medium">Pendentes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <p className="text-gray-600 text-xs font-medium">Em Progresso</p>
            <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-xs font-medium">Concluídos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm">
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleNewPlan} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" /> Novo Plano
            </button>
            {user?.is_admin && (
              <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm">
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-600">Carregando planos...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">Nenhum plano encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full text-xs border-collapse bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-3 py-3 text-left font-semibold">Turno</th>
                  <th className="px-3 py-3 text-left font-semibold">Data AGD</th>
                  <th className="px-3 py-3 text-left font-semibold">Indústria</th>
                  <th className="px-3 py-3 text-left font-semibold">Indicadores</th>
                  <th className="px-3 py-3 text-left font-semibold">Setor</th>
                  <th className="px-3 py-3 text-left font-semibold">Fato</th>
                  <th className="px-3 py-3 text-left font-semibold">Causa Raiz</th>
                  <th className="px-3 py-3 text-left font-semibold">Ação</th>
                  <th className="px-3 py-3 text-left font-semibold">Responsável</th>
                  <th className="px-3 py-3 text-left font-semibold">Área</th>
                  <th className="px-3 py-3 text-left font-semibold">Prazo Previsto</th>
                  <th className="px-3 py-3 text-left font-semibold">Prazo Realizado</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, i) => (
                  <FCAPlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={handleEdit}
                    onEditRestricted={handleEditRestricted}
                    onDelete={handleDelete}
                    isDeleting={deletingId === plan.id}
                    isAdmin={user?.is_admin || false}
                    index={i}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <FCAPlanForm
          plan={editingPlan}
          onClose={() => { setShowForm(false); setEditingPlan(undefined); }}
          onSuccess={loadPlans}
          restrictedMode={restrictedMode}
        />
      )}
    </div>
  );
}
