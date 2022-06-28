import { LitElement, html, css } from "lit";
import { Base } from "../Base";
import { addToCart } from "../cartHelper";
import { getComments, writeComment } from "../firebase";

export class AppProduct extends Base {
  constructor() {
    super();

    this.product = {};
    this.comments = [];
    this.loaded = true;
  }
  static get properties() {
    return {
      product: { type: Object },
      comments: { type: Array, state: true },
      loaded: { type: Boolean },
    };
  }

  async firstUpdated() {
    getComments((comments) => {
      console.log("child added");
      this.comments = [...comments];
    });
  }

  sendMessage(e) {
    e.preventDefault();

    writeComment({
      message: e.target.querySelector("textarea").value,
      product: this.product.id,
    });
  }

  render() {
    return html`
      <section class="product">
        <header>
          <figure>
            <div
              class="placeholder ${this.loaded ? "fade" : ""}"
              style="background-image: url(http://localhost:9000/image/24/${this
                .product.image})"
            ></div>
            <img
              loading="lazy"
              src="http://localhost:9000/image/500/${this.product.image}"
              alt="${this.product.description}"
              data-src="http://localhost:9000/image/500/${this.product.image}"
              width="1280"
              height="720"
            />
          </figure>
        </header>
        <main>
          <h1>${this.product.title}</h1>
          <p class="price">$ ${this.product.price}</p>
          <p>${this.product.description}</p>
        </main>
        <footer>
          <button class="cart-btn" @click="${() => addToCart(this.product)}">
            Add to cart 🛍
          </button>
        </footer>
      </section>
      <section>
        <form @submit="${this.sendMessage}">
          <textarea></textarea>
          <button>Send</button>
        </form>

        <ul>
          ${this.comments.map(({ message }) => html`<li>${message}</li>`)}
        </ul>
      </section>
    `;
  }
}
customElements.define("app-product", AppProduct);
