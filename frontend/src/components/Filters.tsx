import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../store/hooks";
import { ExcelExportButton } from "./ExcelExportButton";
import { groupsService, type Group } from "../api/services/groups.service";
import { useDebounce } from "@/utils/debounce";

interface FiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
  onResetFilters: () => void;
  currentFilters: Record<string, string>;
  sortBy?: string;
}

export function Filters({
  onFiltersChange,
  onResetFilters,
  currentFilters,
  sortBy,
}: FiltersProps) {
  const { user } = useAppSelector((state) => state.auth);

  // Groups state
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Track initial render to prevent unnecessary onFiltersChange calls
  const isInitialMount = useRef(true);

  // Load groups on component mount
  useEffect(() => {
    const loadGroups = async () => {
      setGroupsLoading(true);
      try {
        const fetchedGroups = await groupsService.getAllGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Failed to load groups:", error);
      } finally {
        setGroupsLoading(false);
      }
    };

    loadGroups();
  }, []);

  // Single state object for all filter values
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => ({
      name: currentFilters.name || "",
      surname: currentFilters.surname || "",
      email: currentFilters.email || "",
      phone: currentFilters.phone || "",
      course: currentFilters.course || "",
      age: currentFilters.age || "",
      sum: currentFilters.sum || "",
      alreadyPaid: currentFilters.alreadyPaid || "",
      startDate: currentFilters.startDate || "",
      endDate: currentFilters.endDate || "",
      status: currentFilters.status || "",
      course_format: currentFilters.course_format || "",
      course_type: currentFilters.course_type || "",
      groupId: currentFilters.groupId || "",
      manager_id: currentFilters.manager_id || "",
    })
  );

  // Clear empty filter values
  const clearEmptyFilters = (filters: Record<string, string>) => {
    for (const key in filters) {
      if (!filters[key]) {
        delete filters[key];
      }
    }

    return filters;
  };

  // Debounced filter updates
  const debouncedOnFiltersChange = useDebounce((filters: Record<string, string>) => {
    const clearedFilters = clearEmptyFilters(filters);
    onFiltersChange(clearedFilters);
  }, 800);

  // Watch effect for automatic filter updates (skip during mount)
  useEffect(() => {
    // Skip onFiltersChange during initial mount to prevent page reset
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    debouncedOnFiltersChange(filterValues);
  }, [filterValues]); // Keep onFiltersChange out of dependencies

  // Reset all filters
  const handleReset = () => {
    const resetValues = {
      name: "",
      surname: "",
      email: "",
      phone: "",
      course: "",
      age: "",
      sum: "",
      alreadyPaid: "",
      startDate: "",
      endDate: "",
      status: "",
      course_format: "",
      course_type: "",
      groupId: "",
      manager_id: "",
    };
    setFilterValues(resetValues);
    onResetFilters();
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="flex gap-2">
            <button onClick={handleReset} className="btn btn-sm">
              Reset All
            </button>
            <ExcelExportButton filters={filterValues} sortBy={sortBy} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {/* Text filters */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Search by name"
              className="input input-bordered input-sm w-full"
              value={filterValues.name}
              onChange={(e) => setFilterValues(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Surname</span>
            </label>
            <input
              type="text"
              placeholder="Search by surname"
              className="input input-bordered input-sm w-full"
              value={filterValues.surname}
              onChange={(e) => setFilterValues(prev => ({ ...prev, surname: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Search by email"
              className="input input-bordered input-sm w-full"
              value={filterValues.email}
              onChange={(e) => setFilterValues(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              placeholder="Search by phone"
              className="input input-bordered input-sm w-full"
              value={filterValues.phone}
              onChange={(e) => setFilterValues(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Age</span>
            </label>
            <input
              type="number"
              placeholder="Search by age"
              className="input input-bordered input-sm w-full"
              value={filterValues.age}
              onChange={(e) => setFilterValues(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={filterValues.course}
              onChange={(e) => setFilterValues(prev => ({ ...prev, course: e.target.value }))}
            >
              <option value="">All Courses</option>
              <option value="FS">FS</option>
              <option value="QACX">QACX</option>
              <option value="JCX">JCX</option>
              <option value="JSCX">JSCX</option>
              <option value="FE">FE</option>
              <option value="PCX">PCX</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Sum</span>
            </label>
            <input
              type="number"
              placeholder="Search by sum"
              className="input input-bordered input-sm w-full"
              value={filterValues.sum}
              onChange={(e) => setFilterValues(prev => ({ ...prev, sum: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Already Paid</span>
            </label>
            <input
              type="number"
              placeholder="Search by paid amount"
              className="input input-bordered input-sm w-full"
              value={filterValues.alreadyPaid}
              onChange={(e) => setFilterValues(prev => ({ ...prev, alreadyPaid: e.target.value }))}
            />
          </div>

          {/* Select filters */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={filterValues.status}
              onChange={(e) => setFilterValues(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In work">In work</option>
              <option value="Aggre">Aggre</option>
              <option value="Disaggre">Disaggre</option>
              <option value="Dubbing">Dubbing</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Format</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={filterValues.course_format}
              onChange={(e) => setFilterValues(prev => ({ ...prev, course_format: e.target.value }))}
            >
              <option value="">All Formats</option>
              <option value="online">Online</option>
              <option value="static">Static</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Type</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={filterValues.course_type}
              onChange={(e) => setFilterValues(prev => ({ ...prev, course_type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="minimal">Minimal</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
              <option value="incubator">Incubator</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Group</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={filterValues.groupId}
              onChange={(e) => setFilterValues(prev => ({ ...prev, groupId: e.target.value }))}
              disabled={groupsLoading}
            >
              <option value="">All Groups</option>
              {groupsLoading ? (
                <option value="" disabled>
                  Loading groups...
                </option>
              ) : (
                groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={filterValues.startDate}
              onChange={(e) => setFilterValues(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={filterValues.endDate}
              onChange={(e) => setFilterValues(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          {/* Checkbox for my orders only */}
          {user && (
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">My Orders Only</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={Number(filterValues.manager_id) === Number(user.id)}
                  value={user?.id || ""}
                  onChange={(e) => setFilterValues(prev => ({
                    ...prev,
                    manager_id: e.target.checked ? e.target.value : ""
                  }))}
                />
              </label>
            </div>
          )}

          {!user && (
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/50">
                  My Orders Only (login required)
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
