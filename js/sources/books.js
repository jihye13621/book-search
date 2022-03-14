$(document).ready(function() {
  initSTL();
});

function initSTL() {
  let ThreeJsCanvas2;
  let scene_header2 = new THREE.Scene();
  // set the size of the canvas
  let CANVAS_WIDTH = $( window ).width();
  let CANVAS_HEIGHT = $( window ).height();
  // CAMERA
  let camera_header2 = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
  camera_header2.position.set(0, 50, 150);
  camera_header2.lookAt(scene_header2.position);

  // RENDERER
  // transparent div background color
  let renderer_header2 = new THREE.WebGLRenderer( { alpha: true } );
  renderer_header2.setClearColor( 0x000000, 0 );
  renderer_header2.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

  let booksLoader = new THREE.STLLoader(); // loads books into the scene------------------

  booksLoader.addEventListener( 'load', function ( event ) {
      let material = new THREE.MeshNormalMaterial()
      let geometry = event.content;
      geometry.computeTangents();
      let bookPile = new THREE.Mesh( geometry, material );
      bookPile.position.set( -15, 10, 15);
      bookPile.rotation.set( - 8.5, 0, -2.5);
      // bookPile.rotation.set( - 1.6, 1.5, 1.5);
      bookPile.scale.set( 1, 1, 1 );
      bookPile.castShadow = true;
      bookPile.receiveShadow = true;
      scene_header2.add( bookPile );
  });
  booksLoader.load( 'stl/books.stl' );

  ThreeJsCanvas2 = document.getElementById("ThreeJsCanvas2");
  ThreeJsCanvas2.appendChild(renderer_header2.domElement);

  let render = function () {
    requestAnimationFrame(render);
    scene_header2.rotation.y += 0.02;
    renderer_header2.render(scene_header2, camera_header2);
  };
  render();
}