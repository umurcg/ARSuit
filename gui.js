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

function lightController(gui){

}


function sceneController(gui){

}

function textureController(gui){

}


function modelImporter(gui){



    var importFBXButton = { ImportModel:function(){ 

    	//Imports fbx from local of user
    	importFBX(function(object){

    		//Remove previos object if exists
    		if(objectGroup!==undefined)
    			scene.remove(objectGroup);

    		objectGroup=object;
    		scene.add(objectGroup)
    		fixCameraToObject();
    		updateTextureController();
    		controls.update();
    		render();
    		
          		            	         
    	});

    }};
	gui.add(importFBXButton,'ImportModel');


}

  //UI
           

        
			


			var parameters={
				lightIntensity:light.intensity,
				lightColor:light.color,
				sunPosition:{x:light.position.x,y:light.position.y,z:light.position.z},
				sceneColor:scene.background
				
			}

			var sceneController=gui.addFolder("Scene Controller");


			sceneController.add(parameters,"lightIntensity").onChange(function(){								
				light.intensity=parameters.lightIntensity;
				render();
			});
			sceneController.addThreeColor(parameters,"lightColor");

			function updateRotation(){
				var x=parameters.sunPosition.x;
				var y=parameters.sunPosition.y;
				var z=parameters.sunPosition.z;				
				light.position.set(x, y , z);
				render();				
			}


			var lightRotController=sceneController.addFolder("Sun Position");
			lightRotController.add(parameters.sunPosition,"x").onChange(updateRotation);
			lightRotController.add(parameters.sunPosition,"y").onChange(updateRotation);
			lightRotController.add(parameters.sunPosition,"z").onChange(updateRotation);
			
			sceneController.addThreeColor(parameters,"sceneColor");			

			var textureFolder=gui.addFolder("Texture Controller");

			function changeObjectTexture(object){

				importTexture(function(texture){
					
					object.material.map=texture;
					object.material.needsUpdate = true;
					render();
					console.log("updated material");
				})

            }


			function updateTextureController(){
				textureFolder.removeFolder();
				var objects=objectGroup.children;

				for(let o in objects){
					let buttonFunction={};
					buttonFunction[objects[o].name]=function(){
						changeObjectTexture(objects[o])
					}
					var changeTextButton=textureFolder.add(buttonFunction,objects[o].name);
				}
			}
		