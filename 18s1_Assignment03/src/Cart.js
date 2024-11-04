import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Col, Button, Row } from 'react-bootstrap';
import View from "./View.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import imageMap from "./imageMap.js";

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 3, 2024

function Cart({ cart, cartTotal, userInfo, setUserInfo, view, setViewer }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const tax = (parseFloat(cartTotal) * 0.075).toFixed(2);
    const total = parseFloat(cartTotal) + parseFloat(tax);

    const onReturn = () => {
        setViewer(View.BROWSE);
    };

    const onSubmit = data => {
        console.log(data); 
        setUserInfo(data);
        setViewer(View.SUMMARY);
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
                <div>{item.title}</div>
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
            <div className="mb-3">
                <Button onClick={onReturn} variant="secondary">
                    Return
                    <i class="bi bi-arrow-left-circle-fill" style={{ marginLeft: '8px' }}></i>
                </Button>
            </div>
            <Row className="font-weight-bold mb-2">
                <Col xs={3}>Picture</Col>
                <Col xs={5}>Name</Col>
                <Col xs={4}>Quantity Purchased</Col>
            </Row>
            {listCart}
            <hr />
            <Row className="font-weight-bold mb-2">
                <Col xs={3}></Col>
                <Col xs={5}>Total</Col>
                <Col xs={4}>${cartTotal} + ${tax} Tax = ${total.toFixed(2)}</Col>
            </Row>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                <Row className="mb-3">
                    <Col xs={6}>
                        <label>Full Name</label>
                        <input {...register("fullName", { required: true, pattern: /.+/ })} className="form-control" />
                        {errors.fullName && <p className="text-danger">Full Name is required.</p>}
                    </Col>
                    <Col xs={6}>
                        <label>Email</label>
                        <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} className="form-control" />
                        {errors.email && <p className="text-danger">Email is required.</p>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={6}>
                        <label>Credit Card</label>
                        <input {...register("creditCard", { required: true, pattern: /.+/ })} className="form-control" />
                        {errors.creditCard && <p className="text-danger">Credit Card is required.</p>}
                    </Col>
                    <Col xs={6}>
                        <label>Address</label>
                        <input {...register("address", { required: true, pattern: /.+/ })} className="form-control" />
                        {errors.address && <p className="text-danger">Address is required.</p>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={6}>
                        <label>City</label>
                        <input {...register("city", { required: true, pattern: /.+/ })} className="form-control" />
                        {errors.city && <p className="text-danger">City is required.</p>}
                    </Col>
                    <Col xs={6}>
                        <label>State</label>
                        <input {...register("state", { required: true, pattern: /.+/ })} className="form-control" />
                        {errors.state && <p className="text-danger">State is required.</p>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={6}>
                        <label>Zip</label>
                        <input {...register("zip", { required: true, pattern: /^\d{5}$/ })} className="form-control" />
                        {errors.zip && <p className="text-danger">Zip is required.</p>}
                    </Col>
                    <Col xs={6}>
                        <label>Address 2</label>
                        <input {...register("address2", { pattern: /.+/ })} className="form-control" />
                    </Col>
                </Row>
                <div className="text-center">
                    <Button type="submit" variant="primary">
                        Order
                        <i className="bi bi-bag-check" style={{ marginLeft: '8px' }}></i>
                    </Button>
                </div>
            </form>
        </Container>
    );
}

export default Cart;