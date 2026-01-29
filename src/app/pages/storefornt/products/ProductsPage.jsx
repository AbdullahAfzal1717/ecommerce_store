import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import ProductCard from "@app/_components/storefront/products/ProductCard";
import ProductDetailDrawer from "@app/_components/storefront/products/ProductDetailDrawer";
import { productService } from "@app/_services/product.service";
import { subcategoryService } from "@app/_services/subcategory.service";
import FilterSection from "@app/_components/storefront/products/FilterSection";

const ProductsPage = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    subcategories: [],
  });
  const [filters, setFilters] = useState({
    category: "all",
    subcategory: "all",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes, subRes] = await Promise.all([
          productService.getAll(),
          subcategoryService.getCategoryList(),
          subcategoryService.getAll(),
        ]);
        setData({
          products: prodRes.data,
          categories: catRes.data,
          subcategories: subRes.data,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = data.products.filter((p) => {
    const matchesCat =
      filters.category === "all" ||
      p.subCategory?.category?._id === filters.category;
    const matchesSub =
      filters.subcategory === "all" ||
      p.subCategory?._id === filters.subcategory;
    return matchesCat && matchesSub;
  });

  return (
    <Box sx={{ py: 5 }}>
      <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
        Our Products
      </Typography>

      <FilterSection
        categories={data.categories}
        subcategories={data.subcategories}
        selectedCategory={filters.category}
        selectedSubCategory={filters.subcategory}
        onCategoryChange={(val) =>
          setFilters({ category: val, subcategory: "all" })
        }
        onSubCategoryChange={(val) =>
          setFilters({ ...filters, subcategory: val })
        }
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard
                product={product}
                onOpenDetails={setSelectedProduct}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProductDetailDrawer
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Box>
  );
};

export default ProductsPage;
