exports.extend = (function() {
  const ProxyF = function() {};
  return function(C, P) {
    ProxyF.prototype = P.prototype;
    C.prototype = new ProxyF();
    C.prototype.constructor = C;
  };
}());
