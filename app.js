// Storage Controller
const StorageController = (function () {
    // private

    // public
    return {
        storeProduct: function (product) {
            let products;
            if (localStorage.getItem('products') === null) {
                products = [];
                products.push(product);
            } else {
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function () {
            let products;
            if (localStorage.getItem('products') === null) {
                products = [];
            } else {
                products = JSON.parse(localStorage.getItem('products'));
            }

            return products;
        },
        updateProduct: function (product) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function (prd, index) {
                if (product.id == prd.id) {
                    products.splice(index, 1, product);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));

        },
        deleteProduct: function (id) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function (prd, index) {
                if (id == prd.id) {
                    products.splice(index, 1);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
})();
// Product Controller
const ProductController = (function () {
    // private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    // public
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        getProductById: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                } else {

                }
            })

            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;

        },
        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;
        },
        deleteProduct: function (id) {
            data.products.forEach(function (prd, index) {
                if (id == prd.id) {
                    data.products.splice(index, 1);
                }
            })
        },
        getTotal: function () {
            let total = 0;

            data.products.forEach(function (item) {
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        }
    }

})();

// UI Controller
const UIController = (function () {
    // private
    const Selectors = {
        productList: "#item-list",
        productListItems: '#item-list tr',
        addButton: '#addBtn',
        updateButton: '#updateBtn',
        deleteButton: '#deleteBtn',
        cancelButton: '#cancelBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'

    }

    // public
    return {
        createProductList: function (products) {
            let html = ``;

            products.forEach(prd => {
                html += `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price.toFixed(2)} $</td>
                    <td class="text-right">
                       <i class="far fa-edit edit-product" aria-hidden="true"></i>
                    </td>
                </tr>
            
                `;
            });
            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {
            document.querySelector(Selectors.productCard).style.display = 'block';
            var prdHtml = `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price.toFixed(2)} $</td>
                    <td class="text-right">
                        <i class="far fa-edit edit-product" aria-hidden="true"></i>
                    </td>
                </tr>
            
                `;

            document.querySelector(Selectors.productList).innerHTML += prdHtml;
        },
        updateProduct: function (prd) {
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;

                }
            });

            return updatedItem;
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            })
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function (item) {

                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }

            });
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total.toFixed(2);
            document.querySelector(Selectors.totalTL).textContent = (total * 7.86).toFixed(2);
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState: function () {

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editsState: function (tr) {

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
    }
})();

// App Controller
const App = (function (ProductCtrl, UICtrl, StorageCrtl) {
    // private
    const UISelectors = UICtrl.getSelectors();

    // Load Event Listiners
    const loadEventListeners = function () {
        // add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', addProductSubmit);

        // edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        // cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        // delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
    }

    const addProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // add product

            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // add item to list
            UICtrl.addProduct(newProduct);

            // add product to LocalStorage
            StorageCrtl.storeProduct(newProduct);

            // get total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            // clear inputs
            UICtrl.clearInputs();
        } else {

        }



        e.preventDefault();
    }

    const productEditClick = function (e) {

        if (e.target.classList.contains('edit-product')) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;


            // get selected product
            const product = ProductCtrl.getProductById(id);

            // set current product
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            // add product to UI
            UICtrl.addProductToForm();

            // edits buttons visible
            UICtrl.editsState(e.target.parentNode.parentNode);
        } else {

        }


        e.preventDefault();
    }

    const editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // add product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            // update ui
            let item = UICtrl.updateProduct(updatedProduct);

            // get total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            // update storage
            StorageCrtl.updateProduct(updatedProduct);


            UICtrl.addingState();
            UICtrl.clearWarnings();



        } else {

        }

        e.preventDefault();
    }

    const cancelUpdate = function (e) {

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }

    const deleteProductSubmit = function (e) {

        // get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        // delete product
        ProductCtrl.deleteProduct(selectedProduct.id);

        // delete ui
        UICtrl.deleteProduct(selectedProduct);

        // get total
        const total = ProductCtrl.getTotal();

        // show total
        UICtrl.showTotal(total);

        // delete from storage
        StorageCrtl.deleteProduct(selectedProduct.id);


        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hideCard();
        }


        e.preventDefault();
    }
    // public
    return {
        init: function () {
            console.log('starting app...');

            // add buttons visible
            UICtrl.addingState();

            const products = ProductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);

                // get total
                const total = ProductCtrl.getTotal();

                // show total
                UICtrl.showTotal(total);
            }

            // load event listeners
            loadEventListeners()
        }
    }

})(ProductController, UIController, StorageController);

App.init();