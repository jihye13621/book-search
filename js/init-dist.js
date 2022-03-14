// abstracts
// @prepros-append sources/animate-viewport.js
// @prepros-append sources/stl-loader.js
// @prepros-append sources/books.js
// @prepros-append sources/spinning.js
// @prepros-append sources/general.js

$(document).ready(function() {
  // * VIEWPORT ANIMATION
  // Start animations when element appears in viewpoint
  // JS: components/jquery.viewportchecker.js
  $(".viewpoint-fadeIn").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeIn'
  });
  $(".viewpoint-fadeInLeft").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInLeft'
  });
  $(".viewpoint-fadeInRight").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInRight'
  });
  $(".viewpoint-fadeInUp").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInUp'
  });
  $(".viewpoint-fadeInDown").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInDown'
  });
  
  // ** Delays
  // - Up
  $(".viewpoint-fadeInUp-delay1").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInUp delay1'
  });
  $(".viewpoint-fadeInUp-delay2").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInUp delay2'
  });
  $(".viewpoint-fadeInUp-delay3").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInUp delay3'
  });
  $(".viewpoint-fadeInUp-delay4").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInUp delay4'
  });
  $(".viewpoint-fadeInUp-delay5").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInUp delay5'
  });
  
  // - Left
  $(".viewpoint-fadeInLeft-delay1").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInLeft delay1'
  });
  
  // - In
  $(".viewpoint-fadeIn-delay1").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInDown delay1'
  });
  $(".viewpoint-fadeIn-delay2").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInDown delay2'
  });
  $(".viewpoint-fadeIn-delay3").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInDown delay3'
  });
  $(".viewpoint-fadeIn-delay4").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInDown delay4'
  });
  $(".viewpoint-fadeIn-delay5").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeInDown delay5'
  });
  
  // Inset
  $(".viewpoint-fadeInSet-delay1").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeIn delay1'
  });
      $(".viewpoint-fadeInSet-delay2").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeIn delay2'
  });
      $(".viewpoint-fadeInSet-delay3").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeIn delay3'
  });
  $(".viewpoint-fadeInSet-delay4").viewportChecker({
    classToRemove: 'invisible',
    classToAdd: 'animated fadeIn delay4'
  });
  
  // -Zoom
  $(".viewpoint-zoomIn").viewportChecker({
    classToAdd: 'animated zoomIn'
  });
  // * END VIEWPORT ANIMATIONS
});
/**
 * @author aleeper / http://adamleeper.com/
 * @author mrdoob / http://mrdoob.com/
 * @author gero3 / https://github.com/gero3
 *
 * Description: A THREE loader for STL ASCII files, as created by Solidworks and other CAD programs.
 *
 * Supports both binary and ASCII encoded files, with automatic detection of type.
 *
 * Limitations:
 * 	Binary decoding ignores header. There doesn't seem to be much of a use for it.
 * 	There is perhaps some question as to how valid it is to always assume little-endian-ness.
 * 	ASCII decoding assumes file is UTF-8. Seems to work for the examples...
 *
 * Usage:
 * 	var loader = new THREE.STLLoader();
 * 	loader.addEventListener( 'load', function ( event ) {
 *
 * 		var geometry = event.content;
 * 		scene.add( new THREE.Mesh( geometry ) );
 *
 * 	} );
 * 	loader.load( './models/stl/slotted_disk.stl' );
 */


THREE.STLLoader = function () {};

THREE.STLLoader.prototype = {

	constructor: THREE.STLLoader

};

