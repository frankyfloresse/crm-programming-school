import { useState } from 'react';
import { axiosInstance } from '../api/axiosConfig';
import { useAppSelector } from '../store/hooks';

interface ExcelExportButtonProps {
  filters: Record<string, unknown>;
  sortBy?: string;
}

export function ExcelExportButton({ filters, sortBy }: ExcelExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAppSelector((state) => state.auth);

  const handleExport = async () => {
    if (!accessToken) {
      alert('Please login to export data');
      return;
    }

    setIsLoading(true);

    try {
      // Build query parameters object
      const params: Record<string, string | number> = {};

      // Add all active filters with proper type conversion
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert numeric fields to numbers
          if (key === 'age' || key === 'sum' || key === 'alreadyPaid') {
            params[`filter.${key}`] = Number(value);
          } else {
            // Text fields should use ILIKE for partial matching
            const textFields = ['name', 'surname', 'email', 'phone'];
            if (textFields.includes(key)) {
              params[`filter.${key}`] = `$ilike:${value.toString()}`;
            } else {
              params[`filter.${key}`] = value.toString();
            }
          }
        }
      });

      // Add sort if exists
      if (sortBy) {
        params.sortBy = sortBy;
      }

      // Make request to get Excel file
      const response = await axiosInstance.get('/orders/export', {
        params,
        responseType: 'arraybuffer', // Important for file download
        paramsSerializer: {
          indexes: null, // Prevent array indices in params
          serialize: (paramsObj) => {
            // Handle sortBy with colon properly
            const searchParams = new URLSearchParams();
            Object.entries(paramsObj).forEach(([key, value]) => {
              searchParams.append(key, String(value));
            });
            return searchParams.toString();
          }
        }
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create virtual link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className={`btn btn-success btn-sm ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? 'Exporting...' : 'Export to Excel'}
    </button>
  );
}