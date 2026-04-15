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
  index: number;
}

export function FCAPlanCard({ plan, onEdit, onEditRestricted, onDelete, isDeleting, isAdmin, index }: FCAPlanCardProps) {
  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    in_progress: { label: 'Em Progresso', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
  };

  const config = statusConfig[plan.status as keyof typeof statusConfig] || statusConfig.pending;
  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

  return (
    <tr className={`${rowBg} border-b border-gray-200 hover:bg-blue-50 transition-colors`}>
      <td className="px-3 py-2 whitespace-nowrap">{plan.shift}</td>
      <td className="px-3 py-2 whitespace-nowrap">{fmt(plan.agd_date)}</td>
      <td className="px-3 py-2 whitespace-nowrap">{plan.management_industry}</td>
      <td className="px-3 py-2 whitespace-nowrap">{plan.indicators}</td>
      <td className="px-3 py-2 whitespace-nowrap">{plan.sector}</td>
      <td className="px-3 py-2 max-w-[150px]">
        <p className="line-clamp-2 text-xs">{plan.fact}</p>
      </td>
      <td className="px-3 py-2 max-w-[150px]">
        <p className="line-clamp-2 text-xs">{plan.root_cause}</p>
      </td>
      <td className="px-3 py-2 max-w-[150px]">
        <p className="line-clamp-2 text-xs">{plan.action}</p>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">{plan.responsible}</td>
      <td className="px-3 py-2 whitespace-nowrap">{plan.area}</td>
      <td className="px-3 py-2 whitespace-nowrap">{fmt(plan.planned_deadline)}</td>
      <td className="px-3 py-2 whitespace-nowrap">{plan.actual_deadline ? fmt(plan.actual_deadline) : '-'}</td>
      <td className="px-3 py-2 whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex gap-1">
          {isAdmin ? (
            <button onClick={() => onEdit(plan)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded-lg transition-colors text-xs">
              <Edit2 className="w-3 h-3" />
              Editar
            </button>
          ) : (
            <button onClick={() => onEditRestricted(plan)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded-lg transition-colors text-xs">
              <RefreshCw className="w-3 h-3" />
              Atualizar
            </button>
          )}
          {isAdmin && (
            <button onClick={() => onDelete(plan.id)} disabled={isDeleting}
              className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 px-2 rounded-lg transition-colors text-xs">
              <Trash2 className="w-3 h-3" />
              {isDeleting ? '...' : 'Deletar'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
