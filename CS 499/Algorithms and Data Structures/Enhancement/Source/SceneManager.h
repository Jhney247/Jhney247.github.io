///////////////////////////////////////////////////////////////////////////////
// shadermanager.h
// ============
// manage the loading and rendering of 3D scenes
//
//  AUTHOR: Brian Battersby - SNHU Instructor / Computer Science
//	Created for CS-330-Computational Graphics and Visualization, Nov. 1st, 2023
///////////////////////////////////////////////////////////////////////////////
#pragma once
#include "ShaderManager.h"
#include "ShapeMeshes.h"
#include <string>
#include <vector>

#include "Octree.h"
#include "SceneNode.h"
#include "PerformanceProfiler.h"

/***********************************************************
 *  SceneManager
 *
 *  This class contains the code for preparing and rendering
 *  3D scenes, including the shader settings.
 ***********************************************************/
class SceneManager
{
public:
	// constructor
	SceneManager(ShaderManager* pShaderManager);
	// destructor
	~SceneManager();

    // Register a scene object in the octree
    void RegisterSceneObject(const SceneObject& obj);
    // Query objects in a region (for frustum culling, etc.)
    void QueryObjectsInRegion(const glm::vec3& min, const glm::vec3& max, std::vector<int>& results) const;
    
    // Scene graph management
    void BuildSceneGraph();
    void UpdateSceneGraph();

	struct TEXTURE_INFO
	{
		std::string tag;
		uint32_t ID;
	};

	struct OBJECT_MATERIAL
	{
		float ambientStrength;
		glm::vec3 ambientColor;
		glm::vec3 diffuseColor;
		glm::vec3 specularColor;
		float shininess;
		std::string tag;
	};

private:
	// pointer to shader manager object
	ShaderManager* m_pShaderManager;
	// pointer to basic shapes object
	ShapeMeshes* m_basicMeshes;
	// total number of loaded textures
	int m_loadedTextures;
	// loaded textures info
	TEXTURE_INFO m_textureIDs[16];
	// defined object materials
	std::vector<OBJECT_MATERIAL> m_objectMaterials;

    // Octree for spatial partitioning
    Octree* m_octree;
    
    // Scene graph root node
    std::shared_ptr<SceneNode> m_sceneRoot;

	// load texture images and convert to OpenGL texture data
	bool CreateGLTexture(const char* filename, std::string tag);
	// bind loaded OpenGL textures to slots in memory
	void BindGLTextures();
	// free the loaded OpenGL textures
	void DestroyGLTextures();
	// find a loaded texture by tag
	int FindTextureID(std::string tag);
	int FindTextureSlot(std::string tag);
	// find a defined material by tag
	bool FindMaterial(std::string tag, OBJECT_MATERIAL& material);

	// set the transformation values 
	// into the transform buffer
	void SetTransformations(
		glm::vec3 scaleXYZ,
		float XrotationDegrees,
		float YrotationDegrees,
		float ZrotationDegrees,
		glm::vec3 positionXYZ);

	// set the color values into the shader
	void SetShaderColor(
		float redColorValue,
		float greenColorValue,
		float blueColorValue,
		float alphaValue);

	// set the texture data into the shader
	void SetShaderTexture(
		std::string textureTag);

	// set the UV scale for the texture mapping
	void SetTextureUVScale(
		float u, float v);

	// set the object material into the shader
	void SetShaderMaterial(
		std::string materialTag);

public:
	// The following methods are for the students to 
	// customize for their own 3D scene

	// define materials for realistic lighting
	void DefineObjectMaterials();

	// setup scene lighting for Phong illumination
	void SetupSceneLights();

	// load textures for the 3D scene
	void LoadSceneTextures();

	// prepare the 3D scene
	void PrepareScene();

	// render the 3D scene
	void RenderScene();
};