THREE.STLLoader.prototype.load = function ( url, callback ) {

	var scope = this;

	var xhr = new XMLHttpRequest();

	function onloaded( event ) {

		if ( event.target.status === 200 || event.target.status === 0 ) {

			var geometry = scope.parse( event.target.response || event.target.responseText );

			scope.dispatchEvent( { type: 'load', content: geometry } );

			if ( callback ) callback( geometry );

		} else {

			scope.dispatchEvent( { type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.statusText } );

		}

	}

	xhr.addEventListener( 'load', onloaded, false );

	xhr.addEventListener( 'progress', function ( event ) {

		scope.dispatchEvent( { type: 'progress', loaded: event.loaded, total: event.total } );

	}, false );

	xhr.addEventListener( 'error', function () {

		scope.dispatchEvent( { type: 'error', message: 'Couldn\'t load URL [' + url + ']' } );

	}, false );

	if ( xhr.overrideMimeType ) xhr.overrideMimeType( 'text/plain; charset=x-user-defined' );
	xhr.open( 'GET', url, true );
	xhr.responseType = 'arraybuffer';
	xhr.send( null );

};

THREE.STLLoader.prototype.parse = function ( data ) {


	var isBinary = function () {

		var expect, face_size, n_faces, reader;
		reader = new DataView( binData );
		face_size = (32 / 8 * 3) + ((32 / 8 * 3) * 3) + (16 / 8);
		n_faces = reader.getUint32(80,true);
		expect = 80 + (32 / 8) + (n_faces * face_size);
		return expect === reader.byteLength;

	};

	var binData = this.ensureBinary( data );

	return isBinary()
		? this.parseBinary( binData )
		: this.parseASCII( this.ensureString( data ) );

};

