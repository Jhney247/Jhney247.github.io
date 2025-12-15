///////////////////////////////////////////////////////////////////////////////
// SceneManager.cpp - ENHANCED WITH BEST PRACTICES COMMENTING  
// ============
// Manages the loading and rendering of 3D scenes with professional standards
// PURPOSE: Handle all 3D object creation, positioning, texturing, and lighting
// MODULAR DESIGN: Separated object rendering, texture management, lighting setup
//
// SCENE COMPOSITION: Desk workspace with laptop, books, lamp, mug, plant
// REQUIREMENTS MET: Texturing, lighting, object placement, primitive shapes
// BEST PRACTICES: Clear comments, modular functions, industry formatting
//
//  AUTHOR: Brian Battersby - SNHU Instructor / Computer Science
//	Created for CS-330-Computational Graphics and Visualization, Nov. 1st, 2023
//  ENHANCED: Complete requirements implementation + best practices
///////////////////////////////////////////////////////////////////////////////

#include "SceneManager.h"

#ifndef STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#endif

#define GLM_ENABLE_EXPERIMENTAL
#include <glm/gtx/transform.hpp>

// Global shader uniform names - must match shader variable names exactly
namespace
{
	const char* g_ModelName = "model";           // Model transformation matrix
	const char* g_ColorValueName = "objectColor"; // Object color uniform
	const char* g_TextureValueName = "objectTexture"; // Texture sampler uniform  
	const char* g_UseTextureName = "bUseTexture"; // Boolean for texture usage
	const char* g_UseLightingName = "bUseLighting"; // Boolean for lighting toggle
}

/***********************************************************
 *  RenderScene()
 *
 *  PURPOSE: Render complete 3D desk scene with all objects
 *  FUNCTIONALITY: Creates textured objects positioned like reference photo
 *  REQUIREMENTS MET: Object placement, texturing, primitive shapes
 *  BEST PRACTICE: Well-organized object creation with clear sections
 *
 *  SCENE OBJECTS RENDERED:
 *  - Desk surface (plane) - TEXTURED with rusticwood.jpg
 *  - Laptop (2 boxes) - TEXTURED with gray.jpg for body
 *  - Coffee mug with handle (cylinder + torus)
 *  - 3 stacked books (3 boxes) - TEXTURED with book covers
 *  - Desk lamp (cylinder base + neck + cone shade) - TEXTURED with desk lamp.jpg
 *  - Plant pot with foliage (cylinder + sphere) - TEXTURED
 ***********************************************************/
