const PRICE = 9.99;

new Vue({ // Creamos una instancia de Vue.
    el: '#app', // Donde queremos instanciar nuestra aplicación en el DOM.
    data: { // Propiedades  accsesibles desde el DOM con interpolaciones.
        total: 0,
        items: [],
        cart: [],
        newSearch: 'anime',
        lastSearch:'',
        loading: false,
        price: PRICE
    },
    methods: {
        onSubmit: function(event) {
            this.items = [];
            this.loading = true;
            this.$http
            .get('/search/'.concat(this.newSearch))
            .then(function(res) {
                this.lastSearch = this.newSearch;
                this.items = res.data;
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
    }
});
