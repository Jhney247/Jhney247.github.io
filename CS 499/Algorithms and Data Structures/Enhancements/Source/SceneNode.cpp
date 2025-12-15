#include "SceneNode.h"
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>

SceneNode::SceneNode(const std::string& name)
    : m_name(name)
    , m_parent(nullptr)
    , m_localTransform(1.0f)
    , m_worldTransform(1.0f)
    , m_position(0.0f)
    , m_rotation(0.0f)
    , m_scale(1.0f)
{
}

SceneNode::~SceneNode()
{
    m_children.clear();
}

void SceneNode::addChild(std::shared_ptr<SceneNode> child)
{
    if (child)
    {
        child->m_parent = this;
        m_children.push_back(child);
    }
}

void SceneNode::removeChild(const std::string& name)
{
    m_children.erase(
        std::remove_if(m_children.begin(), m_children.end(),
            [&name](const std::shared_ptr<SceneNode>& node) {
                return node->getName() == name;
            }),
        m_children.end()
    );
}

std::shared_ptr<SceneNode> SceneNode::findChild(const std::string& name)
{
    for (auto& child : m_children)
    {
        if (child->getName() == name)
            return child;
        
        auto found = child->findChild(name);
        if (found)
            return found;
    }
    return nullptr;
}

void SceneNode::setLocalTransform(const glm::mat4& transform)
{
    m_localTransform = transform;
}

void SceneNode::setPosition(const glm::vec3& position)
{
    m_position = position;
    updateLocalTransform();
}

void SceneNode::setRotation(const glm::vec3& rotation)
{
    m_rotation = rotation;
    updateLocalTransform();
}

void SceneNode::setScale(const glm::vec3& scale)
{
    m_scale = scale;
    updateLocalTransform();
}

glm::mat4 SceneNode::getWorldTransform() const
{
    return m_worldTransform;
}

void SceneNode::update(const glm::mat4& parentTransform)
{
    m_worldTransform = parentTransform * m_localTransform;
    
    for (auto& child : m_children)
    {
        child->update(m_worldTransform);
    }
}

void SceneNode::updateLocalTransform()
{
    glm::mat4 translation = glm::translate(glm::mat4(1.0f), m_position);
    glm::mat4 rotX = glm::rotate(glm::mat4(1.0f), glm::radians(m_rotation.x), glm::vec3(1, 0, 0));
    glm::mat4 rotY = glm::rotate(glm::mat4(1.0f), glm::radians(m_rotation.y), glm::vec3(0, 1, 0));
    glm::mat4 rotZ = glm::rotate(glm::mat4(1.0f), glm::radians(m_rotation.z), glm::vec3(0, 0, 1));
    glm::mat4 scale = glm::scale(glm::mat4(1.0f), m_scale);
    
    m_localTransform = translation * rotX * rotY * rotZ * scale;
}
