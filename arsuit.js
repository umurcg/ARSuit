function uploadBufferFile(onload,extension){
	var fileInput = document.createElement( 'input' );
    fileInput.type = 'file';
    fileInput.accept= "."+extension;

    fileInput.addEventListener( 'change', function ( event ) {

        var file=fileInput.files[0];        
        var reader = new FileReader();

        reader.addEventListener( 'load', function ( event ) {

			var contents = event.target.result;					
			onload(contents);
				

		}, false );
		reader.readAsArrayBuffer( file );


    } );

    fileInput.click();

}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

function uploadTextFile(onload,extension){
	
	var fileInput = document.createElement( 'input' );
    fileInput.type = 'file';
    fileInput.accept= "."+extension;

    fileInput.addEventListener( 'change', function ( event ) {

        var file=fileInput.files[0];        
        var reader = new FileReader();

        reader.addEventListener( 'load', function ( event ) {

			var contents = event.target.result;					
			onload(contents);
			debugger;
				

		}, false );
		reader.readAsText( file );


    } );
    

    fileInput.click();

}

function importFBX(onload){

	uploadBufferFile(function(contents){
		var loader = new THREE.FBXLoader();
		var object = loader.parse( contents );
		onload(object);
			
	},"fbx");

}

function importTexture(onload){
	var fileInput = document.createElement( 'input' );
    fileInput.type = 'file';
    fileInput.accept= ".jpg";

    fileInput.addEventListener( 'change', function ( event ) {

    	var file=fileInput.files[0];        	  		  
    	var userImageURL = URL.createObjectURL( file );

		onload(userImageURL);

    	// var loader = new THREE.TextureLoader();
    	// loader.setCrossOrigin("");
    	// var texture = loader.load(userImageURL);
    	// onload(texture);

    } );


    fileInput.click();


}


   //Cmpute merged bounding box of group with calculating all bounding box of child objects
THREE.Object3D.prototype.computeBoundingBox=function(){
	var unionBox=new THREE.Box3();
	var children=this.children;
	for(c in children){
		var child=children[c];
		if(child instanceof THREE.Mesh || child instanceof THREE.Group){
			var box=child.computeBoundingBox();
			if(box===null)
				continue;
			unionBox.union(box);
		}
	}
	//Assign bounding box to this group
	this.boundingBox=unionBox;
	return unionBox;
}
              
//Computes boundingg box of mesh
THREE.Mesh.prototype.computeBoundingBox=function(){
	if(this.geometry===undefined){
		return null;
	}
	this.geometry.computeBoundingBox();
	var box= this.geometry.boundingBox;
	this.boundingBox=box;
	return box;
}
		    
//Sets camera as object will fit to camera view bounds					    
function fixCameraToObject(camera,object){
    
    var boundingBox=object.computeBoundingBox();	    
	var diagonal=new THREE.Vector3().subVectors(boundingBox.max,boundingBox.min);
	var maxDim=diagonal.length();			
	
    //Set z position to 3/2 max Dimension
    camPos= new THREE.Vector3(0,0,maxDim*3/2);
    //Move both camera to max dim position
    camera.position.copy(camPos)
   
    //Set perspective camera far and near values
    camera.far=maxDim*4;
    camera.near=maxDim/100;
    camera.updateProjectionMatrix();	    	    
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
}

function TextureBundle(bundleName){
	this.uuid=uuidv4();
	if(bundleName===undefined)
		this.name="Texture"+this.uuid;
	else
		this.name=bundleName;
	
	this.Map=null;
	this.BumpMap=null;
	this.NormalMap=null;
	this.DisplacementMap=null;
	this.AlphaMap=null;
	this.AoMap=null;
	this.RoughnessMap=null
	this.MetalnessMap=null
	
	this.changeTexture=function(ttype,texture){
		this[ttype]=texture;
		if(this.updateObject!==null)
			this.updateObject();
	}


	//Assign a function that will be triggered when a texture is changed
	this.updateObject=null;

	

}

TextureBundle.prototype.toJson=function(){
	var json=Object.assign({},this)
	delete(json.updateObject);
	delete(json.changeTexture);
	
	return json;
}