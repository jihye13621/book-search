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