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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-white text-sm opacity-90">{plan.management_industry}</p>
            <h3 className="text-white font-semibold text-lg line-clamp-2">{plan.fact?.substring(0, 50)}</h3>
          </div>
          <div className={`ml-2 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${config.color}`}>
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex-1 space-y-3">
        <div className="text-sm">
          <p className="text-gray-600 font-medium mb-1">Setor</p>
          <p className="text-gray-900">{plan.sector}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 font-medium mb-1">Turno</p>
          <p className="text-gray-900">{plan.shift}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 font-medium mb-1">Responsável</p>
          <div className="flex items-center gap-2 text-gray-900">
            <User className="w-4 h-4" />
            {plan.responsible}
          </div>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 font-medium mb-1">Indicadores</p>
          <p className="text-gray-900">{plan.indicators}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600 font-medium mb-1">Prazo Previsto</p>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-4 h-4" />
              {plan.planned_deadline ? new Date(plan.planned_deadline).toLocaleDateString('pt-BR') : '-'}
            </div>
          </div>
          {plan.actual_deadline && (
            <div>
              <p className="text-gray-600 font-medium mb-1">Prazo Realizado</p>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4" />
                {new Date(plan.actual_deadline).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
        </div>
        <div className="text-sm">
          <p className="text-gray-600 font-medium mb-1">Causa Raiz</p>
          <p className="text-gray-900 line-clamp-2">{plan.root_cause}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 font-medium mb-1">Ação</p>
          <p className="text-gray-900 line-clamp-2">{plan.action}</p>
        </div>
      </div>

      <div className="border-t px-6 py-3 flex gap-2 bg-gray-50">
        {isAdmin ? (
          <button
            onClick={() => onEdit(plan)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Editar Tudo
          </button>
        ) : (
          <button
            onClick={() => onEditRestricted(plan)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar Status
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => onDelete(plan.id)}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 disabled:bg-gray-200 text-red-700 disabled:text-gray-500 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </button>
        )}
      </div>
    </div>
  );
}
