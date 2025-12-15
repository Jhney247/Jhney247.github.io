#pragma once
#include <vector>
#include <glm/glm.hpp>
#include <memory>

struct SceneObject {
    glm::vec3 position;
    float boundingRadius;
    int id; // Unique identifier
};

class Octree {
public:
    Octree(const glm::vec3& center, float halfSize, int depth = 0, int maxDepth = 5);
    ~Octree();

    void insert(const SceneObject& obj);
    void remove(int objectId);
    void query(const glm::vec3& min, const glm::vec3& max, std::vector<int>& results) const;
    void clear();

private:
    glm::vec3 m_center;
    float m_halfSize;
    int m_depth;
    int m_maxDepth;
    std::vector<SceneObject> m_objects;
    std::unique_ptr<Octree> m_children[8];
    bool isLeaf() const;
    int getChildIndex(const glm::vec3& pos) const;
};
