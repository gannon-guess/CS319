import React, { useState, useEffect } from "react";
import { Container, Card, Button, InputGroup, Form, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import View from "./View.js";
import imageMap from "./imageMap.js";

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 3, 2024

const Shop = ({ catalog, setCatalog, filteredCatalog, setFilteredCatalog, cart, setCart, cartTotal, setCartTotal, viewer, setViewer }) => {
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
        <Col md={4} key={el.id} className='mb-4'>
            <Card>
                <Card.Img variant="top" src={imageMap[el.image]} alt="shop item" style={{ height: "300px", objectFit: 'contain' }} />
                <Card.Body className="d-flex flex-column">
                    <Card.Title>{el.title}</Card.Title>
                    <Card.Text>💲{el.price.toFixed(2)}</Card.Text>
                    <Card.Text>{el.description}</Card.Text>
                    <InputGroup>
                        <Button variant="outline-danger" onClick={() => removeFromCart(el)} disabled={howManyofThis(el.id) === 0}>-</Button>
                        <Form.Control
                            type="number"
                            value={howManyofThis(el.id)}
                            readOnly
                            className="mx-2 text-center"
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
        const qty = parseInt(quantity, 10);
    
        if (qty < 1) {
            removeFromCart({ id });
        } else {
            const updatedCart = cart.map((cartItem) => {
                if (cartItem.id === id) {
                    return { ...cartItem, quantity: qty };
                }
                return cartItem;
            });
    
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