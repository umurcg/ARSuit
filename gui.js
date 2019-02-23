   //GUI Helper functions------------------------
dat.GUI.prototype.addThreeColor=function(obj,varName){
    // threejs & dat.gui have color incompatible formats so we use a dummy data as target :
    var dummy={};
    // set dummy initial value :
    dummy[varName]=obj[varName].getStyle(); 
    return this.addColor(dummy,varName)
        .onChange(function( colorValue  ){
            //set color from result :
            obj[varName].setStyle(colorValue);
        });
};
dat.GUI.prototype.addThreeUniformColor=function(material,uniformName,label){
    return this.addThreeColor(material.uniforms[uniformName],"value").name(label||uniformName);
};
dat.GUI.prototype.removeFolder = function(name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
}
	//GUI Helper functions------------------------

function buildGUI(){
 	return new dat.GUI();
}

function lightController(gui, light){

	var parameters={
		lightIntensity:light.intensity,
		lightColor:light.color,
		sunPosition:{x:light.position.x,y:light.position.y,z:light.position.z}						
	}


	function updateRotation(){
		var x=parameters.sunPosition.x;
		var y=parameters.sunPosition.y;
		var z=parameters.sunPosition.z;				
		light.position.set(x, y , z);
		
	}

	var lightController= gui.addFolder("Light Controller");
	var lightRotController=lightController.addFolder("Sun Position");
	lightRotController.add(parameters.sunPosition,"x").onChange(updateRotation);
	lightRotController.add(parameters.sunPosition,"y").onChange(updateRotation);
	lightRotController.add(parameters.sunPosition,"z").onChange(updateRotation);

	lightController.add(parameters,"lightIntensity").onChange(function(){								
		light.intensity=parameters.lightIntensity;
		// render();
	});

	lightController.addThreeColor(parameters,"lightColor");


}


function sceneController(gui, scene){

	var parameters={
		sceneColor:scene.background		
	}

	var sceneController=gui.addFolder("Scene Controller");
	sceneController.addThreeColor(parameters,"sceneColor");			
}

function textureController(gui){

	
	var textureFolder=gui.addFolder("Texture Controller");

	var textureType={
		map :1,
		normalMap:2, 
		displacementMap:3,
		alphaMap:4,
		aoMap :5,
		roughnessMap :6,
		metalnessMap :7
	}


	function addObjectTexture(textureBundle, textureType){

		let ttype=textureType
		
		importTexture(function(texture){			

				textureBundle.changeTexture(ttype,texture);											
			
		})
  }


	this.clear=textureFolder.removeFolder;
	
	function createTextureSection(ownerFolder, textureBundle){
			
			var buttonFolder=ownerFolder.addFolder(textureBundle.name);
	
			for(let textType in textureBundle){
					if(textType!=="uuid" && textType!=="name"){
						
						var buttonName="Set"+textType;
						var addTextButton={}
						addTextButton[buttonName]=()=>{addObjectTexture(textureBundle,textType)};
						buttonFolder.add(addTextButton,buttonName);
					}
						
			}

			

	}

	this.updateObjects=function(objects){
		
		//Dictionary holding objects' textures
		var objectsTextures={}

		textureFolder.removeFolder();

		//Create folder for each objects
		for(let o in objects){

				
				let objectName=objects[o].name;

				//Create dictionary for object's texture bundles
				objectsTextures[objectName]={}

				let textObjFolder=textureFolder.addFolder(objectName);

				//New texture button
				var newTextureBut={"NewTexture":createNewTextureBundle}
				textObjFolder.add(newTextureBut,"NewTexture");

				function createNewTextureBundle(){
					 var bundleName="Texture_"+Object.keys(objectsTextures[objectName]).length;
					 var textureBundle=new TextureBundle(bundleName);					 
					 objectTextures[objectName][textureBundle.uuid]=textureBundle;
					 createTextureSection(textObjFolder,textureBundle)
				}

				// let buttonFunction={};
				// buttonFunction[objects[o].name]	=	()=>{changeObjectTexture(objects[o])}						
				// var changeTextButton=textureFolder.add(buttonFunction,objects[o].name);
		}

		
		return objectsTextures;

	}
	



}





			// switch(ttype) {
			// 	case textureType.map:
			// 		object.material.map=texture;
			// 		break;
			// 	case textureType.normalMap:
			// 		object.material.normalMap=texture;
			// 		break;
			// 	case textureType.displacementMap:
			// 		object.material.displacementMap=texture;
			// 		break;
			// 	case textureType.alphaMap:
			// 		object.material.alphaMap=texture;
			// 		break;
			// 	case textureType.aoMap:
			// 		object.material.aoMap=texture;
			// 		break;
			// 	case textureType.roughnessMap:
			// 		object.material.roughnessMap=texture;
			// 		break;
			// 	case textureType.metalnessMap:
			// 		object.material.metalnessMap=texture;
			// 		break;
			// 	default:
			// 		break;
			// }
			// object.material[textureType]=texture;			
			// object.material.needsUpdate = true;	