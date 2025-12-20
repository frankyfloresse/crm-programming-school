import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ordersService } from "../api/services/orders.service";
import { groupsService } from "../api/services/groups.service";
import type { Order } from "../api/services/orders.service";
import type { Group } from "../api/services/groups.service";

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit: boolean;
  onOrderUpdated?: () => void;
}

// Enum values from backend
const ORDER_STATUSES = ["In work", "New", "Aggre", "Disaggre", "Dubbing"];
const COURSES = ["FS", "QACX", "JCX", "JSCX", "FE", "PCX"];
const COURSE_TYPES = ["pro", "minimal", "premium", "incubator", "vip"];
const COURSE_FORMATS = ["static", "online"];

// Validation schema
const orderSchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  age: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 120;
      },
      { message: "Age must be between 1 and 120" }
    ),
  sum: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Sum cannot be negative" }
    ),
  alreadyPaid: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Already paid amount cannot be negative" }
    ),
  course: z.string().optional(),
  course_format: z.string().optional(),
  course_type: z.string().optional(),
  status: z.string().optional(),
  groupId: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function EditOrderModal({
  order,
  isOpen,
  onClose,
  canEdit,
  onOrderUpdated,
}: EditOrderModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      age: "",
      sum: "",
      alreadyPaid: "",
      course: "",
      course_format: "",
      course_type: "",
      status: "",
      groupId: "",
    },
  });

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    if (order) {
      reset({
        name: order.name || "",
        surname: order.surname || "",
        email: order.email || "",
        phone: order.phone || "",
        age: order.age?.toString() || "",
        sum: order.sum?.toString() || "",
        alreadyPaid: order.alreadyPaid?.toString() || "",
        course: order.course || "",
        course_format: order.course_format || "",
        course_type: order.course_type || "",
        status: order.status || "",
        groupId: order.groupId?.toString() || "",
      });
    }
  }, [order, reset]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const fetchedGroups = await groupsService.getAllGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    setIsCreatingGroup(true);
    try {
      await groupsService.createGroup({ name: newGroupName.trim() });
      await fetchGroups();
      setNewGroupName("");
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setValue("groupId", groupId);
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!order || !canEdit) return;

    setIsLoading(true);
    try {
      const updateData = {
        name: data.name || null,
        surname: data.surname || null,
        email: data.email || null,
        phone: data.phone || null,
        age: data.age && data.age.trim() !== "" ? parseInt(data.age) : null,
        sum: data.sum && data.sum.trim() !== "" ? parseInt(data.sum) : null,
        alreadyPaid:
          data.alreadyPaid && data.alreadyPaid.trim() !== ""
            ? parseInt(data.alreadyPaid)
            : null,
        course: data.course || null,
        course_format: data.course_format || null,
        course_type: data.course_type || null,
        status: data.status || null,
        groupId: data.groupId || null,
      };

      await ordersService.updateOrder(parseInt(order.id), updateData);
      onOrderUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!canEdit) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4">
            <div className="alert alert-warning">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold">Access Restricted</h3>
          </div>
          <p className="text-base-content/70 mb-6">
            You can only edit orders without a manager or orders assigned to
            you.
          </p>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-base-content">
          Edit Order
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Group */}
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Group
                </span>
              </label>
              <div className="flex gap-2">
                <select
                  {...register("groupId")}
                  onChange={(e) => handleSelectGroup(e.target.value)}
                  className="select select-bordered bg-base-200 text-base-content flex-1"
                >
                  <option value="">Select group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="New group name"
                  className="input input-bordered bg-base-200 text-base-content w-48"
                />
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || isCreatingGroup}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {isCreatingGroup ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Name
                </span>
              </label>
              <input
                type="text"
                {...register("name")}
                className="input input-bordered bg-base-200 text-base-content w-full"
                placeholder="Enter name"
              />
            </div>

            {/* Sum */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Sum
                </span>
              </label>
              <input
                type="number"
                {...register("sum")}
                className={`input input-bordered bg-base-200 text-base-content w-full ${
                  errors.sum ? "input-error" : ""
                }`}
                placeholder="Enter sum"
              />
              {errors.sum && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.sum.message}
                  </span>
                </label>
              )}
            </div>

            {/* Surname */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Surname
                </span>
              </label>
              <input
                type="text"
                {...register("surname")}
                className="input input-bordered bg-base-200 text-base-content w-full"
                placeholder="Enter surname"
              />
            </div>

            {/* Already Paid */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Already Paid
                </span>
              </label>
              <input
                type="number"
                {...register("alreadyPaid")}
                className={`input input-bordered bg-base-200 text-base-content w-full ${
                  errors.alreadyPaid ? "input-error" : ""
                }`}
                placeholder="Enter amount paid"
              />
              {errors.alreadyPaid && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.alreadyPaid.message}
                  </span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Email
                </span>
              </label>
              <input
                type="email"
                {...register("email")}
                className={`input input-bordered bg-base-200 text-base-content w-full ${
                  errors.email ? "input-error" : ""
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            {/* Course */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Course
                </span>
              </label>
              <select
                {...register("course")}
                className="select select-bordered bg-base-200 text-base-content w-full"
              >
                <option value="">Select course</option>
                {COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Phone
                </span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="input input-bordered bg-base-200 text-base-content w-full"
                placeholder="Enter phone number"
              />
            </div>

            {/* Course Format */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Course Format
                </span>
              </label>
              <select
                {...register("course_format")}
                className="select select-bordered bg-base-200 text-base-content w-full"
              >
                <option value="">Select format</option>
                {COURSE_FORMATS.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Age
                </span>
              </label>
              <input
                type="number"
                {...register("age")}
                className={`input input-bordered bg-base-200 text-base-content w-full ${
                  errors.age ? "input-error" : ""
                }`}
                placeholder="Enter age"
              />
              {errors.age && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.age.message}
                  </span>
                </label>
              )}
            </div>

            {/* Course Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Course Type
                </span>
              </label>
              <select
                {...register("course_type")}
                className="select select-bordered bg-base-200 text-base-content w-full"
              >
                <option value="">Select type</option>
                {COURSE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Status
                </span>
              </label>
              <select
                {...register("status")}
                className="select select-bordered bg-base-200 text-base-content w-full"
              >
                <option value="">Select status</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-wide"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
