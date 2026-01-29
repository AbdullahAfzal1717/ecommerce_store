import React from "react";
import { Box, Tabs, Tab, Chip, Stack } from "@mui/material";

const FilterSection = ({
  categories,
  subcategories,
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
  onSubCategoryChange,
}) => {
  const activeSubCategories = subcategories.filter(
    (sub) => sub.category?._id === selectedCategory
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Tabs
        value={selectedCategory}
        onChange={(e, v) => onCategoryChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          "& .Mui-selected": { color: "black !important", fontWeight: "bold" },
        }}
      >
        <Tab label="All Tech" value="all" />
        {categories.map((cat) => (
          <Tab key={cat._id} label={cat.title.toUpperCase()} value={cat._id} />
        ))}
      </Tabs>

      {selectedCategory !== "all" && activeSubCategories.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
          <Chip
            label="All Types"
            onClick={() => onSubCategoryChange("all")}
            variant={selectedSubCategory === "all" ? "filled" : "outlined"}
            sx={{
              bgcolor: selectedSubCategory === "all" ? "black" : "transparent",
              color: selectedSubCategory === "all" ? "white" : "inherit",
            }}
          />
          {activeSubCategories.map((sub) => (
            <Chip
              key={sub._id}
              label={sub.title}
              onClick={() => onSubCategoryChange(sub._id)}
              variant={selectedSubCategory === sub._id ? "filled" : "outlined"}
              sx={{
                bgcolor:
                  selectedSubCategory === sub._id ? "black" : "transparent",
                color: selectedSubCategory === sub._id ? "white" : "inherit",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default FilterSection;
