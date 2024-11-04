import React from 'react';
import { Container, Col, Button, Row } from 'react-bootstrap';
import View from "./View.js";
import imageMap from "./imageMap.js";

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 3, 2024

function Summary({ userInfo, setUserInfo, cart, setCart, cartTotal, setCartTotal, viewer, setViewer }) {
    const tax = (parseFloat(cartTotal) * 0.075).toFixed(2);
    const total = parseFloat(cartTotal) + parseFloat(tax);
    const onFinish = () => {
        setViewer(View.BROWSE);
        setUserInfo(userInfo);
        setCartTotal(0);
        setCart([]);
    };

    const aggregatedCart = cart.reduce((acc, item) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity; 
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, []);
    
    const getItemCount = (itemId) => {
        return cart.filter(item => item.id === itemId).length;
    };

    const listCart = aggregatedCart.map((item) => ( 
        <Row className="mb-3" key={item.id}>
            <hr />
            <Col xs={3} className="text-center">
                <img src={imageMap[item.image]} alt={item.title} style={{ width: '80px', height: 'auto' }} />
            </Col>
            <Col xs={5} className="d-flex align-items-center">
                <div>
                    {item.title}
                </div>
            </Col>
            <Col xs={4} className="d-flex align-items-center justify-content-end">
                <div>
                    <p className="mb-0">{getItemCount(item.id)} x ${(item.price).toFixed(2)} = ${(item.price * getItemCount(item.id)).toFixed(2)}</p>
                </div>
            </Col>
        </Row>
    ));

    return (
        <Container className="my-4 p-4">
            <h1 className="mb-4 text-center">Payment Summary</h1>
            <h3>Items Purchased:</h3>
            {listCart.length > 0 ? listCart : <p className="text-center">Your cart is empty.</p>}
            <hr />
            <Row className="font-weight-bold mb-2">
                <Col xs={3}></Col>
                <Col xs={5}>Total</Col>
                <Col xs={4}>${cartTotal} + ${tax} Tax = ${total.toFixed(2)}</Col>
            </Row>
            <hr />
            <h2 className="mt-4">Thank you for your order, {userInfo.fullName}!</h2>
            <p>{userInfo.email}</p>
            <p>{userInfo.creditCard}</p>
            <p>{userInfo.address}</p>
            <p>{userInfo.address2}</p>
            <p>{userInfo.city}, {userInfo.state} {userInfo.zip}</p>
            <div className="text-center mt-4">
                <Button onClick={onFinish} variant="secondary">
                    Finish
                    <i className="bi bi-check" style={{ marginLeft: '8px' }}></i>
                </Button>
            </div>
        </Container>
    );
}

export default Summary;