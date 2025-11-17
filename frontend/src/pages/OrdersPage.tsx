import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchOrders } from "../store/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Pagination } from "../components/Pagination";
import { Filters } from "../components/Filters";
import ExpandableTableRow from "../components/ExpandableTableRow";
import OrderDetails from "../components/OrderDetails";
import EditOrderModal from "../components/EditOrderModal";
import type { Order } from "../api/services/orders.service";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, pagination, isLoading, error } = useAppSelector(
    (state) => state.orders
  );
  const { user } = useAppSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(location.search)
  );

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Convert searchParams to filters object
    const { page = "1", sortBy, ...filter } = Object.fromEntries(searchParams);

    const params = {
      page,
      limit: 25,
      sortBy,
      filter,
    };

    dispatch(fetchOrders(params));
  }, [searchParams, dispatch]);

  const getSortInfo = () => {
    const sortBy = searchParams.get("sortBy") || "";
    const [currentColumn, currentDirection] = sortBy.split(":");
    return { currentColumn, currentDirection };
  };

  const handleSort = (column: string) => {
    const { currentColumn, currentDirection } = getSortInfo();

    let direction = "ASC";
    if (column === currentColumn) {
      direction = !currentDirection
        ? "ASC"
        : currentDirection === "ASC"
        ? "DESC"
        : "";
    }

    const params = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...params,
      sortBy: direction ? `${column}:${direction}` : "",
      page: "1",
    });
  };

  const getSortIndicator = (column: string) => {
    const { currentColumn, currentDirection } = getSortInfo();

    if (!currentDirection || currentColumn !== column) {
      return null;
    }

    return (
      <span className="ml-1 text-primary">
        {currentDirection === "ASC" ? "▲" : "▼"}
      </span>
    );
  };

  // Filter handlers
  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setSearchParams({ ...newFilters, page: "1" });
  };

  const handleResetFilters = () => {
    setSearchParams({ page: "1" });
  };

  // Row expansion handlers
  const toggleRowExpansion = (orderId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Edit modal handlers
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
  };

  const handleCloseEditModal = () => {
    setEditingOrder(null);
  };

  const handleOrderUpdated = () => {
    // Convert searchParams to filters object
    const {
      page = "1",
      sortBy,
      ...filter
    } = Object.fromEntries(searchParams.entries());

    dispatch(
      fetchOrders({
        page,
        limit: 25,
        sortBy,
        filter,
      })
    );
  };

  // Check if user can comment/edit
  const canUserInteractWithOrder = (order: Order) => {
    if (!user) return false;

    // Check if order.manager is an object or string
    if (typeof order.manager === "object" && order.manager !== null) {
      return Number(order.manager.id) === Number(user.id);
    }

    return !order.managerId || Number(order.managerId) === Number(user.id);
  };

  return (
    <div>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <Filters
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        currentFilters={Object.fromEntries(searchParams.entries())}
        sortBy={searchParams.get("sortBy") || undefined}
      />

      <div className="relative">
        <div className="overflow-x-auto bg-base-200 rounded-lg shadow">
          <table className="table table-hover w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("id")}
                >
                  ID{getSortIndicator("id")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("name")}
                >
                  Name{getSortIndicator("name")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("surname")}
                >
                  Surname{getSortIndicator("surname")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("email")}
                >
                  Email{getSortIndicator("email")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("phone")}
                >
                  Phone{getSortIndicator("phone")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("age")}
                >
                  Age{getSortIndicator("age")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("course")}
                >
                  Course{getSortIndicator("course")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("course_format")}
                >
                  Format{getSortIndicator("course_format")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("course_type")}
                >
                  Type{getSortIndicator("course_type")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("status")}
                >
                  Status{getSortIndicator("status")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("sum")}
                >
                  Sum{getSortIndicator("sum")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("alreadyPaid")}
                >
                  Paid{getSortIndicator("alreadyPaid")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("group.name")}
                >
                  Group{getSortIndicator("group.name")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("created_at")}
                >
                  Created At{getSortIndicator("created_at")}
                </th>
                <th
                  className="cursor-pointer hover:text-primary"
                  onClick={() => handleSort("manager.firstName")}
                >
                  Manager{getSortIndicator("manager.firstName")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <ExpandableTableRow
                  key={order.id}
                  order={order}
                  isExpanded={expandedRows.has(Number(order.id))}
                  onToggle={() => toggleRowExpansion(Number(order.id))}
                >
                  <OrderDetails
                    order={order}
                    canInteract={canUserInteractWithOrder(order)}
                    onCommentSubmitted={handleOrderUpdated}
                    onEditOrder={handleEditOrder}
                  />
                </ExpandableTableRow>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !isLoading && (
            <div className="p-6 text-center">
              <span className="text-base-content/70">No orders found</span>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-base-200/75 flex items-center justify-center rounded-lg">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <Pagination
          currentPage={Number(searchParams.get("page")) || 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={(page) => {
            const params = Object.fromEntries(searchParams.entries());
            setSearchParams({ ...params, page: String(page) });
          }}
        />
      </div>

      <EditOrderModal
        order={editingOrder}
        isOpen={!!editingOrder}
        onClose={handleCloseEditModal}
        canEdit={editingOrder ? canUserInteractWithOrder(editingOrder) : false}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
