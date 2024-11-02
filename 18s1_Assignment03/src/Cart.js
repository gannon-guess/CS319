import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Card, Col, Button, Row, InputGroup } from 'react-bootstrap';
import View from "./View.js"
import "./styles.css"

// Gannon Guess
// gannon@iastate.edu
// October 30, 2024

// Payment module used to display a form for user input of data
function Cart( { cart, cartTotal, userInfo, setUserInfo, view, setViewer } ) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const tax = (parseFloat(cartTotal) * 0.075).toFixed(2);
    const total = parseFloat(cartTotal) + parseFloat(tax);
    const onReturn = data => {
        setViewer(View.BROWSE); // switch view to Summary
    }
    const onSubmit = data => {
        console.log(data); // log all data
        console.log(data.fullName); // log only fullname
        // update hooks
        setUserInfo(data);
        setViewer(View.SUMMARY); // switch view to Summary
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


    // // display a form for getting user information
    return (
        <div>
            <div>
                <button onClick={ onReturn } className="btn btn-secondary">Return</button>
            </div>
            <div>
                <Row className="font-weight-bold mb-2">
                    <Col xs={3}>Picture</Col>
                    <Col xs={5}>Name</Col>
                    <Col xs={4}>Quantity Purchased</Col>
                </Row>
                {listCart}
                <hr/>
                <Row className="font-weight-bold mb-2">
                    <Col xs={3}></Col>
                    <Col xs={5}>Total</Col>
                    <Col xs={4}>${cartTotal} + ${tax} Tax = ${total.toFixed(2)}</Col>
                </Row>
                <hr/>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">
                    {/* full name input */}
                    <div className="form-group mb-3">
                        <input {...register("fullName", { required: true })} placeholder="Full Name" className="form-control"/>
                        {errors.fullName && <p className="text-danger">Full Name is required.</p>}
                    </div>

                    {/* email input */}
                    <div className="form-group mb-3">
                        <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" className="form-control"/>
                        {errors.email && <p className="text-danger">Email is required.</p>}
                    </div>

                    {/* credit card input */}
                    <InputGroup className="form-group mb-3">
                        <input {...register("creditCard", { required: true })} placeholder="Credit Card" className="form-control"/>
                        {errors.creditCard && <p className="text-danger">Credit Card is required.</p>}
                    </InputGroup>

                    {/* address input */}
                    <div className="form-group mb-3">
                        <input {...register("address", { required: true })} placeholder="Address" className="form-control"/>
                        {errors.address && <p className="text-danger">Address is required.</p>}
                    </div>

                    {/* address 2 input */}
                    <div className="form-group mb-3">
                        <input {...register("address2")} placeholder="Address 2" className="form-control"/>
                    </div>

                    {/* city input */}
                    <div className="form-group mb-3">
                        <input {...register("city", { required: true })} placeholder="City" className="form-control"/>
                        {errors.city && <p className="text-danger">City is required.</p>}
                    </div>

                    {/* state input */}
                    <div className="form-group mb-3">
                        <input {...register("state", { required: true })} placeholder="State" className="form-control"/>
                        {errors.state && <p className="text-danger">State is required.</p>}
                    </div>

                    {/* zipcode input */}
                    <div className="form-group mb-3">
                        <input {...register("zip", { required: true })} placeholder="Zip" className="form-control"/>
                        {errors.zip && <p className="text-danger">Zip is required.</p>}
                        
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        
    );
}

// export the module
export default Cart;