import { LitElement, html, css } from "lit";
import { Base } from "../Base";
import { deleteFromCart, updateCartQuantity } from "../cartHelper";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = {
      items: [],
      total: 0,
    };
  }

  static get properties() {
    return {
      cart: { type: Object },
    };
  }

  round(number) {
    return Math.round(number * 100) / 100;
  }

  async removeQty(product) {
    if (product.quantity > 1) {
      product.quantity = product.quantity - 1;
      this.cart = await updateCartQuantity(product);
    }
  }

  async addQty(product) {
    product.quantity = product.quantity + 1;
    this.cart = await updateCartQuantity(product);
  }

  async remove(product) {
    this.cart = await deleteFromCart(product);
  }

  cartItem(products) {
    return products.map((product) => {
      function add() {
        this.addQty(product);
      }

      function decrease() {
        this.removeQty(product);
      }

      function remove() {
        this.remove(product);
      }
      return html`
        <div class="cart-item">
          <img src="${product.image}" />
          <div class="detail">
            <h2>${product.title}</h2>
            <div class="price">
              $ ${this.round(product.price * product.quantity)}
            </div>
            <div class="quantity">
              <button
                class="qty-btn ${product.quantity < 2 ? "disabled" : ""}"
                @click="${decrease}"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <span>${product.quantity}</span>
              <button class="qty-btn" @click="${add}">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button class="trash" @click="${remove}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="trash"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      `;
    });
  }

  render() {
    return html`
      <h1>My cart :</h1>

      <main>
        ${this.cart.items.length
          ? this.cartItem(this.cart.items)
          : html`<img
              class="empty-state"
              src="../assets/img/undraw_empty_cart_co35.svg"
            />`}
      </main>

      <div class="order-info">
        <h2>Order info :</h2>
        <div class="total">
          Total:
          <span class="total-price">$ ${this.round(this.cart.total)}</span>
        </div>
      </div>
    `;
  }
}
customElements.define("app-cart", AppCart);
