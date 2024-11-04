import React, { useState } from "react";
import View from "./View"
import Shop from "./Browse.js";
import Cart from "./Cart.js"
import Summary from "./Summary.js"

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 3, 2024


function App()
{
    const [catalog, setCatalog] = useState([]);
    const [filteredCatalog, setFilteredCatalog] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [userInfo, setUserInfo] = useState({});

    const [viewer, setViewer] = useState(View.BROWSE);

    return(
        <div>
            {viewer === View.BROWSE ? (
                <Shop 
                    catalog={catalog}
                    setCatalog={setCatalog}
                    filteredCatalog={filteredCatalog}
                    setFilteredCatalog={setFilteredCatalog}
                    cart={cart}
                    setCart={setCart}
                    cartTotal={cartTotal}
                    setCartTotal={setCartTotal}
                    viewer={viewer}
                    setViewer={setViewer}
                />
            ) : viewer === View.CART ? (
                <Cart 
                    cart={cart}
                    cartTotal={cartTotal}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    viewer={viewer}    
                    setViewer={setViewer}
                />
            ) : (
                <Summary 
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    cart={cart}
                    setCart={setCart}
                    cartTotal={cartTotal}
                    setCartTotal={setCartTotal}
                    viewer={viewer}    
                    setViewer={setViewer}
                />
            )}  
            
            
        </div>
    );
}

export default App;