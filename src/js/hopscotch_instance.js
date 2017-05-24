import Hopscotch from './hopscotch';

let hopscotch = new Hopscotch();

// Template includes, placed inside a closure to ensure we don't
// end up declaring our shim globally.
(function(){
// @@include('../../src/tl/_template_headers.js') //
// @@include('hopscotch_templates.js') //
}.call(hopscotch));

export default hopscotch;
