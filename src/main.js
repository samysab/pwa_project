import page from "page";
import checkConnectivity from "network-latency";
import {
  getCart,
  getRessource,
  getRessources,
  setCart,
  setRessource,
  setRessources,
} from "./idbHelper";
import { getProducts, getProduct } from "./api/products";
import { fetchCart } from "./api/cart";
import { getAuthState, getUser } from "./firebase";

(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    interval: 3000,
    threshold: 2000,
  });

  let NETWORK_STATE = true;

  document.addEventListener("connection-changed", ({ detail: state }) => {
    NETWORK_STATE = state;
    if (NETWORK_STATE) {
      document.documentElement.style.setProperty("--app-bg-color", "royalblue");
    } else {
      document.documentElement.style.setProperty("--app-bg-color", "#6e6f72");
    }
  });

  const AppHome = main.querySelector("app-home");
  const AppProduct = main.querySelector("app-product");
  const AppCart = main.querySelector("app-cart");
  const AppLogin = main.querySelector("app-login");

  let isUserLogged = getUser();

  getAuthState((user) => {
    isUserLogged = user;

    if (isUserLogged) {
      const queryString = new URLSearchParams(location.search);

      return page(queryString.get("from") || location.pathname);
    }
    page(`/login?from=${location.pathname}`);
  });

  page("*", async (ctx, next) => {
    main.querySelectorAll("[page]").forEach((page) => (page.active = false));

    let cart = {};

    const storedCart = await getCart();

    if (NETWORK_STATE) {
      cart = await fetchCart();
    }

    setCart({
      items: [],
      total: 0,
      updated: 0,
      ...cart,
      ...storedCart,
    });

    if (!isUserLogged && ctx.pathname != "/login") {
      return;
    }

    skeleton.removeAttribute("hidden");

    next();
  });

  page("/", async () => {
    await import("./views/app-home");

    let storedProducts = [];
    if (NETWORK_STATE) {
      const products = await getProducts();
      storedProducts = await setRessources(products);
    } else {
      storedProducts = await getRessources();
    }

    AppHome.products = storedProducts;
    AppHome.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page("/product/:id", async ({ params }) => {
    await import("./views/app-product");

    let storedProduct = {};
    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(product);
    } else {
      storedProduct = await getRessource(params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page("/cart", async () => {
    await import("./views/app-cart");

    const storedCart = await getCart();

    AppCart.cart = storedCart;

    AppCart.active = true;
    skeleton.setAttribute("hidden", true);
  });
  page("/login", async () => {
    await import("./views/app-login");

    AppLogin.active = true;
    skeleton.setAttribute("hidden", true);
  });

  page();
})(document.querySelector("#app"));
