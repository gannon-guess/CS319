import React from 'react';
import { Container, Card, Col, Button, Row, InputGroup } from 'react-bootstrap';
import View from "./View.js"

// Module used to display the user information entered into
// the Payment form
function Summary({ userInfo, setUserInfo, cart, setCart, setCartTotal, viewer, setViewer }) {

    const onFinish = () => {
        // switch back to Payment
        // set data based on input
        setViewer(View.BROWSE);
        setUserInfo(userInfo);
        setCartTotal(0);
        setCart([]);
    }

    const aggregatedCart = cart.reduce((acc, item) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity; // Sum the quantities
        } else {
          acc.push({ ...item }); // Add new item
        }
        return acc;
    }, []);
    
    const getItemCount = (itemId) => {
        return cart.filter(item => item.id === itemId).length;
    };

    const listCart = aggregatedCart.map((item) => ( 
        <Row className="mb-3" key={item.id}>
            <hr/>
            <Col xs={3}>
                <img src={item.image} alt={item.title} style={{ width: '80px', height: 'auto' }} />
            </Col>
            <Col xs={5} className="d-flex align-items-center">
                <div>
                    {item.title}
                </div>
            </Col>
            <Col xs={4} className="d-flex align-items-center">
                <div>
                <p className="mb-0">{getItemCount(item.id)} x ${(item.price).toFixed(2)} = ${(item.price * getItemCount(item.id)).toFixed(2)}</p>
                </div>
            </Col>
        </Row>
        
    ));

    // display payment information
    return (
        <div>
            <div>
                
            </div>
            <div style={{
                // add padding to improve visual order
                padding: '10px',
                margin: '10px'
            }}>
                {/* display information about submitted data */}
                <h1>Payment Summary:</h1>
                {listCart}
                <h2>Customer Info:</h2>
                <h3>{userInfo.fullName}</h3>
                <p>{userInfo.email}</p>
                <p>{userInfo.creditCard}</p>
                <p>{userInfo.address}</p>
                <p>{userInfo.address2}</p>
                <p>{userInfo.city}, {userInfo.state} {userInfo.zip}</p>
                <button onClick={ onFinish } className="btn btn-secondary">Finish</button>
            </div>
        </div>
    );
};

// export the module
export default Summary;