THREE.STLLoader.prototype.parseBinary = function ( data ) {

	var reader = new DataView( data );
	var faces = reader.getUint32( 80, true );
	var dataOffset = 84;
	var faceLength = 12 * 4 + 2;

	var offset = 0;

	var geometry = new THREE.BufferGeometry();

	var vertices = new Float32Array( faces * 3 * 3 );
	var normals = new Float32Array( faces * 3 * 3 );

	for ( var face = 0; face < faces; face ++ ) {

		var start = dataOffset + face * faceLength;

		for ( var i = 1; i <= 3; i ++ ) {

			var vertexstart = start + i * 12;

			vertices[ offset     ] = reader.getFloat32( vertexstart, true );
			vertices[ offset + 1 ] = reader.getFloat32( vertexstart + 4, true );
			vertices[ offset + 2 ] = reader.getFloat32( vertexstart + 8, true );

			normals[ offset     ] = reader.getFloat32( start    , true );
			normals[ offset + 1 ] = reader.getFloat32( start + 4, true );
			normals[ offset + 2 ] = reader.getFloat32( start + 8, true );

			offset += 3;

		}

	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

	return geometry;

};

THREE.STLLoader.prototype.parseASCII = function (data) {

	var geometry, length, normal, patternFace, patternNormal, patternVertex, result, text;
	geometry = new THREE.Geometry();
	patternFace = /facet([\s\S]*?)endfacet/g;

	while ( ( result = patternFace.exec( data ) ) !== null ) {

		text = result[0];
		patternNormal = /normal[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

		while ( ( result = patternNormal.exec( text ) ) !== null ) {

			normal = new THREE.Vector3( parseFloat( result[ 1 ] ), parseFloat( result[ 3 ] ), parseFloat( result[ 5 ] ) );

		}

		patternVertex = /vertex[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

		while ( ( result = patternVertex.exec( text ) ) !== null ) {

			geometry.vertices.push( new THREE.Vector3( parseFloat( result[ 1 ] ), parseFloat( result[ 3 ] ), parseFloat( result[ 5 ] ) ) );

		}

		length = geometry.vertices.length;

		geometry.faces.push( new THREE.Face3( length - 3, length - 2, length - 1, normal ) );

	}

	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();

	return geometry;

};

THREE.STLLoader.prototype.ensureString = function (buf) {

	if (typeof buf !== "string"){
		var array_buffer = new Uint8Array(buf);
		var str = '';
		for(var i = 0; i < buf.byteLength; i++) {
			str += String.fromCharCode(array_buffer[i]); // implicitly assumes little-endian
		}
		return str;
	} else {
		return buf;
	}

};

THREE.STLLoader.prototype.ensureBinary = function (buf) {

	if (typeof buf === "string"){
		var array_buffer = new Uint8Array(buf.length);
		for(var i = 0; i < buf.length; i++) {
			array_buffer[i] = buf.charCodeAt(i) & 0xff; // implicitly assumes little-endian
		}
		return array_buffer.buffer || array_buffer;
	} else {
		return buf;
	}

};

THREE.EventDispatcher.prototype.apply( THREE.STLLoader.prototype );

if ( typeof DataView === 'undefined'){

	DataView = function(buffer, byteOffset, byteLength){

		this.buffer = buffer;
		this.byteOffset = byteOffset || 0;
		this.byteLength = byteLength || buffer.byteLength || buffer.length;
		this._isString = typeof buffer === "string";

	}

	DataView.prototype = {

		_getCharCodes:function(buffer,start,length){
			start = start || 0;
			length = length || buffer.length;
			var end = start + length;
			var codes = [];
			for (var i = start; i < end; i++) {
				codes.push(buffer.charCodeAt(i) & 0xff);
			}
			return codes;
		},

		_getBytes: function (length, byteOffset, littleEndian) {

			var result;

			// Handle the lack of endianness
			if (littleEndian === undefined) {

				littleEndian = this._littleEndian;

			}

			// Handle the lack of byteOffset
			if (byteOffset === undefined) {

				byteOffset = this.byteOffset;

			} else {

				byteOffset = this.byteOffset + byteOffset;

			}

			if (length === undefined) {

				length = this.byteLength - byteOffset;

			}

			// Error Checking
			if (typeof byteOffset !== 'number') {

				throw new TypeError('DataView byteOffset is not a number');

			}

			if (length < 0 || byteOffset + length > this.byteLength) {

				throw new Error('DataView length or (byteOffset+length) value is out of bounds');

			}

			if (this.isString){

				result = this._getCharCodes(this.buffer, byteOffset, byteOffset + length);

			} else {

				result = this.buffer.slice(byteOffset, byteOffset + length);

			}

			if (!littleEndian && length > 1) {

				if (!(result instanceof Array)) {

					result = Array.prototype.slice.call(result);

				}

				result.reverse();
			}

			return result;

		},

		// Compatibility functions on a String Buffer

		getFloat64: function (byteOffset, littleEndian) {

			var b = this._getBytes(8, byteOffset, littleEndian),

				sign = 1 - (2 * (b[7] >> 7)),
				exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1),

			// Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
				mantissa = ((b[6] & 0x0f) * Math.pow(2, 48)) + (b[5] * Math.pow(2, 40)) + (b[4] * Math.pow(2, 32)) +
							(b[3] * Math.pow(2, 24)) + (b[2] * Math.pow(2, 16)) + (b[1] * Math.pow(2, 8)) + b[0];

			if (exponent === 1024) {
				if (mantissa !== 0) {
					return NaN;
				} else {
					return sign * Infinity;
				}
			}

			if (exponent === -1023) { // Denormalized
				return sign * mantissa * Math.pow(2, -1022 - 52);
			}

			return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);

		},

		getFloat32: function (byteOffset, littleEndian) {

			var b = this._getBytes(4, byteOffset, littleEndian),

				sign = 1 - (2 * (b[3] >> 7)),
				exponent = (((b[3] << 1) & 0xff) | (b[2] >> 7)) - 127,
				mantissa = ((b[2] & 0x7f) << 16) | (b[1] << 8) | b[0];

			if (exponent === 128) {
				if (mantissa !== 0) {
					return NaN;
				} else {
					return sign * Infinity;
				}
			}

			if (exponent === -127) { // Denormalized
				return sign * mantissa * Math.pow(2, -126 - 23);
			}

			return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
		},

		getInt32: function (byteOffset, littleEndian) {
			var b = this._getBytes(4, byteOffset, littleEndian);
			return (b[3] << 24) | (b[2] << 16) | (b[1] << 8) | b[0];
		},

		getUint32: function (byteOffset, littleEndian) {
			return this.getInt32(byteOffset, littleEndian) >>> 0;
		},

		getInt16: function (byteOffset, littleEndian) {
			return (this.getUint16(byteOffset, littleEndian) << 16) >> 16;
		},

		getUint16: function (byteOffset, littleEndian) {
			var b = this._getBytes(2, byteOffset, littleEndian);
			return (b[1] << 8) | b[0];
		},

		getInt8: function (byteOffset) {
			return (this.getUint8(byteOffset) << 24) >> 24;
		},

		getUint8: function (byteOffset) {
			return this._getBytes(1, byteOffset)[0];
		}

	 };

}
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
let scene3d = document.getElementById("ThreeJsCanvas");
let CANVAS_WIDTH = 500;
let CANVAS_HEIGHT = 400;
// SCENE
let scene_header = new THREE.Scene();
// CAMERA
let camera_header = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
camera_header.position.set(0, 0, 150);
camera_header.lookAt(scene_header.position);
// RENDERER
// transparent div background color
let renderer_header = new THREE.WebGLRenderer( { alpha: true } );
renderer_header.setClearColor( 0x000000, 0 );
renderer_header.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
// GEOMETRY & MATERIALS
// outlined sphere
let geometry_sphere = new THREE.CylinderGeometry( 5, 5, 20, 32 );

let material_phong_outlined = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess:30,
    opacity: 0.4,
    specular: 0x111111,
    wireframe: true
});
let sphere_outlined = new THREE.Mesh(geometry_sphere, material_phong_outlined);
scene_header.add(sphere_outlined);
sphere_outlined.castShadow = true;
sphere_outlined.receiveShadow = true;
material_phong_outlined.transparent = true;
// materials
let lambertMaterial = new THREE.MeshLambertMaterial({
    opacity: 0.1,
    color: 0x50acfd
});
lambertMaterial.transparent=true;
//torus
let geometry_torus = new THREE.OctahedronGeometry(84, 4);
let torus_mesh = new THREE.Mesh( geometry_torus, lambertMaterial );
let torus_mesh_outline = new THREE.Mesh( geometry_torus, material_phong_outlined );
scene_header.add( torus_mesh );
scene_header.add( torus_mesh_outline );
//LOCATION ICONS
let location_icon_PivotPoint = new THREE.Object3D();
location_icon_PivotPoint.position.set( 0, 0, 0 );
let location_icon_geometry_logo = new THREE.BoxGeometry( 18, 18, 0 );
let location_icon_geometry = new THREE.BoxGeometry( 20, 20, 0 );
//   let location_icon_material = new THREE.MeshBasicMaterial( {color: 0x8d8d8d} ); //test material of plain color
THREE.ImageUtils.crossOrigin = '';
let location_icon_image_logo = THREE.ImageUtils.loadTexture( 'https://i.imgur.com/jYNfwFr.png' );
let location_icon_imageMaterial_logo = new THREE.MeshBasicMaterial( {
    map: location_icon_image_logo,
    opacity: 0.8,
    // transparent:true
});
//NOTE: tiling of images in textures only functions if image dimensions are powers of two
//for examples: (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, ...)
location_icon_image_logo.wrapS = location_icon_image_logo.wrapT = THREE.RepeatWrapping;
let location_icon_Mesh_logo = new THREE.Mesh( location_icon_geometry_logo, location_icon_imageMaterial_logo );
location_icon_image_logo.wrapS = location_icon_image_logo.wrapT = THREE.RepeatWrapping;
scene_header.add( location_icon_Mesh_logo );
location_icon_PivotPoint.add( location_icon_Mesh_logo );
scene_header.add( location_icon_PivotPoint );
location_icon_Mesh_logo.position.y = -5;
location_icon_Mesh_logo.position.z = 65;
location_icon_Mesh_logo.position.x = 40;

