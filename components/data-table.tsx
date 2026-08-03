'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Transaction } from '@/types';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface DataTableProps {
  data: Transaction[];
  onStatusChange?: (id: string, newStatus: Transaction['status']) => void;
  onRequestDelete?: (tx: Transaction) => void;
  userRole?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  onStatusChange,
  onRequestDelete,
  userRole = 'Admin',
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const isEditable = userRole !== 'Viewer';

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: 'ID Transaksi',
      cell: (info) => (
        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
        >
          Pelanggan
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ),
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.avatarUrl}
              alt={row.customerName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <p className="font-medium text-slate-900 dark:text-white text-xs">
              {row.customerName}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Kategori',
      cell: (info) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
        >
          Jumlah (Rp)
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ),
      cell: (info) => (
        <span className="font-bold text-xs text-amber-500 dark:text-amber-400">
          Rp {(info.getValue() as number).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status & Ubah',
      cell: (info) => {
        const row = info.row.original;
        const status = info.getValue() as Transaction['status'];
        let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        let Icon = Clock;

        if (status === 'Completed') {
          style = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-800/40';
          Icon = CheckCircle2;
        } else if (status === 'Pending') {
          style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-800/40';
          Icon = Clock;
        } else if (status === 'Processing') {
          style = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-800/40';
          Icon = AlertCircle;
        } else if (status === 'Failed') {
          style = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-800/40';
          Icon = XCircle;
        }

        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style}`}>
              <Icon className="w-3 h-3" />
              {status}
            </span>

            {isEditable && onStatusChange && (
              <select
                value={status}
                onChange={(e) =>
                  onStatusChange(row.id, e.target.value as Transaction['status'])
                }
                className="text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-1.5 py-0.5 focus:outline-hidden hover:border-blue-500 cursor-pointer"
                title="Ubah Status (Admin / Manager)"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
        >
          Tanggal
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ),
      cell: (info) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: (info) => {
        const row = info.row.original;
        if (!isEditable || !onRequestDelete) return <span className="text-slate-600 text-xs">-</span>;

        return (
          <button
            onClick={() => onRequestDelete(row)}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition"
            title="Hapus Transaksi Ini"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Header filter & search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Cari transaksi atau pelanggan..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getFilteredRowModel().rows.length}</span> transaksi
        </div>
      </div>

      {/* Table element */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-xs text-slate-400"
                >
                  Tidak ada transaksi yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Halaman <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getState().pagination.pageIndex + 1}</span> dari{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getPageCount()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
