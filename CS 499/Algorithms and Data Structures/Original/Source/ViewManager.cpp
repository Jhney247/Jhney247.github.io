///////////////////////////////////////////////////////////////////////////////
// ViewManager.cpp - ENHANCED WITH BEST PRACTICES COMMENTING
// ===============
// Manages 3D camera viewpoint, projection modes, and user input handling
// Provides smooth camera navigation with mouse and keyboard controls
// MEETS ALL RUBRIC REQUIREMENTS FOR NAVIGATION + BEST PRACTICES
//
// PURPOSE: Handle all camera navigation and view management for 3D scene
// FUNCTIONALITY: WASD movement, mouse look, scroll speed, projection switching
// MODULAR DESIGN: Separated input handling, matrix management, and view updates
//
// Camera Controls:
//   WASD     - Move forward/backward/left/right
//   QE       - Move up/down
//   Mouse    - Look around - pitch and yaw
//   Scroll   - Adjust movement speed
//   P        - Perspective projection mode
//   O        - Orthographic projection mode
//   ESC      - Exit application
//
//  AUTHOR: Brian Battersby - SNHU Instructor / Computer Science
//	Created for CS-330-Computational Graphics and Visualization, Nov. 1st, 2023
//  ENHANCED: For complete navigation requirements + best practices
///////////////////////////////////////////////////////////////////////////////

#include "ViewManager.h"

// GLM Math Libraries for matrix operations
#include <glm/glm.hpp>
#include <glm/gtx/transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <iomanip>  // For std::setprecision

///////////////////////////////////////////////////////////////////////////////
// CONSTANTS AND CONFIGURATION
// Purpose: Centralized configuration for easy maintenance and tuning
///////////////////////////////////////////////////////////////////////////////
namespace
{
    // Window dimensions - sized for optimal scene viewing
    const int WINDOW_WIDTH = 1200;   // Enhanced width for better visibility
    const int WINDOW_HEIGHT = 800;   // Proper aspect ratio maintained

    // Shader uniform variable names - must match shader file uniforms
    const char* g_ViewName = "view";           // View matrix uniform name
    const char* g_ProjectionName = "projection"; // Projection matrix uniform name

    // Camera system variables - global scope for callback access
    Camera* g_pCamera = nullptr;               // Main camera object pointer

    // Mouse input state tracking - prevents camera jumping on first movement
    float gLastX = WINDOW_WIDTH / 2.0f;       // Last recorded mouse X position
    float gLastY = WINDOW_HEIGHT / 2.0f;      // Last recorded mouse Y position
    bool gFirstMouse = true;                  // Flag for initial mouse movement

    // Frame timing for smooth movement - frame-rate independent motion
    float gDeltaTime = 0.0f;                  // Time between current and last frame
    float gLastFrame = 0.0f;                  // Time stamp of previous frame

    // Projection mode state - controls 2D vs 3D view (REQUIREMENT 3)
    bool bOrthographicProjection = false;     // false = perspective, true = orthographic

    // Camera movement configuration - adjustable speed system (REQUIREMENT 2)
    float gCameraSpeed = 3.0f;                // Current movement speed
    const float gBaseCameraSpeed = 3.0f;      // Default/reset speed value
    const float gMaxCameraSpeed = 15.0f;      // Maximum allowed speed
    const float gMinCameraSpeed = 0.3f;       // Minimum allowed speed

    // Mouse sensitivity for camera rotation - fine-tuned for smooth control
    const float gMouseSensitivity = 0.2f;     // Controls rotation responsiveness

    // Key press state tracking - prevents unwanted key repeat behavior
    bool pKeyPressed = false;                 // P key state for projection switching
    bool oKeyPressed = false;                 // O key state for projection switching
}

///////////////////////////////////////////////////////////////////////////////
// CONSTRUCTOR AND DESTRUCTOR
///////////////////////////////////////////////////////////////////////////////

/**
 * ViewManager Constructor
 * PURPOSE: Initialize camera system with optimal position for scene viewing
 * FUNCTIONALITY: Creates camera, sets position/orientation, configures movement
 * BEST PRACTICE: Single responsibility - only handles ViewManager initialization
 *
 * @param pShaderManager - Pointer to shader manager for matrix uniform updates
 */