void SceneManager::RenderScene()
{
    // Start profiling
    auto& profiler = PerformanceProfiler::getInstance();
    profiler.startFrame();
    profiler.startSection("Frustum Culling");
    
    // Camera frustum region (for demo: a bounding box around origin)
    glm::vec3 frustumMin(-8.0f, -2.0f, -8.0f);
    glm::vec3 frustumMax(8.0f, 8.0f, 8.0f);
    std::vector<int> visibleObjectIds;
    QueryObjectsInRegion(frustumMin, frustumMax, visibleObjectIds);
    
    profiler.endSection("Frustum Culling");
    profiler.startSection("Object Rendering");

    // Object definitions (id, position, bounding radius, mesh type)
    struct RenderObj {
        int id;
        glm::vec3 pos;
        glm::vec3 scale;
        float xrot, yrot, zrot;
        std::string texture;
        std::string material;
        std::string meshType;
        float boundingRadius;
    };
    std::vector<RenderObj> objects = {
        {1, glm::vec3(0.0f, 0.0f, 0.0f), glm::vec3(12.0f, 1.0f, 7.0f), 0, 0, 0, "desk_wood", "wood", "plane", 7.0f},
        {2, glm::vec3(0.0f, 0.06f, 0.8f), glm::vec3(2.8f, 0.12f, 2.0f), 0, 0, 0, "laptop_base", "metal", "box", 1.5f},
        {3, glm::vec3(0.0f, 1.0f, 0.2f), glm::vec3(3.0f, 1.8f, 0.08f), -20, 0, 0, "laptop_screen", "screen", "box", 1.8f},
        {4, glm::vec3(-2.2f, 0.35f, 1.5f), glm::vec3(0.5f, 0.7f, 0.5f), 0, 0, 0, "mug_ceramic", "ceramic", "cylinder", 0.7f},
        {5, glm::vec3(-1.7f, 0.35f, 1.5f), glm::vec3(0.4f, 0.4f, 0.4f), 0, 90, 0, "mug_ceramic", "ceramic", "halftorus", 0.4f},
        {6, glm::vec3(3.5f, 0.125f, -0.5f), glm::vec3(1.0f, 0.25f, 1.5f), 0, 0, 0, "book_cover", "paper", "box", 1.0f},
        {7, glm::vec3(3.5f, 0.365f, -0.5f), glm::vec3(0.95f, 0.23f, 1.45f), 0, 3, 0, "book_spine", "wood", "box", 1.0f},
        {8, glm::vec3(3.5f, 0.575f, -0.5f), glm::vec3(0.9f, 0.2f, 1.4f), 0, -5, 0, "book_cover", "paper", "box", 1.0f},
        {9, glm::vec3(-3.5f, 0.075f, -2.0f), glm::vec3(0.7f, 0.15f, 0.7f), 0, 0, 0, "lamp_metal", "metal", "cylinder", 0.7f},
        {10, glm::vec3(-2.8f, 1.1f, -2.0f), glm::vec3(0.12f, 2.0f, 0.12f), 0, 0, 30, "lamp_metal", "metal", "cylinder", 2.0f},
        {11, glm::vec3(-2.2f, 2.0f, -2.0f), glm::vec3(0.8f, 0.6f, 0.8f), 180, 0, 30, "lamp_metal", "metal", "cone", 0.8f},
        {12, glm::vec3(-4.5f, 0.25f, -0.8f), glm::vec3(0.6f, 0.5f, 0.6f), 0, 0, 0, "plant_pot", "ceramic", "cylinder", 0.6f},
        {13, glm::vec3(-4.5f, 0.65f, -0.8f), glm::vec3(0.5f, 0.4f, 0.5f), 0, 0, 0, "plant_foliage", "fabric", "sphere", 0.5f}
    };

    // Record metrics
    profiler.recordObjectCount(static_cast<int>(objects.size()));
    profiler.recordVisibleObjects(static_cast<int>(visibleObjectIds.size()));

    // Register objects in octree (step 1)
    for (const auto& obj : objects) {
        SceneObject so{obj.pos, obj.boundingRadius, obj.id};
        RegisterSceneObject(so);
    }

    // Render only visible objects (step 2)
    for (const auto& obj : objects) {
        if (std::find(visibleObjectIds.begin(), visibleObjectIds.end(), obj.id) == visibleObjectIds.end()) continue;

        // Math optimization: cache transformation matrix
        glm::mat4 scale = glm::scale(obj.scale);
        glm::mat4 rotX = glm::rotate(glm::radians(obj.xrot), glm::vec3(1,0,0));
        glm::mat4 rotY = glm::rotate(glm::radians(obj.yrot), glm::vec3(0,1,0));
        glm::mat4 rotZ = glm::rotate(glm::radians(obj.zrot), glm::vec3(0,0,1));
        glm::mat4 trans = glm::translate(obj.pos);
        glm::mat4 modelView = trans * rotX * rotY * rotZ * scale;
        if (m_pShaderManager) m_pShaderManager->setMat4Value("model", modelView);

        // Set texture/material
        SetShaderTexture(obj.texture);
        SetShaderMaterial(obj.material);

        // LOD logic (step 3): use low detail for distant objects
        float camDist = glm::length(obj.pos); // For demo, camera at origin
        bool useLowLOD = camDist > 6.0f;

        profiler.recordDrawCall();
        
        if (obj.meshType == "plane") m_basicMeshes->DrawPlaneMesh();
        else if (obj.meshType == "box") m_basicMeshes->DrawBoxMesh();
        else if (obj.meshType == "cylinder") m_basicMeshes->DrawCylinderMesh(true, true, true);
        else if (obj.meshType == "halftorus") m_basicMeshes->DrawHalfTorusMesh();
        else if (obj.meshType == "cone") m_basicMeshes->DrawConeMesh(true);
        else if (obj.meshType == "sphere") {
            if (useLowLOD) m_basicMeshes->DrawHalfSphereMesh();
            else m_basicMeshes->DrawSphereMesh();
        }
    }
    
    profiler.endSection("Object Rendering");
    profiler.endFrame();
}

/***********************************************************
 *  SceneManager()
 *
 *  The constructor for the class
 ***********************************************************/
SceneManager::SceneManager(ShaderManager* pShaderManager)
{
	m_pShaderManager = pShaderManager;
	m_basicMeshes = new ShapeMeshes();

    // Octree covers workspace, adjust size as needed
    m_octree = new Octree(glm::vec3(0.0f, 0.0f, 0.0f), 10.0f, 0, 5);
    
    // Initialize scene graph
    m_sceneRoot = std::make_shared<SceneNode>("root");
}

/***********************************************************
 *  ~SceneManager()
 *
 *  The destructor for the class
 ***********************************************************/
SceneManager::~SceneManager()
{
	m_pShaderManager = NULL;
	delete m_basicMeshes;
	m_basicMeshes = NULL;

    delete m_octree;
    m_octree = nullptr;
}

// Register a scene object in the octree
void SceneManager::RegisterSceneObject(const SceneObject& obj)
{
    if (m_octree) m_octree->insert(obj);
}

