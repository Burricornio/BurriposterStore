const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({ // Creamos una instancia de Vue.
    el: '#app', // Donde queremos instanciar nuestra aplicación en el DOM.
    data: { // Propiedades  accsesibles desde el DOM con interpolaciones.
        total: 0,
        items: [], // Variable para almacenar un número de items concreto para implementar el hacer'scroll load'
        cart: [],
        results: [], // Variable para almacenar todos los resultados
        newSearch: 'anime',
        lastSearch:'',
        loading: false,
        price: PRICE
    },
    methods: {
        appendItems: function() {
            if(this.items.length < this.results.length) {
                let append = this.results.slice(this.items.length, this.items.length + LOAD_NUM); // De esta forma obtenemos sólo los diez primeros resultados
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function(event) {
            this.items = [];
            this.loading = true;
            this.$http
            .get('/search/'.concat(this.newSearch))
            .then(function(res) {
                this.lastSearch = this.newSearch;
                this.results = res.data; // Almacenamos todos los resultados
                this.appendItems();
                this.loading = false;
            })
        },
        addItem: function(index) {
            this.total += PRICE;
            let item = this.items[index];
            let found = false;
            for(var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;
            if(item.qty <=0) {
                for(var i = 0; i < this.cart.length; i++) {
                    if(this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price) {
            return `$${price.toFixed(2)}`
        }
    },
    mounted: function() {
        this.onSubmit();

        // Pasos  para implementar 'scroll load' a traves de la librería scrollMonitor
        // Vamos a llamar al 'this' con ES5. Podríamos haber implementado una 'arrow function' de ES6
        let vueInstance = this;
        // Almacenamos en una variableel elemento que queremos observar
        let elem = document.getElementById('product-list-bottom');
        //Creamos el observador
        let watcher = scrollMonitor.create(elem);
        // Observamos si aparece en el viewport
        watcher.enterViewport(function() {
            vueInstance.appendItems()
        })
    }
});


