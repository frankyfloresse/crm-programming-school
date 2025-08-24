import { useEffect } from 'react';
import { fetchOrders } from '../store/orders/ordersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-base-content/70">
            A list of all orders in your account.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-base-content/70">
          A list of all orders in your account.
        </p>
      </div>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto bg-base-200 rounded-lg shadow">
        <table className="table table-hover w-full min-w-[1400px]">
          <thead>
            <tr>
              <th className="w-16">ID</th>
              <th className="w-32">Name</th>
              <th className="w-32">Surname</th>
              <th className="w-48">Email</th>
              <th className="w-36">Phone</th>
              <th className="w-16">Age</th>
              <th className="w-20">Course</th>
              <th className="w-24">Format</th>
              <th className="w-24">Type</th>
              <th className="w-24">Status</th>
              <th className="w-20">Sum</th>
              <th className="w-20">Paid</th>
              <th className="w-32">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="font-medium text-sm">
                    {order.id}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.name}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.surname}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.email}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.phone}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.age}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.course}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.course_format}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.course_type}
                  </span>
                </td>
                <td>
                  {order.status ? (
                    <span className="badge badge-success badge-sm">
                      {order.status}
                    </span>
                  ) : (
                    <span className="text-sm text-base-content/70">
                      -
                    </span>
                  )}
                </td>
                <td>
                  <span className="text-sm">
                    {order.sum || '-'}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {order.alreadyPaid || '-'}
                  </span>
                </td>
                <td>
                  <span className="text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !isLoading && (
          <div className="p-6 text-center">
            <span className="text-base-content/70">
              No orders found
            </span>
          </div>
        )}
      </div>
    </div>
  );
}