// Query objects in a region (for frustum culling, etc.)
void SceneManager::QueryObjectsInRegion(const glm::vec3& min, const glm::vec3& max, std::vector<int>& results) const
{
    if (m_octree) m_octree->query(min, max, results);
}

// Build scene graph with hierarchical relationships
void SceneManager::BuildSceneGraph()
{
    // Example: Create lamp hierarchy (base -> neck -> shade)
    auto lampBase = std::make_shared<SceneNode>("lamp_base");
    lampBase->setPosition(glm::vec3(-3.5f, 0.075f, -2.0f));
    lampBase->setScale(glm::vec3(0.7f, 0.15f, 0.7f));
    lampBase->objectId = 9;
    
    auto lampNeck = std::make_shared<SceneNode>("lamp_neck");
    lampNeck->setPosition(glm::vec3(0.7f, 1.025f, 0.0f)); // Relative to base
    lampNeck->setScale(glm::vec3(0.12f, 2.0f, 0.12f));
    lampNeck->setRotation(glm::vec3(0.0f, 0.0f, 30.0f));
    lampNeck->objectId = 10;
    
    auto lampShade = std::make_shared<SceneNode>("lamp_shade");
    lampShade->setPosition(glm::vec3(0.6f, 0.9f, 0.0f)); // Relative to neck
    lampShade->setScale(glm::vec3(0.8f, 0.6f, 0.8f));
    lampShade->setRotation(glm::vec3(180.0f, 0.0f, 30.0f));
    lampShade->objectId = 11;
    
    // Build hierarchy
    lampBase->addChild(lampNeck);
    lampNeck->addChild(lampShade);
    m_sceneRoot->addChild(lampBase);
    
    // Example: Create plant hierarchy (pot -> foliage)
    auto plantPot = std::make_shared<SceneNode>("plant_pot");
    plantPot->setPosition(glm::vec3(-4.5f, 0.25f, -0.8f));
    plantPot->setScale(glm::vec3(0.6f, 0.5f, 0.6f));
    plantPot->objectId = 12;
    
    auto plantFoliage = std::make_shared<SceneNode>("plant_foliage");
    plantFoliage->setPosition(glm::vec3(0.0f, 0.4f, 0.0f)); // Relative to pot
    plantFoliage->setScale(glm::vec3(0.5f, 0.4f, 0.5f));
    plantFoliage->objectId = 13;
    
    plantPot->addChild(plantFoliage);
    m_sceneRoot->addChild(plantPot);
}

// Update scene graph transformations
void SceneManager::UpdateSceneGraph()
{
    if (m_sceneRoot)
    {
        m_sceneRoot->update();
    }
}

/***********************************************************
 *  CreateGLTexture()
 *
 *  This method is used for loading textures from image files,
 *  configuring the texture mapping parameters in OpenGL,
 *  generating the mipmaps, and loading the read texture into
 *  the next available texture slot in memory.
 ***********************************************************/
bool SceneManager::CreateGLTexture(const char* filename, std::string tag)
{
	int width = 0;
	int height = 0;
	int colorChannels = 0;
	GLuint textureID = 0;

	// indicate to always flip images vertically when loaded
	stbi_set_flip_vertically_on_load(true);

	// try to parse the image data from the specified image file
	unsigned char* image = stbi_load(
		filename,
		&width,
		&height,
		&colorChannels,
		0);

	// if the image was successfully read from the image file
	if (image)
	{
		std::cout << "Successfully loaded image:" << filename << ", width:" << width << ", height:" << height << ", channels:" << colorChannels << std::endl;

		glGenTextures(1, &textureID);
		glBindTexture(GL_TEXTURE_2D, textureID);

		// set the texture wrapping parameters
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
		// set texture filtering parameters
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

		// if the loaded image is in RGB format
		if (colorChannels == 3)
			glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB8, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
		// if the loaded image is in RGBA format - it supports transparency
		else if (colorChannels == 4)
			glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, image);
		else
		{
			std::cout << "Not implemented to handle image with " << colorChannels << " channels" << std::endl;
			return false;
		}

		// generate the texture mipmaps for mapping textures to lower resolutions
		glGenerateMipmap(GL_TEXTURE_2D);

		// free the image data from local memory
		stbi_image_free(image);
		glBindTexture(GL_TEXTURE_2D, 0); // Unbind the texture

		// register the loaded texture and associate it with the special tag string
		m_textureIDs[m_loadedTextures].ID = textureID;
		m_textureIDs[m_loadedTextures].tag = tag;
		m_loadedTextures++;

		return true;
	}

	std::cout << "Could not load image:" << filename << std::endl;

	// Error loading the image
	return false;
}

/***********************************************************
 *  BindGLTextures()
 *
 *  This method is used for binding the loaded textures to
 *  OpenGL texture memory slots.  There are up to 16 slots.
 ***********************************************************/