//CIRCULAR FLOOR
//Create a ground for shape to hover over
let groundGeometry = new THREE.CircleGeometry(7, 50);
let texture_ground = new THREE.MeshPhongMaterial( {
    color:0x50acfd,
    opacity: 0.8,
    specular: 0xffffff,
    shinyness: 20,
    side: THREE.DoubleSide} );
let ground = new THREE.Mesh(groundGeometry, texture_ground);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -55, 0); // (0, -105, 0) to go below the outlined sphere
ground.receiveShadow = true;
scene_header.add(ground);
// brighter lights
let ambientLight = new THREE.AmbientLight( 0x9b9b9b );
scene_header.add( ambientLight );
let lights_header = [];
lights_header[ 0 ] = new THREE.PointLight( 0x090269, 1, 0 );
lights_header[ 1 ] = new THREE.PointLight( 0x990269, 1, 0 );
lights_header[ 2 ] = new THREE.PointLight( 0x72f1ff, 1, 0 );
lights_header[ 0 ].position.set( 0, 200, 0 );
lights_header[ 1 ].position.set( 100, 200, 100 );
lights_header[ 2 ].position.set( - 100, - 200, - 100 );
scene_header.add( lights_header[ 0 ] );
scene_header.add( lights_header[ 1 ] );
scene_header.add( lights_header[ 2 ] );
// light cast shadows
lights_header[ 0 ].castShadow = true;
lights_header[ 1 ].castShadow = true;
lights_header[ 2 ].castShadow = true;

