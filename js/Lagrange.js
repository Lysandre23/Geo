function horner(array, x_scale, y_scale) {
    function recur(x, i, array) {
       if (i == 0) {
          return array[0];
       } else {
          return array[i] + x*recur(x, --i, array);
       }
    }
    return function(x) {
       return recur(x*x_scale, array.length-1, array)*y_scale;
    };
 }
 
 // initialize array
 function zeros(n) {
    var array = new Array(n);
    for (var i=n; i--;) {
      array[i] = 0;
    }
    return array;
 }
 
 function denominator(i, points) {
    var result = 1;
    var x_i = points[i].x;
    for (var j=points.length; j--;) {
       if (i != j) {
         result *= x_i - points[j].x;
       }
    }
    return result;
 }

 // calculate coefficients for Li polynomial
function interpolation_polynomial(i, points) {
    var coefficients = zeros(points.length);
     // alert("Denominator " + i + ": " + denominator(i,points));
    coefficients[0] = 1/denominator(i,points);
     //new Array(points.length);
    /*for (var s=points.length; s--;) {
       coefficients[s] = 1/denominator(i,points);
    }*/
    var new_coefficients;
 
    for (var k = 0; k<points.length; k++) {
       if (k == i) {
         continue;
       }
       new_coefficients = zeros(points.length);
        for (var j= (k < i) ? k+1 : k; j--;) {
          new_coefficients[j+1] += coefficients[j];
          new_coefficients[j] -= points[k].x*coefficients[j];
       }   
       coefficients = new_coefficients;
    }
    return coefficients;
 }

 // calculate coefficients of polynomial
function Lagrange(points) {
    var polynomial = zeros(points.length);
    var coefficients;
    for (var i=0; i<points.length; ++i) {
      coefficients = interpolation_polynomial(i, points);
      //console.log(coefficients);
      for (var k=0; k<points.length; ++k) {
        // console.log(points[k].y*coefficients[k]);
         polynomial[k] += points[i].y*coefficients[k];
      }
    }
    return polynomial;
 }