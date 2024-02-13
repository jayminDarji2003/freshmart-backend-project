import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";
import { useCart } from "../context/cart";
import DropIn from "braintree-web-drop-in-react";
import { useNavigate } from "react-router-dom";
import {
  BRAINTREE_PAYMENT_API,
  GET_BRAINTREE_TOKEN_API,
} from "../utils/constant";

const PaymentPage = () => {
  const [auth] = useAuth();
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // get Payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(GET_BRAINTREE_TOKEN_API);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle Payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(BRAINTREE_PAYMENT_API, {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success(" Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3 className="text-center my-2">Make Payment</h3>

      <div className="my-3 d-flex flex-column w-100 justify-content-center align-items-center">
        {!clientToken || !cart?.length ? (
          ""
        ) : (
          <>
            <div className="w-75">
              <DropIn
                options={{
                  authorization: clientToken,
                  paypal: {
                    flow: "vault",
                  },
                }}
                onInstance={(instance) => {
                  setInstance(instance);
                }}
              />
            </div>
            <div className="container text-center mt-3">
              <button
                className="btn btn-danger"
                onClick={handlePayment}
                disabled={loading || !instance || !auth?.user?.address}
              >
                {loading ? "Processing..." : "Make Payment"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;
