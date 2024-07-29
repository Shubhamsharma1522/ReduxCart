import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import classes from "./Products.module.css";
import ProductsList from "./ProductsList";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const debounce = (func, delay) => {
  let debounceTimer;
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

const Products = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    loadedData: [],
    currentPage: 1,
    productPerPage: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("https://dummyjson.com/products");
      setState((prevState) => ({ ...prevState, loadedData: data.products }));
      setFilteredData(data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = useCallback(
    debounce((term) => {
      const filtered = state.loadedData.filter((product) =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }, 500),
    [state.loadedData]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const indexOfLastProduct = state.currentPage * state.productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - state.productPerPage;
  const currentProducts = filteredData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const setCurrentPage = (pageNumber) => {
    setState((prevState) => ({ ...prevState, currentPage: pageNumber }));
  };

  const hasNoProducts = filteredData.length === 0 && searchTerm.length > 0;

  return (
    <>
      <div className={classes.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.search}
        />
      </div>
      <div className={classes.productList}>
        {hasNoProducts ? (
          <p className={classes.noProducts}>No products found</p>
        ) : (
          currentProducts.map((product) => (
            <ProductsList key={product.id} item={product} />
          ))
        )}
      </div>
      {!hasNoProducts && (
        <Pagination
          productsPerPage={state.productPerPage}
          totalProducts={filteredData.length}
          currentPage={state.currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};

export default Products;
