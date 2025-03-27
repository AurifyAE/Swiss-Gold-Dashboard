"use client";
import React, { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon, ChevronLeft, ChevronRight } from "lucide-react";

// Improved Chevron Icon Component
export const ChevronIcon = ({ expanded }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        >
            <path
                d="M6 9L12 15L18 9"
                stroke="#4628A7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// Transaction Header Component with Sorting
const TransactionHeader = ({
    sortConfig,
    onSort
}) => {
    const headers = [
        { key: 'id', label: 'Transaction ID' },
        { key: 'date', label: 'Delivery Date' },
        { key: 'paymentMethod', label: 'Payment Method' },
        { key: 'status', label: 'Status' },
        { key: 'pricingOption', label: 'Pricing Option' },
        { key: 'amount', label: 'Total Amount' },
    ];

    return (
        <header className="grid grid-cols-7 items-center px-12 py-4 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-md font-semibold text-white">
            {headers.map((header) => (
                <div
                    key={header.key}
                    className="flex items-center cursor-pointer"
                    onClick={() => onSort(header.key)}
                >
                    {header.label}
                    {sortConfig.key === header.key && (
                        <span className="ml-2">
                            {sortConfig.direction === 'asc' ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                        </span>
                    )}
                </div>
            ))}
            <div>Customers</div>
        </header>
    );
};

// Function to get status color and badge
const getStatusBadge = (status) => {
    const statusStyles = {
        "approved": "bg-green-100 text-green-800",
        "successful": "bg-emerald-100 text-emerald-800",
        "pending": "bg-yellow-100 text-yellow-800",
        "processing": "bg-blue-100 text-blue-800",
        "user approval pending": "bg-sky-100 text-sky-800",
        "rejected": "bg-red-100 text-red-800",
        "default": "bg-gray-100 text-gray-800"
    };

    const normalizedStatus = status.toLowerCase();
    const badgeClass = statusStyles[normalizedStatus] || statusStyles["default"];

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {status}
        </span>
    );
};

// Transaction Row Component
const TransactionRow = ({ transaction, expanded, onToggleExpand }) => {
    const { id, date, paymentMethod, status, pricingOption, amount, customer } = transaction;

    return (
        <div className="last:border-b-0">
            <div className="grid grid-cols-7 items-center px-12 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                    <button
                        onClick={onToggleExpand}
                        className="mr-2 text-gray-500 hover:text-blue-600"
                    >
                        <ChevronIcon expanded={expanded} />
                    </button>
                    {id}
                </div>
                <div>{date}</div>
                <div>{paymentMethod}</div>
                <div>{getStatusBadge(status)}</div>
                <div>{pricingOption}</div>
                <div className="font-semibold">${amount.toLocaleString()}</div>
                <div>
                    <button className="px-6 py-2 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                        View
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="bg-gray-50 p-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Customer Name</p>
                        <p>{customer?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Contact Email</p>
                        <p>{customer?.email || 'N/A'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Enhanced PaginationControls Component
const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange
}) => {
    const rowsPerPageOptions = [5, 10, 20, 50];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-100 gap-4 rounded-b-2xl">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="border rounded-md px-2 py-1 bg-white"
                >
                    {rowsPerPageOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>

                <div className="flex gap-1">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                        aria-label="First page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>


                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const TransactionTable = ({
    timeFilter = "This Week",
    statusFilter = null
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: 'date',
        direction: 'desc'
    });

    // Mock transactions with added customer details and varying statuses
    const MOCK_TRANSACTIONS = [
        {
            id: "TXM7N9E7R565789",
            date: "2025-01-15",
            paymentMethod: "Cash",
            status: "Approved",
            pricingOption: "Premium",
            amount: 10000,
            customer: {
                name: "John Doe",
                email: "john.doe@example.com"
            }
        },
        {
            id: "TXM7N9E7R565790",
            date: "2025-01-16",
            paymentMethod: "Credit",
            status: "Processing",
            pricingOption: "Standard",
            amount: 20000,
            customer: {
                name: "Jane Smith",
                email: "jane.smith@example.com"
            }
        },
        {
            id: "TXM7N9E7R565791",
            date: "2025-01-17",
            paymentMethod: "Bank Transfer",
            status: "User Approval Pending",
            pricingOption: "Basic",
            amount: 15000,
            customer: {
                name: "Alice Johnson",
                email: "alice.johnson@example.com"
            }
        },
        {
            id: "TXM7N9E7R565792",
            date: "2025-01-18",
            paymentMethod: "PayPal",
            status: "Rejected",
            pricingOption: "Premium",
            amount: 25000,
            customer: {
                name: "Bob Williams",
                email: "bob.williams@example.com"
            }
        },
        {
            id: "TXM7N9E7R565793",
            date: "2025-01-19",
            paymentMethod: "Cash",
            status: "Success",
            pricingOption: "Standard",
            amount: 18000,
            customer: {
                name: "Charlie Brown",
                email: "charlie.brown@example.com"
            }
        },
        {
            id: "TXM7N9E7R565794",
            date: "2025-01-20",
            paymentMethod: "Credit",
            status: "Approved",
            pricingOption: "Premium",
            amount: 22000,
            customer: {
                name: "David Wilson",
                email: "david.wilson@example.com"
            }
        },
        {
            id: "TXM7N9E7R565795",
            date: "2025-01-21",
            paymentMethod: "Bank Transfer",
            status: "Processing",
            pricingOption: "Basic",
            amount: 12000,
            customer: {
                name: "Eva Davis",
                email: "eva.davis@example.com"
            }
        },
        {
            id: "TXM7N9E7R565796",
            date: "2025-01-22",
            paymentMethod: "PayPal",
            status: "Pending",
            pricingOption: "Standard",
            amount: 19000,
            customer: {
                name: "Frank Miller",
                email: "frank.miller@example.com"
            }
        },
        {
            id: "TXM7N9E7R565797",
            date: "2025-01-23",
            paymentMethod: "Cash",
            status: "Approved",
            pricingOption: "Premium",
            amount: 21000,
            customer: {
                name: "Grace Taylor",
                email: "grace.taylor@example.com"
            }
        },
        {
            id: "TXM7N9E7R565798",
            date: "2025-01-24",
            paymentMethod: "Credit",
            status: "Rejected",
            pricingOption: "Basic",
            amount: 14000,
            customer: {
                name: "Henry Anderson",
                email: "henry.anderson@example.com"
            }
        },
    ];

    // Filter transactions based on time and status
    const filteredTransactions = useMemo(() => {
        return MOCK_TRANSACTIONS.filter(transaction => {
            // Time filter logic
            const isTimeMatch = timeFilter === "This Week" ||
                (timeFilter === "This Month" && new Date(transaction.date).getMonth() === new Date().getMonth()) ||
                (timeFilter === "This Year" && new Date(transaction.date).getFullYear() === new Date().getFullYear());

            // Status filter logic
            const isStatusMatch = !statusFilter ||
                transaction.status.toLowerCase() === statusFilter.toLowerCase() ||
                (statusFilter === "All Orders");

            return isTimeMatch && isStatusMatch;
        });
    }, [timeFilter, statusFilter]);

    // Sorting logic
    const sortedTransactions = useMemo(() => {
        const sortableTransactions = [...filteredTransactions];
        sortableTransactions.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableTransactions;
    }, [filteredTransactions, sortConfig]);

    // Pagination logic
    const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);
    const paginatedTransactions = sortedTransactions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Sorting handler
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        // Reset to first page when rows per page changes
        setCurrentPage(1);
    };

    // Handle page change with boundary checks
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="w-full overflow-hidden">
            <TransactionHeader
                sortConfig={sortConfig}
                onSort={handleSort}
            />

            {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                    <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        expanded={expandedRowId === transaction.id}
                        onToggleExpand={() =>
                            setExpandedRowId(prev => prev === transaction.id ? null : transaction.id)
                        }
                    />
                ))
            ) : (
                <div className="p-6 text-center text-gray-500">
                    No transactions found
                </div>
            )}

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    );
};

export default TransactionTable;