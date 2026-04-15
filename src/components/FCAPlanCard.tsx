import React from 'react';
import { CreditCard as Edit2, Trash2, Calendar, User, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
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
    pending: { label: 'Pendente', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
    in_progress: { label: 'Em Progresso', icon: Clock, color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Concluído', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  };

  const config = statusConfig[plan.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full">
      {/* Layout horizontal */}
      <div className="flex items-stretch">
        {/* Barra colorida lateral */}
        <div className="w-2 bg-blue-600 flex-shrink-0" />

        {/* Conteúdo principal */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Info principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold text-gray-500">{plan.management_industry}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{plan.sector}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{plan.shift}</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{plan.fact}</p>
              <p className="text-xs text-gray-600 mb-1"><span className="font-medium">Causa:</span> {plan.root_cause}</p>
              <p className="text-xs text-gray-600"><span className="font-medium">Ação:</span> {plan.action}</p>
            </div>

            {/* Status + datas + responsável */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {plan.responsible}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {plan.planned_deadline ? new Date(plan.planned_deadline).toLocaleDateString('pt-BR') : '-'}
              </div>
              {plan.actual_deadline && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  ✅ {new Date(plan.actual_deadline).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 mt-3 pt-3 border-t">
            {isAdmin ? (
              <button onClick={() => onEdit(plan)}
                className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1.5 px-3 rounded-lg transition-colors text-xs">
                <Edit2 className="w-3 h-3" />
                Editar Tudo
              </button>
            ) : (
              <button onClick={() => onEditRestricted(plan)}
                className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1.5 px-3 rounded-lg transition-colors text-xs">
                <RefreshCw className="w-3 h-3" />
                Atualizar Status
              </button>
            )}
            {isAdmin && (
              <button onClick={() => onDelete(plan.id)} disabled={isDeleting}
                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 disabled:bg-gray-200 text-red-700 disabled:text-gray-500 font-medium py-1.5 px-3 rounded-lg transition-colors text-xs">
                <Trash2 className="w-3 h-3" />
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