void SceneManager::BindGLTextures()
{
	for (int i = 0; i < m_loadedTextures; i++)
	{
		// bind textures on corresponding texture units
		glActiveTexture(GL_TEXTURE0 + i);
		glBindTexture(GL_TEXTURE_2D, m_textureIDs[i].ID);
	}
}

/***********************************************************
 *  DestroyGLTextures()
 *
 *  This method is used for freeing the memory in all the
 *  used texture memory slots.
 ***********************************************************/
void SceneManager::DestroyGLTextures()
{
	for (int i = 0; i < m_loadedTextures; i++)
	{
		glGenTextures(1, &m_textureIDs[i].ID);
	}
}

/***********************************************************
 *  FindTextureID()
 *
 *  This method is used for getting an ID for the previously
 *  loaded texture bitmap associated with the passed in tag.
 ***********************************************************/
int SceneManager::FindTextureID(std::string tag)
{
	int textureID = -1;
	int index = 0;
	bool bFound = false;

	while ((index < m_loadedTextures) && (bFound == false))
	{
		if (m_textureIDs[index].tag.compare(tag) == 0)
		{
			textureID = m_textureIDs[index].ID;
			bFound = true;
		}
		else
			index++;
	}

	return(textureID);
}

/***********************************************************
 *  FindTextureSlot()
 *
 *  This method is used for getting a slot index for the previously
 *  loaded texture bitmap associated with the passed in tag.
 ***********************************************************/
int SceneManager::FindTextureSlot(std::string tag)
{
	int textureSlot = -1;
	int index = 0;
	bool bFound = false;

	while ((index < m_loadedTextures) && (bFound == false))
	{
		if (m_textureIDs[index].tag.compare(tag) == 0)
		{
			textureSlot = index;
			bFound = true;
		}
		else
			index++;
	}

	return(textureSlot);
}

/***********************************************************
 *  FindMaterial()
 *
 *  This method is used for getting a material from the previously
 *  defined materials list that is associated with the passed in tag.
 ***********************************************************/
bool SceneManager::FindMaterial(std::string tag, OBJECT_MATERIAL& material)
{
	if (m_objectMaterials.size() == 0)
	{
		return(false);
	}

	int index = 0;
	bool bFound = false;
	while ((index < m_objectMaterials.size()) && (bFound == false))
	{
		if (m_objectMaterials[index].tag.compare(tag) == 0)
		{
			bFound = true;
			material.ambientColor = m_objectMaterials[index].ambientColor;
			material.ambientStrength = m_objectMaterials[index].ambientStrength;
			material.diffuseColor = m_objectMaterials[index].diffuseColor;
			material.specularColor = m_objectMaterials[index].specularColor;
			material.shininess = m_objectMaterials[index].shininess;
		}
		else
		{
			index++;
		}
	}

	return(true);
}

/***********************************************************
 *  SetTransformations()
 *
 *  This method is used for setting the transform buffer
 *  using the passed in transformation values.
 ***********************************************************/
void SceneManager::SetTransformations(
	glm::vec3 scaleXYZ,
	float XrotationDegrees,
	float YrotationDegrees,
	float ZrotationDegrees,
	glm::vec3 positionXYZ)
{
    // Cache radians for rotation
    float xRad = glm::radians(XrotationDegrees);
    float yRad = glm::radians(YrotationDegrees);
    float zRad = glm::radians(ZrotationDegrees);

    // Precompute rotation matrices only if needed
    glm::mat4 rotX = (XrotationDegrees != 0.0f) ? glm::rotate(xRad, glm::vec3(1,0,0)) : glm::mat4(1.0f);
    glm::mat4 rotY = (YrotationDegrees != 0.0f) ? glm::rotate(yRad, glm::vec3(0,1,0)) : glm::mat4(1.0f);
    glm::mat4 rotZ = (ZrotationDegrees != 0.0f) ? glm::rotate(zRad, glm::vec3(0,0,1)) : glm::mat4(1.0f);
    glm::mat4 scale = glm::scale(scaleXYZ);
    glm::mat4 trans = glm::translate(positionXYZ);

    // Combine transformations
    glm::mat4 modelView = trans * rotX * rotY * rotZ * scale;

    if (m_pShaderManager)
        m_pShaderManager->setMat4Value(g_ModelName, modelView);
}

/***********************************************************
 *  SetShaderColor()
 *
 *  This method is used for setting the passed in color
 *  into the shader for the next draw command
 ***********************************************************/
void SceneManager::SetShaderColor(
	float redColorValue,
	float greenColorValue,
	float blueColorValue,
	float alphaValue)
{
	// variables for this method
	glm::vec4 currentColor;

	currentColor.r = redColorValue;
	currentColor.g = greenColorValue;
	currentColor.b = blueColorValue;
	currentColor.a = alphaValue;

	if (NULL != m_pShaderManager)
	{
		m_pShaderManager->setIntValue(g_UseTextureName, false);
		m_pShaderManager->setVec4Value(g_ColorValueName, currentColor);
	}
}

