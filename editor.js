var camera, scene, renderer, objectGroup,  controls, light , objectTextures;
createScene();
                  
function createScene() {


    // Renderer.
    renderer = new THREE.WebGLRenderer({antialias:true});
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.onmouseover=()=>{controls.enabled=true};
    renderer.domElement.onmouseout=()=>{controls.enabled=false};

    // Add renderer to page
    document.body.appendChild(renderer.domElement);

    // Create camera.
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = -1;

    // Create scene.
    scene = new THREE.Scene();
    scene.background=new THREE.Color(0xffffff);

    //Orbit controls
    controls = new THREE.OrbitControls( camera );
    controls.enabled=false;

    // Create ambient light and add to scene.
    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add(light);

    //Test cube
    // scene.add( new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial( {color: 0x00ff00} ) ) );

    // Add listener for window resize.
    window.addEventListener('resize', onWindowResize, false);

    

    render();
}



document.addEventListener( 'mousedown', render, false );
document.addEventListener( 'wheel', render, false );
document.addEventListener( 'mousemove', render, false );

function render(){
    renderer.render(scene,camera);                
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


var gui=buildGUI();

function clearObjectTextures(obj){

    obj.material.map=null;
    obj.material.bumpMap=null;
    obj.material.normalMap=null;
    obj.material.displacementMap=null;
    obj.material.alphaMap=null;
    obj.material.aoMap=null;
    obj.material.roughnessMap=null;
    obj.material.metalnessMap=null;
    obj.material.needsUpdate=true;
    
}

var importFBXButton = { ImportModel:function(){ 

    //Imports fbx from local of user
    importFBX(function(object){

        //Remove previos object if exists
        if(objectGroup!==undefined)
            scene.remove(objectGroup);

        objectGroup=object;

        //For each object, rmeove textures because textures will be uploaded by user seperatly
        for(var c in object.children){
            var obj=object.children[c];
            
            // var mainTexture=    obj.material.map;
            // var normalMap=      obj.material.normalMap;
            // var displacementMap=obj.material.displacementMap;
            // var alphaMap=       obj.material.alphaMap;
            // var aoMap=          obj.material.aoMap;
            // var roughnessMap=   obj.material.roughnessMap;
            // var metalnessMap=   obj.material.metalnessMap;

            clearObjectTextures(obj);


        }
        

        scene.add(objectGroup)
        fixCameraToObject(camera,objectGroup);
        objectTextures=textureController.updateObjects(objectGroup.children);
        controls.update();
        render();
        
                                       
    });

}};
gui.add(importFBXButton,'ImportModel');

lightController(gui,light);

sceneController(gui, scene);


var textureController=new textureController(gui);

var saveController={
    saveScene:function(){
        
        
        var exporter=new arsuitExporter(scene,objectTextures);
        var jsonText=JSON.stringify(exporter.json);
        download(jsonText,"bundle.json","txt")
        
        // // Instantiate a exporter
        // var exporter = new THREE.GLTFExporter();

        // // Parse the input and generate the glTF output
        // exporter.parse( objectGroup.children, function ( gltf ) {


        // 	var saveFile=gltf;

        // 	//save background color because gltf doesnt save it
        // 	saveFile.background=scene.background
        // 	saveFile.lightIntensity=light.intensity;
        // 	saveFile.lightColor=light.color;
        // 	saveFile.lightPosition=light.position;

        // 	saveFile.objBumpMaps={};

        // 	for(m in objectGroup.children){

        // 		var obj=objectGroup.children[m];
        // 		var bumpMap=obj.material.bumpMap;
        // 		if(bumpMap===null)
        // 			continue;
                
        // 		saveFile.objBumpMaps[obj.uuid]=bumpMap.toJSON();

                
        // 	}


        

        // 	var json=JSON.stringify(saveFile)
            
        // 	download(json,"scene.json","txt");
        // } );
        
    }
}

gui.add(saveController,"saveScene");

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


