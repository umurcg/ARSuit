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

    	var loader = new THREE.TextureLoader();
    	loader.setCrossOrigin("");
    	var texture = loader.load(userImageURL);
    	onload(texture);

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