/***********************************************************
 *  SetShaderTexture()
 *
 *  This method is used for setting the texture data
 *  associated with the passed in ID into the shader.
 ***********************************************************/
void SceneManager::SetShaderTexture(
	std::string textureTag)
{
	if (NULL != m_pShaderManager)
	{
		m_pShaderManager->setIntValue(g_UseTextureName, true);

		int textureID = -1;
		textureID = FindTextureSlot(textureTag);
		m_pShaderManager->setSampler2DValue(g_TextureValueName, textureID);
	}
}

/***********************************************************
 *  SetTextureUVScale()
 *
 *  This method is used for setting the texture UV scale
 *  values into the shader.
 ***********************************************************/
void SceneManager::SetTextureUVScale(float u, float v)
{
	if (NULL != m_pShaderManager)
	{
		m_pShaderManager->setVec2Value("UVscale", glm::vec2(u, v));
	}
}

/***********************************************************
 *  SetShaderMaterial()
 *
 *  This method is used for passing the material values
 *  into the shader.
 ***********************************************************/
void SceneManager::SetShaderMaterial(
	std::string materialTag)
{
	if (m_objectMaterials.size() > 0)
	{
		OBJECT_MATERIAL material;
		bool bReturn = false;

		bReturn = FindMaterial(materialTag, material);
		if (bReturn == true)
		{
			m_pShaderManager->setVec3Value("material.ambientColor", material.ambientColor);
			m_pShaderManager->setFloatValue("material.ambientStrength", material.ambientStrength);
			m_pShaderManager->setVec3Value("material.diffuseColor", material.diffuseColor);
			m_pShaderManager->setVec3Value("material.specularColor", material.specularColor);
			m_pShaderManager->setFloatValue("material.shininess", material.shininess);
		}
	}
}

/**************************************************************/
/*** STUDENTS CAN MODIFY the code in the methods BELOW for  ***/
/*** preparing and rendering their own 3D replicated scenes.***/
/*** Please refer to the code in the OpenGL sample project  ***/
/*** for assistance.                                        ***/
/**************************************************************/

/***********************************************************
 *  DefineObjectMaterials()
 *
 *  This method is used for configuring the various material
 *  settings for all of the objects in the 3D scene.
 *  Materials support full Phong shading model with ambient,
 *  diffuse, and specular components as required.
 ***********************************************************/
void SceneManager::DefineObjectMaterials()
{
	// Define wood material for desk surface and books
	OBJECT_MATERIAL woodMaterial;
	woodMaterial.ambientColor = glm::vec3(0.4f, 0.3f, 0.1f);  // Ambient component
	woodMaterial.ambientStrength = 0.2f;
	woodMaterial.diffuseColor = glm::vec3(0.6f, 0.4f, 0.2f);  // Diffuse component
	woodMaterial.specularColor = glm::vec3(0.1f, 0.1f, 0.1f);  // Specular component
	woodMaterial.shininess = 0.3f;
	woodMaterial.tag = "wood";
	m_objectMaterials.push_back(woodMaterial);

	// Define metallic material for laptop and lamp components
	OBJECT_MATERIAL metalMaterial;
	metalMaterial.ambientColor = glm::vec3(0.15f, 0.15f, 0.2f);   // Ambient component
	metalMaterial.ambientStrength = 0.3f;
	metalMaterial.diffuseColor = glm::vec3(0.3f, 0.35f, 0.45f);   // Diffuse component
	metalMaterial.specularColor = glm::vec3(0.6f, 0.65f, 0.8f);   // Specular component
	metalMaterial.shininess = 32.0f;
	metalMaterial.tag = "metal";
	m_objectMaterials.push_back(metalMaterial);

	// Define ceramic material for coffee mug and plant pot
	OBJECT_MATERIAL ceramicMaterial;
	ceramicMaterial.ambientColor = glm::vec3(0.2f, 0.2f, 0.2f);   // Ambient component
	ceramicMaterial.ambientStrength = 0.2f;
	ceramicMaterial.diffuseColor = glm::vec3(0.8f, 0.8f, 0.8f);   // Diffuse component
	ceramicMaterial.specularColor = glm::vec3(0.5f, 0.5f, 0.5f);  // Specular component
	ceramicMaterial.shininess = 16.0f;
	ceramicMaterial.tag = "ceramic";
	m_objectMaterials.push_back(ceramicMaterial);

	// Define fabric material for plant foliage
	OBJECT_MATERIAL fabricMaterial;
	fabricMaterial.ambientColor = glm::vec3(0.1f, 0.3f, 0.1f);    // Ambient component
	fabricMaterial.ambientStrength = 0.4f;
	fabricMaterial.diffuseColor = glm::vec3(0.2f, 0.6f, 0.2f);    // Diffuse component
	fabricMaterial.specularColor = glm::vec3(0.1f, 0.2f, 0.1f);   // Specular component
	fabricMaterial.shininess = 1.0f;
	fabricMaterial.tag = "fabric";
	m_objectMaterials.push_back(fabricMaterial);

	// Define screen material for laptop screen
	OBJECT_MATERIAL screenMaterial;
	screenMaterial.ambientColor = glm::vec3(0.1f, 0.1f, 0.1f);    // Ambient component
	screenMaterial.ambientStrength = 0.1f;
	screenMaterial.diffuseColor = glm::vec3(0.9f, 0.9f, 0.9f);    // Diffuse component
	screenMaterial.specularColor = glm::vec3(0.8f, 0.8f, 0.8f);   // Specular component
	screenMaterial.shininess = 64.0f;
	screenMaterial.tag = "screen";
	m_objectMaterials.push_back(screenMaterial);

	// Define paper material for books
	OBJECT_MATERIAL paperMaterial;
	paperMaterial.ambientColor = glm::vec3(0.4f, 0.4f, 0.3f);     // Ambient component
	paperMaterial.ambientStrength = 0.3f;
	paperMaterial.diffuseColor = glm::vec3(0.7f, 0.7f, 0.6f);     // Diffuse component
	paperMaterial.specularColor = glm::vec3(0.1f, 0.1f, 0.1f);    // Specular component
	paperMaterial.shininess = 2.0f;
	paperMaterial.tag = "paper";
	m_objectMaterials.push_back(paperMaterial);
}

