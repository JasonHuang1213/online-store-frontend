import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";

import Header from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import ItemList from "../components/body/ItemList";
import { RootState } from "../redux/Types";
import { userLogin } from "../redux/Action";

export default function Home() {
  const [items, setItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [hasError, setHasError] = useState<any>(false);

  const [searchText, setSearchText] = useState<String>("");
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const dispatch = useDispatch();

  // Warning: Can't perform a React state update on an unmounted component.
  useEffect(() => {
    axios("https://fierce-spring-store-backend.herokuapp.com/api/products")
      .then((res) => {
        setHasError(false);
        setIsLoading(false);
        setItems(res.data);
      })
      .catch((error) => {
        setHasError(true);
        setIsLoading(false);
        console.log(error);
      });

    // clean up states
    return () => {
      setHasError(false);
      setIsLoading(true);
      setItems([]);
    };
  }, []);

  useEffect(() => {
    // If user is logged in and jwt is stored in cookie, get the cart items
    // and set email to be the user email in redux
    const jwt = Cookies.get("jwt");
    if (jwt) {
      axios("https://fierce-spring-store-backend.herokuapp.com/api/user/me", {
        headers: { "x-auth-token": jwt },
      })
        .then((res) => {
          setCartItems(res.data.cart);
          setCartItemsQuantity(cartItems.length);
          dispatch(userLogin(res.data.email));
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn, dispatch, cartItems]);

  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <Header
          setSearchText={setSearchText}
          cartItemsQuantity={cartItemsQuantity}
        />
        <ItemList
          searchText={searchText}
          items={items}
          isLoading={isLoading}
          hasError={hasError}
          setCartItems={setCartItems}
          cartItems={cartItems}
        />
      </div>
      <Footer />
    </>
  );
}