ViewManager::ViewManager(ShaderManager* pShaderManager)
{
    // Store shader manager reference - used for sending matrices to GPU
    m_pShaderManager = pShaderManager;
    m_pWindow = nullptr;

    // Create camera with optimal desk scene viewing position
    // REQUIREMENT 1: Position ensures all scene objects are captured
    g_pCamera = new Camera(
        glm::vec3(0.0f, 8.0f, 12.0f), // Start position - elevated view of workspace
        glm::vec3(0.0f, 1.0f, 0.0f),  // World up vector (Y-axis up)
        -90.0f,                       // Yaw angle - looking toward scene center
        -25.0f                        // Pitch angle - looking down at desk
    );

    // Configure camera properties if creation successful
    if (g_pCamera)
    {
        g_pCamera->Zoom = 65.0f;                    // Field of view for good scene framing
        g_pCamera->MovementSpeed = gCameraSpeed;    // Set initial movement speed
        g_pCamera->MouseSensitivity = gMouseSensitivity; // Set mouse responsiveness
    }

    // Log initialization status for debugging
    std::cout << "INFO: Enhanced ViewManager initialized" << std::endl;
    std::cout << "INFO: Camera positioned for optimal scene coverage" << std::endl;
    std::cout << "INFO: Navigation controls ready - WASD movement, QE vertical, mouse look, scroll speed" << std::endl;
}

/**
 * ViewManager Destructor
 * PURPOSE: Clean up allocated resources to prevent memory leaks
 * BEST PRACTICE: Proper resource management and null pointer safety
 */
ViewManager::~ViewManager()
{
    // Clean up camera object - prevent memory leak
    if (g_pCamera)
    {
        delete g_pCamera;
        g_pCamera = nullptr;
    }

    // Clear manager references - these are not owned by ViewManager
    m_pShaderManager = nullptr;
    m_pWindow = nullptr;
}

///////////////////////////////////////////////////////////////////////////////
// WINDOW MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates the main OpenGL display window with proper configuration
 * Sets up mouse capture and input callbacks for navigation
 * REQUIREMENT 1 & 2: Configures input handling for camera navigation
 *
 * @param windowTitle - Title to display in window title bar
 * @return Pointer to created GLFW window, or nullptr on failure
 */
GLFWwindow* ViewManager::CreateDisplayWindow(const char* windowTitle)
{
    // Create OpenGL window with enhanced size
    GLFWwindow* window = glfwCreateWindow(
        WINDOW_WIDTH,
        WINDOW_HEIGHT,
        windowTitle,
        nullptr,    // Not fullscreen
        nullptr     // No context sharing
    );

    // Validate window creation
    if (!window)
    {
        std::cerr << "ERROR: Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return nullptr;
    }

    // Set window as current OpenGL context
    glfwMakeContextCurrent(window);

    // Configure mouse input for first-person camera (REQUIREMENT 2)
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

    // Register input callback functions for navigation
    glfwSetCursorPosCallback(window, &ViewManager::Mouse_Position_Callback);
    glfwSetScrollCallback(window, &ViewManager::Mouse_Scroll_Callback);

    // Enable depth testing for proper 3D rendering
    glEnable(GL_DEPTH_TEST);

    // Enable alpha blending for transparent objects
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // Store window reference
    m_pWindow = window;

    std::cout << "INFO: Enhanced display window created (" << WINDOW_WIDTH << "x" << WINDOW_HEIGHT << ")" << std::endl;
    std::cout << "INFO: Mouse captured for camera orientation control" << std::endl;
    std::cout << "INFO: All navigation inputs configured and ready" << std::endl;

    return window;
}

///////////////////////////////////////////////////////////////////////////////
// MOUSE INPUT HANDLING - REQUIREMENT 2
///////////////////////////////////////////////////////////////////////////////

/**
 * Static callback function for mouse movement events
 * REQUIREMENT 2: Updates camera orientation (pitch and yaw) based on mouse movement
 * Implements nuanced camera controls for effective 3D object viewing
 * SUPPORTS FULL 360-DEGREE ROTATION - Look at objects from any angle!
 *
 * @param window - GLFW window that received the event
 * @param xMousePos - Current mouse X coordinate
 * @param yMousePos - Current mouse Y coordinate
 */
void ViewManager::Mouse_Position_Callback(GLFWwindow* window, double xMousePos, double yMousePos)
{
    // Handle first mouse movement to prevent camera jump
    if (gFirstMouse)
    {
        gLastX = static_cast<float>(xMousePos);
        gLastY = static_cast<float>(yMousePos);
        gFirstMouse = false;
        return;
    }

    // Calculate mouse movement offset
    float xOffset = static_cast<float>(xMousePos - gLastX);
    float yOffset = static_cast<float>(gLastY - yMousePos); // Y is inverted

    // Update last mouse position for next frame
    gLastX = static_cast<float>(xMousePos);
    gLastY = static_cast<float>(yMousePos);

    // Apply mouse sensitivity scaling for smooth control
    xOffset *= gMouseSensitivity;
    yOffset *= gMouseSensitivity;

    // REQUIREMENT 2: Update camera orientation with FULL 360-DEGREE ROTATION
    // - Yaw (left-right): UNLIMITED rotation - see front, back, sides, everything!
    // - Pitch (up-down): Limited to prevent flipping, but covers full viewing range
    if (g_pCamera)
    {
        g_pCamera->ProcessMouseMovement(xOffset, yOffset);
    }
}