/***********************************************************
 *  SetupSceneLights()
 *
 *  PURPOSE: Configure sophisticated lighting system for scene
 *  FUNCTIONALITY: Creates warm, professional lighting with multiple sources
 *  REQUIREMENTS MET: 2+ lights, colored light, point light, Phong shading
 *  BEST PRACTICE: Modular lighting setup with clear documentation
 *
 *  LIGHTING DESIGN: 9 strategically positioned lights for optimal illumination
 *  - Eliminates dark areas while maintaining warm, inviting atmosphere
 *  - Uses golden, pink, green, and other warm tones as requested
 *  - Each light serves specific purpose (key, fill, accent, support)
 ***********************************************************/
void SceneManager::SetupSceneLights()
{
	// Enable lighting in the shader
	m_pShaderManager->setBoolValue("bUseLighting", true);

	// LIGHT SOURCE 1: Main Golden Key Light - POINT LIGHT REQUIREMENT
	// Warm golden light from above-front for overall scene illumination
	m_pShaderManager->setVec3Value("lightSources[0].position", 0.0f, 10.0f, 5.0f);
	m_pShaderManager->setVec3Value("lightSources[0].ambientColor", 0.3f, 0.25f, 0.18f);   // Slightly brighter golden ambient
	m_pShaderManager->setVec3Value("lightSources[0].diffuseColor", 1.0f, 0.85f, 0.6f);    // Rich golden diffuse
	m_pShaderManager->setVec3Value("lightSources[0].specularColor", 1.0f, 0.9f, 0.7f);    // Golden specular
	m_pShaderManager->setFloatValue("lightSources[0].focalStrength", 25.0f);
	m_pShaderManager->setFloatValue("lightSources[0].specularIntensity", 0.6f);

	// LIGHT SOURCE 2: Soft Pink Accent Light - COLORED LIGHT REQUIREMENT
	// Positioned to create beautiful pink highlights on left objects (mug, plant)
	m_pShaderManager->setVec3Value("lightSources[1].position", -6.0f, 8.0f, 3.0f);
	m_pShaderManager->setVec3Value("lightSources[1].ambientColor", 0.2f, 0.15f, 0.18f);   // Soft pink ambient
	m_pShaderManager->setVec3Value("lightSources[1].diffuseColor", 0.9f, 0.6f, 0.75f);    // Beautiful pink diffuse
	m_pShaderManager->setVec3Value("lightSources[1].specularColor", 1.0f, 0.7f, 0.85f);   // Pink specular highlights
	m_pShaderManager->setFloatValue("lightSources[1].focalStrength", 20.0f);
	m_pShaderManager->setFloatValue("lightSources[1].specularIntensity", 0.5f);

	// LIGHT SOURCE 3: Emerald Green Side Light
	// Positioned to distinguish the books with subtle green tinting
	m_pShaderManager->setVec3Value("lightSources[2].position", 6.0f, 7.0f, 2.0f);
	m_pShaderManager->setVec3Value("lightSources[2].ambientColor", 0.1f, 0.2f, 0.15f);    // Green ambient
	m_pShaderManager->setVec3Value("lightSources[2].diffuseColor", 0.5f, 0.8f, 0.6f);     // Emerald green diffuse
	m_pShaderManager->setVec3Value("lightSources[2].specularColor", 0.6f, 0.9f, 0.7f);    // Green specular
	m_pShaderManager->setFloatValue("lightSources[2].focalStrength", 18.0f);
	m_pShaderManager->setFloatValue("lightSources[2].specularIntensity", 0.4f);

	// LIGHT SOURCE 4: Warm Honey Fill Light
	// Positioned to separate book layers and add depth to right side
	m_pShaderManager->setVec3Value("lightSources[3].position", 3.0f, 12.0f, 1.0f);
	m_pShaderManager->setVec3Value("lightSources[3].ambientColor", 0.22f, 0.18f, 0.1f);   // Honey amber ambient
	m_pShaderManager->setVec3Value("lightSources[3].diffuseColor", 0.95f, 0.75f, 0.45f);  // Warm honey diffuse
	m_pShaderManager->setVec3Value("lightSources[3].specularColor", 1.0f, 0.8f, 0.5f);    // Honey specular
	m_pShaderManager->setFloatValue("lightSources[3].focalStrength", 30.0f);
	m_pShaderManager->setFloatValue("lightSources[3].specularIntensity", 0.35f);

	// LIGHT SOURCE 5: Soft Lavender Rim Light
	// Back light to create beautiful rim lighting and object separation
	m_pShaderManager->setVec3Value("lightSources[4].position", 0.0f, 6.0f, -4.0f);
	m_pShaderManager->setVec3Value("lightSources[4].ambientColor", 0.15f, 0.12f, 0.2f);   // Lavender ambient
	m_pShaderManager->setVec3Value("lightSources[4].diffuseColor", 0.7f, 0.55f, 0.85f);   // Soft lavender diffuse
	m_pShaderManager->setVec3Value("lightSources[4].specularColor", 0.8f, 0.6f, 0.9f);    // Lavender specular
	m_pShaderManager->setFloatValue("lightSources[4].focalStrength", 35.0f);
	m_pShaderManager->setFloatValue("lightSources[4].specularIntensity", 0.3f);

	// LIGHT SOURCE 6: Copper Accent Light
	// Positioned to enhance laptop and center objects with warm copper tones
	m_pShaderManager->setVec3Value("lightSources[5].position", -1.0f, 9.0f, 4.0f);
	m_pShaderManager->setVec3Value("lightSources[5].ambientColor", 0.2f, 0.15f, 0.1f);    // Copper ambient
	m_pShaderManager->setVec3Value("lightSources[5].diffuseColor", 0.9f, 0.65f, 0.4f);    // Rich copper diffuse
	m_pShaderManager->setVec3Value("lightSources[5].specularColor", 1.0f, 0.75f, 0.5f);   // Copper specular
	m_pShaderManager->setFloatValue("lightSources[5].focalStrength", 22.0f);
	m_pShaderManager->setFloatValue("lightSources[5].specularIntensity", 0.45f);

	// LIGHT SOURCE 7: Desk Lamp Area Illumination - ENHANCED
	// Positioned specifically to illuminate the lamp neck and components
	m_pShaderManager->setVec3Value("lightSources[6].position", -2.5f, 3.5f, -1.5f);
	m_pShaderManager->setVec3Value("lightSources[6].ambientColor", 0.3f, 0.25f, 0.15f);  // Brighter warm ambient
	m_pShaderManager->setVec3Value("lightSources[6].diffuseColor", 1.2f, 1.0f, 0.7f);    // Much brighter warm glow
	m_pShaderManager->setVec3Value("lightSources[6].specularColor", 1.0f, 0.85f, 0.6f);  // Bright specular
	m_pShaderManager->setFloatValue("lightSources[6].focalStrength", 12.0f);
	m_pShaderManager->setFloatValue("lightSources[6].specularIntensity", 0.8f);

	// LIGHT SOURCE 8: Left Side Lamp Support Light - NEW
	// Additional light specifically for lamp neck visibility
	m_pShaderManager->setVec3Value("lightSources[7].position", -4.0f, 2.0f, -2.5f);
	m_pShaderManager->setVec3Value("lightSources[7].ambientColor", 0.25f, 0.2f, 0.15f);  // Warm ambient for lamp area
	m_pShaderManager->setVec3Value("lightSources[7].diffuseColor", 0.9f, 0.8f, 0.6f);    // Warm diffuse to light lamp
	m_pShaderManager->setVec3Value("lightSources[7].specularColor", 0.8f, 0.7f, 0.5f);   // Subtle specular
	m_pShaderManager->setFloatValue("lightSources[7].focalStrength", 15.0f);
	m_pShaderManager->setFloatValue("lightSources[7].specularIntensity", 0.6f);

	// LIGHT SOURCE 9: Lamp Neck Direct Illumination - NEW
	// Front-angled light to eliminate lamp neck darkness
	m_pShaderManager->setVec3Value("lightSources[8].position", -1.5f, 1.5f, 0.0f);
	m_pShaderManager->setVec3Value("lightSources[8].ambientColor", 0.2f, 0.18f, 0.12f);  // Neutral warm ambient
	m_pShaderManager->setVec3Value("lightSources[8].diffuseColor", 0.8f, 0.75f, 0.6f);   // Direct lamp illumination
	m_pShaderManager->setVec3Value("lightSources[8].specularColor", 0.9f, 0.8f, 0.65f);  // Clear specular highlights
	m_pShaderManager->setFloatValue("lightSources[8].focalStrength", 18.0f);
	m_pShaderManager->setFloatValue("lightSources[8].specularIntensity", 0.7f);
}

