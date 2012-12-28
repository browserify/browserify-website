module.exports = Search;

function Search (target) {
    if (!(this instanceof Search)) return new Search(target);
    this.elements = {
        form: target.querySelector('form'),
        query: target.querySelector('.query')
    };
    
    this.elements.form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        
    });
}

Search.prototype.focus = function () {
    this.elements.query.focus();
};
