import { LitElement, html, css } from "lit";
import page from "page";
import { Base } from "../Base";
import { registerUser } from "../firebase";

export class AppLogin extends Base {
  async handleRegister(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const user = await registerUser(email, password);

    page("/");
  }
  render() {
    return html`
      <form @submit="${this.handleRegister}">
        <input type="email" />
        <input type="password" />
        <button>Register</button>
      </form>
    `;
  }
}
customElements.define("app-login", AppLogin);
