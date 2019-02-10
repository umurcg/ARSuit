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


	function changeObjectTexture(object){

		importTexture(function(texture){			
			object.material.map=texture;
			object.material.needsUpdate = true;						
		})
    }


	this.clear=textureFolder.removeFolder;
	
	this.updateObjects=function(objects){
		
		textureFolder.removeFolder();
		for(let o in objects){
				let buttonFunction={};
				buttonFunction[objects[o].name]=function(){
				changeObjectTexture(objects[o])
			}
			var changeTextButton=textureFolder.add(buttonFunction,objects[o].name);
		}
	}
	
}



