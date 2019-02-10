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