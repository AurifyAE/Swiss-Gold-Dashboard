"use client";
import React, {
  useState,
  useMemo,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import axiosInstance from "../../axios/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Improved Chevron Icon Component
export const ChevronIcon = ({ expanded }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${
        expanded ? "rotate-180" : ""
      }`}
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
const downloadSingleTransactionPDF = async (transaction, productsToDisplay) => {
  try {
    // Create the PDF document with just this transaction
    const doc = (
      <Document>
        <Page size="A4" wrap={false}>
          <TransactionPDF
            transaction={transaction}
            products={productsToDisplay}
          />
        </Page>
      </Document>
    );

    // Generate the blob
    const blob = await pdf(doc).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
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
const TransactionHeader = ({ sortConfig, onSort, className = "" }) => {
  const headers = [
    { key: "id", label: "Transaction ID" },
    { key: "date", label: "Delivery Date" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Status" },
    { key: "TotalWeight", label: "TotalWeight" },
    { key: "amount", label: "Total Amount" },
  ];

  return (
    <header
      className={`grid grid-cols-7 items-center px-12 py-4 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-md font-semibold text-white ${className}`}
    >
      {headers.map((header) => (
        <div
          key={header.key}
          className="flex items-center cursor-pointer"
          onClick={() => onSort(header.key)}
        >
          {header.label}
          {sortConfig.key === header.key && (
            <span className="ml-2">
              {sortConfig.direction === "asc" ? (
                <ChevronUpIcon size={16} />
              ) : (
                <ChevronDownIcon size={16} />
              )}
            </span>
          )}
        </div>
      ))}
      <div>Customers</div>
    </header>
  );
};

// Products
// const productsArray = [];

// PDF Generation Component
const TransactionPDF = ({ transaction, products }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 0,
      margin: 0,
      position: "relative",
    },
    container: {
      padding: 40,
      height: "100%",
      display: "flex",
      flexDirection: "column",
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
              Date:{" "}
              {new Date(transaction.date).toLocaleDateString("en-GB", {
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
            {/* <Text style={[styles.tableCellHeader, { flex: 1 }]}>Image</Text> */}
            <Text style={[styles.tableCellHeader, { flex: 2.5 }]}>
              Item Description
            </Text>
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
              {/* <View style={[styles.tableCell, { flex: 1 }]}>
                <Image src={product.image} style={styles.productImage} />
              </View> */}
              <View style={[styles.tableCell, { flex: 2.5 }]}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetails}>
                  Weight: {product.weight}g
                </Text>
              </View>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>
                {product.quantity}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {product.purity}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                ${product.amount}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          <Text style={styles.termsText}>
            • All prices are in USD{"\n"}• Payment is due upon receipt of
            delivery{"\n"}• Goods once sold cannot be returned{"\n"}• This is a
            computer-generated delivery note and requires no signature
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
    approved: "bg-green-100 text-green-800",
    successful: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    "user approval pending": "bg-sky-100 text-sky-800",
    rejected: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  const normalizedStatus = status.toLowerCase();
  const badgeClass = statusStyles[normalizedStatus] || statusStyles["default"];

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
    >
      {status}
    </span>
  );
};

const TransactionRow = ({
  transaction,
  expanded,
  onToggleExpand,
  dashboard = false,
}) => {
  const {
    orderId,
    id,
    date,
    paymentMethod,
    status,
    totalWeight,
    amount,
    customer,
    products: transactionProducts,
  } = transaction;
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState(status);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState("");
  const [modals, setModals] = useState({
    remark: false,
    quantity: false,
  });
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  // Function to handle status change
  const handleStatusChange = async (newStatus) => {
    // Store the previous status in case we need to revert
    const previousStatus = selectedStatus;

    // For rejected status, we need to open a modal for remarks
    if (newStatus === "Rejected") {
      // Set the selected order ID and open the remark modal
      setSelectedOrder(orderId);
      setModals((prev) => ({ ...prev, remark: true }));
      return;
    }

    // Update the local state immediately for responsive UI
    setSelectedStatus(newStatus);
    setShowDropdown(false);

    // Show loading indicator
    const loadingToastId = toast.loading("Updating status...");

    try {
      // Call the API to update the status
      await axiosInstance.put(`/update-order/${orderId}`, {
        orderStatus: newStatus,
      });

      // Show success message
      toast.success("Status updated successfully", {
        id: loadingToastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating status:", error);

      // Revert to previous status on error
      setSelectedStatus(previousStatus);

      // Show error message
      toast.error("Failed to update status", {
        id: loadingToastId,
      });
    }
  };

  // Optimized remark submission handler
  const handleRemarkSubmit = async () => {
    if (!selectedOrder || !remark.trim()) {
      setError("Please enter a remark");
      return;
    }

    const loadingToastId = toast.loading("Submitting remark...");

    try {
      await axiosInstance.put(`/update-order-reject/${selectedOrder}`, {
        orderStatus: "Rejected",
        remark,
      });

      // Update local state
      setSelectedStatus("Rejected");

      // Close modal and reset fields
      setModals((prev) => ({ ...prev, remark: false }));
      setRemark("");
      setError("");

      toast.success("Order rejected", {
        id: loadingToastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting remark:", error);
      toast.error("Failed to submit remark", { id: loadingToastId });
      setError("Failed to submit remark.");
    }
  };

  // Handle product approval
  const handleApproval = async (product) => {
    console.log(product.fixedPrice);
    console.log(orderId);
    if (!orderId || !product.itemId) return;

    if (product.quantity <= 1) {
      const loadingToastId = toast.loading("Processing approval...");
      try {
        await axiosInstance.put(`/update-order-quantity/${orderId}`, {
          itemStatus: "Approved",
          itemId: product.itemId,
          fixedPrice: product.amount,
          quantity: product.quantity,
        });

        toast.success("Order approved", {
          id: loadingToastId,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error approving order:", error);
        toast.error("Failed to approve order", { id: loadingToastId });
        setError("Failed to approve order.");
      }
    } else {
      setSelectedOrder(orderId);
      setSelectedProduct(product);
      setQuantity(product.quantity);
      setModals((prev) => ({ ...prev, quantity: true }));
    }
  };

  // Optimized quantity submission handler
  const handleQuantitySubmit = async () => {
    if (!selectedOrder || !selectedProduct?.productId) return;

    const loadingToastId = toast.loading("Updating quantity...");
    try {
      await axiosInstance.put(`/update-order-quantity/${selectedOrder}`, {
        itemStatus: "UserApprovalPending",
        itemId: selectedProduct.itemId,
        fixedPrice: selectedProduct.amount,
        quantity: quantity,
      });

      setModals((prev) => ({ ...prev, quantity: false }));
      toast.success("Quantity updated", {
        id: loadingToastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity", { id: loadingToastId });
      setError("Failed to update quantity.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const productsToDisplay =
    transactionProducts && transactionProducts.length > 0
      ? transactionProducts
      : products; // Fall back to global products if no transaction-specific products

  // Status color mapping
  const statusStyles = {
    Rejected: "bg-red-100 text-[#FF0000]",
    Success: "bg-green-100 text-[#11AA0E]",
    UserApprovalPending: "bg-blue-100 text-[#0790E6]",
    Processing: "bg-orange-100 text-[#FF8C00]",
    Approved: "bg-green-100 text-[#11AA0E]",
  };
  const handleViewProfile = (userId) => {
    console.log("first")
    navigate(`/profile/${userId}`);
  };
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
        <div className="ml-5">{date}</div>
        <div>{paymentMethod}</div>

        {/* Status display - conditional rendering based on dashboard prop */}
        <div className="relative" ref={dropdownRef}>
          {dashboard ? (
            // For dashboard, just show the status without dropdown
            <div
              className={`flex items-center justify-between px-3 py-1 rounded-md text-sm font-semibold w-max ${statusStyles[selectedStatus]}`}
            >
              <span>{selectedStatus}</span>
            </div>
          ) : (
            // For non-dashboard view, show dropdown functionality
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center justify-between px-3 py-1 rounded-md text-sm font-semibold w-max ${statusStyles[selectedStatus]}`}
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                <span>{selectedStatus}</span>
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${
                    showDropdown ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showDropdown && (
                <ul
                  className="absolute left-0 mt-1 w-42 bg-white shadow-lg border rounded-md text-sm z-10"
                  role="menu"
                >
                  {[
                    "Approved",
                    "Rejected",
                    "Success",
                    "UserApprovalPending",
                    "Processing",
                  ].map((statusOption) => (
                    <li
                      key={statusOption}
                      onClick={() => handleStatusChange(statusOption)}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        statusOption === selectedStatus
                          ? "bg-gray-50 font-medium"
                          : ""
                      }`}
                      role="menuitem"
                    >
                      {statusOption}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="font-semibold">{totalWeight} g</div>
        <div className="font-semibold">
          AED {typeof amount === "number" ? amount.toLocaleString() : amount}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={()=>handleViewProfile(customer.id)} className="px-6 py-2 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            View
          </button>
          {!dashboard && (
            <button
              onClick={() =>
                downloadSingleTransactionPDF(transaction, productsToDisplay)
              }
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
              {!dashboard && (
                <div className="text-center w-[200px]">Actions</div>
              )}
            </div>

            {productsToDisplay.length > 0 ? (
              productsToDisplay.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center px-4 py-5 border-b border-solid border-b-zinc-100"
                >
                  <div className="hidden md:flex items-center w-full">
                    <div className="pl-7 text-sm text-center text-black w-[150px]">
                      <div className="flex justify-center items-center ml-12 bg-white h-[68px] shadow-[0_1px_2px_rgba(0,0,0,0.09)] w-[53px]">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt="Gold bar"
                            className="w-10 h-[62px]"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="text-sm text-center text-black w-[250px]">
                      {product.name}
                    </div>
                    <div className="text-sm text-center text-black w-[180px]">
                      {product.weight}
                    </div>
                    <div className="text-sm text-center text-black w-[180px]">
                      {product.purity}
                    </div>
                    <div className="text-sm text-center text-black w-[180px]">
                      {product.quantity}
                    </div>
                    <div className="text-sm text-center text-black w-[180px]">
                      {product.amount}
                    </div>
                    {!dashboard && (
                      <div className="text-sm text-center text-black w-[200px]">
                        {product.status === "Approval Pending" ? (
                          <button
                            onClick={() => handleApproval(product)}
                            className="bg-blue-100 text-[#0790E6] px-4 py-2 rounded-md shadow-lg hover:bg-blue-200 transition-colors"
                          >
                            Approval Pending
                          </button>
                        ) : (
                          <button
                            className={`px-4 py-2 rounded-md shadow-lg ${
                              statusStyles[product.status] ||
                              "bg-orange-100 text-[#FF8C00]"
                            }`}
                          >
                            {product.status}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No products found for this transaction
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {modals.remark && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reject Order</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows="4"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter reason for rejection"
              ></textarea>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded"
                onClick={() => {
                  setModals((prev) => ({ ...prev, remark: false }));
                  setRemark("");
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleRemarkSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Modal */}
      {modals.quantity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Update Quantity</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded p-2"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded"
                onClick={() => {
                  setModals((prev) => ({ ...prev, quantity: false }));
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#32B4DB] to-[#156AEF] text-white rounded"
                onClick={handleQuantitySubmit}
              >
                Submit
              </button>
            </div>
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
  onRowsPerPageChange,
  totalItems,
}) => {
  const rowsPerPageOptions = [5, 10, 20, 50];

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(startItem + rowsPerPage - 1, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-100 gap-4 rounded-b-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="border rounded-md px-2 py-1 bg-white"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {startItem}-{endItem} of {totalItems}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
            aria-label="Previous page"
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
  className = "",
  dashboard = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const adminId =
    typeof window !== "undefined" ? localStorage.getItem("adminId") : null;

  // Optimized API calls with useCallback
  const fetchOrders = useCallback(async () => {
    if (!adminId) {
      setError("Admin ID not found. Please log in again.");
      return;
    }
    setLoading(true);
    const loadingToastId = toast.loading("Fetching orders...");
    try {
      const response = await axiosInstance.get(`/booking/${adminId}`);
      const newOrders = response.data.orderDetails;
      console.log("API Response:", newOrders);
      // Create an array to store all products from all transactions
      let allProducts = [];
      // Transform the API response to match our table structure
      const transformedOrders = newOrders.map((order) => {
        // Extract products from each order
        if (order.items && Array.isArray(order.items)) {
          // Process each product item in the order
          const orderProducts = order.items.map((item) => {
            // Handle the new product structure where product details are in a sub-object
            const productData = item.product || {};

            return {
              image:
                productData.images && productData.images.length > 0
                  ? productData.images[0].url
                  : "",
              name: productData.title || "Gold Product",
              weight: productData.weight ? `${productData.weight}` : "N/A",
              purity: productData.purity || "9999",
              quantity: item.quantity || "1",
              amount: item.fixedPrice || productData.price || "0",
              productId:
                productData.id ||
                item._id ||
                `product-${Math.random().toString(36).substr(2, 9)}`,
              status: item.itemStatus || "N/A",
            };
          });

          // Add these products to our global products array
          allProducts = [...allProducts, ...orderProducts];
        }
        // Return the transformed order
        return {
          orderId: order._id,
          id:
            order.transactionId ||
            order._id ||
            `tx-${Math.random().toString(36).substr(2, 9)}`,
          date: order.orderDate
            ? new Date(order.orderDate).toLocaleDateString()
            : "N/A",
          paymentMethod: order.paymentMethod || "N/A",
          status: order.orderStatus || "N/A",
          amount: order.totalPrice || 0,
          totalWeight:order.totalWeight || 0,
          customer: {
            id:order.customer?.id,
            name: order.customer?.name || "N/A",
            email: order.customer?.email || "N/A",
          },
          // Store products specific to this order, using the new structure
          products:
            order.items && Array.isArray(order.items)
              ? order.items.map((item) => {
                  const productData = item.product || {};

                  return {
                    image:
                      productData.images && productData.images.length > 0
                        ? productData.images[0].url
                        : "",
                    name: productData.title || "Gold Product",
                    weight: productData.weight
                      ? `${productData.weight}`
                      : "N/A",
                    purity: productData.purity || "9999",
                    quantity: item.quantity || "1",
                    amount: item.fixedPrice || productData.price || "0",
                    itemId: item._id,
                    productId:
                      productData.id ||
                      item._id ||
                      `product-${Math.random().toString(36).substr(2, 9)}`,
                    status: item.itemStatus || "N/A",
                    type: productData.type || "GOLD",
                    sku: productData.sku || "N/A",
                  };
                })
              : [],
        };
      });
      // Update global products array - deduplicate by productId if needed
      const uniqueProducts = [];
      const productIds = new Set();

      allProducts.forEach((product) => {
        if (!productIds.has(product.productId)) {
          productIds.add(product.productId);
          uniqueProducts.push(product);
        }
      });

      // Update the products array with all found products
      setProducts(uniqueProducts);
      //   TransactionPDF(uniqueProducts);

      // Set the transformed orders to state
      setOrders(transformedOrders);

      toast.success("Orders loaded successfully", {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders", { id: loadingToastId });
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredTransactions = useMemo(() => {
    return orders.filter((transaction) => {
      const isTimeMatch =
        timeFilter === "This Week" ||
        (timeFilter === "This Month" &&
          new Date(transaction.date).getMonth() === new Date().getMonth()) ||
        (timeFilter === "This Year" &&
          new Date(transaction.date).getFullYear() ===
            new Date().getFullYear());

      const isStatusMatch =
        !statusFilter ||
        transaction.status.toLowerCase() === statusFilter.toLowerCase() ||
        statusFilter === "All Orders";

      const isSearchMatch =
        !searchQuery ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.paymentMethod
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.pricingOption
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery) ||
        transaction.customer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.customer?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return isTimeMatch && isStatusMatch && isSearchMatch;
    });
  }, [orders, timeFilter, statusFilter, searchQuery]);

  const sortedTransactions = useMemo(() => {
    const sortableTransactions = [...filteredTransactions];
    sortableTransactions.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableTransactions;
  }, [filteredTransactions, sortConfig]);

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Export all transactions to PDF
  const handleExportAllToPDF = async () => {
    try {
      // Create an array of all transaction pages
      const pages = filteredTransactions.map((transaction) => (
        <Page key={transaction.id} size="A4" wrap={false}>
          <TransactionPDF transaction={transaction} products={products} />
        </Page>
      ));

      // Create the PDF document
      const doc = <Document>{pages}</Document>;

      // Generate the blob and trigger download
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "All_Transactions.pdf";
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
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <TransactionHeader
        sortConfig={sortConfig}
        onSort={handleSort}
        className={className}
      />

      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading orders...</div>
      ) : paginatedTransactions.length > 0 ? (
        paginatedTransactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            expanded={expandedRowId === transaction.id}
            onToggleExpand={() =>
              setExpandedRowId((prev) =>
                prev === transaction.id ? null : transaction.id
              )
            }
            dashboard={dashboard}
          />
        ))
      ) : (
        <div className="p-6 text-center text-gray-500">
          No transactions found
        </div>
      )}

      {/* Updated PaginationControls with totalItems */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages || 1}
        totalItems={totalItems} // Pass total items count
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
};

TransactionTable.displayName = "TransactionTable";

export default TransactionTable;
