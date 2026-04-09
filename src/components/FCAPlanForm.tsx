import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FCAPlan } from '../types';
import { useAuth } from '../context/AuthContext';

interface FCAPlanFormProps {
  plan?: FCAPlan;
  onClose: () => void;
  onSuccess: () => void;
}

export function FCAPlanForm({ plan, onClose, onSuccess }: FCAPlanFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shift: plan?.shift || '',
    agd_date: plan?.agd_date || '',
    management_industry: plan?.management_industry || '',
    indicators: plan?.indicators || '',
    sector: plan?.sector || '',
    fact: plan?.fact || '',
    root_cause: plan?.root_cause || '',
    action: plan?.action || '',
    responsible: plan?.responsible || '',
    area: plan?.area || '',
    planned_deadline: plan?.planned_deadline || '',
    actual_deadline: plan?.actual_deadline || '',
    status: plan?.status || 'pending',
  });

  const shifts = ['Turno 1', 'Turno 2', 'Turno 3', 'Madrugada'];
  const statuses = ['pending', 'in_progress', 'completed'];
  const sectors = [
    'Produção',
    'Logística',
    'Vendas',
    'Administrativo',
    'Qualidade',
    'Manutenção',
    'TI',
    'RH',
    'Financeiro',
  ];

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      if (plan?.id) {
        const { error: updateError } = await supabase
          .from('fca_plans')
          .update(formData)
          .eq('id', plan.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('fca_plans')
          .insert([{ ...formData, user_id: user.id }]);
        if (insertError) throw insertError;
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar plano');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl m-4 my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {plan ? 'Editar Plano FCA' : 'Novo Plano FCA'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
              <select
                value={formData.shift}
                onChange={(e) => handleChange('shift', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Selecione</option>
                {shifts.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data AGD</label>
              <input
                type="date"
                value={formData.agd_date}
                onChange={(e) => handleChange('agd_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Indústria de Gestão
              </label>
              <input
                type="text"
                value={formData.management_industry}
                onChange={(e) => handleChange('management_industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Indicadores</label>
              <input
                type="text"
                value={formData.indicators}
                onChange={(e) => handleChange('indicators', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
              <select
                value={formData.sector}
                onChange={(e) => handleChange('sector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Selecione</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável pela Ação
              </label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => handleChange('responsible', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'pending'
                      ? 'Pendente'
                      : status === 'in_progress'
                      ? 'Em Progresso'
                      : 'Concluído'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo Previsto
              </label>
              <input
                type="date"
                value={formData.planned_deadline}
                onChange={(e) => handleChange('planned_deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo Realizado
              </label>
              <input
                type="date"
                value={formData.actual_deadline}
                onChange={(e) => handleChange('actual_deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fato</label>
            <textarea
              value={formData.fact}
              onChange={(e) => handleChange('fact', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Causa Raiz</label>
            <textarea
              value={formData.root_cause}
              onChange={(e) => handleChange('root_cause', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
            <textarea
              value={formData.action}
              onChange={(e) => handleChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
