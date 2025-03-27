"use client";
import React, { useState, useMemo, forwardRef } from "react";
import { ChevronDownIcon, ChevronUpIcon, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';

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

// Download Single Transaction 
const downloadSingleTransactionPDF = async (transaction) => {
    try {
        // Create the PDF document with just this transaction
        const doc = (
            <Document>
                <Page size="A4" wrap={false}>
                    <TransactionPDF transaction={transaction} products={products} />
                </Page>
            </Document>
        );

        // Generate the blob
        const blob = await pdf(doc).toBlob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Transaction_${transaction.id}_Details.pdf`;
        document.body.appendChild(link);
        link.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

// Transaction Header Component with Sorting
const TransactionHeader = ({
    sortConfig,
    onSort,
    className = ''
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
        <header className={`grid grid-cols-7 items-center px-12 py-4 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-md font-semibold text-white ${className}`}>
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

// Products
const products = [
    {
        image: "https://cdn.builder.io/api/v1/image/assets/TEMP/02a48f308affaf6760b150aa96c2d18a3b2b8204",
        name: "5 Grams Gold Bar",
        weight: "5",
        purity: "9999",
        quantity: "20",
        amount: "1727.8817",
    },
    {
        image: "https://cdn.builder.io/api/v1/image/assets/TEMP/02a48f308affaf6760b150aa96c2d18a3b2b8204",
        name: "10 Grams Gold Bar",
        weight: "10",
        purity: "9999",
        quantity: "15",
        amount: "3455.7634",
    },
    {
        image: "https://cdn.builder.io/api/v1/image/assets/TEMP/02a48f308affaf6760b150aa96c2d18a3b2b8204",
        name: "1 Grams Gold Bar",
        weight: "1",
        purity: "9999",
        quantity: "50",
        amount: "345.5763",
    },
];

// PDF Generation Component
const TransactionPDF = ({ transaction, products }) => {
    const styles = StyleSheet.create({
        page: {
            padding: 0,
            margin: 0,
            position: 'relative',
        },
        container: {
            padding: 40,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        watermarkContainer: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            opacity: 0.04,
            zIndex: -1,
        },
        watermarkText: {
            fontSize: 100,
            color: "#000000",
            textAlign: "center",
            fontWeight: "bold",
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 40,
            borderBottom: 2,
            borderBottomColor: "#e2e8f0",
            paddingBottom: 20,
        },
        headerContent: {
            flex: 1,
        },
        companyName: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#1e3a8a",
            marginBottom: 10,
        },
        companyDetails: {
            fontSize: 9,
            color: "#64748b",
            lineHeight: 1.6,
        },
        invoiceDetails: {
            alignItems: "flex-end",
        },
        invoiceTitle: {
            fontSize: 28,
            fontWeight: "bold",
            color: "#1e3a8a",
            marginBottom: 10,
        },
        invoiceNumber: {
            fontSize: 12,
            color: "#64748b",
        },
        invoiceDate: {
            fontSize: 10,
            color: "#64748b",
            marginTop: 5,
        },
        billingSection: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
        },
        billingBox: {
            width: "48%",
            padding: 15,
            backgroundColor: "#f8fafc",
            borderRadius: 5,
        },
        billingTitle: {
            fontSize: 12,
            fontWeight: "bold",
            color: "#1e3a8a",
            marginBottom: 10,
        },
        billingInfo: {
            fontSize: 9,
            color: "#64748b",
            lineHeight: 1.6,
        },
        table: {
            marginBottom: 30,
        },
        productImage: {
            width: 40,
            height: 40,
            objectFit: "contain",
        },
        tableHeader: {
            flexDirection: "row",
            backgroundColor: "#1e3a8a",
            padding: 10,
            color: "#ffffff",
        },
        tableCellHeader: {
            color: "#ffffff",
            fontSize: 10,
            fontWeight: "bold",
        },
        tableRow: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
            padding: 10,
        },
        tableCell: {
            fontSize: 9,
            color: "#334155",
        },
        productName: {
            fontSize: 10,
            fontWeight: "bold",
            marginBottom: 4,
        },
        productDetails: {
            fontSize: 8,
            color: "#64748b",
        },
        termsSection: {
            marginBottom: 30,
            padding: 15,
            backgroundColor: "#f8fafc",
            borderRadius: 5,
        },
        termsTitle: {
            fontSize: 11,
            fontWeight: "bold",
            color: "#1e3a8a",
            marginBottom: 10,
        },
        termsText: {
            fontSize: 8,
            color: "#64748b",
            lineHeight: 1.6,
        },
        footer: {
            borderTopWidth: 1,
            borderTopColor: "#e2e8f0",
            paddingTop: 20,
            alignItems: "center",
        },
        footerText: {
            fontSize: 12,
            color: "#1e3a8a",
            fontWeight: "bold",
            marginBottom: 5,
        },
        footerContact: {
            fontSize: 9,
            color: "#64748b",
        },
    });

    const watermarkText = transaction.status.toUpperCase();

    return (
        <Document>
            {/* <Page size="A4" style={styles.page} key={transaction.id}> */}
            <View style={styles.container}>
                <View style={styles.watermarkContainer}>
                    <Text style={styles.watermarkText}>{watermarkText}</Text>
                </View>

                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.companyName}>Gold Trading Company</Text>
                        <Text style={styles.companyDetails}>
                            123 Gold Street, Business District{"\n"}
                            Tel: +971 4 123 4567{"\n"}
                            Email: info@goldtrading.com{"\n"}
                            TRN: 123456789012345
                        </Text>
                    </View>
                    <View style={styles.invoiceDetails}>
                        <Text style={styles.invoiceTitle}>Delivery Note</Text>
                        <Text style={styles.invoiceNumber}>#{transaction.id}</Text>
                        <Text style={styles.invoiceDate}>
                            Date: {new Date(transaction.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                            })}
                        </Text>
                    </View>
                </View>

                <View style={styles.billingSection}>
                    <View style={styles.billingBox}>
                        <Text style={styles.billingTitle}>Bill To:</Text>
                        <Text style={styles.billingInfo}>
                            {transaction.customer?.name || "N/A"}
                            {"\n"}
                            Dubai, UAE
                            {"\n"}
                            Phone: +971 5XX XXX XXXX
                            {"\n"}
                            {transaction.customer?.email || "N/A"}
                        </Text>
                    </View>
                    <View style={styles.billingBox}>
                        <Text style={styles.billingTitle}>Payment Details:</Text>
                        <Text style={styles.billingInfo}>
                            Method: {transaction.paymentMethod}
                            {"\n"}
                            Delivery Date: {transaction.date}
                            {"\n"}
                            Transaction ID: {transaction.id}
                            {"\n"}
                            Status: {transaction.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Image</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2.5 }]}>Item Description</Text>
                        <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Qty</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Purity</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Amount</Text>
                    </View>

                    {products.map((product, index) => (
                        <View
                            style={[
                                styles.tableRow,
                                { backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff" },
                            ]}
                            key={index}
                        >
                            <View style={[styles.tableCell, { flex: 1 }]}>
                                <Image src={product.image} style={styles.productImage} />
                            </View>
                            <View style={[styles.tableCell, { flex: 2.5 }]}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productDetails}>
                                    Weight: {product.weight}g
                                </Text>
                            </View>
                            <Text style={[styles.tableCell, { flex: 0.5 }]}>{product.quantity}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{product.purity}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>${product.amount}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.termsSection}>
                    <Text style={styles.termsTitle}>Terms & Conditions:</Text>
                    <Text style={styles.termsText}>
                        • All prices are in USD{"\n"}
                        • Payment is due upon receipt of delivery{"\n"}
                        • Goods once sold cannot be returned{"\n"}
                        • This is a computer-generated delivery note and requires no signature
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Thank you for your business!</Text>
                    <Text style={styles.footerContact}>
                        For any queries, please contact: support@goldtrading.com
                    </Text>
                </View>
            </View>
            {/* </Page> */}
        </Document>
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
const TransactionRow = ({ transaction, expanded, onToggleExpand, dashboard = false }) => {
    const { id, date, paymentMethod, status, pricingOption, amount, customer } = transaction;

    return (
        <div className="last:border-b-0 bg-white">
            <div className="grid grid-cols-7 items-center px-12 py-4 hover:bg-[#F1FCFF] transition-colors">
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
                <div className="flex items-center justify-between">
                    <button
                        className="px-6 py-2 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        View
                    </button>
                    {!dashboard && (
                        <button
                            onClick={() => downloadSingleTransactionPDF(transaction)}
                            className="p-2 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-white rounded-md transition-colors"
                            aria-label="Download PDF"
                        >
                            <Download size={16} />
                        </button>
                    )}

                </div>
            </div>
            {expanded && (
                <div className="bg-[#F1FCFF] py-5 px-8 w-full">
                    <div className="bg-white rounded-xl border-2 border-sky-400 border-solid shadow-[0_4px_4px_rgba(50,180,219,0.24)] w-full overflow-x-auto">
                        <div className="hidden md:flex px-0 py-4 text-sm text-black bg-zinc-300 rounded-[9px_9px_0_0]">
                            <div className="pl-7 text-left w-[150px]">Product Image</div>
                            <div className="text-center w-[250px]">Name</div>
                            <div className="text-center w-[180px]">Weight</div>
                            <div className="text-center w-[180px]">Purity</div>
                            <div className="text-center w-[180px]">Quantity</div>
                            <div className="text-center w-[180px]">Amount</div>
                            <div className="text-center w-[200px]">Actions</div>
                        </div>

                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row items-center px-4 py-5 border-b border-solid border-b-zinc-100"
                            >
                                <div className="hidden md:flex items-center w-full">
                                    <div className="pl-7 text-sm text-center text-black w-[150px]">
                                        <div className="flex justify-center items-center ml-12 bg-white h-[68px] shadow-[0_1px_2px_rgba(0,0,0,0.09)] w-[53px]">
                                            {product.image ? (
                                                <img src={product.image} alt="Gold bar" className="w-10 h-[62px]" />
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="text-sm text-center text-black w-[250px]">{product.name}</div>
                                    <div className="text-sm text-center text-black w-[180px]">{product.weight}</div>
                                    <div className="text-sm text-center text-black w-[180px]">{product.purity}</div>
                                    <div className="text-sm text-center text-black w-[180px]">{product.quantity}</div>
                                    <div className="text-sm text-center text-black w-[180px]">{product.amount}</div>
                                    <div className="text-sm text-center text-black w-[200px]"></div>
                                </div>
                            </div>
                        ))}
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
    statusFilter = null,
    searchQuery = "",
    className = '',
    dashboard = false
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

    // Filter transactions based on time, status, and search query
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

            // Search query logic
            const isSearchMatch = !searchQuery ||
                transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.pricingOption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.amount.toString().includes(searchQuery) ||
                transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.customer.email.toLowerCase().includes(searchQuery.toLowerCase());

            return isTimeMatch && isStatusMatch && isSearchMatch;
        });
    }, [timeFilter, statusFilter, searchQuery]);

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
        setCurrentPage(1);
    };

    // Handle page change with boundary checks
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Export all transactions to PDF
    const handleExportAllToPDF = async () => {
        try {
            // Create an array of all transaction pages
            const pages = filteredTransactions.map(transaction => (
                <Page key={transaction.id} size="A4" wrap={false}>
                    <TransactionPDF transaction={transaction} products={products} />
                </Page>
            ));

            // Create the PDF document
            const doc = <Document>{pages}</Document>;

            // Generate the blob and trigger download
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'All_Transactions.pdf';
            document.body.appendChild(link);
            link.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    // Expose the function (keep this the same)
    TransactionTable.exportAllToPDF = handleExportAllToPDF;

    return (
        <div className="w-full overflow-hidden">
            <TransactionHeader
                sortConfig={sortConfig}
                onSort={handleSort}
                className={className}
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
                        dashboard={dashboard}
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

TransactionTable.displayName = 'TransactionTable';

export default TransactionTable;