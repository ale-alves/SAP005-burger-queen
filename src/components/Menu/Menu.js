import React, { useEffect, useState } from "react";
import "./Menu.css";
import Logotipo from "../../components/Logotipo/Logotipo";

const Menu = () => {
  const tokenUser = localStorage.getItem("token");
  const [breakfast, setBreakfast] = useState([]);
  const [allDay, setAllDay] = useState([]);
  const [showMenus, setShowMenus] = useState(true);
  const [orderSummary, setOrderSummary] = useState([]);
  const [burguers, setBurguers] = useState([]);
  const [burguerOption, setBurguerOption] = useState({
    name: null,
    flavor: null,
    complement: null,
  });
  const [products, setProducts] = useState([]);
  const [sendOrder, setSendOrder] = useState({
    client: "",
    table: "",
    products: [],
  });

  useEffect(() => {
    fetch("https://lab-api-bq.herokuapp.com/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokenUser}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        console.log(products);

        const itemBreakfast = data.filter((itens) =>
          itens.type.includes("breakfast")
        );
        setBreakfast(itemBreakfast);

        const itemAllDay = data.filter((itens) =>
          itens.type.includes("all-day")
        );
        setAllDay(itemAllDay);

        const itemBurguer = [data[4], data[13]];
        setBurguers(itemBurguer);
      });
  }, [tokenUser]);

  useEffect(() => {
    console.log(burguerOption);
    console.log(orderSummary);
  }, [burguerOption, orderSummary]);

  const flavorsBurguers = (flavor, name) => {
    burguerOption.flavor = flavor;
    burguerOption.name = name;
    setBurguerOption({ ...burguerOption });
  };

  const complementsBurguers = (complement) => {
    burguerOption.complement = complement;
    setBurguerOption({ ...burguerOption });
  };

  return (
    <>
      <section className="main">
        <section className="main-left">
          <div className="logotipo">
            <Logotipo />
          </div>
          <div className="btn-show-menus">
            <button
              className="btn-breakfast"
              onClick={() => setShowMenus(true)}
            >
              Café da Manhã
            </button>

            <button className="btn-allDay" onClick={() => setShowMenus(false)}>
              Almoço/ Jantar
            </button>
          </div>
          <section id="summary">
            <p className="title-summary">Resumo do Pedido:</p>
            {orderSummary.map((order) => (
              <p>
                {order.name} {order.complement} {order.flavor}{" "}
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(order.price)}
              </p>
            ))}
            <p className="title-total">
              <strong>TOTAL:{" "}
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                orderSummary.reduce((total, item) => total + item.price, 0)
              )}{" "}
            </strong></p>
            <button id="btn-sendKitchen"
              onClick={() => {
                const products = orderSummary.map((order) => {
                  return { id: order.id, qtd: 1 };
                });
                sendOrder.products = products;
                fetch("https://lab-api-bq.herokuapp.com/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${tokenUser}`,
                  },
                  body: JSON.stringify(sendOrder),
                })
                  .then((response) => response.json())
                  .then((data) => console.log(data));
              }}
            >
              Enviar Pedido
            </button>
          </section>
        </section>

        <section className="main-right">
          {showMenus ? (
            <>
              <h1>CAFÉ DA MANHÃ</h1>
              <section className="main-right-breakfast">
                {breakfast.map((item, index) => (
                  <>
                    <section className="container-breakfast">
                      <p className="item-breakfast">
                        {item.name}{" "}
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}{" "}
                      </p>
                      <button
                        className="item-btn"
                        onClick={() =>
                          setOrderSummary([...orderSummary, breakfast[index]])
                        }
                      >
                        Adicionar
                      </button>
                    </section>
                  </>
                ))}
              </section>
            </>
          ) : (
            <>
              <h1>HAMBURGUERES</h1>
              <section >
                {burguers.map((item, index) => (
                  <section className="itens-burgers">
                    <p className="itens-burgers-title">
                      {item.name}{" "}
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price)}
                    </p>
                    <section className="itens-flavor">
                      <p className="title-flavor"><strong>Hamburguer:</strong></p>
                      <input
                        type="radio"
                        id="carne"
                        name={item.name}
                        onClick={() => flavorsBurguers("carne", item.name)}
                      />
                      <label htmlFor="carne"> carne</label>

                      <input
                        type="radio"
                        id="frango"
                        name={item.name}
                        onClick={() => flavorsBurguers("frango", item.name)}
                      />
                      <label htmlFor="frango"> frango</label>

                      <input
                        type="radio"
                        id="vegetariano"
                        name={item.name}
                        onClick={() =>
                          flavorsBurguers("vegetariano", item.name)
                        }
                      />
                      <label htmlFor="vegetariano"> vegetariano</label>
                    </section>

                    <section >
                      <p className="title-complement"><strong>Adicional R$ 1,00</strong></p>
                      <input 
                        type="radio"
                        id="ovo"
                        name={item.id}
                        onClick={() => complementsBurguers("ovo")}
                      />
                      <label htmlFor="ovo"> ovo</label>

                      <input
                        type="radio"
                        id="queijo"
                        name={item.id}
                        onClick={() => complementsBurguers("queijo")}
                      />
                      <label htmlFor="queijo"> queijo</label>
                    </section>

                    <button
                      className="item-btn-burgers"
                      onClick={() => {
                        products.filter((product) => {
                          if (
                            product.name === burguerOption.name &&
                            product.flavor === burguerOption.flavor &&
                            product.complement === burguerOption.complement
                          ) {
                            setOrderSummary([...orderSummary, product]);
                          }
                        });
                      }}
                    >
                      Adicionar
                    </button>
                  </section>
                ))}
              </section>

              <h1>ACOMPANHAMENTOS</h1>
              {allDay.map((item, index) => (
                <section >
                  {item.sub_type === "side" ? (
                    <>
                      <p className="itens-sides">
                        {item.name}{" "}
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                         <button
                        className="item-btn"
                        onClick={() =>
                          setOrderSummary([...orderSummary, allDay[index]])
                        }
                      >
                        Adicionar
                      </button>
                      </p>
                     
                    </>
                  ) : null}
                </section>
              ))}

              <h1>BEBIDAS</h1>
              {allDay.map((item, index) => (
                <section >
                  {item.sub_type === "drinks" ? (
                    <>
                      <p className="itens-drinks">
                        {item.name}{" "}
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)} 
                        <button
                        className="item-btn"
                        onClick={() =>
                          setOrderSummary([...orderSummary, allDay[index]])
                        }
                      >
                        Adicionar
                      </button>
                      </p>
                     
                    </>
                  ) : null}
                </section>
              ))}
            </>
          )}
        </section>
      </section>
    </>
  );
};

export default Menu;
