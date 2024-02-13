import { useState, useEffect } from "react";
import axios from "axios";
import { GET_CATEGORY_API } from "../../utils/constant";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  // get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get(GET_CATEGORY_API);
      setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  return categories;
}
