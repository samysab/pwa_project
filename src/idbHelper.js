import { openDB } from "idb";

const PRODUCT_STORE_NAME = "Products";
const CART_STORE_NAME = "Cart";

export function initDB() {
  return openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id",
      });

      store.createIndex("id", "id");
      store.createIndex("category", "category");

      db.createObjectStore(CART_STORE_NAME);
    },
  });
}

export async function setRessources(data = []) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, "readwrite");
  data.forEach((item) => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function setRessource(data = {}) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, "readwrite");
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", data.id);
}

export async function getRessources() {
  const db = await initDB();
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function getRessource(id) {
  const db = await initDB();
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", Number(id));
}

export async function unsetRessource(id) {
  const db = await initDB();
  await db.delete(PRODUCT_STORE_NAME, id);
}

export async function setCart(cart) {
  const db = await initDB();
  const tx = db.transaction(CART_STORE_NAME, "readwrite");
  tx.store.put(cart, "cart");
  await tx.done;
  return db.get(CART_STORE_NAME, "cart");
}

export async function getCart() {
  const db = await initDB();
  return db.get(CART_STORE_NAME, "cart");
}
