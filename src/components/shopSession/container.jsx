import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "../../axios/axios";
import toast, { Toaster } from 'react-hot-toast';

export default function ProductManagement() {
  // Refs for form inputs
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const weightRef = useRef(null);
  const skuRef = useRef(null);
  const purityRef = useRef(null);
  const imageInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const stockRef = useRef(null);

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Image state
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const MAX_IMAGES = 5;

  // Custom toast styles
  const toastStyles = {
    success: {
      style: {
        border: '2px solid #10B981',
        padding: '16px',
        color: '#10B981',
        backgroundColor: '#ECFDF5',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '12px',
      },
      icon: <CheckCircle className="text-green-500" />,
    },
    error: {
      style: {
        border: '2px solid #EF4444',
        padding: '16px',
        color: '#EF4444',
        backgroundColor: '#FEE2E2',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '12px',
      },
      icon: <AlertCircle className="text-red-500" />,
    },
  };

  // Enhanced notification methods
  const showSuccessToast = (message) => {
    toast.success(message, {
      style: toastStyles.success.style,
      icon: toastStyles.success.icon,
      duration: 3000,
      position: 'top-right',
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      style: toastStyles.error.style,
      icon: toastStyles.error.icon,
      duration: 3000,
      position: 'top-right',
    });
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const adminId =
        localStorage.getItem("adminId") || "67c1a8978399ea3181f5cad9";
      const response = await axios.get(`/get-all-product/${adminId}`);

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        showErrorToast("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showErrorToast("Unable to retrieve products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset form and refs
  const resetForm = useCallback(() => {
    // Reset refs
    const refs = [
      titleRef,
      descriptionRef,
      priceRef,
      weightRef,
      skuRef,
      purityRef,
      imageInputRef,
      stockRef,
    ];
    refs.forEach((ref) => {
      if (ref.current) {
        if (ref.current.type === "select-one") {
          ref.current.selectedIndex = 0;
        } else {
          ref.current.value = "";
        }
      }
    });

    // Reset images
    setExistingImages([]);
    setNewImages([]);
  }, []);

  // Enhanced validation function
  const validateForm = useCallback(() => {
    // Title validation
    if (!titleRef.current?.value.trim()) {
      return { 
        isValid: false, 
        errorMessage: "Product title is required" 
      };
    }

    // Image validation
    if (existingImages.length === 0 && newImages.length === 0) {
      return { 
        isValid: false, 
        errorMessage: "At least one product image is required" 
      };
    }

    // Price validation
    const price = priceRef.current?.value;
    if (!price || isNaN(price) || Number(price) <= 0) {
      return { 
        isValid: false, 
        errorMessage: "Please enter a valid price" 
      };
    }

    // Weight validation
    const weight = weightRef.current?.value;
    if (!weight || isNaN(weight) || Number(weight) <= 0) {
      return { 
        isValid: false, 
        errorMessage: "Please enter a valid weight" 
      };
    }

    // SKU validation
    if (!skuRef.current?.value.trim()) {
      return { 
        isValid: false, 
        errorMessage: "SKU is required" 
      };
    }

    return { isValid: true };
  }, [existingImages, newImages]);

  // Image upload handler
  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const totalImagesCount = existingImages.length + newImages.length;
      const remainingSlots = MAX_IMAGES - totalImagesCount;

      if (files.length > remainingSlots) {
        showErrorToast(
          `You can only upload ${MAX_IMAGES} images in total. ${remainingSlots} slots remaining.`
        );
        const selectedFiles = files.slice(0, remainingSlots);
        setNewImages((prev) => [...prev, ...selectedFiles]);
      } else {
        setNewImages((prev) => [...prev, ...files]);
      }
    },
    [existingImages, newImages, showErrorToast]
  );

  // Remove new image
  const removeNewImage = useCallback((index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Remove existing image
  const removeExistingImage = useCallback((index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Prepare form data for submission
  const prepareFormData = useCallback(() => {
    const formData = new FormData();

    // Add form field values from refs
    const fields = [
      { ref: titleRef, name: "title" },
      { ref: descriptionRef, name: "description" },
      { ref: priceRef, name: "price" },
      { ref: weightRef, name: "weight" },
      { ref: skuRef, name: "sku" },
      { ref: purityRef, name: "purity" },
    ];

    fields.forEach(({ ref, name }) => {
      if (ref.current) {
        formData.append(name, ref.current.value);
      }
    });

    // Add stock value
    formData.append("stock", stockRef.current?.value === "true");

    // Add images
    newImages.forEach((img) => {
      formData.append("image", img);
    });

    return formData;
  }, [newImages]);

  // Add product handler
  const handleAddProduct = useCallback(async () => {
    const loadingToast = toast.loading('Adding product...', {
      style: {
        border: '2px solid #3B82F6',
        padding: '16px',
        color: '#3B82F6',
        backgroundColor: '#EFF6FF',
        borderRadius: '12px',
      },
    });

    try {
      const formData = prepareFormData();

      const response = await axios.post(
        "/add-products?adminId=67c1a8978399ea3181f5cad9",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(loadingToast);

      if (response.data.success) {
        showSuccessToast("Product added successfully!");
        setIsModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        showErrorToast("Failed to add product");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error adding product:", error);
      showErrorToast("An error occurred while adding the product");
    }
  }, [prepareFormData, resetForm, fetchProducts]);

  // Update product handler
  const handleUpdateProduct = useCallback(async () => {
    const loadingToast = toast.loading('Updating product...', {
      style: {
        border: '2px solid #3B82F6',
        padding: '16px',
        color: '#3B82F6',
        backgroundColor: '#EFF6FF',
        borderRadius: '12px',
      },
    });

    try {
      if (!currentProduct?._id) {
        showErrorToast("No product selected for update");
        return;
      }

      const formData = prepareFormData();

      // Add existing image IDs to retain
      const existingImageIds = existingImages.map((img) => img._id || img.id);
      formData.append("existingImageIds", JSON.stringify(existingImageIds));

      const response = await axios.put(
        `/edit-products/${currentProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(loadingToast);

      if (response.data.success) {
        showSuccessToast("Product updated successfully!");
        setIsModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        showErrorToast("Failed to update product");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error updating product:", error);
      showErrorToast("An error occurred while updating the product");
    }
  }, [
    currentProduct,
    existingImages,
    prepareFormData,
    resetForm,
    fetchProducts,
  ]);

  // Delete product handler
  const handleDeleteProduct = useCallback(
    async (productId) => {
      // Custom confirmation toast
      const confirmToast = toast((t) => (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-yellow-500" />
            <span className="font-bold">Confirm Deletion</span>
          </div>
          <p className="text-sm">Are you sure you want to delete this product?</p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDeletion(productId);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        style: {
          border: '2px solid #FBBF24',
          padding: '16px',
          backgroundColor: '#FEF3C7',
          borderRadius: '12px',
        },
        duration: Infinity,
      });

      // Actual deletion method
      const performDeletion = async (id) => {
        const loadingToast = toast.loading('Deleting product...', {
          style: {
            border: '2px solid #3B82F6',
            padding: '16px',
            color: '#3B82F6',
            backgroundColor: '#EFF6FF',
            borderRadius: '12px',
          },
        });

        try {
          const response = await axios.delete(`/delete-products/${id}`);

          toast.dismiss(loadingToast);

          if (response.data.success) {
            showSuccessToast("Product deleted successfully!");
            fetchProducts();
          } else {
            showErrorToast("Failed to delete product");
          }
        } catch (error) {
          toast.dismiss(loadingToast);
          console.error("Error deleting product:", error);
          showErrorToast("An error occurred while deleting the product");
        }
      };
    },
    [fetchProducts]
  );

  // Populate form for editing
  const populateFormForEditing = useCallback((product) => {
    // Set refs with product data
    if (titleRef.current) titleRef.current.value = product.title || "";
    if (descriptionRef.current)
      descriptionRef.current.value = product.description || "";
    if (priceRef.current) priceRef.current.value = product.price || "";
    if (weightRef.current) weightRef.current.value = product.weight || "";
    if (skuRef.current) skuRef.current.value = product.sku || "";
    if (purityRef.current) purityRef.current.value = product.purity || "";
    if (stockRef.current) stockRef.current.value = String(product.stock);

    // Set existing images
    setExistingImages(product.images || []);

    // Reset new images
    setNewImages([]);
  }, []);

  // Search handler
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  // Memoized filtered and paginated products
  const { filteredProducts, currentItems, totalPages } = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = filtered.slice(indexOfFirstItem, indexOfLastItem);

    return {
      filteredProducts: filtered,
      currentItems: current,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [products, searchTerm, currentPage, itemsPerPage]);

  // Total image count helper
  const getTotalImageCount = () => existingImages.length + newImages.length;

  // Product Modal Component
  const ProductModal = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const validationResult = validateForm();
      
      if (validationResult.isValid) {
        isEditMode ? handleUpdateProduct() : handleAddProduct();
      } else {
        showErrorToast(validationResult.errorMessage);
      }
    };

    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
          isModalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h2>
            </div>

            <div className="p-6">
              {/* Image Upload Section */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">📷</span>
                    <h3 className="text-lg font-semibold">Product Images</h3>
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                    {getTotalImageCount()}/{MAX_IMAGES} images
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                  {/* Existing Images */}
                  {existingImages.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative group aspect-square"
                    >
                      <img
                        src={img.url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="p-2 bg-red-500 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New Images */}
                  {newImages.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group aspect-square"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-blue-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="p-2 bg-red-500 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {getTotalImageCount() < MAX_IMAGES && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Images</span>
                      <span className="text-xs text-gray-400 mt-1">
                        Max {MAX_IMAGES}
                      </span>
                    </label>
                  )}
                </div>

                {getTotalImageCount() === 0 && (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                    <span>⚠️</span>
                    <div>
                      <p className="font-medium">No images uploaded</p>
                      <p className="text-sm">
                        Please upload at least one product image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title
                  </label>
                  <input
                    ref={titleRef}
                    type="text"
                    placeholder="Enter product title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    ref={descriptionRef}
                    type="text"
                    placeholder="Enter product description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    ref={priceRef}
                    type="number"
                    placeholder="Enter price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (grams)
                  </label>
                  <input
                    ref={weightRef}
                    type="number"
                    placeholder="Enter weight"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purity
                  </label>
                  <select
                    ref={purityRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select purity</option>
                    <option value="24">24K</option>
                    <option value="22">22K</option>
                    <option value="18">18K</option>
                    <option value="14">14K</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    ref={skuRef}
                    type="text"
                    placeholder="Enter SKU"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <select
                    ref={stockRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={true}>In Stock</option>
                    <option value={false}>Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  getTotalImageCount() === 0
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={getTotalImageCount() === 0}
              >
                {isEditMode ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] p-6 rounded-lg shadow-sm min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setIsEditMode(false);
            setCurrentProduct(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>

        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search SKU or title"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Weight (gms)</th>
                <th className="py-3 px-4 text-left">Purity</th>
                <th className="py-3 px-4 text-left">SKU</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                    <div className="mt-2 text-gray-500">
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-gray-200 rounded">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0].url
                              : "/placeholder.png"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{product.title}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.description}
                    </td>
                    <td className="py-3 px-4">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{product.weight}</td>
                    <td className="py-3 px-4">{product.purity}</td>
                    <td className="py-3 px-4">{product.sku}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.stock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditMode(true);
                            setCurrentProduct(product);
                            populateFormForEditing(product);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}