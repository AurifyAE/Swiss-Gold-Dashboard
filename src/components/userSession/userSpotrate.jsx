import React, { useState, useEffect, useCallback } from 'react';
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
  InputLabel
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Edit as EditIcon, 
  AddCircle as AddCircleIcon,
  LocalOffer as LocalOfferIcon,
  Percent as PercentIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from '../../axios/axios';

// Styled Components
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(to right, #3B82F6, #2563EB)',
  '& .MuiTableCell-root': {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  borderRadius: 16,
  boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const ProductImage = styled('img')({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  }
});

const SearchBox = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
  }
}));

export default function ProductManagement() {
  // State Management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Charge States
  const [markingChargeType, setMarkingChargeType] = useState('');
  const [markingChargeValue, setMarkingChargeValue] = useState('');
  const [premiumDiscountType, setPremiumDiscountType] = useState('');
  const [premiumDiscountValue, setPremiumDiscountValue] = useState('');

  // Notification State
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Pagination Configuration
  const productsPerPage = 6;

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const adminId = localStorage.getItem("adminId") || "67c1a8978399ea3181f5cad9";
      const response = await axios.get(`/get-all-product/${adminId}`);
      
      if (response.data.success) {
        const productsWithSelection = response.data.data.map(product => ({
          ...product,
          isSelected: false,
        }));
        setProducts(productsWithSelection);
        setFilteredProducts(productsWithSelection);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      handleNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Notification Handler
  const handleNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Close Notification
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Search Handler
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(1);

    const filtered = products.filter(product => 
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
    setFilteredProducts(prev => 
      prev.map(product => 
        product._id === productId 
          ? { ...product, isSelected: !product.isSelected }
          : product
      )
    );

    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(id => id === productId);
      return existingIndex > -1 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
    });
  };

  // Select All Products
  const handleSelectAll = () => {
    const paginatedProductIds = paginatedProducts.map(p => p._id);
    const allSelected = selectedProducts.length === paginatedProductIds.length;
    
    setFilteredProducts(prev => 
      prev.map(product => ({ 
        ...product, 
        isSelected: !allSelected && paginatedProductIds.includes(product._id)
      }))
    );

    setSelectedProducts(allSelected ? [] : paginatedProductIds);
  };

  // Apply Comprehensive Charges
  const handleApplyCharges = async () => {
    // Validation
    if (!markingChargeType || !premiumDiscountType) {
      handleNotification('Please select both Marking Charge and Premium/Discount types', 'error');
      return;
    }

    try {
      // Prepare products to update
      const productsToUpdate = selectedProducts.map(productId => {
        const product = filteredProducts.find(p => p._id === productId);
        return {
          productId,
          markingChargeType,
          markingChargeValue: parseFloat(markingChargeValue) || 0,
          premiumDiscountType,
          premiumDiscountValue: parseFloat(premiumDiscountValue) || 0
        };
      });

      // Endpoint to update multiple products
      const response = await axios.put('/update-multiple-products', {
        products: productsToUpdate
      });

      if (response.data.success) {
        // Refresh products
        fetchProducts();
        
        // Reset selection and charges
        setSelectedProducts([]);
        setMarkingChargeType('');
        setMarkingChargeValue('');
        setPremiumDiscountType('');
        setPremiumDiscountValue('');

        // Show success notification
        handleNotification('Charges applied successfully');
      }
    } catch (error) {
      handleNotification(error.message, 'error');
    }
  };

  // Delete Selected Products
  const handleDeleteSelected = async () => {
    try {
      const response = await axios.delete('/delete-multiple-products', {
        data: { productIds: selectedProducts }
      });

      if (response.data.success) {
        fetchProducts();
        setSelectedProducts([]);
        handleNotification('Selected products deleted successfully');
      }
    } catch (error) {
      handleNotification(error.message, 'error');
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
    <Box p={4}>
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Page Title */}
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #3B82F6, #2563EB)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}
      >
        Product Management
      </Typography>

      {/* Search Box */}
      <SearchBox 
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          )
        }}
        sx={{ mb: 3 }}
      />

      {/* Charges Application Section */}
      {selectedProducts.length > 0 && (
        <GradientCard sx={{ mb: 3 }}>
          <Box p={2} display="flex" gap={2} flexWrap="wrap" alignItems="center">
            {/* Marking Charge */}
            <Box display="flex" alignItems="center" gap={2}>
              <LocalOfferIcon color="primary" />
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{ width: 120 }}
              />
            </Box>

            {/* Premium/Discount */}
            <Box display="flex" alignItems="center" gap={2}>
              <PercentIcon color="secondary" />
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{ width: 120 }}
              />
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyCharges}
                startIcon={<AddCircleIcon />}
                sx={{ 
                  height: 40,
                  background: 'linear-gradient(to right, #4338ca, #3730a3)',
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
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                }}
              >
                Delete Selected
              </Button>
            </Box>
          </Box>
        </GradientCard>
      )}

      {/* Product Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell padding="checkbox">
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
              </TableCell>
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
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.3s',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={product.isSelected}
                    onChange={() => handleProductSelect(product._id)}
                  />
                </TableCell>
                <TableCell>
                  <ProductImage 
                    src={product.images[0]?.url || '/placeholder-image.png'} 
                    alt={product.title} 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {product.title}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {product.weight} g
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: product.purity >= 90 ? 'success.main' : 'text.secondary'
                    }}
                  >
                    {product.purity}%
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    startIcon={<EditIcon />}
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
      <Box 
        display="flex" 
        justifyContent="center" 
        mt={3}
      >
        <Pagination 
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}