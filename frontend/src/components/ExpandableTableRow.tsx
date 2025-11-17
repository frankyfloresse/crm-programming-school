import React from 'react';
import type { Order } from '../api/services/orders.service';

interface ExpandableTableRowProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export default function ExpandableTableRow({
  order,
  isExpanded,
  onToggle,
  children
}: ExpandableTableRowProps) {
  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent toggling if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input, select, textarea, a')) {
      return;
    }
    onToggle();
  };

  return (
    <>
      <tr
        className={`cursor-pointer transition-colors ${
          isExpanded ? 'bg-base-300' : 'hover:bg-base-200'
        }`}
        onClick={handleRowClick}
      >
        <td>
          <span className="font-medium text-sm flex items-center gap-2">
            {order.id}
            {isExpanded ? (
              <span className="text-primary text-xs">▼</span>
            ) : (
              <span className="text-base-content/50 text-xs">▶</span>
            )}
          </span>
        </td>
        <td>
          <span className="text-sm">{order.name}</span>
        </td>
        <td>
          <span className="text-sm">{order.surname}</span>
        </td>
        <td>
          <span className="text-sm">{order.email}</span>
        </td>
        <td>
          <span className="text-sm">{order.phone}</span>
        </td>
        <td>
          <span className="text-sm">{order.age}</span>
        </td>
        <td>
          <span className="text-sm">{order.course}</span>
        </td>
        <td>
          <span className="text-sm">{order.course_format}</span>
        </td>
        <td>
          <span className="text-sm">{order.course_type}</span>
        </td>
        <td>
          {order.status ? (
            <div className="badge badge-success badge-sm whitespace-nowrap">
              {order.status}
            </div>
          ) : (
            <span className="text-sm text-base-content/50">-</span>
          )}
        </td>
        <td>
          <span className="text-sm">{order.sum || '-'}</span>
        </td>
        <td>
          <span className="text-sm">{order.alreadyPaid || '-'}</span>
        </td>
        <td>
          <span className="text-sm">
            {order.group?.name || '-'}
          </span>
        </td>
        <td>
          <span className="text-sm">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </td>
        <td>
          <span className="text-sm">
            {/* Display manager info if available */}
            {order.manager ? (
              <span className="badge badge-info badge-sm whitespace-nowrap">
                {order.manager.firstName} {order.manager.lastName}
              </span>
            ) : (
              <span className="text-base-content/50">-</span>
            )}
          </span>
        </td>
      </tr>

      {/* Expandable content */}
      {isExpanded && (
        <tr>
          <td colSpan={16} className="p-0">
            <div className="collapse-open">
              {children}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}