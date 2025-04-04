import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
  Checkbox,
  Button,
  Card,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Modal,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  AddCircle as AddCircleIcon,
  LocalOffer as LocalOfferIcon,
  Percent as PercentIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axiosInstance from "../../axios/axios";

// Styled Components
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(to right, #32B4DB, #156AEF)",
  "& .MuiTableCell-root": {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  borderRadius: 16,
  boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ProductImage = styled("img")({
  width: 45,
  height: 45,
  objectFit: "cover",
  borderRadius: 12,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const ModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: "90%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
  padding: theme.spacing(4),
}));

const ProductModalImage = styled("img")({
  width: 120,
  height: 120,
  objectFit: "cover",
  borderRadius: 12,
  marginBottom: 16,
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
});

export default function ProductManagement() {
  // State Management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Charge States
  const [markingChargeType, setMarkingChargeType] = useState("");
  const [markingChargeValue, setMarkingChargeValue] = useState("");
  const [premiumDiscountType, setPremiumDiscountType] = useState("");
  const [premiumDiscountValue, setPremiumDiscountValue] = useState("");

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productMarkingChargeType, setProductMarkingChargeType] = useState("");
  const [productMarkingChargeValue, setProductMarkingChargeValue] =
    useState("");
  const [productPremiumDiscountType, setProductPremiumDiscountType] =
    useState("");
  const [productPremiumDiscountValue, setProductPremiumDiscountValue] =
    useState("");

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "N/A";
  const userId = searchParams.get("userId") || "Unknown";

  // Notification State
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination Configuration
  const productsPerPage = 6;

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const adminId =
        localStorage.getItem("adminId") || "67c1a8978399ea3181f5cad9";
      const response = await axiosInstance.get(`/get-all-product/${adminId}`);

      if (response.data.success) {
        const productsWithSelection = response.data.data.map((product) => ({
          ...product,
          isSelected: false,
        }));
        setProducts(productsWithSelection);
        setFilteredProducts(productsWithSelection);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      handleNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Modal Handlers
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setProductMarkingChargeType(product.markingChargeType || "markup");
    setProductMarkingChargeValue(product.markingChargeValue || "");
    setProductPremiumDiscountType(product.premiumDiscountType || "premium");
    setProductPremiumDiscountValue(product.premiumDiscountValue || "");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Save Product Charges
  const handleSaveProductCharges = async () => {
    console.log(selectedProduct._id)
    try {
      // Validation (keep your existing checks)
      if (!productMarkingChargeType || !productPremiumDiscountType) {
        handleNotification("Please select Premium/Discount types", "error");
        return;
      }

      const response = await axiosInstance.patch(
        `/products/${categoryId}`,
        {
          productId: selectedProduct._id,
          markingCharge: parseFloat(productMarkingChargeValue) || 0,
          pricingType: productPremiumDiscountType,
          value: parseFloat(productPremiumDiscountValue) || 0,
          isActive: true,
        },
        {headers: {
          "Content-Type": "application/json" // Ensure this is present
        }}
      );

      // Rest of your success handling
      if (response.data.success) {
        fetchProducts();
        handleCloseModal();
        handleNotification("Product charges updated successfully");
      }
    } catch (error) {
      handleNotification(error.message, "error");
    }
  };

  // Notification Handler
  const handleNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close Notification
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Search Handler
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(1);

    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(value) ||
        product.price.toString().includes(value) ||
        product.weight.toString().includes(value)
    );

    setFilteredProducts(filtered);
  };

  // Pagination Handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Product Selection Handler
  const handleProductSelect = (productId) => {
    setFilteredProducts((prev) =>
      prev.map((product) =>
        product._id === productId
          ? { ...product, isSelected: !product.isSelected }
          : product
      )
    );

    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((id) => id === productId);
      return existingIndex > -1
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });
  };

  // Select All Products
  const handleSelectAll = () => {
    const paginatedProductIds = paginatedProducts.map((p) => p._id);
    const allSelected = selectedProducts.length === paginatedProductIds.length;

    setFilteredProducts((prev) =>
      prev.map((product) => ({
        ...product,
        isSelected: !allSelected && paginatedProductIds.includes(product._id),
      }))
    );

    setSelectedProducts(allSelected ? [] : paginatedProductIds);
  };

  // Apply Comprehensive Charges
  const handleApplyCharges = async () => {
    // Validation
    if (!markingChargeType || !premiumDiscountType) {
      handleNotification(
        "Please select both Marking Charge and Premium/Discount types",
        "error"
      );
      return;
    }

    try {
      // Prepare products to update
      const productsToUpdate = selectedProducts.map((productId) => {
        const product = filteredProducts.find((p) => p._id === productId);
        return {
          productId,
          markingChargeType,
          markingChargeValue: parseFloat(markingChargeValue) || 0,
          premiumDiscountType,
          premiumDiscountValue: parseFloat(premiumDiscountValue) || 0,
        };
      });

      // Endpoint to update multiple products
      const response = await axiosInstance.put("/update-multiple-products", {
        products: productsToUpdate,
      });

      if (response.data.success) {
        // Refresh products
        fetchProducts();

        // Reset selection and charges
        setSelectedProducts([]);
        setMarkingChargeType("");
        setMarkingChargeValue("");
        setPremiumDiscountType("");
        setPremiumDiscountValue("");

        // Show success notification
        handleNotification("Charges applied successfully");
      }
    } catch (error) {
      handleNotification(error.message, "error");
    }
  };

  // Delete Selected Products
  const handleDeleteSelected = async () => {
    try {
      const response = await axiosInstance.delete("/delete-multiple-products", {
        data: { productIds: selectedProducts },
      });

      if (response.data.success) {
        fetchProducts();
        setSelectedProducts([]);
        handleNotification("Selected products deleted successfully");
      }
    } catch (error) {
      handleNotification(error.message, "error");
    }
  };

  // Lifecycle
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Pagination Logic
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  // Render Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <div className="px-10 h-[100vh]">
      <Box p={4}>
        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Page Title */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "#000",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
            fontSize: "25px",
          }}
        >
          Spotrate Management
        </Typography>

        {/* Search Box */}
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              height: "45px",
              borderRadius: "30px",
              border: "2px solid #2196f3",
              backgroundColor: "#fff",
              transition: "border-color 0.3s, box-shadow 0.3s",
              paddingLeft: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", // Hide default border
              },
            },
          }}
        />

        {/* Charges Application Section */}
        {/* {selectedProducts.length > 0 && (
          <GradientCard sx={{ mb: 3 }}>
            <Box
              p={2}
              display="flex"
              gap={2}
              flexWrap="wrap"
              alignItems="center"
            >
              
              <Box display="flex" alignItems="center" gap={2}>
                <LocalOfferIcon color="primary" />
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <InputLabel>Marking Charge Type</InputLabel>
                  <Select
                    value={markingChargeType}
                    onChange={(e) => setMarkingChargeType(e.target.value)}
                    label="Marking Charge Type"
                  >
                    <MenuItem value="markup">Markup</MenuItem>
                    <MenuItem value="commission">Commission</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Marking Charge"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={markingChargeValue}
                  onChange={(e) => setMarkingChargeValue(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  sx={{ width: 120 }}
                />
              </Box>

              
              <Box display="flex" alignItems="center" gap={2}>
                <PercentIcon color="secondary" />
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <InputLabel>Premium/Discount Type</InputLabel>
                  <Select
                    value={premiumDiscountType}
                    onChange={(e) => setPremiumDiscountType(e.target.value)}
                    label="Premium/Discount Type"
                  >
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="discount">Discount</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Premium/Discount"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={premiumDiscountValue}
                  onChange={(e) => setPremiumDiscountValue(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  sx={{ width: 120 }}
                />
              </Box>

              
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyCharges}
                  startIcon={<AddCircleIcon />}
                  sx={{
                    height: 40,
                    background: "linear-gradient(to right, #4338ca, #3730a3)",
                  }}
                >
                  Apply Charges
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteSelected}
                  startIcon={<DeleteIcon />}
                  sx={{
                    height: 40,
                    background: "linear-gradient(to right, #ef4444, #dc2626)",
                  }}
                >
                  Delete Selected
                </Button>
              </Box>
            </Box>
          </GradientCard>
        )} */}

        {/* Product Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <StyledTableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < paginatedProducts.length
                    }
                    checked={
                      paginatedProducts.length > 0 &&
                      selectedProducts.length === paginatedProducts.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Weight</TableCell>
                <TableCell align="right">Purity</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow
                  key={product._id}
                  hover
                  selected={product.isSelected}
                  onClick={() => handleOpenModal(product)}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                  }}
                >
                  {/* <TableCell
                    padding="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={product.isSelected}
                      onChange={() => handleProductSelect(product._id)}
                    />
                  </TableCell> */}
                  <TableCell>
                    <ProductImage
                      src={product.images[0]?.url || "/placeholder-image.png"}
                      alt={product.title}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.title}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight="bold"
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {product.weight} g
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color:
                          product.purity >= 90
                            ? "success.main"
                            : "text.secondary",
                      }}
                    >
                      {product.purity}K
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="subtitle1"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(product);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredProducts.length / productsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>

        {/* Product Detail Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="product-modal-title"
        >
          <ModalContent>
            {selectedProduct && (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    id="product-modal-title"
                    variant="h5"
                    component="h2"
                    fontWeight="bold"
                  >
                    Product Details
                  </Typography>
                  <IconButton onClick={handleCloseModal} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box display="flex" flexDirection="row" gap={3} mb={3}>
                  <ProductModalImage
                    src={
                      selectedProduct.images[0]?.url || "/placeholder-image.png"
                    }
                    alt={selectedProduct.title}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {selectedProduct.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Price:{" "}
                      <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Weight:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {selectedProduct.weight} g
                      </span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Purity:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            selectedProduct.purity >= 90
                              ? "#2e7d32"
                              : "inherit",
                        }}
                      >
                        {selectedProduct.purity}K
                      </span>
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Set Charge Values
                </Typography>

                <Grid container spacing={3}>
                  {/* Marking Charge */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Marking Charge"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={productMarkingChargeValue}
                      onChange={(e) =>
                        setProductMarkingChargeValue(e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                        },
                        "& input[type=number]": {
                          "-moz-appearance": "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      }}
                    />
                  </Grid>

                  {/* Premium/Discount */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Premium/Discount Type</InputLabel>
                      <Select
                        value={productPremiumDiscountType}
                        onChange={(e) =>
                          setProductPremiumDiscountType(e.target.value)
                        }
                        label="Premium/Discount Type"
                      >
                        <MenuItem value="premium">Premium</MenuItem>
                        <MenuItem value="discount">Discount</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Premium/Discount Value"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={productPremiumDiscountValue}
                      onChange={(e) =>
                        setProductPremiumDiscountValue(e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                        },
                        "& input[type=number]": {
                          "-moz-appearance": "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCloseModal}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProductCharges}
                    sx={{
                      background: "linear-gradient(to right, #4338ca, #3730a3)",
                    }}
                  >
                    Apply Charges
                  </Button>
                </Box>
              </>
            )}
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
}
