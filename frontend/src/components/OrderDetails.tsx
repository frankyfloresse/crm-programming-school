import CommentSection from './CommentSection';
import type { Order } from '../api/services/orders.service';

interface OrderDetailsProps {
  order: Order;
  canInteract: boolean;
  onCommentSubmitted: () => void;
  onEditOrder: (order: Order) => void;
}

// Header component for order details
function OrderDetailsHeader({ order, canInteract, onEdit }: {
  order: Order;
  canInteract: boolean;
  onEdit: (order: Order) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-base-content">Order Details</h2>
      <button
        onClick={() => onEdit(order)}
        disabled={!canInteract}
        className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title={canInteract ? 'Edit order' : 'You don\'t have permission to edit this order'}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Order
      </button>
    </div>
  );
}

// Information display component
function OrderInformation({ order }: { order: Order }) {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body">
        <div className="space-y-6">
          {/* Message Field */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Message</label>
            <div className="p-3 bg-base-200 rounded-lg border border-base-300 min-h-[80px] text-sm w-full">
              {order.msg || <span className="text-base-content/50">No message provided</span>}
            </div>
          </div>

          {/* UTM Field */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">UTM Parameters</label>
            <div className="p-3 bg-base-200 rounded-lg border border-base-300 min-h-[80px] font-mono text-sm w-full">
              {order.utm || <span className="text-base-content/50">No UTM data</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Comments section component
function OrderCommentsSection({
  order,
  canInteract,
  onCommentSubmitted
}: {
  order: Order;
  canInteract: boolean;
  onCommentSubmitted: () => void;
}) {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body p-4">
        <CommentSection
          orderId={Number(order.id)}
          canComment={canInteract}
          onCommentSubmitted={onCommentSubmitted}
          msg={order.msg}
          utm={order.utm}
        />
      </div>
    </div>
  );
}

export default function OrderDetails({
  order,
  canInteract,
  onCommentSubmitted,
  onEditOrder
}: OrderDetailsProps) {
  return (
    <div className="container mx-auto p-6 bg-base-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <OrderDetailsHeader
          order={order}
          canInteract={canInteract}
          onEdit={onEditOrder}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderInformation order={order} />
          <OrderCommentsSection
            order={order}
            canInteract={canInteract}
            onCommentSubmitted={onCommentSubmitted}
          />
        </div>
      </div>
    </div>
  );
}