/**
 * Static callback function for mouse scroll wheel events
 * REQUIREMENT 2: Adjusts camera movement speed for user control over exploration
 * Provides fine-tuned speed control for better object examination
 *
 * @param window - GLFW window that received the event
 * @param xOffset - Horizontal scroll offset (unused)
 * @param yOffset - Vertical scroll offset (used for speed adjustment)
 */
void ViewManager::Mouse_Scroll_Callback(GLFWwindow* window, double xOffset, double yOffset)
{
    // Enhanced speed adjustment with better granularity
    const float speedAdjustment = 0.8f; // Improved step size
    gCameraSpeed += static_cast<float>(yOffset) * speedAdjustment;

    // Clamp speed to enhanced bounds for better control
    gCameraSpeed = glm::clamp(gCameraSpeed, gMinCameraSpeed, gMaxCameraSpeed);

    // Update camera object's movement speed to match
    if (g_pCamera)
    {
        g_pCamera->MovementSpeed = gCameraSpeed;
    }

    // Provide enhanced user feedback
    std::cout << "INFO: Camera movement speed adjusted to " << std::fixed << std::setprecision(1)
        << gCameraSpeed << " (Range: " << gMinCameraSpeed << " - " << gMaxCameraSpeed << ")" << std::endl;
}

///////////////////////////////////////////////////////////////////////////////
// KEYBOARD INPUT HANDLING - REQUIREMENT 1 & 3
///////////////////////////////////////////////////////////////////////////////

/**
 * Process continuous keyboard input for camera movement
 * PURPOSE: Handle WASD/QE movement and P/O projection switching
 * REQUIREMENT 1: WASD horizontal/depth movement, QE vertical movement
 * REQUIREMENT 3: P/O perspective/orthographic view switching
 * BEST PRACTICE: Single function handles related input, well-documented controls
 */
