'use client';

import { useState, useEffect } from 'react';
import { getUsers, getAttendees, exportPins } from '@/libs/api';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  guestCategory: string;
  lastScan?: string | null;
}

const userColumns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'organization', header: 'Organization' },
  { accessorKey: 'guestCategory', header: 'Category' },
];

const attendeeColumns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'organization', header: 'Organization' },
  { accessorKey: 'guestCategory', header: 'Category' },
  {
    accessorKey: 'lastScan',
    header: 'Last Scan',
    cell: ({ row }) => (row.original.lastScan ? new Date(row.original.lastScan).toLocaleString() : 'N/A'),
  },
];

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [attendeePage, setAttendeePage] = useState(1);
  const limit = 10;

  const fetchUsers = async (page: number) => {
    try {
      const data = await getUsers(page, limit);
      setUsers(data.users || []);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching users');
    }
  };

  const fetchAttendees = async (page: number) => {
    try {
      const data = await getAttendees(page, limit);
      setAttendees(data.attendees || []);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching attendees');
    }
  };

  useEffect(() => {
    fetchUsers(userPage);
  }, [userPage]);

  useEffect(() => {
    fetchAttendees(attendeePage);
  }, [attendeePage]);

  const handleExportPins = async () => {
    try {
      await exportPins();
      toast.success('PINs exported successfully');
    } catch (err: any) {
      toast.error(err.message || 'Error exporting PINs');
    }
  };

  const userTable = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const attendeeTable = useReactTable({
    data: attendees,
    columns: attendeeColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
        <table className="w-full border-collapse">
          <thead>
            {userTable.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {userTable.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button onClick={() => { setUserPage(Math.max(1, userPage - 1)); fetchUsers(Math.max(1, userPage - 1)); }} disabled={userPage === 1} className="bg-blue-500 text-white p-2">Previous</button>
          <button onClick={() => { setUserPage(userPage + 1); fetchUsers(userPage + 1); }} className="bg-blue-500 text-white p-2">Next</button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Attendees</h2>
        <table className="w-full border-collapse">
          <thead>
            {attendeeTable.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {attendeeTable.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button onClick={() => { setAttendeePage(Math.max(1, attendeePage - 1)); fetchAttendees(Math.max(1, attendeePage - 1)); }} disabled={attendeePage === 1} className="bg-blue-500 text-white p-2">Previous</button>
          <button onClick={() => { setAttendeePage(attendeePage + 1); fetchAttendees(attendeePage + 1); }} className="bg-blue-500 text-white p-2">Next</button>
        </div>
      </div>

      <button onClick={handleExportPins} className="bg-green-500 text-white p-2">Export PINs as CSV</button>
      <ToastContainer />
    </div>
  );
}