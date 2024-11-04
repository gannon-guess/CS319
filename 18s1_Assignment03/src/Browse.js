import React, { useState, useEffect } from "react";
import { Container, Card, Button, InputGroup, Form, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

import NavBar from "./NavBar.js";
import View from "./View.js";

const Shop = ({ catalog, setCatalog, filteredCatalog, setFilteredCatalog, cart, setCart, cartTotal, setCartTotal, viewer, setViewer }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const howManyofThis = (id) => {
        return cart.filter((cartItem) => cartItem.id === id).length;
    };

    const onCheckout = () => {
        setViewer(View.CART); // Switch view to Summary
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("./products.json");
            const data = await response.json();
            setCatalog(data);
            setFilteredCatalog(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const totalAmount = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
        setCartTotal(totalAmount);
    }, [cart]);

    const listItems = filteredCatalog.map((el) => (
        <Col md={4} key={el.id} className='mb-4'>
            <Card>
                <Card.Img variant="top" src={el.image} alt="shop item" style={{ height: "300px", objectFit: 'contain' }} />
                <Card.Body className="d-flex flex-column">
                    <Card.Title>{el.title}</Card.Title>
                    <Card.Text>💲{el.price.toFixed(2)}</Card.Text>
                    <Card.Text>{el.description}</Card.Text>
                    <InputGroup>
                        <Button variant="outline-danger" onClick={() => removeFromCart(el)} disabled={howManyofThis(el.id) === 0}>-</Button>
                        <Form.Control
                            type="number"
                            value={howManyofThis(el.id)}
                            onChange={(e) => updateQuantity(el.id, e.target.value)}
                            className="mx-2"
                            style={{ width: "60px" }}
                        />
                        <Button variant="outline-success" onClick={() => addToCart(el)}>+</Button>
                    </InputGroup>
                </Card.Body>
            </Card>
        </Col>
    ));

    const addToCart = (el) => {
        setCart([...cart, el]);
    };

    const removeFromCart = (el) => {
        const updatedCart = cart.map((cartItem) => {
            if (cartItem.id === el.id) {
                if (cartItem.quantity > 1) {
                    // Decrease quantity by 1
                    return { ...cartItem, quantity: cartItem.quantity - 1 };
                } else {
                    // If quantity is 1, remove the item from the cart
                    return null;
                }
            }
            return cartItem;
        }).filter(Boolean); // Remove null values
    
        setCart(updatedCart);
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
        <Container>
            <h2 className="my-4 text-center"></h2>
    
            <div className="mb-4 d-flex align-items-center">
                <InputGroup style={{ width: '300px' }}>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                        Search
                        <i className="bi bi-search" style={{ marginLeft: '8px' }}></i>
                    </Button>
                    <Button onClick={handleClear}>Clear</Button>
                </InputGroup>
                
                <div className="ml-3">
                    <Button onClick={onCheckout} variant="primary" style={{marginLeft: '8px'}}>
                        Checkout
                        <i className="bi bi-cart" style={{ marginLeft: '8px' }}></i>
                    </Button>
                </div>
            </div> 
    
            <Row>
                {listItems}
            </Row>
    
            
        </Container>
    );
}

export default Shop;