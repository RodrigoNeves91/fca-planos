import React from 'react';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { FCAPlan } from '../types';

interface FCAPlanCardProps {
  plan: FCAPlan;
  onEdit: (plan: FCAPlan) => void;
  onEditRestricted: (plan: FCAPlan) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isAdmin: boolean;
}

export function FCAPlanCard({ plan, onEdit, onEditRestricted, onDelete, isDeleting, isAdmin }: FCAPlanCardProps) {
  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    in_progress: { label: 'Em Progresso', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    completed: { label: 'Concluído', color: 'bg-green-100 text-green-800 border-green-300' },
  };

  const config = statusConfig[plan.status as keyof typeof statusConfig] || statusConfig.pending;
  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Header colorido */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white text-xs">
          <span className="font-semibold">{plan.management_industry}</span>
          <span className="opacity-60">•</span>
          <span>{plan.shift}</span>
          <span className="opacity-60">•</span>
          <span>{plan.agd_date ? fmt(plan.agd_date) : '-'}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Corpo em grid */}
      <div className="p-4">
        {/* Linha 1 — Fato, Causa, Ação */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
            <p className="text-xs font-bold text-red-600 mb-1">🔴 FATO</p>
            <p className="text-xs text-gray-800 line-clamp-3">{plan.fact}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <p className="text-xs font-bold text-yellow-600 mb-1">🟡 CAUSA RAIZ</p>
            <p className="text-xs text-gray-800 line-clamp-3">{plan.root_cause}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <p className="text-xs font-bold text-green-600 mb-1">🟢 AÇÃO</p>
            <p className="text-xs text-gray-800 line-clamp-3">{plan.action}</p>
          </div>
        </div>

        {/* Linha 2 — Detalhes */}
        <div className="grid grid-cols-4 gap-2 text-xs mb-3">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-500 font-medium mb-0.5">Setor</p>
            <p className="text-gray-800 font-semibold">{plan.sector}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-500 font-medium mb-0.5">Área</p>
            <p className="text-gray-800 font-semibold">{plan.area}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-500 font-medium mb-0.5">Indicadores</p>
            <p className="text-gray-800 font-semibold">{plan.indicators}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-500 font-medium mb-0.5">Responsável</p>
            <p className="text-gray-800 font-semibold">{plan.responsible}</p>
          </div>
        </div>

        {/* Linha 3 — Prazos + Botões */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2 text-xs">
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
              <p className="text-orange-600 font-medium">📅 Prazo Previsto</p>
              <p className="text-gray-800 font-semibold">{fmt(plan.planned_deadline)}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              <p className="text-green-600 font-medium">✅ Prazo Realizado</p>
              <p className="text-gray-800 font-semibold">{plan.actual_deadline ? fmt(plan.actual_deadline) : 'Pendente'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin ? (
              <button onClick={() => onEdit(plan)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-xs">
                <Edit2 className="w-3 h-3" />
                Editar
              </button>
            ) : (
              <button onClick={() => onEditRestricted(plan)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-xs">
                <RefreshCw className="w-3 h-3" />
                Atualizar Status
              </button>
            )}
            {isAdmin && (
              <button onClick={() => onDelete(plan.id)} disabled={isDeleting}
                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded-lg transition-colors text-xs">
                <Trash2 className="w-3 h-3" />
                {isDeleting ? '...' : 'Deletar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
