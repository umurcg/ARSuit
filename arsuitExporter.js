//Structure---------

/*
-XScene (Object)
    *backgroundColor (THREE.Color)
    *lightColor (THREE.Color)
    *lightPosition (THREE.Vector3)
    *lightIntensity (float)
    -Scene (Object)
        -Object1 (Object)
        -Object2 (Object)
        ...               
        -ObjectX (Object)
            -GeometryData (Object)
                *vertices
                *faces
                *faceVertexUVs
            -DefaultTextureUUID (String)            
            -Textures (Object)
                -Texture1 (Object)
                -Texture2 (Object)
                ...
                -TextureX (Object)
                    *map (dataurl)
                    *normalMap (dataurl) - fake depth effect
                    *displacementMap (dataurl) - changing geometry                                                                       
                    *alphaMap (dataurl) - opacity
                    *aoMap (dataurl) - ambient occulusion 
                    *roughnessMap (data url) - Mirror effect
                    *metalnessMap - metalEffect
*/
function arsuitExporter(scene,textures){

    var scope=this;

    this.scene=scene;
    this.objectTextures=textures;

    this.json={};
    
    //Save scene backgorund
    this.json["background"]=scene.background;

    //Create bundle section
    this.json["bundle"]={};

    //Loop for each object
    var sceneObjs=scene.children;
    for(o in sceneObjs){
        
        var object=sceneObjs[o];

        
        //If object is light then exort it as light
        if(object instanceof THREE.Light){
            this.json["light"]=exportLight(object);
        //Else export it as object
        }else if(object instanceof THREE.Group){

            for(let oo in object.children){
                var child=object.children[oo];
                
                var objName=child.name;
                this.json["bundle"][objName]=exportObject(child);
            }
        }
    }

    

    //EXPORTER FUNCTIONS-------
    
    function exportLight(light){
        var json={};
        json["color"]=light.color;
        json["intensity"]=light.intensity;
        json["position"]=light.position;
        return json;
    
    }
    
    function exportObject(obj){
        var objectName=obj.name;
        

        var json={};
        json["geometryData"]=exportGeometry(obj.geometry);
        json["textures"]=exportObjectTextures(objectName)
        json["defaultTextureUUID"]=null;

        


        return json;
        
    }
    
    function exportGeometry(geometry){
        // const vertices=geometry.vertices;
        // const faces=geometry.faces;
        // const faceVertexUVs=geometry.faceVertexUVs;
    
        
        return null;
        // return {"vertices":vertices,"faces":faces,"faceVertexUVs":faceVertexUVs};
        return geometry.toJSON();
    
    }
    
    
    function exportObjectTextures(objectName){

        var json={};
        
        var objTextures=scope.objectTextures[objectName];

        if(objTextures!==undefined){

            for (var ot in objTextures){
                                
                var textureBundle=objTextures[ot];
                
                json[textureBundle.uuid]=textureBundle.toJson();                                            
                
            }

        }else{
            return null;
        }

        return json;
    }


}

