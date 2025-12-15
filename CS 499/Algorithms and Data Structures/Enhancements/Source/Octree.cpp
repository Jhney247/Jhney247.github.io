#include "Octree.h"
#include <algorithm>

Octree::Octree(const glm::vec3& center, float halfSize, int depth, int maxDepth)
    : m_center(center), m_halfSize(halfSize), m_depth(depth), m_maxDepth(maxDepth) {}

Octree::~Octree() { clear(); }

void Octree::clear() {
    for (auto& child : m_children) child.reset();
    m_objects.clear();
}

bool Octree::isLeaf() const { return m_depth >= m_maxDepth; }

int Octree::getChildIndex(const glm::vec3& pos) const {
    int idx = 0;
    if (pos.x > m_center.x) idx |= 1;
    if (pos.y > m_center.y) idx |= 2;
    if (pos.z > m_center.z) idx |= 4;
    return idx;
}

void Octree::insert(const SceneObject& obj) {
    if (isLeaf()) {
        m_objects.push_back(obj);
        return;
    }
    int idx = getChildIndex(obj.position);
    if (!m_children[idx]) {
        glm::vec3 offset(
            (idx & 1 ? 0.5f : -0.5f) * m_halfSize,
            (idx & 2 ? 0.5f : -0.5f) * m_halfSize,
            (idx & 4 ? 0.5f : -0.5f) * m_halfSize
        );
        m_children[idx] = std::make_unique<Octree>(m_center + offset, m_halfSize * 0.5f, m_depth + 1, m_maxDepth);
    }
    m_children[idx]->insert(obj);
}

void Octree::remove(int objectId) {
    m_objects.erase(std::remove_if(m_objects.begin(), m_objects.end(), [objectId](const SceneObject& o) { return o.id == objectId; }), m_objects.end());
    for (auto& child : m_children) {
        if (child) child->remove(objectId);
    }
}

void Octree::query(const glm::vec3& min, const glm::vec3& max, std::vector<int>& results) const {
    // Check if this node is outside query bounds
    glm::vec3 nodeMin = m_center - glm::vec3(m_halfSize);
    glm::vec3 nodeMax = m_center + glm::vec3(m_halfSize);
    if (nodeMax.x < min.x || nodeMin.x > max.x || nodeMax.y < min.y || nodeMin.y > max.y || nodeMax.z < min.z || nodeMin.z > max.z)
        return;
    // Add objects in this node
    for (const auto& obj : m_objects) {
        if (obj.position.x >= min.x && obj.position.x <= max.x &&
            obj.position.y >= min.y && obj.position.y <= max.y &&
            obj.position.z >= min.z && obj.position.z <= max.z) {
            results.push_back(obj.id);
        }
    }
    // Query children
    for (const auto& child : m_children) {
        if (child) child->query(min, max, results);
    }
}
