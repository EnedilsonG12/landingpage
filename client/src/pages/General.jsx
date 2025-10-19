import React from "react";
import Orders from "../pages/Orders";
import Order_Items from "../pages/Order_Items";

function General() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Órdenes</h1>
      <Orders />
      <hr />
      <Order_Items />
    </div>
  );
}

export default General;
