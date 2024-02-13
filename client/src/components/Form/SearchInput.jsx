import React from "react";
import { useSearch } from "../../context/search.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SEARCH_PRODUCT_API } from "../../utils/constant.js";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${SEARCH_PRODUCT_API}${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        className="d-flex search-form me-5"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2 rounded-3"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="primaryButton rounded-3" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
