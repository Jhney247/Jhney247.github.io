#pragma once
#include <vector>
#include <memory>
#include <string>
#include <glm/glm.hpp>

/***********************************************************
 *  SceneNode
 *
 *  Hierarchical scene graph node for parent-child relationships
 *  Supports transformation propagation and scene organization
 ***********************************************************/
class SceneNode
{
public:
    SceneNode(const std::string& name);
    ~SceneNode();

    // Scene graph management
    void addChild(std::shared_ptr<SceneNode> child);
    void removeChild(const std::string& name);
    std::shared_ptr<SceneNode> findChild(const std::string& name);
    
    // Transformation methods
    void setLocalTransform(const glm::mat4& transform);
    void setPosition(const glm::vec3& position);
    void setRotation(const glm::vec3& rotation); // Euler angles in degrees
    void setScale(const glm::vec3& scale);
    
    // Get transforms
    glm::mat4 getLocalTransform() const { return m_localTransform; }
    glm::mat4 getWorldTransform() const;
    
    // Update hierarchy (propagate transforms)
    void update(const glm::mat4& parentTransform = glm::mat4(1.0f));
    
    // Accessors
    const std::string& getName() const { return m_name; }
    const std::vector<std::shared_ptr<SceneNode>>& getChildren() const { return m_children; }
    SceneNode* getParent() const { return m_parent; }
    
    // Object data
    int objectId = -1;
    bool visible = true;

private:
    std::string m_name;
    SceneNode* m_parent;
    std::vector<std::shared_ptr<SceneNode>> m_children;
    
    glm::mat4 m_localTransform;
    glm::mat4 m_worldTransform;
    
    glm::vec3 m_position;
    glm::vec3 m_rotation;
    glm::vec3 m_scale;
    
    void updateLocalTransform();
};