let candleBooks = new THREE.STLLoader(); // loads books into the scene------------------
let candleBooksPivotPoint = new THREE.Object3D();
candleBooks.addEventListener( 'load', function ( event ) {
    let material = new THREE.MeshNormalMaterial();
    let geometry = event.content;
    geometry.computeTangents();
    let bookShelf = new THREE.Mesh( geometry, material );
    bookShelf.position.set( 0, -20, 0);
    bookShelf.rotation.set( -1.2, .2, .3);
    bookShelf.scale.set( 3, 3, 3 );

    bookShelf.castShadow = true;
    bookShelf.receiveShadow = true;

    scene_header.add( bookShelf );
    candleBooksPivotPoint.add( bookShelf );
    scene_header.add( candleBooksPivotPoint );
    candleBooksPivotPoint.transparent = true;
});
candleBooks.load( 'stl/bookCandle.stl' );

// FINISH SCENE SETUP
// document.body.appendChild(scene3d.domElement);
ThreeJsCanvas.appendChild(renderer_header.domElement);
// renderer.render(scene, camera);
let steps = 0;
let render = function () {
    steps += 0.07;
    requestAnimationFrame(render);
    sphere_outlined.rotation.y += 0.01;
    sphere_outlined.rotation.z += 0.01;
    candleBooksPivotPoint.rotation.y += 0.03; //rotates the books

    torus_mesh_outline.rotation.y -= 0.01;
    torus_mesh.rotation.y -= 0.01;
    torus_mesh_outline.rotation.z -= 0.001;
    torus_mesh.rotation.z -= 0.001;
    torus_mesh_outline.position.y = 5 + (1.7*(Math.cos(steps)));
    torus_mesh.position.y = 5 + (1.7*(Math.cos(steps)));
    location_icon_PivotPoint.position.y = 5 + (2.7*(Math.cos(steps)));
    candleBooksPivotPoint.position.y = (2*(Math.cos(steps)));
    renderer_header.render(scene_header, camera_header);
};
render();
(function($){
  $(function(){
    $('.sidenav').sidenav();
  }); 
})(jQuery);

$(document).ready(function() {
  stopIntroAnimation();
  getBooksWhileTyping($('#myInput'));
  colorfulBg();
  setUpBookAnimation();
  setUpBackToSearchBtn();
  checkWindowSize();
});

$(window).resize(function(){
  checkWindowSize();
});

var checkWindowSize = function() {
  var ww = document.body.clientWidth;
  if (ww < 600) {
    $('.card').removeClass('horizontal');
  } else if (ww >= 601) {
    $('.card').addClass('horizontal');
  };
};

