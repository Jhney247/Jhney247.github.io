///////////////////////////////////////////////////////////////////////////////
// MainCode.cpp - Updated with Better Background Color
// ============
// Main application entry point for 3D Scene Interaction System
// Handles OpenGL initialization, window creation, and main render loop
//
// Controls:
//   WASD - Camera movement (forward/back/left/right)
//   QE   - Camera vertical movement (up/down)  
//   Mouse - Camera look direction
//   Mouse Scroll - Camera movement speed
//   P/O  - Toggle Perspective/Orthographic view
//   ESC  - Exit application
//
//  AUTHOR: Brian Battersby - SNHU Instructor / Computer Science
//	Created for CS-330-Computational Graphics and Visualization, Nov. 1st, 2023
///////////////////////////////////////////////////////////////////////////////

#include <iostream>         // Standard I/O operations
#include <cstdlib>          // Exit codes and utilities

// OpenGL Libraries
#include <GL/glew.h>        // OpenGL Extension Wrangler Library
#include "GLFW/glfw3.h"     // Cross-platform OpenGL context creation

// GLM Math Libraries for 3D transformations
#define GLM_ENABLE_EXPERIMENTAL
#include <glm/glm.hpp>
#include <glm/gtx/transform.hpp>
#include <glm/gtc/type_ptr.hpp>

// Project Headers
#include "SceneManager.h"    // 3D scene object management
#include "ViewManager.h"     // Camera and viewport management
#include "ShapeMeshes.h"     // 3D shape mesh definitions
#include "ShaderManager.h"   // GLSL shader program management
#include "PerformanceProfiler.h" // Performance profiling

///////////////////////////////////////////////////////////////////////////////
// GLOBAL CONSTANTS AND VARIABLES
///////////////////////////////////////////////////////////////////////////////
namespace
{
    // Window configuration
    const char* const WINDOW_TITLE = "CS-330: 7-1 Final Project Submission- Jason_Hney";

    // Manager objects for handling different aspects of the 3D application
    GLFWwindow* g_Window = nullptr;           // Main OpenGL display window
    SceneManager* g_SceneManager = nullptr;   // Manages 3D scene objects and rendering
    ShaderManager* g_ShaderManager = nullptr; // Manages GLSL shader programs
    ViewManager* g_ViewManager = nullptr;     // Manages camera and view transformations
}

///////////////////////////////////////////////////////////////////////////////
// FUNCTION DECLARATIONS
///////////////////////////////////////////////////////////////////////////////
bool InitializeGLFW();
bool InitializeGLEW();

///////////////////////////////////////////////////////////////////////////////
// MAIN APPLICATION ENTRY POINT
///////////////////////////////////////////////////////////////////////////////
/**
 * Main function - Application entry point
 * Initializes OpenGL libraries, creates managers, and runs the main render loop
 *
 * @param argc - Command line argument count
 * @param argv - Command line argument values
 * @return EXIT_SUCCESS on successful completion, EXIT_FAILURE on error
 */