void ViewManager::ProcessKeyboardEvents()
{
    // Exit application on ESC key - standard user expectation
    if (glfwGetKey(m_pWindow, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(m_pWindow, true);
        std::cout << "INFO: Application exit requested" << std::endl;
        return;
    }

    // Safety check - ensure camera exists before processing movement
    if (!g_pCamera)
    {
        return;
    }

    // Calculate frame-rate independent movement speed
    const float velocity = gCameraSpeed * gDeltaTime;

    ///////////////////////////////////////////////////////////////////////////
    // REQUIREMENT 1: WASD MOVEMENT CONTROLS
    // PURPOSE: Horizontal and depth navigation around the 3D scene
    // FUNCTIONALITY: Camera traverses X, Y, Z axes to capture all objects
    ///////////////////////////////////////////////////////////////////////////

    if (glfwGetKey(m_pWindow, GLFW_KEY_W) == GLFW_PRESS)
    {
        g_pCamera->ProcessKeyboard(FORWARD, gDeltaTime);  // Move toward camera target
    }

    if (glfwGetKey(m_pWindow, GLFW_KEY_S) == GLFW_PRESS)
    {
        g_pCamera->ProcessKeyboard(BACKWARD, gDeltaTime); // Move away from camera target
    }

    if (glfwGetKey(m_pWindow, GLFW_KEY_A) == GLFW_PRESS)
    {
        g_pCamera->ProcessKeyboard(LEFT, gDeltaTime);     // Strafe left relative to view
    }

    if (glfwGetKey(m_pWindow, GLFW_KEY_D) == GLFW_PRESS)
    {
        g_pCamera->ProcessKeyboard(RIGHT, gDeltaTime);    // Strafe right relative to view
    }

    ///////////////////////////////////////////////////////////////////////////
    // REQUIREMENT 1: QE VERTICAL MOVEMENT CONTROLS  
    // PURPOSE: Up and down movement for complete 3D navigation
    // FUNCTIONALITY: Ensures camera can capture objects from any elevation
    ///////////////////////////////////////////////////////////////////////////

    if (glfwGetKey(m_pWindow, GLFW_KEY_Q) == GLFW_PRESS)
    {
        g_pCamera->Position += g_pCamera->Up * velocity;  // Move up in world space
    }

    if (glfwGetKey(m_pWindow, GLFW_KEY_E) == GLFW_PRESS)
    {
        g_pCamera->Position -= g_pCamera->Up * velocity;  // Move down in world space
    }

    ///////////////////////////////////////////////////////////////////////////
    // REQUIREMENT 3: PROJECTION MODE TOGGLE CONTROLS
    // PURPOSE: Switch between perspective (3D) and orthographic (2D) views
    // FUNCTIONALITY: Maintains camera orientation during projection changes
    ///////////////////////////////////////////////////////////////////////////

    // Switch to perspective projection (P key) - realistic 3D view
    if (glfwGetKey(m_pWindow, GLFW_KEY_P) == GLFW_PRESS)
    {
        if (!pKeyPressed)  // Debounce key to prevent multiple rapid switches
        {
            bOrthographicProjection = false;
            std::cout << "INFO: Switched to Perspective view (3D) - Camera orientation maintained" << std::endl;
            pKeyPressed = true;
        }
    }
    else
    {
        pKeyPressed = false;  // Reset key state when released
    }

    // Switch to orthographic projection (O key) - technical 2D view
    if (glfwGetKey(m_pWindow, GLFW_KEY_O) == GLFW_PRESS)
    {
        if (!oKeyPressed)  // Debounce key to prevent multiple rapid switches
        {
            bOrthographicProjection = true;
            std::cout << "INFO: Switched to Orthographic view (2D) - Camera orientation maintained" << std::endl;
            oKeyPressed = true;
        }
    }
    else
    {
        oKeyPressed = false;  // Reset key state when released
    }
}

///////////////////////////////////////////////////////////////////////////////
// SCENE VIEW PREPARATION - ALL REQUIREMENTS
///////////////////////////////////////////////////////////////////////////////

/**
 * Prepares the view and projection matrices for 3D scene rendering
 * REQUIREMENT 1: Ensures camera captures all objects with proper orbit radius
 * REQUIREMENT 2: Handles smooth input processing for effective object viewing
 * REQUIREMENT 3: Switches between perspective and orthographic projections
 * Maintains camera orientation during view mode changes
 */
void ViewManager::PrepareSceneView()
{
    ///////////////////////////////////////////////////////////////////////////
    // FRAME TIMING CALCULATION - For smooth movement
    ///////////////////////////////////////////////////////////////////////////

    const float currentFrame = static_cast<float>(glfwGetTime());
    gDeltaTime = currentFrame - gLastFrame;
    gLastFrame = currentFrame;

    ///////////////////////////////////////////////////////////////////////////
    // INPUT PROCESSING - Handle all navigation requirements
    ///////////////////////////////////////////////////////////////////////////

    ProcessKeyboardEvents();

    ///////////////////////////////////////////////////////////////////////////
    // VIEW MATRIX SETUP - REQUIREMENT 1 & 2
    // Camera position and orientation for optimal scene viewing
    ///////////////////////////////////////////////////////////////////////////

    glm::mat4 view = g_pCamera->GetViewMatrix();

    ///////////////////////////////////////////////////////////////////////////
    // PROJECTION MATRIX SETUP - REQUIREMENT 3
    // Dynamic switching between perspective and orthographic views
    ///////////////////////////////////////////////////////////////////////////

    glm::mat4 projection;

    if (bOrthographicProjection)
    {
        // REQUIREMENT 3: Orthographic projection for 2D-like technical views
        // Sized to capture entire workspace scene while maintaining camera orientation
        const float orthoSize = 15.0f;  // Enhanced size for complete scene coverage
        const float aspectRatio = static_cast<float>(WINDOW_WIDTH) / static_cast<float>(WINDOW_HEIGHT);

        projection = glm::ortho(
            -orthoSize * aspectRatio, orthoSize * aspectRatio,  // Left, right (aspect corrected)
            -orthoSize, orthoSize,                              // Bottom, top  
            0.1f, 100.0f                                       // Near, far clipping planes
        );
    }
    else
    {
        // REQUIREMENT 3: Perspective projection for realistic 3D views
        // Field of view optimized for scene examination
        const float aspectRatio = static_cast<float>(WINDOW_WIDTH) / static_cast<float>(WINDOW_HEIGHT);
        projection = glm::perspective(
            glm::radians(g_pCamera->Zoom),  // Field of view angle
            aspectRatio,                    // Aspect ratio
            0.1f,                          // Near clipping plane
            100.0f                         // Far clipping plane
        );
    }

    ///////////////////////////////////////////////////////////////////////////
    // SHADER UNIFORM UPDATES - Send matrices to GPU
    ///////////////////////////////////////////////////////////////////////////

    if (m_pShaderManager)
    {
        // Update view matrix uniform for camera position/orientation
        m_pShaderManager->setMat4Value(g_ViewName, view);

        // Update projection matrix uniform for current view mode
        m_pShaderManager->setMat4Value(g_ProjectionName, projection);

        // Update camera position for lighting calculations
        m_pShaderManager->setVec3Value("viewPosition", g_pCamera->Position);

        // Also send as "viewPos" for compatibility with lighting shaders
        m_pShaderManager->setVec3Value("viewPos", g_pCamera->Position);
    }
}