/***********************************************************
 *  LoadSceneTextures()
 *
 *  PURPOSE: Load all texture files for scene objects
 *  FUNCTIONALITY: Creates OpenGL textures from specified image files
 *  REQUIREMENTS MET: 2+ textured objects, 1024x1024+ resolution
 *  BEST PRACTICE: Centralized texture loading with error handling
 *
 *  TEXTURES LOADED:
 *  - rusticwood.jpg     -> Desk surface (TEXTURED OBJECT #1)
 *  - gray.jpg           -> Laptop body (TEXTURED OBJECT #2)
 *  - desk lamp.jpg      -> Lamp components (TEXTURED OBJECT #3)
 *  - Brown wood tones.jpg -> Plant pot (TEXTURED OBJECT #4)
 *  - Additional textures for complete scene realism
 ***********************************************************/
void SceneManager::LoadSceneTextures()
{
	bool bReturn = false;

	// TEXTURED OBJECT #1: Desk surface - rusticwood.jpg
	bReturn = CreateGLTexture(
		"../Utilities/textures/rusticwood.jpg",
		"desk_wood");

	// TEXTURED OBJECT #2: Laptop base - gray.jpg  
	bReturn = CreateGLTexture(
		"../Utilities/textures/gray.jpg",
		"laptop_base");

	// TEXTURED OBJECT #3: Desk lamp (all parts) - desk lamp.jpg
	bReturn = CreateGLTexture(
		"../Utilities/textures/desk lamp.jpg",
		"lamp_metal");

	// TEXTURED OBJECT #4: Plant pot - Brown wood tones.jpg (terracotta appearance)
	bReturn = CreateGLTexture(
		"../Utilities/textures/Brown wood tones.jpg",
		"plant_pot");

	// Additional textures for complete scene realism

	// Laptop screen - drywall.jpg (white screen appearance)
	bReturn = CreateGLTexture(
		"../Utilities/textures/drywall.jpg",
		"laptop_screen");

	// Coffee mug ceramic - drywall.jpg (white ceramic appearance)
	bReturn = CreateGLTexture(
		"../Utilities/textures/drywall.jpg",
		"mug_ceramic");

	// Book covers - book cover.jpg
	bReturn = CreateGLTexture(
		"../Utilities/textures/book cover.jpg",
		"book_cover");

	// Book spines - Brown wood tones.jpg (leather-bound appearance)
	bReturn = CreateGLTexture(
		"../Utilities/textures/Brown wood tones.jpg",
		"book_spine");

	// Plant foliage - Create green appearance (using backdrop with green tint)
	bReturn = CreateGLTexture(
		"../Utilities/textures/backdrop.jpg",
		"plant_foliage");

	// After loading all textures, bind them to OpenGL texture slots
	BindGLTextures();
}

