#pragma once
#include <chrono>
#include <string>
#include <unordered_map>
#include <fstream>

/***********************************************************
 *  PerformanceProfiler
 *
 *  Measures and logs performance metrics for the application
 *  Tracks frame times, object counts, and draw calls
 ***********************************************************/
class PerformanceProfiler
{
public:
    static PerformanceProfiler& getInstance();
    
    // Frame timing
    void startFrame();
    void endFrame();
    
    // Metrics
    void recordObjectCount(int count);
    void recordDrawCall();
    void recordVisibleObjects(int count);
    
    // Profiling sections
    void startSection(const std::string& name);
    void endSection(const std::string& name);
    
    // Results
    float getFPS() const { return m_fps; }
    float getFrameTime() const { return m_frameTime; }
    int getObjectCount() const { return m_objectCount; }
    int getDrawCalls() const { return m_drawCalls; }
    int getVisibleObjects() const { return m_visibleObjects; }
    
    // Logging
    void logToFile(const std::string& filename);
    void logToConsole();
    void reset();

private:
    PerformanceProfiler();
    ~PerformanceProfiler();
    
    struct SectionTimer {
        std::chrono::high_resolution_clock::time_point start;
        double totalTime = 0.0;
        int callCount = 0;
    };
    
    std::chrono::high_resolution_clock::time_point m_frameStart;
    std::chrono::high_resolution_clock::time_point m_frameEnd;
    
    float m_fps;
    float m_frameTime;
    int m_objectCount;
    int m_drawCalls;
    int m_visibleObjects;
    int m_frameCount;
    
    std::unordered_map<std::string, SectionTimer> m_sections;
    
    double m_totalFrameTime;
    int m_totalFrames;
};
