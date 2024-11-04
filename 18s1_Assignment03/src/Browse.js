import React, { useState, useEffect } from "react";
import { Container, Card, Col, Button, InputGroup, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css'

import NavBar from "./NavBar.js";
import View from "./View.js"

const Shop = ( { catalog, setCatalog, filteredCatalog, setFilteredCatalog, cart, setCart, cartTotal, setCartTotal, viewer, setViewer } ) => {
    const [searchTerm, setSearchTerm] = useState('');

    function howManyofThis(id) {
        let hmot = cart.filter((cartItem) => cartItem.id === id);
        return hmot.length;
    }

    const onCheckout = data => {
        console.log(View.CART);
        setViewer(View.CART); // switch view to Summary
    }

    useEffect(()=>{
        const fetchData = async () => {
            const someResponse = await fetch("./products.json");
            const data = await someResponse.json();
            // update State Variable
            setCatalog(data);
            setFilteredCatalog(data);
            console.log(data);
        };
        fetchData();
    },[]);

    useEffect(()=>{
        const total = () => {
            let totalAmount = 0;
            for (let i=0; i<cart.length; i++){
                totalAmount += cart[i].price;
            }
            totalAmount = totalAmount.toFixed(2);
            setCartTotal(totalAmount);
            console.log(totalAmount);
        };
        total();
    },[cart]);

    const listItems = filteredCatalog.map((el) => (
        <Container className='p-4' key={el.id}>
            <Card >
                <Card.Img className="card-img-top" src={el.image} alt="shop item" style={{ height: "300px", width:"auto", objectFit: 'contain' }} />
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="card-title">{el.title}</Card.Title>
                    <Card.Text className="card-text">💲{el.price.toFixed(2)}</Card.Text>
                    <Card.Text className="card-description">{el.description}</Card.Text>
                    <Card.Footer className="mt-auto d-flex align-items-center">
                        <InputGroup>
                            <Button 
                                variant="light" 
                                onClick={() => removeFromCart(el)} 
                                disabled={howManyofThis(el.id) === 0}
                            >
                                -
                            </Button>
                            <Form.Control 
                                type="number" 
                                value={howManyofThis(el.id)} 
                                onChange={(e) => updateQuantity(el.id, e.target.value)} 
                                className="mx-2" 
                                style={{ width: "60px" }}
                            />
                            <Button 
                                variant="light" 
                                onClick={() => addToCart(el)}
                            >
                                +
                            </Button>
                        </InputGroup>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </Container>
    ));

    const addToCart = (el) => {
        setCart([...cart, el]);
    };

    
    const removeFromCart = (el) => {
        let itemFound = false;
        const updatedCart = cart.filter((cartItem) => {
            if (cartItem.id === el.id && !itemFound) {
                itemFound = true;
                return false;
            }
            return true;
        });
        if (itemFound) {
            setCart(updatedCart);
        }
    };

    const updateQuantity = (id, quantity) => {
        // Convert quantity to a number
        const qty = parseInt(quantity, 10);
    
        if (qty < 1) {
            // If the quantity is less than 1, remove the item from the cart
            removeFromCart({ id });
        } else {
            // Otherwise, update the quantity in the cart
            const updatedCart = cart.map((cartItem) => {
                if (cartItem.id === id) {
                    // Return a new object with the updated quantity
                    return { ...cartItem, quantity: qty };
                }
                return cartItem;
            });
    
            // If the item was not found in the cart, add it with the specified quantity
            if (!updatedCart.find(item => item.id === id)) {
                const newItem = { ...catalog.find(item => item.id === id), quantity: qty };
                updatedCart.push(newItem);
            }
    
            setCart(updatedCart);
        }
    };

    const cartItems = cart.map((el, index) => (
        <div key={index}>
            <img class="img-fluid" src={el.image} width={40} height="auto" alt="shop item"/>
            {el.title}
            ${el.price}
        </div>
    ));

    const handleSearch = () => {
        if (searchTerm) {
            const filtered = catalog.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCatalog(filtered);
        } else {
            setFilteredCatalog(catalog); 
        }
    };

    const handleClear = () => {
        setSearchTerm(''); 
        setFilteredCatalog(catalog); 
    };
    
    
    return (
        <div>
            STORE SE/ComS3190
            <div class="card">
                
                <div style={{ display: 'flex', alignItems: 'center', width: '350px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, marginRight: '8px' }}
                    />
                    <Button onClick={handleSearch} style={{ marginLeft: '8px' }}>Search</Button>
                    <Button onClick={handleClear} style={{ marginLeft: '8px' }}>Clear</Button>

                </div>
                    
                    
                <div>
                    <Button onClick={onCheckout}>
                            Checkout
                            <i className="bi bi-cart" style={{ marginLeft: '8px' }}></i>
                    </Button>
                </div>   
                <div class="row">
                    <div class="col-md-8 cart">
                        <div class="title">
                            <div class="row">
                                <div class="col">
                                    <h4>
                                        <b>3190 Shopping Cart</b>
                                    </h4>
                                </div>
                                <div class="col align-self-center text-right text-muted">
                                    <h4>
                                        <b>Products selected {cart.length}</b>
                                    </h4>
                                </div>
                                <div class ="col align-self-center text-right text-muted">
                                    <h4>
                                        <b>Order total: ${cartTotal}</b>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-container" style={{alignItems: "center"}}>
                            {listItems}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Shop;