import React, { useState } from "react";
import View from "./View"
import Shop from "./Browse.js";
import Cart from "./Cart.js"
import Summary from "./Summary.js"


function App()
{
    const [catalog, setCatalog] = useState([]);
    const [filteredCatalog, setFilteredCatalog] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    // create variable for form data and its setter
    const [userInfo, setUserInfo] = useState({});
    // create variable for viewer state and its setter
    const [viewer, setViewer] = useState(View.BROWSE); // set viewer to Payment

    // display page based on viewer
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
                    setCartTotal={setCartTotal}
                    viewer={viewer}    
                    setViewer={setViewer}
                />
            )}  
            
            
        </div>
    );
}

// export the module
export default App;