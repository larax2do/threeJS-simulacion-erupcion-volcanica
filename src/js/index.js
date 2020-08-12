import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Detector from "../js/vendor/Detector";

//pruebas
//import  terrain from "../textures/agri-small-dem.tif";
//import  mountainImage from "../textures/agri-small-autumn.jpg";

//Misti
import  terrain from "../textures/mistiDEM.tif";
import  mountainImage from "../textures/mistiMAPA1.jpg";
import  lavaImage from "../textures/lava.jpg";

import * as GeoTIFF from "geotiff";

require("../sass/home.sass");

class Application {
  constructor(opts = {}) {

    this.count=1000;
    this.distanciaA=9999;
    this.maxg = new THREE.Vector3( 0, 0, -0.1 );
    this.meta = new THREE.Vector3(-1000,82,-15);
    

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (opts.container) {
      this.container = opts.container;
    } else {
      const div = Application.createContainer();
      document.body.appendChild(div);
      this.container = div;
    }

    if (Detector.webgl) {
      this.init();
      this.render();
    } else {
      // TODO: style warning message
      console.log("WebGL NOT supported in your browser!");
      const warning = Detector.getWebGLErrorMessage();
      this.container.appendChild(warning);
    }
  }

  init() {
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.finterr=false;
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLight();
    
    this.setupTerrainModel();
    this.setupEsfera();
    this.setupHelpers();

    window.addEventListener("resize", () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
  }

  render() {
    this.controls.update();
    if(this.finterr)
    {

      //Algoritmo PSO

      do
      {
        for (var i = 0 ; i < this.count ; i++) {
          var esfera=this.balls[num];
          // funcion objetivo
          var objetivo=this.meta.distanceTo(esfera[0].position);
          var 


          //actualizar el maximo conocido


          //actualizar el maximo global

        }
        //actualiza la tasa de inercia
        for (var i = 0 ; i < this.count ; i++) {
          //actualizar velocidad

          //actualizar posicion

        }
      }
      while(true);//condicion de satisfaccion


      var num=Math.floor(Math.random()* (this.count - 0) + 0);
      //for(var i = 0 ; i < this.count ; i++)
      //{

        var esfera=this.balls[num];
        var opc=Math.floor(Math.random()* (4 - 0) + 0);
        console.log("opc=",num);
        var mov=Math.random()* (2 - 0.01) + 0.01;
        

        var vec=esfera[0].position.add(esfera[2].add(esfera[1].add(this.maxg)));
        console.log("x=",vec.x);
        console.log("z=",vec.z);
        esfera[0].position.x=vec.x;
        esfera[0].position.z=vec.z;

        var raycaster = new THREE.Raycaster();
        esfera[0].position.y=-600;
        this.raycaster.set(esfera[0].position, new THREE.Vector3(0, 1, 0));

        var intersects = this.raycaster.intersectObject(this.mountain);
        esfera[0].position.y = intersects[0].point.y + 0.7;



      //}


    /*
      this.sphere.position.z += 0.03;

    var raycaster = new THREE.Raycaster();
    this.raycaster.set(this.sphere.position, new THREE.Vector3(0, -1, 0));

    var intersects = this.raycaster.intersectObject(this.mountain);
    this.sphere.position.y = intersects[0].point.y + 0.7;

    */
    }
    

    this.renderer.render(this.scene, this.camera);
    // when render is invoked via requestAnimationFrame(this.render) there is
    // no 'this', so either we bind it explicitly or use an es6 arrow function.
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(() => this.render());
  }

  static createContainer() {
    const div = document.createElement("div");
    div.setAttribute("id", "canvas-container");
    div.setAttribute("class", "container");
    // div.setAttribute('width', window.innerWidth);
    // div.setAttribute('height', window.innerHeight);
    return div;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xd3d3d3); // it's a dark gray
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    const fov = 75;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 10000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(500, 500, 500);
    this.camera.lookAt(this.scene.position);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    this.controls.autoRotate = true;
  }

  setupLight() {
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(500, 1000, 250);
    this.scene.add(this.light);
    // this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }

  setupTerrainModel() {
    const readGeoTif = async () => {
      console.log("Inicia terrain");
      const rawTiff = await GeoTIFF.fromUrl(terrain);
      const tifImage = await rawTiff.getImage();
      const image = {
        width: tifImage.getWidth(),
        height: tifImage.getHeight()
      };
      

      /* 
      The third and fourth parameter are image segments and we are subtracting one from each,
       otherwise our 3D model goes crazy.
       https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js#L57
       */
      const geometry = new THREE.PlaneGeometry(
        image.width,
        image.height,
        image.width - 1,
        image.height -1
      );
      const data = await tifImage.readRasters({ interleave: true });

      console.time("parseGeom");
      geometry.vertices.forEach((geom, index) => {
        geom.z = (data[index] / 20) /* * 1 */;
      });
      console.timeEnd("parseGeom");

      const texture = new THREE.TextureLoader().load(mountainImage);
      const material = new THREE.MeshLambertMaterial({
        wireframe: false,
        side: THREE.DoubleSide,
        map: texture
      });

      this.mountain = new THREE.Mesh(geometry, material);
      this.mountain.position.y = -100;
      this.mountain.rotation.x = -Math.PI / 2;

      this.scene.add(this.mountain);
      this.mountain.updateMatrixWorld(true)




      //esferas

      

      const pgeometry = new THREE.CircleGeometry( 11, 10);
      const ptext= new THREE.TextureLoader().load(lavaImage);
      const pmaterial = new THREE.MeshLambertMaterial( {
          
          wireframe: false,
          side: THREE.DoubleSide,
          map: ptext
      });
      
      var plane = new THREE.Mesh( pgeometry, pmaterial );
      //plane.position.y=182.5;

      plane.position.y=400;
      plane.position.x=82;
      plane.position.z=-15;
      plane.rotation.x=Math.PI/2;
      this.scene.add( plane );


      this.finterr= true;
      console.log("fin terrain");
      const loader = document.getElementById("loader");
      loader.style.opacity = "-1";

      // After a proper animation on opacity, hide element to make canvas clickable again
      setTimeout(
        (() => {
          loader.style.display = "none";
        }),
        1500
      );
    };

    readGeoTif();
  }

  setupEsfera()
  {
    
    this.balls = [];

      for ( var i = 0 ; i < this.count ; i++ )
      {
        var interno=[];

        //console.log("Inicia e");
        var sphere_geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        var sphere_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
        sphere.position.y=-600;

        //plane.position.y=182.5;

        //plane.position.y=400;
        sphere.position.x=82;
        sphere.position.z=-15;


        interno.push(sphere);
        interno.push(new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z));//maxlocal
        interno.push(new THREE.Vector3(Math.random()* (1 - 0.1) + 0.1, 0, Math.random()* (1 - 0.1) + 0.1));//velocidad
        this.balls.push(interno);


        this.scene.add(sphere);
        //console.log("fin e");
        //radius of sphere    
      }
    

  }

  setupHelpers() {
    const gridHelper = new THREE.GridHelper(1000, 40);
    this.scene.add(gridHelper);

    // const dirLightHelper = new THREE.DirectionalLightHelper(this.light, 10);
    // this.scene.add(dirLightHelper);

    console.log("The X axis is red. The Y axis is green. The Z axis is blue.");
    const axesHelper = new THREE.AxesHelper(500);
    this.scene.add(axesHelper);
  }
}

// wrap everything inside a function scope and invoke it (IIFE, a.k.a. SEAF)
(() => {
  const app = new Application({
    container: document.getElementById("canvas-container")
  });
  console.log(app);
})();