int main(int argc, char* argv[])
{
    // Initialize GLFW library for window and context management
    if (!InitializeGLFW())
    {
        std::cerr << "ERROR: Failed to initialize GLFW library" << std::endl;
        return EXIT_FAILURE;
    }

    // Create shader manager for GLSL program management
    g_ShaderManager = new ShaderManager();
    if (!g_ShaderManager)
    {
        std::cerr << "ERROR: Failed to create ShaderManager" << std::endl;
        return EXIT_FAILURE;
    }

    // Create view manager for camera and viewport control
    g_ViewManager = new ViewManager(g_ShaderManager);
    if (!g_ViewManager)
    {
        std::cerr << "ERROR: Failed to create ViewManager" << std::endl;
        delete g_ShaderManager;
        return EXIT_FAILURE;
    }

    // Create the main OpenGL display window
    g_Window = g_ViewManager->CreateDisplayWindow(WINDOW_TITLE);
    if (!g_Window)
    {
        std::cerr << "ERROR: Failed to create display window" << std::endl;
        delete g_ViewManager;
        delete g_ShaderManager;
        return EXIT_FAILURE;
    }

    // Initialize GLEW for OpenGL extension management
    if (!InitializeGLEW())
    {
        std::cerr << "ERROR: Failed to initialize GLEW library" << std::endl;
        delete g_ViewManager;
        delete g_ShaderManager;
        return EXIT_FAILURE;
    }

    // Load and compile shader programs from external GLSL files
    const bool shadersLoaded = g_ShaderManager->LoadShaders(
        "../Utilities/shaders/vertexShader.glsl",
        "../Utilities/shaders/fragmentShader.glsl"
    );

    if (!shadersLoaded)
    {
        std::cerr << "ERROR: Failed to load shader programs" << std::endl;
        delete g_ViewManager;
        delete g_ShaderManager;
        return EXIT_FAILURE;
    }

    // Activate the shader program for rendering
    g_ShaderManager->use();

    // Create scene manager and prepare 3D scene objects
    g_SceneManager = new SceneManager(g_ShaderManager);
    if (!g_SceneManager)
    {
        std::cerr << "ERROR: Failed to create SceneManager" << std::endl;
        delete g_ViewManager;
        delete g_ShaderManager;
        return EXIT_FAILURE;
    }

    g_SceneManager->PrepareScene();

    std::cout << "INFO: 3D Scene application initialized successfully" << std::endl;
    std::cout << "INFO: Use WASD for movement, QE for up/down, mouse to look around" << std::endl;
    std::cout << "INFO: Press P for Perspective view, O for Orthographic view" << std::endl;
    std::cout << "INFO: Performance profiling enabled - stats will be logged" << std::endl;

    // Initialize profiler
    auto& profiler = PerformanceProfiler::getInstance();
    int frameCounter = 0;

    ///////////////////////////////////////////////////////////////////////////
    // MAIN RENDER LOOP
    ///////////////////////////////////////////////////////////////////////////
    while (!glfwWindowShouldClose(g_Window))
    {
        // Enable depth testing for proper 3D object rendering
        glEnable(GL_DEPTH_TEST);

        // Clear color and depth buffers for new frame
        // UPDATED BACKGROUND: Warm light brown/beige instead of dark gray
        glClearColor(0.85f, 0.78f, 0.68f, 1.0f);  // Warm light brown/beige background
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        // Update camera view and projection matrices
        g_ViewManager->PrepareSceneView();

        // Render all 3D scene objects
        g_SceneManager->RenderScene();

        // Swap front and back buffers (double buffering)
        glfwSwapBuffers(g_Window);

        // Process pending window and input events
        glfwPollEvents();
        
        // Log profiling data every 100 frames
        frameCounter++;
        if (frameCounter % 100 == 0)
        {
            profiler.logToConsole();
            profiler.logToFile("performance_log.txt");
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // CLEANUP AND SHUTDOWN
    ///////////////////////////////////////////////////////////////////////////

    // Clean up allocated manager objects
    if (g_SceneManager)
    {
        delete g_SceneManager;
        g_SceneManager = nullptr;
    }

    if (g_ViewManager)
    {
        delete g_ViewManager;
        g_ViewManager = nullptr;
    }

    if (g_ShaderManager)
    {
        delete g_ShaderManager;
        g_ShaderManager = nullptr;
    }

    // Terminate GLFW and clean up resources
    glfwTerminate();

    std::cout << "INFO: Application terminated successfully" << std::endl;
    return EXIT_SUCCESS;
}

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize GLFW library and configure OpenGL context
 * Sets up OpenGL version, profile, and platform-specific settings
 *
 * @return true if initialization successful, false otherwise
 */
bool InitializeGLFW()
{
    // Initialize GLFW library
    if (!glfwInit())
    {
        std::cerr << "ERROR: Failed to initialize GLFW" << std::endl;
        return false;
    }

    // Configure OpenGL context based on platform
#ifdef __APPLE__
    // macOS requires specific OpenGL version and forward compatibility
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
#else
    // Windows/Linux can use newer OpenGL versions
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
#endif

    return true;
}

/**
 * Initialize GLEW library for OpenGL extension management
 * Must be called after OpenGL context creation
 *
 * @return true if initialization successful, false otherwise
 */
bool InitializeGLEW()
{
    // Initialize GLEW to access OpenGL extensions
    const GLenum result = glewInit();
    if (result != GLEW_OK)
    {
        std::cerr << "ERROR: GLEW initialization failed: "
            << glewGetErrorString(result) << std::endl;
        return false;
    }

    // Display OpenGL information for debugging
    std::cout << "INFO: OpenGL successfully initialized" << std::endl;
    std::cout << "INFO: OpenGL Version: " << glGetString(GL_VERSION) << std::endl;
    std::cout << "INFO: GLSL Version: " << glGetString(GL_SHADING_LANGUAGE_VERSION) << std::endl;

    return true;
}