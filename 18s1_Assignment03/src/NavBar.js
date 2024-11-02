import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, InputGroup, FormControl } from "react-bootstrap";

const NavBar = ({catalog, setCatalog, filteredCatalog, setFilteredCatalog, categories}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filterCategory = (tag)=>{
        const results = catalog.filter((eachProduct) => {return eachProduct.category === tag})
        setFilteredCatalog(results)
    }
    const clearSearch = () => {
        setSearchTerm(""); // Clear the input
        setFilteredCatalog(catalog); // Reset to full catalog
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        const results = catalog.filter(eachProduct => {
        if (e.target.value === "") return catalog;
            return eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase())
        });
        setFilteredCatalog(results);
    }

    return (
        <div>
            {/* Search Input Section */}
            <div className="mb-4">
                <InputGroup>
                    <FormControl
                        placeholder="Search products..."
                        aria-label="Search products"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <Button variant="outline-secondary" onClick={clearSearch}>
                        <i className="bi bi-x">Clear</i> {/* Bootstrap icon for clear */}
                    </Button>
                </InputGroup>
            </div>
        </div>
    );
};


export default NavBar;