function setUpBackToSearchBtn() {
  $('.btn-back-search').click(function() {
    $('.autocomplete').removeClass('d-none').fadeIn('slow');
    $('.output').html('');
    $('.btn-back-search').fadeOut('slow');
    $('.spinning-books').fadeIn('slow').removeClass('d-none');
  });
}

function setUpBookAnimation() {
  $('.click-book-animation').click(function() {
    startIntroAnimation();
  });
}

function startIntroAnimation() {
  $('.main-search-page').fadeOut('slow');
  $('.page-footer').fadeOut('slow');
  $('.navigation-wrapper').fadeOut('slow');
  $('#book-pile-wrapper').fadeIn('slow');
  stopIntroAnimation();
}

function stopIntroAnimation() {
  setTimeout(function() {
      $('.main-search-page').fadeIn('slow').removeClass('d-none');
      $('.page-footer').fadeIn('slow').removeClass('d-none');
      $('.navigation-wrapper').fadeIn('slow').removeClass('d-none');
      $('#book-pile-wrapper').fadeOut('slow');
  }, 3500);
}

function colorfulBg() {
  // Some random colors
  const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

  const numBalls = 50;
  const balls = [];

  for (let i = 0; i < numBalls; i++) {
    let ball = document.createElement("div");
    ball.classList.add("ball");
    ball.style.background = colors[Math.floor(Math.random() * colors.length)];
    ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
    ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
    ball.style.transform = `scale(${Math.random()})`;
    ball.style.width = `${Math.random()}em`;
    ball.style.height = ball.style.width;
    
    balls.push(ball);
    // document.body.append(ball);
    document.getElementById('book-pile-wrapper').prepend(ball);
  }

  // Keyframes
  balls.forEach((el, i, ra) => {
    let to = {
      x: Math.random() * (i % 2 === 0 ? -11 : 11),
      y: Math.random() * 12
    };

    let anim = el.animate(
      [
        { transform: "translate(0, 0)" },
        { transform: `translate(${to.x}rem, ${to.y}rem)` }
      ],
      {
        duration: (Math.random() + 1) * 2000, // random duration
        direction: "alternate",
        fill: "both",
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );
  });
}

function getBooksWhileTyping(inputEl) {
  $('#myInput').keyup(function(event) {
    var element = document.getElementById("loading-css");
    element.classList.remove("d-none");
    $('.output').html('');
    let a, b, i, val = this.value;
    closeAllLists();
    if (!val) { 
        closeAllLists();
        element.classList.add("d-none");
        return false;
    }
    fetch(`https://openlibrary.org/search.json?q=${$('#myInput').val()}&limit=10`)
    .then(a=>a.json())
    .then(response=>{
        closeAllLists();
      console.log(response);
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      
      for (i = 0; i < response.docs.length; i++) {
          let coverArtImg;
          if (!response.docs[i].cover_i) {
              coverArtImg = `/img/cover-img.png`;
          } else {
              coverArtImg = `https://covers.openlibrary.org/b/id/${response.docs[i].cover_i}-S.jpg`;
          }
          b = document.createElement("DIV");
          b.setAttribute("class", "flex box");
          b.innerHTML = `<div class="cover-img-wrapper"><img class="type-cover-img" src="${coverArtImg}" alt=""></div>`;
          b.innerHTML += `<div><a data-id="${response.docs[i].title}" data-key="${response.docs[i].key}" data-author-key="${response.docs[i].author_key[0]}"class="purple-text book-titles" onclick="getBookDetails(this)">` + response.docs[i].title + "</a><br>by: " + response.docs[i].author_name[0] + "</div>";
          b.addEventListener("click", function(e) {
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });

          window.addEventListener('click', function(e){   
              if (document.getElementById('myInputautocomplete-list') && document.getElementById('myInputautocomplete-list').contains(e.target)){
              } else {
                // Clicked outside the box
                closeAllLists();
                $('#myInput').val('');
              }
          });
          element.classList.add("d-none");
          a.appendChild(b);
        }
        if (!response.docs.length || response.numFound == 0 || response.num_found == 0) {
          $('.output').html(`<span class="no-such-results">No Such Results</span>`);
          closeAllLists();
          element.classList.add("d-none");
        }
      });
      const keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        event.preventDefault();
        closeAllLists();
        getBooks();
      }
  });
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inputEl) {
          x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

function getBookDetails(identifier) {
  $('.autocomplete').addClass('d-none');
  $('.spinning-books').fadeOut('slow').addClass('d-none');
  $('.btn-back-search').removeClass('d-none').fadeIn('slow');

  const authorKey = $(identifier).data('author-key'); 
  let authorName = '';
  let authorBio = 'No Bio Yet';
  let authorBioHtml = '';
  let authorWiki = '';
  let authorWikiHtml = '';
  let authorPhoto = '';
  let authorPhotoHtml = '';
  fetch(`https://openlibrary.org/authors/${authorKey}.json`)
    .then(a=>a.json())
    .then(response=>{
        // console.log('author info: ',response);
        authorName = response.name;
        if (response.bio) {
          authorBio = response.bio;
          if (response.bio.value) {
            authorBio = response.bio.value;
          }
        }
        authorBioHtml = `<div class="card-content">Biography: ${authorBio}</div>`;
        if (response.wikipedia) {
          authorWiki = response.wikipedia;
          authorWikiHtml = `<div class="card-action">
                            <a class="purple-text" href="${authorWiki}" target="_blank">Author Wikipedia</a>
                          </div>`;
        }

        authorPhoto = `https://covers.openlibrary.org/a/olid/${authorKey}.jpg`; // https://covers.openlibrary.org/a/$key/$value-$size.jpg, ex: https://covers.openlibrary.org/a/olid/OL229501A-S.jpg
        authorPhotoHtml = `<img class="author-photo" src="${authorPhoto}" alt="author photo">`;
    }
  );

  const bookKey = $(identifier).data('key');
  fetch(`https://openlibrary.org${bookKey}.json`)
  .then(a=>a.json())
  .then(response=>{
    console.log(response);
    let outputText = '';
    let coverArtImg = `/img/cover-img.png`; // placeholder
    let bookDescription = '';
    let subjectMatters = '';

    if (response.covers && response.covers.length) {
      coverArtImg = `https://covers.openlibrary.org/b/id/${response.covers[0]}-L.jpg`;
    }
    
    if (response.description) {
      if (response.description && response.description.value) {
        bookDescription = `<p><span class="text-bold">Description: ${response.description.value}</span>`;
      } 
      bookDescription = `<p class="description-box"><span class="text-bold">Description: ${response.description}</span>`;
    } 
    if (response.subjects && response.subjects.length) {
      subjectMatters = `<p><span class="text-bold">Subject: `;
      response.subjects.forEach(function(subject){
        subjectMatters += `<span class="subject-matters">${subject}</span>`;
      });
      subjectMatters += `<span>`;
    }
    
    outputText += `
      <div class="col s12 m7">
        <div class="card horizontal">
            <div class="card-image">
              <img class="cover-img cover-img-searched" src="${coverArtImg}" alt="">
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <h5>${response.title}</h5>
                <ul class="collapsible">
                  <li>
                    <div class="collapsible-header purple-text"><i class="material-icons">account_box</i>
                      <span class="text-bold">By:&nbsp;</span>${authorName}
                    </div>
                    <div class="collapsible-body">
                      <div class="card">
                        <div class="card-image">
                          ${authorPhotoHtml}
                        </div>
                        <div class="card-stacked">
                          ${authorBioHtml}
                          ${authorWikiHtml}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                ${bookDescription}
                ${subjectMatters}
              </div>
            </div>
          </div>
      </div>`;
    $('.output').html(outputText);
    $('.collapsible').collapsible();
    checkWindowSize();
  });
}

//# sourceMappingURL=init-dist.js.map