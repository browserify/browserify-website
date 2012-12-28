module.exports = Search;

function Search (target) {
    if (!(this instanceof Search)) return new Search(target);
    this.elements = {
        query: target.querySelector('.query')
    };
}

Search.prototype.focus = function () {
    this.elements.query.focus();
};