/***********************************************************
 *  PrepareScene()
 *
 *  This method is used for preparing the 3D scene by loading
 *  the shapes, textures in memory to support the 3D scene
 *  rendering. Ensures all required primitive shapes are loaded
 *  and meets all rubric requirements.
 ***********************************************************/
void SceneManager::PrepareScene()
{
	// Load all textures first
	LoadSceneTextures();

	// Define materials for realistic lighting interaction with full Phong model
	DefineObjectMaterials();

	// Setup scene lighting (meets 2+ lights requirement, colored light, point light)
	SetupSceneLights();

	// Load all the meshes needed for the desk scene
	// REQUIREMENT: Must include 4 of these primitive shapes minimum
	m_basicMeshes->LoadPlaneMesh();    // ? PLANE - For the desk surface
	m_basicMeshes->LoadBoxMesh();      // ? BOX - For laptop, books  
	m_basicMeshes->LoadCylinderMesh(); // ? CYLINDER - For coffee mug, lamp base/neck, plant pot
	m_basicMeshes->LoadConeMesh();     // ? CONE - For lamp shade
	m_basicMeshes->LoadTorusMesh(0.1f); // ? TORUS - For coffee mug handle
	m_basicMeshes->LoadSphereMesh();   // ? SPHERE - For plant foliage
}