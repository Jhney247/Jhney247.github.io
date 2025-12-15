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
	// Declare variables for transformations
	glm::vec3 scaleXYZ;
	float XrotationDegrees = 0.0f;
	float YrotationDegrees = 0.0f;
	float ZrotationDegrees = 0.0f;
	glm::vec3 positionXYZ;

	/******************************************************************/
	// OBJECT PLACEMENT OPTIMIZATION: Matching 2D Reference Photo
	// Ensuring accurate X, Y, Z coordinates relative to each other
	/******************************************************************/

	/******************************************************************/
	// DESK SURFACE (PLANE) - Foundation object at proper scale
	/******************************************************************/
	// Set the scale for the desk surface (matches photo proportions)
	scaleXYZ = glm::vec3(12.0f, 1.0f, 7.0f);

	// Set rotation (no rotation needed for desk)
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (foundation at origin)
	positionXYZ = glm::vec3(0.0f, 0.0f, 0.0f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply wood texture with tiling for realistic wood planks appearance
	SetTextureUVScale(3.0f, 2.0f); // Tile texture for wood planks effect
	SetShaderTexture("desk_wood"); // Uses rusticwood.jpg
	SetShaderMaterial("wood"); // Wood material for proper light reflection

	// Draw the desk surface
	m_basicMeshes->DrawPlaneMesh();

	/******************************************************************/
	// LAPTOP BASE (BOX) - Center-positioned like in reference photo
	// X: 0.0 (centered), Y: on desk surface, Z: slightly forward
	/******************************************************************/
	// Set scale for laptop base (proportional to reference)
	scaleXYZ = glm::vec3(2.8f, 0.12f, 2.0f);

	// Set rotation (perfectly straight like in photo)
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (center of desk, slightly forward like in photo)
	positionXYZ = glm::vec3(0.0f, 0.06f, 0.8f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply gray texture for realistic laptop base appearance
	SetTextureUVScale(1.0f, 1.0f); // Reset UV scale to normal
	SetShaderTexture("laptop_base"); // Uses gray.jpg
	SetShaderMaterial("metal"); // Metallic material for proper specular highlights

	// Draw laptop base
	m_basicMeshes->DrawBoxMesh();

	/******************************************************************/
	// LAPTOP SCREEN (BOX) - White screen texture
	/******************************************************************/
	// Set scale for laptop screen
	scaleXYZ = glm::vec3(3.0f, 1.8f, 0.08f);

	// Set rotation (tilted back at realistic angle)
	XrotationDegrees = -20.0f; // Tilt screen back
	YrotationDegrees = 0.0f;   // Straight alignment
	ZrotationDegrees = 0.0f;

	// Set position (behind laptop base, centered)
	positionXYZ = glm::vec3(0.0f, 1.0f, 0.2f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply white screen texture
	SetShaderTexture("laptop_screen"); // Uses drywall.jpg for white appearance
	SetShaderMaterial("screen"); // Screen material for bright, reflective surface

	// Draw laptop screen
	m_basicMeshes->DrawBoxMesh();

	/******************************************************************/
	// COFFEE MUG BODY (CYLINDER) - Left of laptop, close proximity
	// X: negative (left side), Y: on desk, Z: near laptop (close relationship)
	/******************************************************************/
	// Set scale for coffee mug (realistic size relative to laptop)
	scaleXYZ = glm::vec3(0.5f, 0.7f, 0.5f);

	// Set rotation
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (left of laptop, maintaining close relationship like in photo)
	positionXYZ = glm::vec3(-2.2f, 0.35f, 1.5f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply white ceramic texture for realistic mug appearance
	SetShaderTexture("mug_ceramic"); // Uses drywall.jpg for white ceramic look
	SetShaderMaterial("ceramic"); // Ceramic material for subtle specular highlights

	// Draw coffee mug (draw all parts: bottom, top, sides)
	m_basicMeshes->DrawCylinderMesh(true, true, true);

	/******************************************************************/
	// COFFEE MUG HANDLE (TORUS - partial) - Same white ceramic
	/******************************************************************/
	// Set scale for mug handle
	scaleXYZ = glm::vec3(0.4f, 0.4f, 0.4f);

	// Set rotation
	XrotationDegrees = 0.0f;
	YrotationDegrees = 90.0f;  // Rotate to side
	ZrotationDegrees = 0.0f;

	// Set position (attached to mug side, maintaining handle relationship)
	positionXYZ = glm::vec3(-1.7f, 0.35f, 1.5f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply same ceramic texture for cohesive handle
	SetShaderTexture("mug_ceramic"); // Same white ceramic texture
	SetShaderMaterial("ceramic"); // Consistent ceramic material

	// Draw half torus for handle
	m_basicMeshes->DrawHalfTorusMesh();

	/******************************************************************/
	// BOOK STACK - Right side positioning to match reference photo
	// X: positive (right side), Y: stacked heights, Z: back area
	/******************************************************************/

	// BOOK 1 (BOTTOM BOOK) - Foundation of stack
	// X: right side, Y: on desk, Z: back right like in photo
	/******************************************************************/
	// Set scale for first book (base of stack)
	scaleXYZ = glm::vec3(1.0f, 0.25f, 1.5f);

	// Set rotation
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (right side, back area like in photo)
	positionXYZ = glm::vec3(3.5f, 0.125f, -0.5f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply brown book cover texture
	SetShaderTexture("book_cover"); // Uses book cover.jpg
	SetShaderMaterial("paper"); // Paper material for book appearance

	// Draw first book
	m_basicMeshes->DrawBoxMesh();

	/******************************************************************/
	// BOOK 2 (MIDDLE BOOK) - Stacked on first book
	// X: same as base, Y: elevated, Z: same depth with slight variation
	/******************************************************************/
	// Set scale for second book (slightly different size for realism)
	scaleXYZ = glm::vec3(0.95f, 0.23f, 1.45f);

	// Set rotation (slight rotation for natural book stack look)
	XrotationDegrees = 0.0f;
	YrotationDegrees = 3.0f;   // Slight rotation for realism
	ZrotationDegrees = 0.0f;

	// Set position (stacked on first book, precise Y positioning)
	positionXYZ = glm::vec3(3.5f, 0.365f, -0.5f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply brown wood texture for book spine effect
	SetShaderTexture("book_spine"); // Uses Brown wood tones.jpg
	SetShaderMaterial("wood"); // Wood material for leather-bound book appearance

	// Draw second book
	m_basicMeshes->DrawBoxMesh();

	/******************************************************************/
	// BOOK 3 (TOP BOOK) - Completing the stack
	// X: same column, Y: highest elevation, Z: maintaining stack alignment
	/******************************************************************/
	// Set scale for third book (smallest for natural stack progression)
	scaleXYZ = glm::vec3(0.9f, 0.2f, 1.4f);

	// Set rotation (slight opposite rotation for natural stacking)
	XrotationDegrees = 0.0f;
	YrotationDegrees = -5.0f;  // Slight opposite rotation
	ZrotationDegrees = 0.0f;

	// Set position (top of stack, precise Y calculation)
	positionXYZ = glm::vec3(3.5f, 0.575f, -0.5f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply book cover texture for visual variety
	SetShaderTexture("book_cover"); // Uses book cover.jpg
	SetShaderMaterial("paper"); // Paper material for book appearance

	// Draw third book
	m_basicMeshes->DrawBoxMesh();

	/******************************************************************/
	// DESK LAMP - Left rear positioning exactly like reference photo
	// Complex object with multiple components in precise relationship
	/******************************************************************/

	// DESK LAMP BASE (CYLINDER) - Foundation component
	// X: negative (left side), Y: on desk, Z: negative (back area)
	/******************************************************************/
	// Set scale for lamp base (realistic proportions)
	scaleXYZ = glm::vec3(0.7f, 0.15f, 0.7f);

	// Set rotation
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (left rear, matching photo placement)
	positionXYZ = glm::vec3(-3.5f, 0.075f, -2.0f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply desk lamp texture for base
	SetShaderTexture("lamp_metal"); // Uses desk lamp.jpg
	SetShaderMaterial("metal"); // Metallic material for lamp base

	// Draw lamp base
	m_basicMeshes->DrawCylinderMesh(true, true, true);

	/******************************************************************/
	// DESK LAMP NECK (CYLINDER) - Articulated arm component
	// X: angled from base, Y: elevated, Z: extending toward desk center
	/******************************************************************/
	// Set scale for lamp neck (realistic arm proportions)
	scaleXYZ = glm::vec3(0.12f, 2.0f, 0.12f);

	// Set rotation (articulated angle matching photo reference)
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 30.0f;  // Natural articulated lamp angle

	// Set position (extending from base toward center)
	positionXYZ = glm::vec3(-2.8f, 1.1f, -2.0f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply desk lamp texture with UV scaling for tube effect
	SetTextureUVScale(1.0f, 4.0f); // Stretch texture along cylinder length
	SetShaderTexture("lamp_metal"); // Uses desk lamp.jpg
	SetShaderMaterial("metal"); // Same metallic material for cohesive lamp

	// Draw lamp neck
	m_basicMeshes->DrawCylinderMesh(true, true, true);

	/******************************************************************/
	// DESK LAMP SHADE (CONE) - Shade component at arm end
	// X: at neck end, Y: elevated, Z: positioned to light desk
	/******************************************************************/
	// Set scale for lamp shade (realistic shade proportions)
	scaleXYZ = glm::vec3(0.8f, 0.6f, 0.8f);

	// Set rotation (inverted cone, matching neck angle)
	XrotationDegrees = 180.0f; // Inverted for lampshade
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 30.0f;  // Match neck articulation

	// Set position (at end of neck, pointing toward work area)
	positionXYZ = glm::vec3(-2.2f, 2.0f, -2.0f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply desk lamp texture for shade
	SetTextureUVScale(1.0f, 1.0f); // Reset UV scale to normal
	SetShaderTexture("lamp_metal"); // Uses desk lamp.jpg
	SetShaderMaterial("metal"); // Consistent metallic material for entire lamp

	// Draw lamp shade (draw bottom and sides, not top)
	m_basicMeshes->DrawConeMesh(true);

	/******************************************************************/
	// PLANT POT (CYLINDER) - Left side near desk lamp
	// X: negative (left), Y: on desk, Z: near lamp but not overlapping
	/******************************************************************/
	// Set scale for plant pot (realistic size relative to other objects)
	scaleXYZ = glm::vec3(0.6f, 0.5f, 0.6f);

	// Set rotation
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (left side near lamp, maintaining clear separation)
	positionXYZ = glm::vec3(-4.5f, 0.25f, -0.8f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply brown terracotta texture for realistic plant pot
	SetShaderTexture("plant_pot"); // Uses Brown wood tones.jpg for terracotta look
	SetShaderMaterial("ceramic"); // Ceramic material for terracotta appearance

	// Draw plant pot
	m_basicMeshes->DrawCylinderMesh(true, true, true);

	/******************************************************************/
	// PLANT FOLIAGE (SPHERE) - Growing from pot
	// X: same as pot, Y: above pot, Z: same as pot
	/******************************************************************/
	// Set scale for plant foliage (realistic plant size)
	scaleXYZ = glm::vec3(0.5f, 0.4f, 0.5f);

	// Set rotation
	XrotationDegrees = 0.0f;
	YrotationDegrees = 0.0f;
	ZrotationDegrees = 0.0f;

	// Set position (directly above pot, maintaining plant relationship)
	positionXYZ = glm::vec3(-4.5f, 0.65f, -0.8f);

	// Apply transformations
	SetTransformations(scaleXYZ, XrotationDegrees, YrotationDegrees, ZrotationDegrees, positionXYZ);

	// Apply green texture for plant foliage
	SetShaderTexture("plant_foliage"); // Green texture for leaves
	SetShaderMaterial("fabric"); // Matte material for plant appearance

	// Draw plant foliage
	m_basicMeshes->DrawSphereMesh();

	/******************************************************************/
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
	// variables for this method
	glm::mat4 modelView;
	glm::mat4 scale;
	glm::mat4 rotationX;
	glm::mat4 rotationY;
	glm::mat4 rotationZ;
	glm::mat4 translation;

	// set the scale value in the transform buffer
	scale = glm::scale(scaleXYZ);
	// set the rotation values in the transform buffer
	rotationX = glm::rotate(glm::radians(XrotationDegrees), glm::vec3(1.0f, 0.0f, 0.0f));
	rotationY = glm::rotate(glm::radians(YrotationDegrees), glm::vec3(0.0f, 1.0f, 0.0f));
	rotationZ = glm::rotate(glm::radians(ZrotationDegrees), glm::vec3(0.0f, 0.0f, 1.0f));
	// set the translation value in the transform buffer
	translation = glm::translate(positionXYZ);

	modelView = translation * rotationX * rotationY * rotationZ * scale;

	if (NULL != m_pShaderManager)
	{
		m_pShaderManager->setMat4Value(g_ModelName, modelView);
	}
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